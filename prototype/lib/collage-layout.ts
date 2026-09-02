import type { Locale, MuseumEntry, ShapeName } from './content.ts';
import { text } from './content.ts';

export type VisibleBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CollageObject = {
  id: string;
  projectUrl: string;
  label: string;
  projectTitle: string;
  altText: string;
  shape: ShapeName;
  intrinsicSize: { width: number; height: number };
  visibleAlphaBounds: VisibleBounds;
  hitPadding: number;
  visualWeight: number;
};

export type CollagePlacement = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  objectScale: number;
  objectOffset: number;
  objectFlip: 1 | -1;
  layer: number;
};

export type CollageLayout = {
  canvasHeight: number;
  densityColumns: number;
  placements: CollagePlacement[];
};

type ShapeProfile = {
  intrinsicSize: { width: number; height: number };
  visibleAlphaBounds: VisibleBounds;
  hitPadding: number;
  visualWeight: number;
};

export const shapeProfiles: Record<ShapeName, ShapeProfile> = {
  button: { intrinsicSize: { width: 920, height: 920 }, visibleAlphaBounds: { x: .12, y: .12, width: .76, height: .76 }, hitPadding: 18, visualWeight: .94 },
  stone: { intrinsicSize: { width: 1040, height: 720 }, visibleAlphaBounds: { x: .07, y: .2, width: .86, height: .62 }, hitPadding: 16, visualWeight: 1.08 },
  metal: { intrinsicSize: { width: 1020, height: 790 }, visibleAlphaBounds: { x: .08, y: .14, width: .84, height: .72 }, hitPadding: 16, visualWeight: 1.04 },
  leaf: { intrinsicSize: { width: 700, height: 1080 }, visibleAlphaBounds: { x: .18, y: .04, width: .64, height: .92 }, hitPadding: 20, visualWeight: .93 },
  tile: { intrinsicSize: { width: 960, height: 820 }, visibleAlphaBounds: { x: .09, y: .12, width: .82, height: .76 }, hitPadding: 16, visualWeight: 1.02 },
  spool: { intrinsicSize: { width: 760, height: 1040 }, visibleAlphaBounds: { x: .18, y: .05, width: .64, height: .9 }, hitPadding: 20, visualWeight: .96 },
  bead: { intrinsicSize: { width: 880, height: 880 }, visibleAlphaBounds: { x: .13, y: .13, width: .74, height: .74 }, hitPadding: 20, visualWeight: .9 },
  paper: { intrinsicSize: { width: 1020, height: 800 }, visibleAlphaBounds: { x: .08, y: .13, width: .84, height: .74 }, hitPadding: 16, visualWeight: 1.03 },
  ribbon: { intrinsicSize: { width: 1060, height: 650 }, visibleAlphaBounds: { x: .06, y: .23, width: .88, height: .54 }, hitPadding: 16, visualWeight: 1.05 },
  ring: { intrinsicSize: { width: 900, height: 900 }, visibleAlphaBounds: { x: .12, y: .12, width: .76, height: .76 }, hitPadding: 18, visualWeight: .96 },
  shard: { intrinsicSize: { width: 1000, height: 820 }, visibleAlphaBounds: { x: .08, y: .12, width: .84, height: .76 }, hitPadding: 16, visualWeight: 1.04 },
};

const clamp = (minimum: number, value: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

function randomUnit(seed: number, key: string) {
  let hash = (2166136261 ^ seed) >>> 0;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 2246822507);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 3266489909);
  hash ^= hash >>> 16;
  return (hash >>> 0) / 4294967296;
}

function horizontalOverlap(
  left: { x: number; width: number },
  right: { x: number; width: number },
  gap: number,
) {
  return left.x < right.x + right.width + gap && left.x + left.width + gap > right.x;
}

function lowestOpenY(
  x: number,
  width: number,
  height: number,
  startY: number,
  placements: CollagePlacement[],
  gap: number,
) {
  let y = startY;
  for (let step = 0; step <= placements.length; step += 1) {
    const blockers = placements.filter((placement) => (
      horizontalOverlap({ x, width }, placement, gap)
      && y < placement.y + placement.height + gap
      && y + height + gap > placement.y
    ));
    if (blockers.length === 0) return y;
    y = Math.min(...blockers.map((placement) => placement.y + placement.height + gap));
  }
  return y;
}

function protectedOverlap(
  candidate: { x: number; y: number; width: number; height: number },
  placement: CollagePlacement,
  gap: number,
) {
  return horizontalOverlap(candidate, placement, gap)
    && candidate.y < placement.y + placement.height + gap
    && candidate.y + candidate.height + gap > placement.y;
}

function createsHorizontalBand(centerY: number, placements: CollagePlacement[], span = 72, capacity = 3) {
  const centres = [centerY, ...placements.map((placement) => placement.y + placement.height / 2)].sort((a, b) => a - b);
  for (let index = 0; index + capacity < centres.length; index += 1) {
    if (centres[index + capacity] - centres[index] < span) return true;
  }
  return false;
}

export function makeCollageObjects(entries: MuseumEntry[], locale: Locale, projectUrl = (slug: string) => `/${locale}/projects/${slug}`): CollageObject[] {
  return entries.map((entry) => {
    const profile = shapeProfiles[entry.shape];
    const label = text(entry.objectName, locale);
    const projectTitle = text(entry.project.title, locale);
    return {
      id: entry.slug,
      projectUrl: projectUrl(entry.slug),
      label,
      projectTitle,
      altText: `${label} — ${projectTitle}`,
      shape: entry.shape,
      ...profile,
    };
  });
}

export function createCollageLayout(objects: CollageObject[], containerWidth: number, seed: number): CollageLayout {
  const safeWidth = Math.max(280, containerWidth);
  const gutter = clamp(16, safeWidth * .042, 64);
  const usableWidth = safeWidth - gutter * 2;
  const protectedGap = clamp(4, safeWidth * .005, 9);
  const targetCellWidth = clamp(184, safeWidth * .15, 198);
  const densityColumns = clamp(1, Math.floor((usableWidth + protectedGap) / (targetCellWidth + protectedGap)), 8);
  const nominalWidth = (usableWidth - protectedGap * (densityColumns - 1)) / densityColumns;
  const roomyFactor = clamp(0, (nominalWidth - 178) / 72, 1);
  const ordered = [...objects].sort((a, b) => randomUnit(seed, `${a.id}:order`) - randomUnit(seed, `${b.id}:order`));
  const objectById = new Map(objects.map((object) => [object.id, object]));
  const placements: CollagePlacement[] = [];
  const estimatedCardWidth = nominalWidth * (densityColumns === 1 ? .88 : .64);
  const estimatedCardHeight = densityColumns === 1
    ? 286
    : 184;
  const targetCanvasHeight = densityColumns === 1
    ? objects.length * 288
    : Math.max(780, objects.length * estimatedCardWidth * estimatedCardHeight / (usableWidth * .64));

  ordered.forEach((object, placementIndex) => {
    const widthVariation = densityColumns === 1
      ? .76 + randomUnit(seed, `${object.id}:width`) * .22
      : .54 + randomUnit(seed, `${object.id}:width`) * .18;
    const width = Math.min(usableWidth, nominalWidth * widthVariation * clamp(.94, object.visualWeight, 1.06));
    const height = densityColumns === 1
      ? 260 + randomUnit(seed, `${object.id}:mobile-height`) * 30 + (object.visualWeight - 1) * 12
      : 158 + randomUnit(seed, `${object.id}:height`) * 42 + (object.visualWeight - 1) * 12;

    let bestX = gutter;
    let bestY = 12;
    let bestScore = Number.POSITIVE_INFINITY;
    const candidateCount = densityColumns === 1 ? 1 : 720;
    for (let candidateIndex = 0; candidateIndex < candidateCount; candidateIndex += 1) {
      const envelopeGrowth = 1 + Math.floor(candidateIndex / 180) * .03;
      const candidateX = densityColumns === 1
        ? gutter + randomUnit(seed, `${object.id}:mobile-x`) * Math.max(0, usableWidth - width)
        : gutter + randomUnit(seed, `${object.id}:candidate-x:${candidateIndex}`) * Math.max(0, usableWidth - width);
      const candidateY = densityColumns === 1
        ? placementIndex * 288 + 8
        : 10 + randomUnit(seed, `${object.id}:candidate-y:${candidateIndex}`)
          * Math.max(0, targetCanvasHeight * envelopeGrowth - height - 20);
      const candidate = { x: candidateX, y: candidateY, width, height };
      if (placements.some((placement) => protectedOverlap(candidate, placement, protectedGap))) continue;

      const centerX = candidateX + width / 2;
      const centerY = candidateY + height / 2;
      const repeatedShapeTooClose = densityColumns > 1 && placements.some((placement) => {
        if (objectById.get(placement.id)?.shape !== object.shape) return false;
        const dx = centerX - (placement.x + placement.width / 2);
        const dy = centerY - (placement.y + placement.height / 2);
        return Math.hypot(dx, dy) < nominalWidth * 1.6;
      });
      if (repeatedShapeTooClose) continue;
      if (densityColumns > 1 && createsHorizontalBand(centerY, placements)) continue;
      const topBandCapacity = densityColumns >= 6 ? 3 : 2;
      if (candidateY < 108 && placements.filter((placement) => placement.y < 108).length >= topBandCapacity) continue;

      let alignmentPenalty = 0;
      let repeatedShapePenalty = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      let closeNeighbours = 0;
      let localCrowdingPenalty = 0;

      placements.forEach((placement) => {
        const placedObject = objectById.get(placement.id);
        const dx = centerX - (placement.x + placement.width / 2);
        const dy = centerY - (placement.y + placement.height / 2);
        const distance = Math.hypot(dx, dy);
        nearestDistance = Math.min(nearestDistance, distance);
        const topAlignment = Math.abs(candidateY - placement.y);
        alignmentPenalty += Math.exp(-.5 * (topAlignment / 72) ** 2) * 76;
        const centerAlignment = Math.abs(centerY - (placement.y + placement.height / 2));
        alignmentPenalty += Math.exp(-.5 * (centerAlignment / 66) ** 2) * 64;
        const leftAlignment = Math.abs(candidateX - placement.x);
        alignmentPenalty += Math.exp(-.5 * (leftAlignment / 52) ** 2) * 14;
        if (distance < nominalWidth * 1.65) closeNeighbours += 1;
        localCrowdingPenalty += Math.max(0, nominalWidth * 1.42 - distance) * .5;
        if (placedObject?.shape === object.shape) {
          const separationTarget = nominalWidth * 2.5;
          if (distance < separationTarget) repeatedShapePenalty += (separationTarget - distance) * 2.2;
        }
      });

      const isolationThreshold = nominalWidth * 2.25;
      const spacingPenalty = Number.isFinite(nearestDistance)
        ? Math.max(0, nearestDistance - isolationThreshold) * .4
        : 0;
      const crowdingPenalty = localCrowdingPenalty + Math.max(0, closeNeighbours - 2) * 54;
      const overflowPenalty = Math.max(0, candidateY + height - targetCanvasHeight) * 8;
      const seededVariation = randomUnit(seed, `${object.id}:candidate-score:${candidateIndex}`) * 24;
      const score = alignmentPenalty + repeatedShapePenalty + spacingPenalty + crowdingPenalty + overflowPenalty + seededVariation;
      if (score < bestScore) {
        bestScore = score;
        bestX = candidateX;
        bestY = candidateY;
      }
    }

    if (!Number.isFinite(bestScore)) {
      for (let fallbackIndex = 0; fallbackIndex < 96; fallbackIndex += 1) {
        const candidateX = gutter + randomUnit(seed, `${object.id}:fallback-x:${fallbackIndex}`) * Math.max(0, usableWidth - width);
        const candidateY = lowestOpenY(candidateX, width, height, 10, placements, protectedGap);
        const centerX = candidateX + width / 2;
        const centerY = candidateY + height / 2;
        const repeatedShapeTooClose = densityColumns > 1 && placements.some((placement) => {
          if (objectById.get(placement.id)?.shape !== object.shape) return false;
          return Math.hypot(
            centerX - (placement.x + placement.width / 2),
            centerY - (placement.y + placement.height / 2),
          ) < nominalWidth * 1.6;
        });
        if (repeatedShapeTooClose) continue;
        if (densityColumns > 1 && createsHorizontalBand(centerY, placements)) continue;
        const topBandCapacity = densityColumns >= 6 ? 3 : 2;
        if (candidateY < 108 && placements.filter((placement) => placement.y < 108).length >= topBandCapacity) continue;
        if (candidateY < bestY || !Number.isFinite(bestScore)) {
          bestX = candidateX;
          bestY = candidateY;
          bestScore = candidateY;
        }
      }
    }

    if (!Number.isFinite(bestScore)) {
      bestX = gutter + randomUnit(seed, `${object.id}:last-resort-x`) * Math.max(0, usableWidth - width);
      bestY = Math.max(10, ...placements.map((placement) => placement.y + placement.height + protectedGap));
      for (let separationStep = 0; separationStep < objects.length; separationStep += 1) {
        const centerX = bestX + width / 2;
        const centerY = bestY + height / 2;
        const clearsRepeatedShapes = placements.every((placement) => (
          objectById.get(placement.id)?.shape !== object.shape
          || Math.hypot(
            centerX - (placement.x + placement.width / 2),
            centerY - (placement.y + placement.height / 2),
          ) >= nominalWidth * 1.6
        ));
        if (clearsRepeatedShapes) break;
        bestY += nominalWidth * .2;
      }
    }

    const x = bestX;
    const y = bestY;
    const rotationRange = densityColumns === 1 ? 4.5 : 6 + roomyFactor * 3;
    const rotation = (randomUnit(seed, `${object.id}:rotation`) * 2 - 1) * rotationRange;
    const scaleVariation = densityColumns === 1
      ? 1 + randomUnit(seed, `${object.id}:scale`) * .08
      : .98 + randomUnit(seed, `${object.id}:scale`) * .16;
    const expansion = densityColumns === 1
      ? 1
      : 1 + roomyFactor * (.08 + randomUnit(seed, `${object.id}:expansion`) * .12);
    const objectScale = scaleVariation * expansion;
    const desiredOffset = densityColumns === 1
      ? 0
      : (randomUnit(seed, `${object.id}:drift-direction`) > .5 ? 1 : -1)
        * (5 + randomUnit(seed, `${object.id}:drift`) * (14 + roomyFactor * 20));
    const visualWidth = Math.min(width * 1.55, 272) * objectScale;
    const radians = Math.abs(rotation) * Math.PI / 180;
    const visualHalfWidth = visualWidth * (Math.cos(radians) + (4 / 3) * Math.sin(radians)) / 2;
    const cardCenterX = x + width / 2;
    const objectOffset = clamp(visualHalfWidth - cardCenterX + 14, desiredOffset, safeWidth - visualHalfWidth - cardCenterX - 14);

    placements.push({
      id: object.id,
      x,
      y,
      width,
      height,
      rotation,
      objectScale,
      objectOffset,
      objectFlip: randomUnit(seed, `${object.id}:flip`) > .5 ? 1 : -1,
      layer: 1 + Math.floor(randomUnit(seed, `${object.id}:layer`) * 8),
    });
  });

  const canvasHeight = Math.max(0, ...placements.map(({ y, height }) => y + height)) + 28;
  return { canvasHeight: Math.ceil(canvasHeight), densityColumns, placements };
}
