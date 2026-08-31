import assert from 'node:assert/strict';
import test from 'node:test';
import { createCollageLayout, rectsOverlap } from './collage-layout.ts';
import { entries } from './content.ts';

const objects = entries.map((entry) => ({ id: entry.slug, shape: entry.shape }));
const seeds = [7, 42, 991, 1847, 88501, 172993, 351107, 429496729, 910247, 6031709, 7854301, 9917791];
const viewports = [
  { width: 360, height: 720 },
  { width: 768, height: 980 },
  { width: 1440, height: 900 },
];

test('keeps objects inside the safe canvas with controlled overlap', () => {
  for (const seed of seeds) {
    for (const viewport of viewports) {
      const layout = createCollageLayout(seed, objects, viewport.width, viewport.height);
      assert.equal(layout.placements.length, 30);
      for (const placement of layout.placements) {
        assert.ok(placement.x >= 0 && placement.y >= 0, `${seed}: negative placement`);
        assert.ok(placement.x + placement.width <= viewport.width, `${seed}: clipped horizontally`);
        assert.ok(placement.y + placement.height <= layout.height, `${seed}: clipped vertically`);
      }
      for (let index = 0; index < layout.placements.length; index += 1) {
        for (let next = index + 1; next < layout.placements.length; next += 1) {
          const overlap = rectsOverlap(layout.placements[index], layout.placements[next]);
          const smallerArea = Math.min(
            layout.placements[index].width * layout.placements[index].height,
            layout.placements[next].width * layout.placements[next].height,
          );
          const allowedOverlap = viewport.width >= 1200 ? 0.1 : viewport.width < 520 ? 0 : 0.06;
          assert.ok(overlap <= smallerArea * allowedOverlap, `${seed}: overlap is too large`);
        }
      }
    }
  }
});

test('is repeatable by seed, changes between seeds, and reflows on resize', () => {
  const first = createCollageLayout(42, objects, 1440, 900);
  const again = createCollageLayout(42, objects, 1440, 900);
  const changed = createCollageLayout(43, objects, 1440, 900);
  const resized = createCollageLayout(42, objects, 768, 980);
  assert.deepEqual(again, first);
  assert.notDeepEqual(changed.placements, first.placements);
  assert.notDeepEqual(resized.placements, first.placements);
});

test('varies object scales within each seeded composition', () => {
  for (const seed of seeds) {
    const layout = createCollageLayout(seed, objects, 1440, 900);
    const scales = layout.placements.map((item) => item.scale);
    assert.ok(Math.max(...scales) - Math.min(...scales) > 0.2, `${seed}: object scale range is too narrow`);
  }
});

test('uses a pronounced size lift on wide desktops without changing mobile density', () => {
  for (const seed of seeds) {
    const intermediate = createCollageLayout(seed, objects, 1024, 900);
    const wide = createCollageLayout(seed, objects, 1440, 900);
    const intermediateAverage = intermediate.placements.reduce((total, item) => total + item.scale, 0) / objects.length;
    const wideAverage = wide.placements.reduce((total, item) => total + item.scale, 0) / objects.length;
    assert.ok(wideAverage > intermediateAverage * 1.22, `${seed}: wide-screen composition was not enlarged enough`);
  }
});

test('layers at least some objects on wide screens', () => {
  for (const seed of seeds) {
    const layout = createCollageLayout(seed, objects, 1440, 900);
    const overlapCount = layout.placements.reduce((total, item, index) => total + layout.placements
      .slice(index + 1)
      .filter((other) => rectsOverlap(item, other) > 0).length, 0);
    assert.ok(overlapCount > 0, `${seed}: wide-screen composition should have layered objects`);
  }
});

test('balances desktop visual mass across the whole composition', () => {
  for (const seed of seeds) {
    const layout = createCollageLayout(seed, objects, 1440, 900);
    const zoneCounts = Array<number>(15).fill(0);
    const zoneMasses = Array<number>(15).fill(0);
    for (const item of layout.placements) {
      const column = Math.min(4, Math.floor((item.x + item.width / 2) / (1440 / 5)));
      const row = Math.min(2, Math.floor((item.y + item.height / 2) / (layout.height / 3)));
      const zone = row * 5 + column;
      zoneCounts[zone] += 1;
      zoneMasses[zone] += item.shapeWidth * item.shapeHeight;
    }
    assert.ok(zoneCounts.every((count) => count === 2), `${seed}: every desktop zone needs two objects`);
    assert.ok(Math.max(...zoneMasses) / Math.min(...zoneMasses) < 2.3, `${seed}: visual mass is too uneven`);
  }
});

test('keeps distribution broad and uses a taller canvas on narrow screens', () => {
  for (const seed of seeds) {
    const mobile = createCollageLayout(seed, objects, 360, 720);
    const desktop = createCollageLayout(seed, objects, 1440, 900);
    const mobileCentres = mobile.placements.map((item) => ({ x: item.x + item.width / 2, y: item.y + item.height / 2 }));
    const desktopCentres = desktop.placements.map((item) => ({ x: item.x + item.width / 2, y: item.y + item.height / 2 }));
    const mobileSpread = Math.max(...mobileCentres.map((item) => item.y)) - Math.min(...mobileCentres.map((item) => item.y));
    const desktopSpread = Math.max(...desktopCentres.map((item) => item.x)) - Math.min(...desktopCentres.map((item) => item.x));
    assert.ok(mobile.height > 1800, 'a thirty-object mobile canvas should remain legible and scrollable');
    assert.ok(mobile.height < 2600, 'mobile canvas should not add unnecessary empty desert');
    assert.ok(mobileSpread > mobile.height * 0.52, 'mobile composition should cover the canvas');
    assert.ok(desktopSpread > 1440 * 0.5, 'desktop composition should not cluster into a column');
  }
});

test('falls back to a legible vertical canvas on an unusually narrow size', () => {
  const layout = createCollageLayout(99, objects, 220, 400);
  assert.equal(layout.placements.length, 30);
  assert.ok(layout.height >= 2400);
  assert.ok(layout.placements.every((item) => item.x + item.width <= 220));
});
