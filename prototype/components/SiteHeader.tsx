import Link from 'next/link';
import { SiteHeaderBase } from './SiteHeaderBase';
import type { Locale } from '@/lib/content';

export function SiteHeader({ locale, view, pathSuffix = '' }: { locale: Locale; view: 'collection' | 'project'; pathSuffix?: string }) {
  return (
    <SiteHeaderBase
      locale={locale}
      view={view}
      collectionHref={`/${locale}`}
      localizedHref={(item) => `/${item}${pathSuffix}`}
      LinkComponent={Link}
    />
  );
}
