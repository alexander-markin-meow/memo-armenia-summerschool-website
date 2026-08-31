import type { ComponentType, ReactNode } from 'react';
import { Shape } from './Shape';
import { entries, mediumLabel, text, ui, type Locale, type MuseumEntry } from '@/lib/content';

type ProjectLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
};

export function ProjectArticle({
  entry,
  locale,
  LinkComponent,
  projectHref,
}: {
  entry: MuseumEntry;
  locale: Locale;
  LinkComponent: ComponentType<ProjectLinkProps>;
  projectHref: (slug: string) => string;
}) {
  const index = entries.findIndex((item) => item.slug === entry.slug);
  const previous = entries[(index - 1 + entries.length) % entries.length];
  const next = entries[(index + 1) % entries.length];

  return (
    <article>
      <section className="object-lead">
        <div className="lead-object"><Shape name={entry.shape} /></div>
        <div>
          <p className="eyebrow">{text(ui.foundObject, locale)}</p>
          <h1>{text(entry.objectName, locale)}</h1>
          <dl className="metadata">
            <div><dt>{text(ui.place, locale)}</dt><dd>{text(entry.location, locale)}</dd></div>
            <div><dt>{text(ui.date, locale)}</dt><dd>{text(entry.approximateDate, locale)}</dd></div>
          </dl>
          <p className="object-context">{text(entry.context, locale)}</p>
        </div>
      </section>

      <section className="project-story">
        <p className="eyebrow">{text(ui.participantProject, locale)} · {mediumLabel(entry.project.medium, locale)}</p>
        <h2>{text(entry.project.title, locale)}</h2>
        <p className="byline">{text(entry.project.participant, locale)} · {text(ui.pseudonym, locale)}</p>
        <p className="standfirst">{text(entry.project.introduction, locale)}</p>
        {entry.project.medium === 'video' ? (
          <div className="video-placeholder" role="img" aria-label={text(ui.video, locale)}>
            <span aria-hidden="true">▶</span>
            <b>{text(ui.video, locale)}</b>
          </div>
        ) : entry.project.medium === 'text' ? (
          <div className="story-placeholder">
            <p><b>{text(ui.story, locale)}.</b> {text(ui.storyOne, locale)}</p>
            <p>{text(ui.storyTwo, locale)}</p>
          </div>
        ) : (
          <div className="placeholder-gallery" role="img" aria-label={text(ui.gallery, locale)}>
            {[0, 1, 2].map((item) => <span key={item} className={`gallery-cell gallery-${item + 1}`} aria-hidden="true" />)}
          </div>
        )}
      </section>

      <nav className="project-pagination" aria-label={text(ui.adjacentProjects, locale)}>
        <LinkComponent href={projectHref(previous.slug)}><small>{text(ui.previous, locale)}</small><b>{text(previous.project.title, locale)}</b></LinkComponent>
        <LinkComponent href={projectHref(next.slug)}><small>{text(ui.next, locale)}</small><b>{text(next.project.title, locale)}</b></LinkComponent>
      </nav>
    </article>
  );
}
