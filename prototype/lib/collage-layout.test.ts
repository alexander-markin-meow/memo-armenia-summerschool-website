import assert from 'node:assert/strict';
import test from 'node:test';
import { createCollageLayout, makeCollageObjects } from './collage-layout.ts';
import { entries } from './content.ts';

const objects = makeCollageObjects(entries, 'en');

function overlaps(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

test('is deterministic for a seed and reshuffles for a new seed', () => {
  const first = createCollageLayout(objects, 1200, 4132);
  const repeat = createCollageLayout(objects, 1200, 4132);
  const changed = createCollageLayout(objects, 1200, 9831);
  assert.deepEqual(first, repeat);
  assert.notDeepEqual(first.placements.map(({ id }) => id), changed.placements.map(({ id }) => id));
});

test('keeps every protected target visible and separate across the width sweep', () => {
  for (let width = 280; width <= 2560; width += 16) {
    const layout = createCollageLayout(objects, width, 71391);
    assert.equal(layout.placements.length, objects.length, `missing placement at ${width}px`);
    assert.equal(new Set(layout.placements.map(({ id }) => id)).size, objects.length, `duplicate placement at ${width}px`);
    for (const placement of layout.placements) {
      assert.ok(placement.width >= 48 && placement.height >= 48, `small target at ${width}px`);
      assert.ok(placement.x >= 0 && placement.x + placement.width <= width + .001, `horizontal clipping at ${width}px`);
      assert.ok(placement.y >= 0 && placement.y + placement.height <= layout.canvasHeight, `vertical clipping at ${width}px`);
    }
    for (let left = 0; left < layout.placements.length; left += 1) {
      for (let right = left + 1; right < layout.placements.length; right += 1) {
        assert.equal(overlaps(layout.placements[left], layout.placements[right]), false, `targets overlap at ${width}px`);
      }
    }
  }
});

test('preserves seeded object order while density increases with screen width', () => {
  const widths = [320, 390, 768, 1024, 1440, 1920, 2560];
  const layouts = widths.map((width) => createCollageLayout(objects, width, 44109));
  const objectOrder = layouts[0].placements.map(({ id }) => id);
  for (const layout of layouts.slice(1)) {
    assert.deepEqual(layout.placements.map(({ id }) => id), objectOrder);
  }
  for (let index = 1; index < layouts.length; index += 1) {
    assert.ok(layouts[index].densityColumns >= layouts[index - 1].densityColumns);
  }
  assert.equal(layouts[0].densityColumns, 1);
  assert.ok(layouts.at(-1)!.densityColumns >= 6);
});

test('keeps the plane compact instead of limiting wide screens to object pairs', () => {
  const mobile = createCollageLayout(objects, 390, 71391);
  const desktop = createCollageLayout(objects, 1440, 71391);
  const wide = createCollageLayout(objects, 1920, 71391);
  assert.ok(mobile.canvasHeight < 9000);
  assert.ok(desktop.densityColumns >= 6);
  assert.ok(wide.densityColumns >= 8);
  assert.ok(desktop.canvasHeight < 2200);
  assert.ok(wide.canvasHeight < 1800);
});

test('balances placeholder silhouettes and keeps repeats out of immediate clusters', () => {
  const silhouetteCounts = new Map<string, number>();
  for (const object of objects) {
    silhouetteCounts.set(object.shape, (silhouetteCounts.get(object.shape) ?? 0) + 1);
  }
  assert.equal(silhouetteCounts.size, 11);
  for (const count of silhouetteCounts.values()) {
    assert.ok(count >= 2 && count <= 3, `unbalanced placeholder silhouette count: ${count}`);
  }

  const objectById = new Map(objects.map((object) => [object.id, object]));
  for (const width of [768, 1024, 1440, 1920]) {
    for (const seed of [223, 71391, 44109]) {
      const layout = createCollageLayout(objects, width, seed);
      const gutter = Math.min(64, Math.max(16, width * .042));
      const protectedGap = Math.min(9, Math.max(4, width * .005));
      const usableWidth = width - gutter * 2;
      const nominalWidth = (usableWidth - protectedGap * (layout.densityColumns - 1)) / layout.densityColumns;
      for (let left = 0; left < layout.placements.length; left += 1) {
        for (let right = left + 1; right < layout.placements.length; right += 1) {
          const a = layout.placements[left];
          const b = layout.placements[right];
          if (objectById.get(a.id)?.shape !== objectById.get(b.id)?.shape) continue;
          const distance = Math.hypot(
            a.x + a.width / 2 - b.x - b.width / 2,
            a.y + a.height / 2 - b.y - b.height / 2,
          );
          assert.ok(distance >= nominalWidth * 1.6 - .001, `repeated silhouette cluster at ${width}px for seed ${seed}`);
        }
      }
    }
  }
});

test('keeps the plane from resolving into horizontal bands', () => {
  for (const width of [768, 802, 1024, 1440, 1920]) {
    for (const seed of [223, 71391, 44109]) {
      const layout = createCollageLayout(objects, width, seed);
      const centres = layout.placements
        .map((placement) => placement.y + placement.height / 2)
        .sort((a, b) => a - b);
      for (let index = 0; index + 3 < centres.length; index += 1) {
        assert.ok(centres[index + 3] - centres[index] >= 72, `horizontal band at ${width}px for seed ${seed}`);
      }
      const topCapacity = layout.densityColumns >= 6 ? 3 : 2;
      assert.ok(
        layout.placements.filter((placement) => placement.y < 108).length <= topCapacity,
        `flat leading row at ${width}px for seed ${seed}`,
      );
    }
  }
});

test('stores the complete interaction descriptor for every object', () => {
  for (const object of objects) {
    assert.match(object.projectUrl, /^\/en\/projects\//);
    assert.ok(object.intrinsicSize.width > 0 && object.intrinsicSize.height > 0);
    assert.ok(object.visibleAlphaBounds.width > 0 && object.visibleAlphaBounds.height > 0);
    assert.ok(object.hitPadding >= 0);
    assert.ok(object.label.length > 0 && object.altText.length > 0);
    assert.ok(object.visualWeight > 0);
  }
});
