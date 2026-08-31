import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LocaleSync } from '@/components/LocaleSync';
import { ProjectArticle } from '@/components/ProjectArticle';
import { SkipLink } from '@/components/SkipLink';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { entryBySlug, isLocale, text, ui } from '@/lib/content';

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const entry = entryBySlug(slug);
  if (!isLocale(lang) || !entry) return {};
  const title = `${text(entry.project.title, lang)} — ${text(ui.siteTitle, lang)}`;
  const description = text(entry.project.introduction, lang);
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { title, description, images: [] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  const entry = entryBySlug(slug);
  if (!isLocale(lang) || !entry) notFound();

  return <>
    <SkipLink locale={lang} />
    <main className="project-page" id="main" lang={lang} tabIndex={-1}>
      <LocaleSync locale={lang} />
      <SiteHeader locale={lang} view="project" pathSuffix={`/projects/${slug}`} />
      <div className="project-controls">
        <Link className="back-link" href={`/${lang}`}>← {text(ui.backCollection, lang)}</Link>
      </div>
      <p className="prototype-badge project-notice">{text(ui.prototype, lang)}</p>
      <ProjectArticle
        entry={entry}
        locale={lang}
        LinkComponent={Link}
        projectHref={(projectSlug) => `/${lang}/projects/${projectSlug}`}
      />
    </main>
    <SiteFooter locale={lang} />
  </>;
}
