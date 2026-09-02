'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { collectionSeed, consumeCollectionScroll, rememberCollectionScroll } from '@/lib/browser-state';
import { createCollageLayout } from '@/lib/collage-layout';
import type { MuseumEntry } from '@/lib/content';

const FALLBACK_SEED = 20260823;

export function useCollectionLayout(entries: MuseumEntry[]) {
  const items = useMemo(() => entries.map((entry) => ({ id: entry.slug, collage: entry.collage })), [entries]);
  const [layout, setLayout] = useState(() => createCollageLayout(FALLBACK_SEED, items));
  const restoredScroll = useRef(false);

  useEffect(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const frame = requestAnimationFrame(() => {
      setLayout(createCollageLayout(collectionSeed(navigation?.type), items));
    });
    return () => cancelAnimationFrame(frame);
  }, [items]);

  useEffect(() => {
    if (restoredScroll.current) return;
    restoredScroll.current = true;
    const scrollY = consumeCollectionScroll();
    if (scrollY !== null) requestAnimationFrame(() => window.scrollTo({ top: scrollY }));
  }, [layout]);

  const rememberScroll = useCallback(() => rememberCollectionScroll(window.scrollY), []);
  return { layout, rememberScroll };
}
