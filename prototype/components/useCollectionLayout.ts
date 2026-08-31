'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { collectionSeed, consumeCollectionScroll, rememberCollectionScroll } from '@/lib/browser-state';
import { createCollageLayout, type CollageLayout } from '@/lib/collage-layout';
import type { MuseumEntry } from '@/lib/content';

export function useCollectionLayout(entries: MuseumEntry[]) {
  const field = useRef<HTMLElement>(null);
  const [layout, setLayout] = useState<CollageLayout | null>(null);
  const restoredScroll = useRef(false);

  useEffect(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const seed = collectionSeed(navigation?.type);

    const update = () => {
      const width = field.current?.getBoundingClientRect().width;
      if (!width) return;
      setLayout(createCollageLayout(
        seed,
        entries.map((entry) => ({ id: entry.slug, shape: entry.shape })),
        Math.floor(width),
        window.innerHeight,
      ));
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

  useEffect(() => {
    if (!layout || restoredScroll.current) return;
    restoredScroll.current = true;
    const scrollY = consumeCollectionScroll();
    if (scrollY === null) return;
    requestAnimationFrame(() => window.scrollTo({ top: scrollY }));
  }, [layout]);

  const rememberScroll = useCallback(() => rememberCollectionScroll(window.scrollY), []);

  return { field, layout, rememberScroll };
}
