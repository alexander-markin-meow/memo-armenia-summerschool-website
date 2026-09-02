import type { CollageMetadata } from './content';

export type CollageItem = { id: string; collage: CollageMetadata };
export type CollageVariant = 'desktop' | 'mobile';
export type CollagePosition = { xPercent: number; top: number; scale: number; rotation: number };
export type CollagePlacement = {
  id: string;
  order: number;
  band: number;
  desktop: CollagePosition;
  mobile: CollagePosition;
  width: number;
  height: number;
  hitPadding: number;
};
export type CollageLayout = {
  seed: number;
  desktopHeight: number;
  mobileHeight: number;
  placements: CollagePlacement[];
};

export type Rect = { x: number; y: number; width: number; height: number };

const DESKTOP_WIDTH = 1200;
const MOBILE_WIDTH = 360;
const DESKTOP_STEP = 190;
const MOBILE_STEP = 202;
const LABEL_HEIGHT = 68;
const CENTRAL_TARGET = 48;
const MOBILE_HIT_PADDING = 12;

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

function shuffle<T>(items: T[], random: () => number) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function overlapArea(a: Rect, b: Rect) {
  const width = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const height = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return width * height;
}

export function overlapRatio(a: Rect, b: Rect) {
  return overlapArea(a, b) / Math.min(a.width * a.height, b.width * b.height);
}

function itemRect(item: CollageItem, position: CollagePosition, viewportWidth: number, includeLabel: boolean): Rect {
  const width = item.collage.dimensions.width * position.scale;
  const height = item.collage.dimensions.height * position.scale;
  const left = viewportWidth * position.xPercent / 100 - width / 2;
  return { x: left, y: position.top, width, height: height + (includeLabel ? LABEL_HEIGHT : 0) };
}

export function visibleRect(item: CollageItem, placement: CollagePlacement, variant: CollageVariant, viewportWidth = variant === 'desktop' ? DESKTOP_WIDTH : MOBILE_WIDTH) {
  const position = placement[variant];
  const source = itemRect(item, position, viewportWidth, false);
  const bounds = item.collage.visibleBounds;
  const left = source.width * bounds.left / 100;
  const right = source.width * bounds.right / 100;
  const top = source.height * bounds.top / 100;
  const bottom = source.height * bounds.bottom / 100;
  return { x: source.x + left, y: source.y + top, width: source.width - left - right, height: source.height - top - bottom };
}

export function hitRect(item: CollageItem, placement: CollagePlacement, variant: CollageVariant, viewportWidth = variant === 'desktop' ? DESKTOP_WIDTH : MOBILE_WIDTH) {
  const position = placement[variant];
  const shape = itemRect(item, position, viewportWidth, false);
  const padding = variant === 'mobile' ? MOBILE_HIT_PADDING : item.collage.hitPadding;
  return {
    x: shape.x - padding,
    y: shape.y - padding,
    width: Math.max(CENTRAL_TARGET, shape.width + padding * 2),
    height: Math.max(CENTRAL_TARGET, shape.height + padding * 2 + LABEL_HEIGHT),
  };
}

export function centralClickZone(item: CollageItem, placement: CollagePlacement, variant: CollageVariant, viewportWidth = variant === 'desktop' ? DESKTOP_WIDTH : MOBILE_WIDTH) {
  const visible = visibleRect(item, placement, variant, viewportWidth);
  return {
    x: visible.x + visible.width / 2 - CENTRAL_TARGET / 2,
    y: visible.y + visible.height / 2 - CENTRAL_TARGET / 2,
    width: CENTRAL_TARGET,
    height: CENTRAL_TARGET,
  };
}

/**
 * Creates a deterministic composition from one visit seed. The same values feed
 * two CSS breakpoint layouts, so ordinary resizing never causes a reshuffle.
 */
export function createCollageLayout(seed: number, items: CollageItem[]): CollageLayout {
  const random = mulberry32(seed);
  const ordered = shuffle(items, random);
  const bands: CollageItem[][] = [];
  for (let index = 0; index < ordered.length;) {
    const remaining = ordered.length - index;
    const count = remaining === 1 || (remaining > 2 && random() < 0.12) ? 1 : 2;
    bands.push(ordered.slice(index, index + count));
    index += count;
  }

  const placements: CollagePlacement[] = [];
  let order = 0;
  for (const [band, bandItems] of bands.entries()) {
    for (const [slot, item] of bandItems.entries()) {
      const weight = item.collage.visualWeight ?? 1;
      const paired = bandItems.length === 2;
      const desktopX = paired
        ? (slot === 0 ? 20 + random() * 17 : 63 + random() * 17)
        : 24 + random() * 52;
      const mobileX = paired ? (slot === 0 ? 24 : 76) : 26 + random() * 48;
      const desktopScale = clamp((0.86 + random() * 0.34) * weight, 0.8, 1.24);
      const mobileScale = clamp((0.53 + random() * 0.06) * weight, 0.51, 0.59);

      const placement: CollagePlacement = {
        id: item.id,
        order,
        band,
        width: item.collage.dimensions.width,
        height: item.collage.dimensions.height,
        hitPadding: item.collage.hitPadding,
        desktop: {
          xPercent: Math.round(desktopX * 100) / 100,
          top: 52 + band * DESKTOP_STEP + Math.round(random() * 24),
          scale: Math.round(desktopScale * 1000) / 1000,
          rotation: Math.round((random() * 24 - 12) * 10) / 10,
        },
        mobile: {
          xPercent: Math.round(mobileX * 100) / 100,
          top: 30 + band * MOBILE_STEP + Math.round(random() * 3),
          scale: Math.round(mobileScale * 1000) / 1000,
          rotation: Math.round((random() * 14 - 7) * 10) / 10,
        },
      };

      // If adjacent bands meet, move the newer object down just enough to keep
      // visible overlap under 20% and every central 48px target fully exposed.
      let attempts = 0;
      while (attempts < 18 && placements.some((other) => {
        const otherItem = items.find((candidate) => candidate.id === other.id)!;
        return overlapRatio(visibleRect(item, placement, 'desktop'), visibleRect(otherItem, other, 'desktop')) > 0.2
          || overlapArea(centralClickZone(item, placement, 'desktop'), centralClickZone(otherItem, other, 'desktop')) > 0;
      })) {
        placement.desktop.top += 8;
        attempts += 1;
      }

      placements.push(placement);
      order += 1;
    }
  }

  return {
    seed,
    desktopHeight: bands.length * DESKTOP_STEP + 250,
    mobileHeight: bands.length * MOBILE_STEP + 230,
    placements,
  };
}
