import Link from 'next/link';
import { Shape } from './Shape';
import { CollectionIntro } from './CollectionIntro';
import type { Locale, MuseumEntry } from '@/lib/content';
import { text, ui } from '@/lib/content';

export function CollectionClient({ entries, locale }: { entries: MuseumEntry[]; locale: Locale }) {
  return (
    <>
      <CollectionIntro locale={locale} />
      <section id="objects" className="object-grid" aria-label={text(ui.collection, locale)}>
        {entries.map((entry) => (
          <Link
            className="object-card"
            href={`/${locale}/projects/${entry.slug}`}
            key={entry.slug}
            data-testid="museum-object"
            aria-label={`${text(entry.objectName, locale)} — ${text(entry.project.title, locale)}`}
          >
            <span className="object-figure"><Shape name={entry.shape} /></span>
            <span className="object-label">
              <b>{text(entry.objectName, locale)}</b>
              <small className="object-project">{text(entry.project.title, locale)}</small>
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
