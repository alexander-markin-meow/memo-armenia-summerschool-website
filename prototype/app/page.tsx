import { CollectionClient } from '@/components/CollectionClient';
import { LocaleSync } from '@/components/LocaleSync';
import { SkipLink } from '@/components/SkipLink';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { entries } from '@/lib/content';

export default function Home() {
  return <>
    <SkipLink locale="en" />
    <main className="collection-shell" id="main" lang="en" tabIndex={-1}>
      <LocaleSync locale="en" />
      <SiteHeader locale="en" view="collection" />
      <CollectionClient entries={entries} locale="en" />
    </main>
    <SiteFooter locale="en" />
  </>;
}
