'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shape } from './Shape';
import type { Locale, MuseumEntry } from '@/lib/content';
import { text } from '@/lib/content';

type Placement = { column: number; row: number; rotation: number; scale: number; dx: number; dy: number };

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function makePlacements(seed: number, width: number): Placement[] {
  const columns = width < 700 ? 2 : width < 1100 ? 3 : 4;
  const rows = width < 700 ? 3 : 2;
  const random = mulberry32(seed + columns * 101);
  const slots = Array.from({ length: columns * rows }, (_, index) => index);

  for (let index = slots.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [slots[index], slots[swap]] = [slots[swap], slots[index]];
  }

  return slots.slice(0, 6).map((slot) => ({
    column: (slot % columns) + 1,
    row: Math.floor(slot / columns) + 1,
    rotation: Math.round((random() * 24 - 12) * 10) / 10,
    scale: Math.round((0.9 + random() * 0.18) * 100) / 100,
    dx: Math.round(random() * 14 - 7),
    dy: Math.round(random() * 12 - 6),
  }));
}

export function CollectionClient({ entries, locale }: { entries: MuseumEntry[]; locale: Locale }) {
  const [placements, setPlacements] = useState<Placement[] | null>(null);

  useEffect(() => {
    const stored = window.sessionStorage.getItem('lori-collection-seed');
    const seed = stored ? Number(stored) : crypto.getRandomValues(new Uint32Array(1))[0];
    window.sessionStorage.setItem('lori-collection-seed', String(seed));

    const update = () => setPlacements(makePlacements(seed, window.innerWidth));
    update();
    let timeout = 0;
    const onResize = () => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(update, 120);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section className="object-field" aria-label="Collection of found objects" data-ready={placements ? 'true' : 'false'}>
      {entries.map((entry, index) => {
        const placement = placements?.[index];
        const style: CSSProperties | undefined = placement ? {
          gridColumn: placement.column,
          gridRow: placement.row,
          transform: `translate(${placement.dx}%, ${placement.dy}%) rotate(${placement.rotation}deg) scale(${placement.scale})`,
        } : undefined;
        return (
          <Link
            className="object-link"
            href={`/${locale}/projects/${entry.slug}`}
            key={entry.slug}
            style={style}
            data-testid="museum-object"
          >
            <Shape name={entry.shape} />
            <span className="object-label">
              <b>{String(index + 1).padStart(2, '0')} — {text(entry.objectName, locale)}</b>
              <small>{text(entry.project.title, locale)}</small>
            </span>
          </Link>
        );
      })}
    </section>
  );
}
