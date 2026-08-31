import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';

export default function NotFound() {
  return <>
    <main className="not-found" id="main">
      <p className="eyebrow">Lost and Found: Lori, Armenia · 404</p>
      <h1>This object or project was not found.</h1>
      <Link href="/en">← Back to collection</Link>
    </main>
    <SiteFooter locale="en" />
  </>;
}
