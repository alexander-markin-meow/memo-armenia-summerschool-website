'use client';

import Link from 'next/link';
import { CollectionCanvas } from './CollectionCanvas';
import { CollectionIntro } from './CollectionIntro';
import type { Locale, MuseumEntry } from '@/lib/content';

export function CollectionClient({ entries, locale }: { entries: MuseumEntry[]; locale: Locale }) {
  return (
    <>
      <CollectionIntro locale={locale} />
      <CollectionCanvas entries={entries} locale={locale} LinkComponent={Link} projectHref={(entry) => `/${locale}${entry.collage.projectPath}`} />
    </>
  );
}
