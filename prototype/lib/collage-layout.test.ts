import assert from 'node:assert/strict';
import test from 'node:test';
import { centralClickZone, createCollageLayout, hitRect, overlapRatio, visibleRect } from './collage-layout.ts';
import { entries } from './content.ts';

const items = entries.map((entry) => ({ id: entry.slug, collage: entry.collage }));
const byId = new Map(items.map((item) => [item.id, item]));

test('creates one or two objects per vertical band and changes with the visit seed', () => {
  const first = createCollageLayout(42, items);
  const again = createCollageLayout(42, items);
  const changed = createCollageLayout(43, items);
  assert.deepEqual(again, first);
  assert.notDeepEqual(changed.placements, first.placements);
  assert.equal(first.placements.length, entries.length);
  const counts = new Map<number, number>();
  for (const placement of first.placements) counts.set(placement.band, (counts.get(placement.band) ?? 0) + 1);
  assert.ok([...counts.values()].every((count) => count === 1 || count === 2));
});

test('keeps desktop alpha overlap controlled and every central target exposed', () => {
  for (const seed of [7, 42, 991, 88501, 351107]) {
    const layout = createCollageLayout(seed, items);
    for (let index = 0; index < layout.placements.length; index += 1) {
      const current = layout.placements[index];
      const currentItem = byId.get(current.id)!;
      assert.ok(hitRect(currentItem, current, 'desktop').width >= 48);
      assert.ok(hitRect(currentItem, current, 'desktop').height >= 48);
      for (const other of layout.placements.slice(index + 1)) {
        const otherItem = byId.get(other.id)!;
        assert.ok(overlapRatio(visibleRect(currentItem, current, 'desktop'), visibleRect(otherItem, other, 'desktop')) <= 0.201);
        assert.equal(overlapRatio(centralClickZone(currentItem, current, 'desktop'), centralClickZone(otherItem, other, 'desktop')), 0);
      }
    }
  }
});

test('keeps mobile hit areas separate and all objects inside the canvas', () => {
  for (const seed of [7, 42, 991, 88501, 351107]) {
    const layout = createCollageLayout(seed, items);
    for (let index = 0; index < layout.placements.length; index += 1) {
      const current = layout.placements[index];
      const currentItem = byId.get(current.id)!;
      const rect = hitRect(currentItem, current, 'mobile', 360);
      assert.ok(rect.x >= 0 && rect.x + rect.width <= 360, `${seed}: ${current.id} leaves mobile width`);
      assert.ok(rect.y >= 0 && rect.y + rect.height <= layout.mobileHeight, `${seed}: ${current.id} leaves mobile height`);
      for (const other of layout.placements.slice(index + 1)) {
        const otherItem = byId.get(other.id)!;
        assert.equal(overlapRatio(rect, hitRect(otherItem, other, 'mobile', 360)), 0, `${seed}: mobile hit areas overlap`);
      }
    }
  }
});

test('stores complete geometry and accessibility metadata for every object', () => {
  for (const entry of entries) {
    assert.equal(entry.collage.projectPath, `/projects/${entry.slug}`);
    assert.ok(entry.collage.dimensions.width > 0 && entry.collage.dimensions.height > 0);
    assert.ok(entry.collage.hitPadding > 0);
    for (const locale of ['en', 'hy', 'ru'] as const) {
      assert.ok(entry.collage.label[locale]);
      assert.ok(entry.collage.altText[locale]);
    }
  }
});
