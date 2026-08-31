import { CollectionClient } from '@/components/CollectionClient';
import { LocaleSync } from '@/components/LocaleSync';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { entries, text, ui } from '@/lib/content';

export default function Home() {
  return <>
    <main className="collection-shell" id="main">
      <LocaleSync locale="en" />
      <SiteHeader locale="en" view="collection" />
      <p className="prototype-badge">{text(ui.prototype, 'en')}</p>
      <CollectionClient entries={entries} locale="en" />
    </main>
    <SiteFooter locale="en" />
  </>;
}
