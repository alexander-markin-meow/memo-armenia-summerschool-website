'use client';

import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Shape } from './Shape';
import { createCollageLayout, type CollageLayout } from '@/lib/collage-layout';
import type { Locale, MuseumEntry } from '@/lib/content';
import { text, ui } from '@/lib/content';

export function CollectionClient({ entries, locale }: { entries: MuseumEntry[]; locale: Locale }) {
  const field = useRef<HTMLElement>(null);
  const [layout, setLayout] = useState<CollageLayout | null>(null);

  useEffect(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const stored = window.sessionStorage.getItem('lori-collection-seed');
    // A refresh begins a fresh visit. Client-side project navigation retains the session's seed.
    const seed = stored && navigation?.type !== 'reload' ? Number(stored) : crypto.getRandomValues(new Uint32Array(1))[0];
    window.sessionStorage.setItem('lori-collection-seed', String(seed));

    const update = () => {
      const width = field.current?.getBoundingClientRect().width;
      if (!width) return;
      setLayout(createCollageLayout(seed, entries.map((entry) => ({ id: entry.slug, shape: entry.shape })), Math.floor(width), window.innerHeight));
    };
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
  }, [entries]);

  return (
    <section
      ref={field}
      className="object-field"
      aria-label={text(ui.collection, locale)}
      data-ready={layout ? 'true' : 'false'}
      style={layout ? { height: layout.height } : undefined}
    >
      {entries.map((entry, index) => {
        const placement = layout?.placements[index];
        const style: CSSProperties | undefined = placement ? {
          left: placement.x,
          top: placement.y,
          width: placement.width,
          height: placement.height,
          '--shape-width': `${placement.shapeWidth}px`,
          '--shape-height': `${placement.shapeHeight}px`,
          '--shape-rotation': `${placement.rotation}deg`,
        } as CSSProperties : undefined;
        return (
          <Link
            className="object-link"
            href={`/${locale}/projects/${entry.slug}`}
            key={entry.slug}
            style={style}
            data-testid="museum-object"
            aria-label={`${text(entry.objectName, locale)} — ${text(entry.project.title, locale)}`}
          >
            <Shape name={entry.shape} />
            <span className="object-label">
              <b>{text(entry.objectName, locale)}</b>
              <small className="object-project">{text(entry.project.title, locale)}</small>
            </span>
          </Link>
        );
      })}
    </section>
  );
}
