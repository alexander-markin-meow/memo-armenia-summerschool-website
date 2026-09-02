'use client';

import type { ComponentType, CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { Shape } from './Shape';
import { useCollectionLayout } from './useCollectionLayout';
import { text, ui, type Locale, type MuseumEntry } from '@/lib/content';

type CanvasLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler;
  'aria-label'?: string;
  'data-testid'?: string;
};

export function CollectionCanvas({
  entries,
  locale,
  LinkComponent,
  projectHref,
}: {
  entries: MuseumEntry[];
  locale: Locale;
  LinkComponent: ComponentType<CanvasLinkProps>;
  projectHref: (entry: MuseumEntry) => string;
}) {
  const { layout, rememberScroll } = useCollectionLayout(entries);
  const entriesBySlug = new Map(entries.map((entry) => [entry.slug, entry]));
  const canvasStyle = {
    '--desktop-canvas-height': `${layout.desktopHeight}px`,
    '--mobile-canvas-height': `${layout.mobileHeight}px`,
  } as CSSProperties;

  return (
    <section id="objects" className="object-canvas" aria-label={text(ui.collection, locale)} style={canvasStyle}>
      {layout.placements.map((placement) => {
        const entry = entriesBySlug.get(placement.id)!;
        const style = {
          '--desktop-x': `${placement.desktop.xPercent}%`,
          '--desktop-y': `${placement.desktop.top}px`,
          '--desktop-scale': placement.desktop.scale,
          '--desktop-rotation': `${placement.desktop.rotation}deg`,
          '--mobile-x': `${placement.mobile.xPercent}%`,
          '--mobile-y': `${placement.mobile.top}px`,
          '--mobile-scale': placement.mobile.scale,
          '--mobile-rotation': `${placement.mobile.rotation}deg`,
          '--desktop-shape-width': `${Math.round(placement.width * placement.desktop.scale)}px`,
          '--desktop-shape-height': `${Math.round(placement.height * placement.desktop.scale)}px`,
          '--mobile-shape-width': `${Math.round(placement.width * placement.mobile.scale)}px`,
          '--mobile-shape-height': `${Math.round(placement.height * placement.mobile.scale)}px`,
          '--hit-padding': `${placement.hitPadding}px`,
          '--object-order': placement.order,
        } as CSSProperties;
        return (
          <LinkComponent
            className="object-link"
            href={projectHref(entry)}
            key={entry.slug}
            onClick={rememberScroll}
            style={style}
            data-testid="museum-object"
            aria-label={`${text(entry.collage.altText, locale)} — ${text(ui.openProject, locale)}: ${text(entry.collage.label, locale)}`}
          >
            <span className="object-figure"><Shape name={entry.shape} /></span>
            <span className="object-label">
              <b>{text(entry.objectName, locale)}</b>
              <small className="object-project">{text(entry.project.title, locale)}</small>
              <span className="object-action">{text(ui.openProject, locale)} <span aria-hidden="true">↗</span></span>
            </span>
          </LinkComponent>
        );
      })}
    </section>
  );
}
