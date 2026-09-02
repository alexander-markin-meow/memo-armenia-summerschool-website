"use client";

import { useEffect, useMemo, useRef, useState, type AnchorHTMLAttributes, type ComponentType, type CSSProperties, type ReactNode } from 'react';
import { Shape } from './Shape';
import type { Locale, MuseumEntry } from '@/lib/content';
import { text, ui } from '@/lib/content';
import { createCollageLayout, makeCollageObjects } from '@/lib/collage-layout';

type CollectionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
};

type CollageStyle = CSSProperties & {
  '--object-rotation': string;
  '--object-scale': number;
  '--object-offset': string;
  '--object-flip': number;
};

const initialSeed = 20260831;

function visitSeed() {
  const values = new Uint32Array(1);
  window.crypto.getRandomValues(values);
  return values[0];
}

export function CollectionCollage({
  entries,
  locale,
  LinkComponent,
  projectHref,
}: {
  entries: MuseumEntry[];
  locale: Locale;
  LinkComponent: ComponentType<CollectionLinkProps>;
  projectHref: (slug: string) => string;
}) {
  const collageRef = useRef<HTMLElement>(null);
  const [containerWidth, setContainerWidth] = useState(1024);
  const [seed, setSeed] = useState(initialSeed);
  const objects = useMemo(() => makeCollageObjects(entries, locale, projectHref), [entries, locale, projectHref]);
  const layout = useMemo(() => createCollageLayout(objects, containerWidth, seed), [containerWidth, objects, seed]);
  const objectById = useMemo(() => new Map(objects.map((object) => [object.id, object])), [objects]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setSeed(visitSeed()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const element = collageRef.current;
    if (!element) return;
    const updateWidth = () => setContainerWidth(Math.round(element.getBoundingClientRect().width));
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={collageRef}
      id="objects"
      className="object-collage"
      aria-label={text(ui.collection, locale)}
      aria-describedby="collage-instruction"
      data-layout-columns={layout.densityColumns}
      style={{ height: `${layout.canvasHeight}px` }}
    >
      {layout.placements.map((placement) => {
        const object = objectById.get(placement.id);
        if (!object) return null;
        const style: CollageStyle = {
          left: placement.x,
          top: placement.y,
          width: placement.width,
          height: placement.height,
          zIndex: placement.layer,
          '--object-rotation': `${placement.rotation.toFixed(2)}deg`,
          '--object-scale': Number(placement.objectScale.toFixed(3)),
          '--object-offset': `${placement.objectOffset.toFixed(1)}px`,
          '--object-flip': placement.objectFlip,
        };
        return (
          <LinkComponent
            className="object-card"
            href={object.projectUrl}
            key={object.id}
            style={style}
            data-testid="museum-object"
            data-alt={object.altText}
            data-visible-alpha={`${object.visibleAlphaBounds.x},${object.visibleAlphaBounds.y},${object.visibleAlphaBounds.width},${object.visibleAlphaBounds.height}`}
            data-hit-padding={object.hitPadding}
            aria-label={object.altText}
          >
            <span className="object-figure"><Shape name={object.shape} /></span>
            <span className="object-label">
              <b>{object.label}</b>
              <span className="object-arrow" aria-hidden="true">↗</span>
            </span>
          </LinkComponent>
        );
      })}
    </section>
  );
}
