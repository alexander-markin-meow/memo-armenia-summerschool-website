import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CollectionClient } from '@/components/CollectionClient';
import { LocaleSync } from '@/components/LocaleSync';
import { SiteHeader } from '@/components/SiteHeader';
import { entries, isLocale, text, ui } from '@/lib/content';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: `Lori, Found — ${text(ui.collection, lang)}`,
    description: text(ui.prototypeLong, lang),
  };
}

export default async function CollectionPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <main className="collection-shell" id="main">
      <LocaleSync locale={lang} />
      <SiteHeader locale={lang} view="collection" />
      <p className="prototype-badge">{text(ui.prototype, lang)}</p>
      <CollectionClient entries={entries} locale={lang} />
    </main>
  );
}
