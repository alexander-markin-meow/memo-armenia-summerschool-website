import { AnchorLink } from './AnchorLink';
import { CollectionIntro } from './CollectionIntro';
import { Shape } from './Shape';
import { text, ui, type Locale, type MuseumEntry } from '@/lib/content';

export function CollectionClient({ entries, locale }: { entries: MuseumEntry[]; locale: Locale }) {
  return (
    <>
      <CollectionIntro locale={locale} />
      <section id="objects" className="object-grid" aria-label={text(ui.collection, locale)}>
        {entries.map((entry) => (
          <AnchorLink
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
          </AnchorLink>
        ))}
      </section>
    </>
  );
}
