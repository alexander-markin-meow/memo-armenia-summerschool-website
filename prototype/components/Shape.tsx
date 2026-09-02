import type { CSSProperties } from 'react';
import type { ShapeName } from '@/lib/content';

const atlasCells: Record<ShapeName, { x: number; y: number }> = {
  button: { x: 0, y: 0 },
  stone: { x: 1, y: 0 },
  metal: { x: 2, y: 0 },
  leaf: { x: 3, y: 0 },
  tile: { x: 0, y: 1 },
  spool: { x: 1, y: 1 },
  bead: { x: 2, y: 1 },
  paper: { x: 3, y: 1 },
  ribbon: { x: 0, y: 2 },
  ring: { x: 1, y: 2 },
  shard: { x: 2, y: 2 },
};

export function Shape({ name, className = '' }: { name: ShapeName; className?: string }) {
  const cell = atlasCells[name];
  return (
    <span
      className={`shape shape-${name} shape-atlas ${className}`}
      style={{ '--atlas-x': `${cell.x * 100 / 3}%`, '--atlas-y': `${cell.y * 50}%` } as CSSProperties}
      aria-hidden="true"
    />
  );
}
