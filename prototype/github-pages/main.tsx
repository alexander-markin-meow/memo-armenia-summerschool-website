import { StrictMode, useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { Shape } from '@/components/Shape';
import { GrainLayer } from '@/components/GrainLayer';
import { createCollageLayout, type CollageLayout } from '@/lib/collage-layout';
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

function Collection({ route }: { route: Extract<Route, { kind: 'collection' }> }) {
  const field = useRef<HTMLElement>(null);
  const [layout, setLayout] = useState<CollageLayout | null>(null);
  useEffect(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const stored = sessionStorage.getItem('lori-collection-seed');
    const seed = stored && navigation?.type !== 'reload' ? Number(stored) : crypto.getRandomValues(new Uint32Array(1))[0];
    sessionStorage.setItem('lori-collection-seed', String(seed));

    const update = () => {
      const width = field.current?.getBoundingClientRect().width;
      if (!width) return;
      setLayout(createCollageLayout(seed, entries.map((entry) => ({ id: entry.slug, shape: entry.shape })), Math.floor(width), innerHeight));
    };
    update();
    let timeout = 0;
    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(update, 120);
    };
    addEventListener('resize', onResize);
    return () => { clearTimeout(timeout); removeEventListener('resize', onResize); };
  }, []);
  return <main className="collection-shell" id="main"><Header route={route} /><p className="prototype-badge">{text(ui.prototype, route.locale)}</p>
    <section ref={field} className="object-field" aria-label={text(ui.collection, route.locale)} data-ready={layout ? 'true' : 'false'} style={layout ? { height: layout.height } : undefined}>
      {entries.map((entry, index) => {
        const place = layout?.placements[index];
        const style: CSSProperties | undefined = place ? {
          left: place.x,
          top: place.y,
          width: place.width,
          height: place.height,
          '--shape-width': `${place.shapeWidth}px`,
          '--shape-height': `${place.shapeHeight}px`,
          '--shape-rotation': `${place.rotation}deg`,
        } as CSSProperties : undefined;
        return <a className="object-link" style={style} href={`#/${route.locale}/projects/${entry.slug}`} key={entry.slug} aria-label={`${text(entry.objectName, route.locale)} — ${text(entry.project.title, route.locale)}`}><Shape name={entry.shape} /><span className="object-label"><b>{text(entry.objectName, route.locale)}</b><small className="object-project">{text(entry.project.title, route.locale)}</small></span></a>;
      })}
    </section>
  </main>;
}

function Catalogue({ route }: { route: Extract<Route, { kind: 'catalogue' }> }) {
  const locationFilter = route.query.get('location') || '';
  const typeFilter = route.query.get('type') || '';
  const mediumFilter = route.query.get('medium') || '';
  const locations = [...new Set(entries.map((entry) => entry.location.en))];
  const types = [...new Set(entries.map((entry) => entry.shape))];
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
      <label>{text(ui.location, route.locale)}<select name="location" defaultValue={locationFilter}><option value="">{text(ui.all, route.locale)}</option>{locations.map((location) => { const entry = entries.find((item) => item.location.en === location)!; return <option key={location} value={location}>{text(entry.location, route.locale)}</option>; })}</select></label>
      <label>{text(ui.objectType, route.locale)}<select name="type" defaultValue={typeFilter}><option value="">{text(ui.all, route.locale)}</option>{types.map((type) => { const entry = entries.find((item) => item.shape === type)!; return <option key={type} value={type}>{text(entry.objectName, route.locale)}</option>; })}</select></label>
      <label>{text(ui.projectMedium, route.locale)}<select name="medium" defaultValue={mediumFilter}><option value="">{text(ui.all, route.locale)}</option>{(['text', 'photo', 'video', 'mixed'] as Medium[]).map((medium) => <option key={medium} value={medium}>{mediumLabel(medium, route.locale)}</option>)}</select></label>
      <button type="submit">{text(ui.applyFilters, route.locale)}</button><a href={`#/${route.locale}/catalogue`}>{text(ui.clearFilters, route.locale)}</a>
    </form>
    <p className="result-count" aria-live="polite">{filtered.length} {text(ui.results, route.locale)}</p>
    <section className="catalogue-list">{filtered.map((entry) => <a className="catalogue-row" href={`#/${route.locale}/projects/${entry.slug}`} key={entry.slug}>
      <span className="catalogue-object"><Shape name={entry.shape} /></span><span className="catalogue-names"><b>{text(entry.objectName, route.locale)}</b><small>{text(entry.location, route.locale)}</small></span><span className="catalogue-project"><b>{text(entry.project.title, route.locale)}</b><small>{mediumLabel(entry.project.medium, route.locale)}</small></span><span>↗</span>
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
    <article><section className="object-lead"><div className="lead-object"><Shape name={entry.shape} /></div><div><p className="eyebrow">{text(ui.foundObject, route.locale)}</p><h1>{text(entry.objectName, route.locale)}</h1><dl className="metadata"><div><dt>{text(ui.place, route.locale)}</dt><dd>{text(entry.location, route.locale)}</dd></div><div><dt>{text(ui.date, route.locale)}</dt><dd>{text(entry.approximateDate, route.locale)}</dd></div></dl><p className="object-context">{text(entry.context, route.locale)}</p></div></section>
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

createRoot(document.getElementById('root')!).render(<StrictMode><GrainLayer /><a className="skip-link" href="#main">Skip to content</a><App /></StrictMode>);
