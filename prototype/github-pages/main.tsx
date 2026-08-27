import { StrictMode, useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { Shape } from '@/components/Shape';
import { entries, isLocale, mediumLabel, text, ui, type Locale, type Medium } from '@/lib/content';
import './pages.css';

type Route =
  | { kind: 'collection'; locale: Locale }
  | { kind: 'catalogue'; locale: Locale; query: URLSearchParams }
  | { kind: 'project'; locale: Locale; slug: string };

function parseRoute(): Route {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path = 'en', query = ''] = raw.split('?');
  const segments = path.split('/').filter(Boolean);
  const locale = isLocale(segments[0] || '') ? segments[0] as Locale : 'en';
  if (segments[1] === 'catalogue') return { kind: 'catalogue', locale, query: new URLSearchParams(query) };
  if (segments[1] === 'projects' && segments[2]) return { kind: 'project', locale, slug: segments[2] };
  return { kind: 'collection', locale };
}

function localizedRoute(route: Route, locale: Locale) {
  if (route.kind === 'catalogue') return `#/${locale}/catalogue${route.query.size ? `?${route.query}` : ''}`;
  if (route.kind === 'project') return `#/${locale}/projects/${route.slug}`;
  return `#/${locale}`;
}

function Header({ route }: { route: Route }) {
  return <header className="site-header">
    <a href={`#/${route.locale}`} className="wordmark"><span>Lori, Found</span><small>{text(ui.siteSubtitle, route.locale)}</small></a>
    <nav className="site-nav" aria-label={text(ui.language, route.locale)}>
      <a href={`#/${route.locale}`} aria-current={route.kind === 'collection' ? 'page' : undefined}>{text(ui.collection, route.locale)}</a>
      <a href={`#/${route.locale}/catalogue`} aria-current={route.kind === 'catalogue' ? 'page' : undefined}>{text(ui.catalogue, route.locale)}</a>
      <span className="language-links">{(['en', 'hy', 'ru'] as Locale[]).map((locale) => <a key={locale} href={localizedRoute(route, locale)} aria-current={route.locale === locale ? 'true' : undefined}>{locale.toUpperCase()}</a>)}</span>
    </nav>
  </header>;
}

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function placements(seed: number, width: number) {
  const columns = width < 700 ? 2 : width < 1100 ? 3 : 4;
  const rows = width < 700 ? 3 : 2;
  const random = mulberry32(seed + columns * 101);
  const slots = Array.from({ length: columns * rows }, (_, index) => index);
  for (let index = slots.length - 1; index; index--) {
    const swap = Math.floor(random() * (index + 1));
    [slots[index], slots[swap]] = [slots[swap], slots[index]];
  }
  return slots.slice(0, 6).map((slot) => ({
    column: slot % columns + 1,
    row: Math.floor(slot / columns) + 1,
    rotation: random() * 24 - 12,
    scale: .9 + random() * .18,
    dx: random() * 14 - 7,
    dy: random() * 12 - 6,
  }));
}

function Collection({ route }: { route: Extract<Route, { kind: 'collection' }> }) {
  const [layout, setLayout] = useState<ReturnType<typeof placements>>([]);
  useEffect(() => {
    const stored = sessionStorage.getItem('lori-collection-seed');
    const seed = stored ? Number(stored) : crypto.getRandomValues(new Uint32Array(1))[0];
    sessionStorage.setItem('lori-collection-seed', String(seed));
    const update = () => setLayout(placements(seed, innerWidth));
    update(); addEventListener('resize', update);
    return () => removeEventListener('resize', update);
  }, []);
  return <main className="collection-shell" id="main"><Header route={route} /><p className="prototype-badge">{text(ui.prototype, route.locale)}</p>
    <section className="object-field" aria-label={text(ui.collection, route.locale)} data-ready={layout.length ? 'true' : 'false'}>
      {entries.map((entry, index) => {
        const place = layout[index];
        const style: CSSProperties | undefined = place ? { gridColumn: place.column, gridRow: place.row, transform: `translate(${place.dx}%, ${place.dy}%) rotate(${place.rotation}deg) scale(${place.scale})` } : undefined;
        return <a className="object-link" style={style} href={`#/${route.locale}/projects/${entry.slug}`} key={entry.slug}><Shape name={entry.shape} /><span className="object-label"><b>{String(index + 1).padStart(2, '0')} — {text(entry.objectName, route.locale)}</b><small>{text(entry.project.title, route.locale)}</small></span></a>;
      })}
    </section>
  </main>;
}

function Catalogue({ route }: { route: Extract<Route, { kind: 'catalogue' }> }) {
  const locationFilter = route.query.get('location') || '';
  const typeFilter = route.query.get('type') || '';
  const mediumFilter = route.query.get('medium') || '';
  const filtered = entries.filter((entry) => (!locationFilter || entry.location.en === locationFilter) && (!typeFilter || entry.shape === typeFilter) && (!mediumFilter || entry.project.medium === mediumFilter));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = new URLSearchParams();
    new FormData(event.currentTarget).forEach((value, key) => { if (value) query.set(key, String(value)); });
    location.hash = `/${route.locale}/catalogue${query.size ? `?${query}` : ''}`;
  };
  return <main className="catalogue-page" id="main"><Header route={route} />
    <div className="catalogue-heading"><div><p className="eyebrow">Lori, Found</p><h1>{text(ui.catalogue, route.locale)}</h1></div><p>{text(ui.prototypeLong, route.locale)}</p></div>
    <form className="filters" onSubmit={submit}>
      <label>{text(ui.location, route.locale)}<select name="location" defaultValue={locationFilter}><option value="">{text(ui.all, route.locale)}</option>{entries.map((entry) => <option key={entry.slug} value={entry.location.en}>{text(entry.location, route.locale)}</option>)}</select></label>
      <label>{text(ui.objectType, route.locale)}<select name="type" defaultValue={typeFilter}><option value="">{text(ui.all, route.locale)}</option>{entries.map((entry) => <option key={entry.shape} value={entry.shape}>{text(entry.objectName, route.locale)}</option>)}</select></label>
      <label>{text(ui.projectMedium, route.locale)}<select name="medium" defaultValue={mediumFilter}><option value="">{text(ui.all, route.locale)}</option>{(['text', 'photo', 'video', 'mixed'] as Medium[]).map((medium) => <option key={medium} value={medium}>{mediumLabel(medium, route.locale)}</option>)}</select></label>
      <button type="submit">{text(ui.applyFilters, route.locale)}</button><a href={`#/${route.locale}/catalogue`}>{text(ui.clearFilters, route.locale)}</a>
    </form>
    <p className="result-count" aria-live="polite">{filtered.length} {text(ui.results, route.locale)}</p>
    <section className="catalogue-list">{filtered.map((entry) => <a className="catalogue-row" href={`#/${route.locale}/projects/${entry.slug}`} key={entry.slug}>
      <span className="catalogue-index">{String(entries.indexOf(entry) + 1).padStart(2, '0')}</span><span className="catalogue-object"><Shape name={entry.shape} /></span><span className="catalogue-names"><b>{text(entry.objectName, route.locale)}</b><small>{text(entry.location, route.locale)}</small></span><span className="catalogue-project"><b>{text(entry.project.title, route.locale)}</b><small>{mediumLabel(entry.project.medium, route.locale)}</small></span><span>↗</span>
    </a>)}</section>
  </main>;
}

function Project({ route }: { route: Extract<Route, { kind: 'project' }> }) {
  const entry = entries.find((item) => item.slug === route.slug);
  if (!entry) return <main className="not-found" id="main"><h1>{text(ui.notFound, route.locale)}</h1><a href={`#/${route.locale}`}>← {text(ui.backCollection, route.locale)}</a></main>;
  const index = entries.indexOf(entry);
  const previous = entries[(index - 1 + entries.length) % entries.length];
  const next = entries[(index + 1) % entries.length];
  return <main className="project-page" id="main"><Header route={route} />
    <div className="project-controls"><a className="back-link" href={`#/${route.locale}`}>← {text(ui.backCollection, route.locale)}</a><a className="back-link" href={`#/${route.locale}/catalogue`}>← {text(ui.backCatalogue, route.locale)}</a></div><p className="prototype-badge project-notice">{text(ui.prototype, route.locale)}</p>
    <article><section className="object-lead"><div className="lead-object"><Shape name={entry.shape} /></div><div><p className="eyebrow">{text(ui.foundObject, route.locale)} {String(index + 1).padStart(2, '0')}</p><h1>{text(entry.objectName, route.locale)}</h1><dl className="metadata"><div><dt>{text(ui.place, route.locale)}</dt><dd>{text(entry.location, route.locale)}</dd></div><div><dt>{text(ui.date, route.locale)}</dt><dd>{text(entry.approximateDate, route.locale)}</dd></div></dl><p className="object-context">{text(entry.context, route.locale)}</p></div></section>
      <section className="project-story"><p className="eyebrow">{text(ui.participantProject, route.locale)} · {mediumLabel(entry.project.medium, route.locale)}</p><h2>{text(entry.project.title, route.locale)}</h2><p className="byline">{text(entry.project.participant, route.locale)} · {text(ui.pseudonym, route.locale)}</p><p className="standfirst">{text(entry.project.introduction, route.locale)}</p>{entry.project.medium === 'video' ? <button className="video-placeholder"><span>▶</span><b>{text(ui.video, route.locale)}</b></button> : entry.project.medium === 'text' ? <div className="story-placeholder"><p>{text(ui.storyOne, route.locale)}</p><p>{text(ui.storyTwo, route.locale)}</p></div> : <div className="placeholder-gallery">{[1, 2, 3].map((item) => <span key={item} className={`gallery-cell gallery-${item}`} />)}</div>}</section>
      <nav className="project-pagination"><a href={`#/${route.locale}/projects/${previous.slug}`}><small>{text(ui.previous, route.locale)}</small><b>{text(previous.project.title, route.locale)}</b></a><a href={`#/${route.locale}/projects/${next.slug}`}><small>{text(ui.next, route.locale)}</small><b>{text(next.project.title, route.locale)}</b></a></nav>
    </article>
  </main>;
}

function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute());
  useEffect(() => {
    if (!location.hash) location.hash = '/en';
    const update = () => setRoute(parseRoute());
    addEventListener('hashchange', update); return () => removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    document.documentElement.lang = route.locale;
    document.title = `Lori, Found — ${route.kind === 'collection' ? text(ui.collection, route.locale) : route.kind === 'catalogue' ? text(ui.catalogue, route.locale) : entries.find((entry) => entry.slug === route.slug)?.project.title[route.locale] || 'Project'}`;
    scrollTo(0, 0);
  }, [route]);
  return route.kind === 'collection' ? <Collection route={route} /> : route.kind === 'catalogue' ? <Catalogue route={route} /> : <Project route={route} />;
}

createRoot(document.getElementById('root')!).render(<StrictMode><a className="skip-link" href="#main">Skip to content</a><App /></StrictMode>);
