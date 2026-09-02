import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LocaleSync } from '@/components/LocaleSync';
import { ResearchResults } from '@/components/ResearchResults';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { SkipLink } from '@/components/SkipLink';
import { isLocale, text, ui } from '@/lib/content';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: `${text(ui.research, lang)} — ${text(ui.siteTitle, lang)}`, description: text(ui.researchIntro, lang) };
}

export default async function ResearchPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <>
    <SkipLink locale={lang} />
    <main className="research-page" id="main" lang={lang} tabIndex={-1}>
      <LocaleSync locale={lang} />
      <SiteHeader locale={lang} view="research" pathSuffix="/research" />
      <ResearchResults locale={lang} LinkComponent={Link} projectHref={(slug) => `/${lang}/projects/${slug}`} />
    </main>
    <SiteFooter locale={lang} />
  </>;
}
