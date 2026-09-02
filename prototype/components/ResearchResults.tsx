import type { ComponentType, ReactNode } from 'react';
import { entries, text, ui, type Locale } from '@/lib/content';

type ResearchLinkProps = { children: ReactNode; className?: string; href: string };

export function ResearchResults({
  locale,
  LinkComponent,
  projectHref,
}: {
  locale: Locale;
  LinkComponent: ComponentType<ResearchLinkProps>;
  projectHref: (slug: string) => string;
}) {
  const linkedProjects = entries.slice(0, 3);
  const notes = [
    { title: ui.researchInterviews, text: ui.researchInterviewsText, mark: '01' },
    { title: ui.researchConcepts, text: ui.researchConceptsText, mark: '02' },
    { title: ui.researchExperiments, text: ui.researchExperimentsText, mark: '03' },
    { title: ui.researchProcess, text: ui.researchProcessText, mark: '04' },
  ];

  return (
    <article className="research-record">
      <header className="research-lead">
        <p className="eyebrow">{text(ui.research, locale)}</p>
        <h1>{text(ui.researchTitle, locale)}</h1>
        <p>{text(ui.researchIntro, locale)}</p>
        <small>{text(ui.prototype, locale)}</small>
      </header>

      <section className="research-projects" aria-labelledby="research-projects-title">
        <div>
          <p className="research-number">00</p>
          <h2 id="research-projects-title">{text(ui.researchProjects, locale)}</h2>
          <p>{text(ui.researchProjectsText, locale)}</p>
        </div>
        <ol>
          {linkedProjects.map((entry) => (
            <li key={entry.slug}>
              <LinkComponent href={projectHref(entry.slug)}>
                <span>{text(entry.objectName, locale)}</span>
                <b>{text(entry.project.title, locale)}</b>
                <span aria-hidden="true">↗</span>
              </LinkComponent>
            </li>
          ))}
        </ol>
      </section>

      <div className="research-notes">
        {notes.map((note) => (
          <section key={note.mark}>
            <p className="research-number">{note.mark}</p>
            <h2>{text(note.title, locale)}</h2>
            <p>{text(note.text, locale)}</p>
          </section>
        ))}
      </div>

      <aside className="research-later">
        <span aria-hidden="true">⌁</span>
        <p>{text(ui.researchMapLater, locale)}</p>
      </aside>
    </article>
  );
}
