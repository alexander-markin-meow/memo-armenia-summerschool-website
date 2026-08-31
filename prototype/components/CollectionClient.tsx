'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Shape } from './Shape';
import { CollectionIntro } from './CollectionIntro';
import { useCollectionLayout } from './useCollectionLayout';
import type { Locale, MuseumEntry } from '@/lib/content';
import { text, ui } from '@/lib/content';

export function CollectionClient({ entries, locale }: { entries: MuseumEntry[]; locale: Locale }) {
  const { field, layout, rememberScroll } = useCollectionLayout(entries);

  return (
    <>
      <CollectionIntro locale={locale} />
      <section
        ref={field}
        id="objects"
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
              onClick={rememberScroll}
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
    </>
  );
}
