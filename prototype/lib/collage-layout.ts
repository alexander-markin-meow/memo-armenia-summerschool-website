import type { ShapeName } from './content';

export type CollageItem = { id: string; shape: ShapeName };

export type CollagePlacement = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shapeWidth: number;
  shapeHeight: number;
  rotation: number;
  scale: number;
};

export type CollageLayout = {
  height: number;
  placements: CollagePlacement[];
  fallbackLevel: number;
};

type Rect = { x: number; y: number; width: number; height: number };
type Zone = Rect & { angle: number };

const SHAPES: Record<ShapeName, { width: number; height: number }> = {
  button: { width: 116, height: 116 },
  stone: { width: 156, height: 104 },
  metal: { width: 162, height: 108 },
  leaf: { width: 112, height: 164 },
  tile: { width: 144, height: 128 },
  spool: { width: 118, height: 142 },
  bead: { width: 118, height: 118 },
  paper: { width: 154, height: 116 },
  ribbon: { width: 156, height: 82 },
  ring: { width: 126, height: 126 },
  shard: { width: 142, height: 132 },
};

const DESKTOP_LABEL_HEIGHT = 54;
const MOBILE_LABEL_HEIGHT = 42;
const HIT_PADDING_X = 14;
const EDGE_PADDING = 12;
const CANDIDATES_PER_ITEM = 260;

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function overlapArea(a: Rect, b: Rect) {
  const width = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const height = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return width * height;
}

function distance(a: Rect, b: Rect) {
  const ax = a.x + a.width / 2;
  const ay = a.y + a.height / 2;
  const bx = b.x + b.width / 2;
  const by = b.y + b.height / 2;
  return Math.hypot(ax - bx, ay - by);
}

function shuffle<T>(items: T[], random: () => number) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  return shuffled;
}

function compositionZones(width: number, height: number, itemCount: number, mobile: boolean): Zone[] {
  // Desktop zones carry two objects; mobile gives every object its own vertical territory
  // so touch targets remain clear without creating a long empty field.
  const zoneCount = Math.ceil(itemCount / (mobile ? 1 : 2));
  const columns = width < 300 ? 1 : mobile ? 2 : width < 900 ? 3 : 5;
  const rows = Math.ceil(zoneCount / columns);
  const zoneWidth = width / columns;
  const zoneHeight = height / rows;
  const zoneRandom = mulberry32(Math.round(width * 31 + height * 17 + itemCount));

  return Array.from({ length: zoneCount }, (_, index) => ({
    x: (index % columns) * zoneWidth,
    y: Math.floor(index / columns) * zoneHeight,
    width: zoneWidth,
    height: zoneHeight,
    angle: zoneRandom() * Math.PI * 2,
  }));
}

function zoneAnchor(zone: Zone, slot: number, random: () => number) {
  const radius = Math.min(zone.width, zone.height) * (0.14 + random() * 0.08);
  const angle = zone.angle + (slot % 2) * Math.PI + (random() - 0.5) * 0.48;
  return {
    x: zone.x + zone.width / 2 + Math.cos(angle) * radius,
    y: zone.y + zone.height / 2 + Math.sin(angle) * radius,
  };
}

function fieldHeight(width: number, viewportHeight: number, itemCount: number) {
  if (width < 520) return Math.max(1340, Math.round(viewportHeight * 1.86), itemCount * 80);
  if (width < 900) return Math.max(1050, Math.round(viewportHeight * 1.4));
  return Math.max(450, viewportHeight - 140);
}

function itemDimensions(
  item: CollageItem,
  order: number,
  count: number,
  random: () => number,
  fallback: number,
  mobile: boolean,
  wide: boolean,
) {
  const source = SHAPES[item.shape];
  const prominence = mobile
    ? [1, 0.46, 0.2, 0.38, 0.25][order % 5] ?? 0.28
    : 1 - order / Math.max(1, count - 1);
  // Wide laptop and desktop canvases deliberately give the collection a stronger physical presence.
  const densityScale = mobile ? count > 20 ? 0.78 : 0.9 : count > 20 ? wide ? 0.94 : 0.7 : count > 10 ? 0.86 : 1.06;
  const fallbackScale = 1 - fallback * 0.065;
  // Every seed keeps a restrained per-object size variation rather than repeating one scale.
  const scaleJitter = 0.88 + random() * 0.28;
  const minimumScale = mobile ? 0.42 : count > 20 ? 0.36 : 0.42;
  const scale = clamp((0.64 + prominence * 0.28) * densityScale * fallbackScale * scaleJitter, minimumScale, 1.08);
  const shapeWidth = Math.round(source.width * scale);
  const shapeHeight = Math.round(source.height * scale);
  const rotation = Math.round((random() * 18 - 9) * 10) / 10;
  const radians = Math.abs(rotation) * Math.PI / 180;
  const rotatedWidth = Math.ceil(shapeWidth * Math.cos(radians) + shapeHeight * Math.sin(radians));
  const rotatedHeight = Math.ceil(shapeWidth * Math.sin(radians) + shapeHeight * Math.cos(radians));
  return {
    shapeWidth,
    shapeHeight,
    width: rotatedWidth + HIT_PADDING_X * 2,
    height: rotatedHeight + (mobile ? MOBILE_LABEL_HEIGHT : DESKTOP_LABEL_HEIGHT),
    rotation,
    scale,
  };
}

function scoreCandidate(
  candidate: Rect,
  placed: Rect[],
  canvas: { width: number; height: number },
  maximumOverlapRatio: number,
  anchor: { x: number; y: number },
  zone: Zone,
) {
  const centreX = candidate.x + candidate.width / 2;
  const centreY = candidate.y + candidate.height / 2;
  const diagonal = Math.hypot(canvas.width, canvas.height);
  let nearest = diagonal;
  let rowPenalty = 0;
  let columnPenalty = 0;
  let symmetryPenalty = 0;
  let overlapScore = 0;

  for (const current of placed) {
    const overlap = overlapArea(candidate, current);
    const smallerArea = Math.min(candidate.width * candidate.height, current.width * current.height);
    if (overlap > smallerArea * maximumOverlapRatio) return Number.NEGATIVE_INFINITY;
    overlapScore += overlap / smallerArea;
    const currentDistance = distance(candidate, current);
    nearest = Math.min(nearest, currentDistance);
    const currentX = current.x + current.width / 2;
    const currentY = current.y + current.height / 2;
    const localScale = Math.max(candidate.width, current.width, candidate.height, current.height);
    if (Math.abs(centreX - currentX) < localScale * 0.2) columnPenalty += 0.7;
    if (Math.abs(centreY - currentY) < localScale * 0.16) rowPenalty += 0.7;
    const mirrorX = canvas.width - currentX;
    const mirrorY = canvas.height - currentY;
    if (Math.hypot(centreX - mirrorX, centreY - mirrorY) < localScale * 0.48) symmetryPenalty += 1;
  }

  const edgeDistance = Math.min(candidate.x, candidate.y, canvas.width - candidate.x - candidate.width, canvas.height - candidate.y - candidate.height);
  const edgeScore = clamp(edgeDistance / 58, 0, 1);
  const anchorDistance = Math.hypot(centreX - anchor.x, centreY - anchor.y);
  const anchorScore = 1 - clamp(anchorDistance / (Math.min(zone.width, zone.height) * 0.42), 0, 1);
  const desiredSpacing = Math.max(candidate.width, candidate.height) * 1.04;
  const proximityScore = placed.length
    ? 1 - clamp(Math.abs(nearest - desiredSpacing) / desiredSpacing, 0, 1)
    : 1;
  // Anchors guarantee even coverage; the remaining scoring retains a small, natural mess.
  return anchorScore * 4.6 + proximityScore * 0.7 + overlapScore * 0.85 + edgeScore * 0.35 - rowPenalty * 0.55 - columnPenalty * 0.65 - symmetryPenalty * 0.7;
}

function makeAttempt(seed: number, items: CollageItem[], width: number, height: number, fallback: number): CollagePlacement[] | null {
  const random = mulberry32(seed + fallback * 104729);
  const mobile = width < 520;
  const wide = width >= 1200;
  const zones = compositionZones(width, height, items.length, mobile);
  const zoneOrder = shuffle(zones, mulberry32(seed + fallback * 1327));
  const zoneSlots = new Map<Zone, number>();
  const bySize = items
    .map((item, index) => ({
      item,
      index,
      dimensions: itemDimensions(item, index, items.length, random, fallback, mobile, wide),
    }))
    .sort((a, b) => (b.dimensions.shapeWidth * b.dimensions.shapeHeight) - (a.dimensions.shapeWidth * a.dimensions.shapeHeight));
  const placed: Array<CollagePlacement & { rect: Rect }> = [];
  const canvas = { width, height };
  const maximumOverlapRatio = mobile ? 0 : wide ? 0.1 : 0.06;

  for (const [placementIndex, current] of bySize.entries()) {
    const { dimensions } = current;
    const maxX = width - dimensions.width - EDGE_PADDING;
    const maxY = height - dimensions.height - EDGE_PADDING;
    if (maxX <= EDGE_PADDING || maxY <= EDGE_PADDING) return null;
    const zone = zoneOrder[placementIndex % zoneOrder.length];
    const slot = zoneSlots.get(zone) ?? 0;
    zoneSlots.set(zone, slot + 1);
    const anchor = zoneAnchor(zone, slot, random);

    let winner: { rect: Rect; score: number } | null = null;
    const candidateCount = mobile ? CANDIDATES_PER_ITEM * 4 : CANDIDATES_PER_ITEM;
    for (let attempt = 0; attempt < candidateCount; attempt += 1) {
      const centreX = clamp(
        anchor.x + (random() - 0.5) * zone.width * 0.48,
        dimensions.width / 2 + EDGE_PADDING,
        width - dimensions.width / 2 - EDGE_PADDING,
      );
      const centreY = clamp(
        anchor.y + (random() - 0.5) * zone.height * 0.48,
        dimensions.height / 2 + EDGE_PADDING,
        height - dimensions.height / 2 - EDGE_PADDING,
      );
      const rect = {
        x: Math.round(centreX - dimensions.width / 2),
        y: Math.round(centreY - dimensions.height / 2),
        width: dimensions.width,
        height: dimensions.height,
      };
      const score = scoreCandidate(rect, placed.map((item) => item.rect), canvas, maximumOverlapRatio, anchor, zone);
      if (!winner || score > winner.score) winner = { rect, score };
    }
    if (!winner || !Number.isFinite(winner.score)) return null;
    placed.push({
      id: current.item.id,
      x: winner.rect.x,
      y: winner.rect.y,
      ...dimensions,
      rect: winner.rect,
    });
  }

  return items.map((item) => {
    const placement = placed.find((placedItem) => placedItem.id === item.id);
    if (!placement) throw new Error('A collage item was not placed.');
    return {
      id: placement.id,
      x: placement.x,
      y: placement.y,
      width: placement.width,
      height: placement.height,
      shapeWidth: placement.shapeWidth,
      shapeHeight: placement.shapeHeight,
      rotation: placement.rotation,
      scale: placement.scale,
    };
  });
}

/** Builds a deterministic, free-form layout and retains its seed through responsive reflows. */
export function createCollageLayout(seed: number, items: CollageItem[], width: number, viewportHeight: number): CollageLayout {
  const height = fieldHeight(width, viewportHeight, items.length);
  for (let fallback = 0; fallback < 5; fallback += 1) {
    const placements = makeAttempt(seed, items, width, height, fallback);
    if (placements) return { height, placements, fallbackLevel: fallback };
  }

  const fallbackHeight = Math.max(height, Math.ceil(items.length * 210));
  const placements = makeAttempt(seed, items, width, fallbackHeight, 4);
  if (!placements) throw new Error('Unable to place the collage without collision.');
  return { height: fallbackHeight, placements, fallbackLevel: 4 };
}

export function rectsOverlap(a: CollagePlacement, b: CollagePlacement) {
  return overlapArea(a, b);
}
