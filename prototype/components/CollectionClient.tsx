'use client';

import { AnchorLink } from './AnchorLink';
import { CollectionCanvas } from './CollectionCanvas';
import { CollectionIntro } from './CollectionIntro';
import type { Locale, MuseumEntry } from '@/lib/content';

export function CollectionClient({ entries, locale }: { entries: MuseumEntry[]; locale: Locale }) {
  return (
    <>
      <CollectionIntro locale={locale} />
      <CollectionCanvas entries={entries} locale={locale} LinkComponent={AnchorLink} projectHref={(entry) => `/${locale}${entry.collage.projectPath}`} />
    </>
  );
}
