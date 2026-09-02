"use client";

import { AnchorLink } from './AnchorLink';
import { CollectionCollage } from './CollectionCollage';
import { CollectionIntro } from './CollectionIntro';
import type { Locale, MuseumEntry } from '@/lib/content';

export function CollectionClient({ entries, locale }: { entries: MuseumEntry[]; locale: Locale }) {
  return (
    <>
      <CollectionIntro locale={locale} />
      <CollectionCollage entries={entries} locale={locale} LinkComponent={AnchorLink} projectHref={(slug) => `/${locale}/projects/${slug}`} />
    </>
  );
}
