import { AnchorLink } from '@/components/AnchorLink';
import { SkipLink } from '@/components/SkipLink';
import { SiteFooter } from '@/components/SiteFooter';

export default function NotFound() {
  return <>
    <SkipLink locale="en" />
    <main className="not-found" id="main" lang="en" tabIndex={-1}>
      <p className="eyebrow">Lost and Found: Pokr Ayrum · 404</p>
      <h1>This object or project was not found.</h1>
      <AnchorLink href="/en">← Back to collection</AnchorLink>
    </main>
    <SiteFooter locale="en" />
  </>;
}
