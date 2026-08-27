import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LocaleSync } from '@/components/LocaleSync';
import { Shape } from '@/components/Shape';
import { SiteHeader } from '@/components/SiteHeader';
import { entries, entryBySlug, isLocale, mediumLabel, text, ui } from '@/lib/content';

type Props = {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ from?: string }>;
};

function safeReturn(value: string | undefined, lang: string) {
  if (!value) return null;
  try {
    const decoded = decodeURIComponent(value);
    return decoded.startsWith(`/${lang}/catalogue`) && !decoded.startsWith('//') ? decoded : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const entry = entryBySlug(slug);
  if (!isLocale(lang) || !entry) return {};
  const title = `${text(entry.project.title, lang)} — Lori, Found`;
  const description = text(entry.project.introduction, lang);
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { title, description, images: [] },
  };
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const { lang, slug } = await params;
  const search = await searchParams;
  const entry = entryBySlug(slug);
  if (!isLocale(lang) || !entry) notFound();
  const index = entries.indexOf(entry);
  const previous = entries[(index - 1 + entries.length) % entries.length];
  const next = entries[(index + 1) % entries.length];
  const returnPath = safeReturn(search.from, lang);

  return (
    <main className="project-page" id="main">
      <LocaleSync locale={lang} />
      <SiteHeader locale={lang} view="project" pathSuffix={`/projects/${slug}`} />
      <div className="project-controls">
        <Link className="back-link" href={`/${lang}`}>← {text(ui.backCollection, lang)}</Link>
        {returnPath && <Link className="back-link" href={returnPath}>← {text(ui.backCatalogue, lang)}</Link>}
      </div>
      <p className="prototype-badge project-notice">{text(ui.prototype, lang)}</p>

      <article>
        <section className="object-lead">
          <div className="lead-object"><Shape name={entry.shape} /></div>
          <div>
            <p className="eyebrow">{text(ui.foundObject, lang)} {String(index + 1).padStart(2, '0')}</p>
            <h1>{text(entry.objectName, lang)}</h1>
            <dl className="metadata">
              <div><dt>{text(ui.place, lang)}</dt><dd>{text(entry.location, lang)}</dd></div>
              <div><dt>{text(ui.date, lang)}</dt><dd>{text(entry.approximateDate, lang)}</dd></div>
            </dl>
            <p className="object-context">{text(entry.context, lang)}</p>
          </div>
        </section>

        <section className="project-story">
          <p className="eyebrow">{text(ui.participantProject, lang)} · {mediumLabel(entry.project.medium, lang)}</p>
          <h2>{text(entry.project.title, lang)}</h2>
          <p className="byline">{text(entry.project.participant, lang)} · {text(ui.pseudonym, lang)}</p>
          <p className="standfirst">{text(entry.project.introduction, lang)}</p>
          {entry.project.medium === 'video' ? (
            <button className="video-placeholder" type="button" aria-label={text(ui.playVideo, lang)}>
              <span aria-hidden="true">▶</span>
              <b>{text(ui.video, lang)}</b>
            </button>
          ) : entry.project.medium === 'text' ? (
            <div className="story-placeholder">
              <p><b>{text(ui.story, lang)}.</b> {text(ui.storyOne, lang)}</p>
              <p>{text(ui.storyTwo, lang)}</p>
            </div>
          ) : (
            <div className="placeholder-gallery" aria-label={text(ui.gallery, lang)}>
              {[0, 1, 2].map((item) => <span key={item} className={`gallery-cell gallery-${item + 1}`} />)}
            </div>
          )}
        </section>

        <nav className="project-pagination" aria-label="Adjacent projects">
          <Link href={`/${lang}/projects/${previous.slug}`}><small>{text(ui.previous, lang)}</small><b>{text(previous.project.title, lang)}</b></Link>
          <Link href={`/${lang}/projects/${next.slug}`}><small>{text(ui.next, lang)}</small><b>{text(next.project.title, lang)}</b></Link>
        </nav>
      </article>
    </main>
  );
}
