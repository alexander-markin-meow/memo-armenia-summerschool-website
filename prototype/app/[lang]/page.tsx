import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CollectionClient } from '@/components/CollectionClient';
import { LocaleSync } from '@/components/LocaleSync';
import { SkipLink } from '@/components/SkipLink';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { entries, isLocale, text, ui } from '@/lib/content';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: `${text(ui.siteTitle, lang)} — ${text(ui.collection, lang)}`,
    description: text(ui.prototypeLong, lang),
    openGraph: {
      title: `${text(ui.siteTitle, lang)} — ${text(ui.collection, lang)}`,
      description: text(ui.prototypeLong, lang),
      images: [{ url: '/og.png', width: 1729, height: 910, alt: 'Lost and Found: Lori, Armenia — found-object illustrations on warm paper' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${text(ui.siteTitle, lang)} — ${text(ui.collection, lang)}`,
      description: text(ui.prototypeLong, lang),
      images: ['/og.png'],
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <>
    <SkipLink locale={lang} />
    <main className="collection-shell" id="main" lang={lang} tabIndex={-1}>
      <LocaleSync locale={lang} />
      <SiteHeader locale={lang} view="collection" />
      <CollectionClient entries={entries} locale={lang} />
    </main>
    <SiteFooter locale={lang} />
  </>;
}
