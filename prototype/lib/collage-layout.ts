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

const SHAPES: Record<ShapeName, { width: number; height: number }> = {
  button: { width: 116, height: 116 },
  stone: { width: 156, height: 104 },
  metal: { width: 162, height: 108 },
  leaf: { width: 112, height: 164 },
  tile: { width: 144, height: 128 },
  spool: { width: 118, height: 142 },
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
  clusterSize: number,
) {
  const source = SHAPES[item.shape];
  const clusterRole = order % clusterSize;
  const prominence = mobile
    ? [1, 0.46, 0.2, 0.38, 0.25][clusterRole] ?? 0.28
    : 1 - order / Math.max(1, count - 1);
  // Thirty objects need a compact desktop treatment, but wide canvases have enough room
  // for a small scale lift without compromising the protected label and hit-area spacing.
  const densityScale = mobile ? count > 20 ? 0.72 : 0.84 : count > 20 ? wide ? 0.63 : 0.58 : count > 10 ? 0.79 : 1;
  const fallbackScale = 1 - fallback * 0.065;
  const scaleJitter = 0.84 + random() * 0.32;
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
  minimumGap: number,
  mobileClusterY?: number,
) {
  const centreX = candidate.x + candidate.width / 2;
  const centreY = candidate.y + candidate.height / 2;
  const diagonal = Math.hypot(canvas.width, canvas.height);
  let nearest = diagonal;
  let rowPenalty = 0;
  let columnPenalty = 0;
  let symmetryPenalty = 0;

  for (const current of placed) {
    if (overlapArea(candidate, current) > 0) return Number.NEGATIVE_INFINITY;
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
  const density = placed.length ? nearest / Math.max(minimumGap, 1) : 1.5;
  const edgeScore = clamp(edgeDistance / 58, 0, 1);
  const centrality = Math.hypot(centreX - canvas.width / 2, centreY - canvas.height / 2) / diagonal;

  if (mobileClusterY !== undefined) {
    const desiredSpacing = Math.max(candidate.width, candidate.height) * 1.15;
    const spacingScore = placed.length
      ? 1.45 - Math.abs(nearest - desiredSpacing) / desiredSpacing
      : 1.1;
    const clusterScore = 1 - clamp(Math.abs(centreY - mobileClusterY) / (canvas.height * 0.22), 0, 1);
    // Mobile deliberately forms loose, irregular vertical constellations instead of a left/right sequence.
    return spacingScore * 2.3 + clusterScore * 2.8 + edgeScore * 0.45 - rowPenalty * 0.45 - columnPenalty * 0.8 - symmetryPenalty;
  }

  // A small centre preference avoids a large accidental empty desert without building rows or columns.
  return density * 3.8 + edgeScore * 0.8 + (1 - centrality) * 0.35 - rowPenalty - columnPenalty - symmetryPenalty * 0.9;
}

function makeAttempt(seed: number, items: CollageItem[], width: number, height: number, fallback: number): CollagePlacement[] | null {
  const random = mulberry32(seed + fallback * 104729);
  const mobile = width < 520;
  const wide = width >= 1200;
  const clusterRandom = mulberry32(seed + fallback * 1327);
  const clusterCount = mobile ? Math.min(6, Math.ceil(items.length / 4)) : 4;
  const mobileClusterY = Array.from({ length: clusterCount }, (_, index) => {
    const base = (index + 0.5) / clusterCount;
    return height * (base + (clusterRandom() - 0.5) * 0.085);
  });
  const clusterSize = Math.ceil(items.length / clusterCount);
  const bySize = items
    .map((item, index) => ({
      item,
      index,
      cluster: Math.min(Math.floor(index / clusterSize), clusterCount - 1),
      dimensions: itemDimensions(item, index, items.length, random, fallback, mobile, wide, clusterSize),
    }))
    .sort((a, b) => (b.dimensions.shapeWidth * b.dimensions.shapeHeight) - (a.dimensions.shapeWidth * a.dimensions.shapeHeight));
  const placed: Array<CollagePlacement & { rect: Rect }> = [];
  const canvas = { width, height };
  const minimumGap = Math.max(22 - fallback * 5, 6);

  for (const current of bySize) {
    const { dimensions } = current;
    const maxX = width - dimensions.width - EDGE_PADDING;
    const maxY = height - dimensions.height - EDGE_PADDING;
    if (maxX <= EDGE_PADDING || maxY <= EDGE_PADDING) return null;

    let winner: { rect: Rect; score: number } | null = null;
    const candidateCount = mobile ? CANDIDATES_PER_ITEM * 6 : CANDIDATES_PER_ITEM;
    for (let attempt = 0; attempt < candidateCount; attempt += 1) {
      const rect = {
        x: Math.round(EDGE_PADDING + random() * (maxX - EDGE_PADDING)),
        y: Math.round(EDGE_PADDING + random() * (maxY - EDGE_PADDING)),
        width: dimensions.width,
        height: dimensions.height,
      };
      const score = scoreCandidate(rect, placed.map((item) => item.rect), canvas, minimumGap, mobile ? mobileClusterY[current.cluster] : undefined);
      if (!winner || score > winner.score) winner = { rect, score };
    }
    if (!winner || !Number.isFinite(winner.score)) return null;
    placed.push({
      id: current.item.id,
      x: winner.rect.x,
      y: winner.rect.y,
      width: winner.rect.width,
      height: winner.rect.height,
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
