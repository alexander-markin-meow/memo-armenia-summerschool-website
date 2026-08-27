import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LocaleSync } from '@/components/LocaleSync';
import { Shape } from '@/components/Shape';
import { SiteHeader } from '@/components/SiteHeader';
import { entries, isLocale, mediumLabel, text, ui, type Medium } from '@/lib/content';

type Search = { location?: string; type?: string; medium?: string };
type Props = { params: Promise<{ lang: string }>; searchParams: Promise<Search> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: `Lori, Found — ${text(ui.catalogue, lang)}`, description: text(ui.prototypeLong, lang) };
}

export default async function CataloguePage({ params, searchParams }: Props) {
  const { lang } = await params;
  const filters = await searchParams;
  if (!isLocale(lang)) notFound();

  const locations = [...new Set(entries.map((entry) => entry.location.en))];
  const types = [...new Set(entries.map((entry) => entry.shape))];
  const mediums: Medium[] = ['text', 'photo', 'video', 'mixed'];
  const filtered = entries.filter((entry) =>
    (!filters.location || entry.location.en === filters.location) &&
    (!filters.type || entry.shape === filters.type) &&
    (!filters.medium || entry.project.medium === filters.medium),
  );
  const query = new URLSearchParams();
  if (filters.location) query.set('location', filters.location);
  if (filters.type) query.set('type', filters.type);
  if (filters.medium) query.set('medium', filters.medium);
  const returnPath = `/${lang}/catalogue${query.size ? `?${query.toString()}` : ''}`;

  return (
    <main className="catalogue-page" id="main">
      <LocaleSync locale={lang} />
      <SiteHeader locale={lang} view="catalogue" pathSuffix="/catalogue" />
      <div className="catalogue-heading">
        <div>
          <p className="eyebrow">Lori, Found</p>
          <h1>{text(ui.catalogue, lang)}</h1>
        </div>
        <p>{text(ui.prototypeLong, lang)}</p>
      </div>

      <form className="filters" method="get">
        <label>{text(ui.location, lang)}
          <select name="location" defaultValue={filters.location || ''}>
            <option value="">{text(ui.all, lang)}</option>
            {locations.map((location) => {
              const entry = entries.find((item) => item.location.en === location)!;
              return <option key={location} value={location}>{text(entry.location, lang)}</option>;
            })}
          </select>
        </label>
        <label>{text(ui.objectType, lang)}
          <select name="type" defaultValue={filters.type || ''}>
            <option value="">{text(ui.all, lang)}</option>
            {types.map((type) => {
              const entry = entries.find((item) => item.shape === type)!;
              return <option key={type} value={type}>{text(entry.objectName, lang)}</option>;
            })}
          </select>
        </label>
        <label>{text(ui.projectMedium, lang)}
          <select name="medium" defaultValue={filters.medium || ''}>
            <option value="">{text(ui.all, lang)}</option>
            {mediums.map((medium) => <option key={medium} value={medium}>{mediumLabel(medium, lang)}</option>)}
          </select>
        </label>
        <button type="submit">{text(ui.applyFilters, lang)}</button>
        <Link href={`/${lang}/catalogue`}>{text(ui.clearFilters, lang)}</Link>
      </form>

      <p className="result-count" aria-live="polite">{filtered.length} {text(ui.results, lang)}</p>
      <section className="catalogue-list" aria-label={text(ui.catalogue, lang)}>
        {filtered.map((entry) => (
          <Link
            href={`/${lang}/projects/${entry.slug}?from=${encodeURIComponent(returnPath)}`}
            className="catalogue-row"
            key={entry.slug}
          >
            <span className="catalogue-index">{String(entries.indexOf(entry) + 1).padStart(2, '0')}</span>
            <span className="catalogue-object"><Shape name={entry.shape} /></span>
            <span className="catalogue-names">
              <b>{text(entry.objectName, lang)}</b>
              <small>{text(entry.location, lang)}</small>
            </span>
            <span className="catalogue-project">
              <b>{text(entry.project.title, lang)}</b>
              <small>{mediumLabel(entry.project.medium, lang)}</small>
            </span>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
