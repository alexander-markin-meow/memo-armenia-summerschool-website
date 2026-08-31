import { StrictMode, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { CollectionIntro } from '@/components/CollectionIntro';
import { GrainLayer } from '@/components/GrainLayer';
import { ProjectArticle } from '@/components/ProjectArticle';
import { Shape } from '@/components/Shape';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeaderBase } from '@/components/SiteHeaderBase';
import { SkipLink } from '@/components/SkipLink';
import { useCollectionLayout } from '@/components/useCollectionLayout';
import { rememberLocale } from '@/lib/browser-state';
import { entries, text, ui, type Locale } from '@/lib/content';
import { localizedHashRoute, parseHashRoute, type HashRoute } from '@/lib/github-pages-routing';
import './pages.css';

function HashLink({ href, children, ...props }: { href: string; children: ReactNode; className?: string; lang?: string; 'aria-current'?: 'page' | 'true'; 'aria-label'?: string }) {
  return <a href={href} {...props}>{children}</a>;
}

function Header({ route }: { route: HashRoute }) {
  const view = route.kind === 'collection' ? 'collection' : 'project';
  return (
    <SiteHeaderBase
      locale={route.locale}
      view={view}
      collectionHref={`#/${route.locale}`}
      localizedHref={(locale) => localizedHashRoute(route, locale)}
      LinkComponent={HashLink}
    />
  );
}

function Collection({ route }: { route: Extract<HashRoute, { kind: 'collection' }> }) {
  const { field, layout, rememberScroll } = useCollectionLayout(entries);
  return <><main className="collection-shell" id="main" lang={route.locale} tabIndex={-1}><Header route={route} /><CollectionIntro locale={route.locale} />
    <section ref={field} id="objects" className="object-field" aria-label={text(ui.collection, route.locale)} data-ready={layout ? 'true' : 'false'} style={layout ? { height: layout.height } : undefined}>
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
        return <a className="object-link" style={style} href={`#/${route.locale}/projects/${entry.slug}`} key={entry.slug} onClick={rememberScroll} aria-label={`${text(entry.objectName, route.locale)} — ${text(entry.project.title, route.locale)}`}><Shape name={entry.shape} /><span className="object-label"><b>{text(entry.objectName, route.locale)}</b><small className="object-project">{text(entry.project.title, route.locale)}</small></span></a>;
      })}
    </section>
  </main><SiteFooter locale={route.locale} /></>;
}

function Project({ route }: { route: Extract<HashRoute, { kind: 'project' }> }) {
  const entry = entries.find((item) => item.slug === route.slug);
  if (!entry) return <NotFound locale={route.locale} />;
  return <><main className="project-page" id="main" lang={route.locale} tabIndex={-1}><Header route={route} />
    <div className="project-controls"><a className="back-link" href={`#/${route.locale}`}>← {text(ui.backCollection, route.locale)}</a></div><p className="prototype-badge project-notice">{text(ui.prototype, route.locale)}</p>
    <ProjectArticle entry={entry} locale={route.locale} LinkComponent={HashLink} projectHref={(slug) => `#/${route.locale}/projects/${slug}`} />
  </main><SiteFooter locale={route.locale} /></>;
}

function NotFound({ locale }: { locale: Locale }) {
  return <><main className="not-found" id="main" lang={locale} tabIndex={-1}><h1>{text(ui.notFound, locale)}</h1><a href={`#/${locale}`}>← {text(ui.backCollection, locale)}</a></main><SiteFooter locale={locale} /></>;
}

function App() {
  const [route, setRoute] = useState<HashRoute>(() => parseHashRoute(location.hash));
  useEffect(() => {
    if (!location.hash) location.hash = '/en';
    const update = () => setRoute(parseHashRoute(location.hash));
    addEventListener('hashchange', update); return () => removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    document.documentElement.lang = route.locale;
    rememberLocale(route.locale);
    const routeTitle = route.kind === 'collection'
      ? text(ui.collection, route.locale)
      : route.kind === 'project'
        ? entries.find((entry) => entry.slug === route.slug)?.project.title[route.locale] || text(ui.notFound, route.locale)
        : text(ui.notFound, route.locale);
    document.title = `${text(ui.siteTitle, route.locale)} — ${routeTitle}`;
    if (route.kind !== 'collection') scrollTo(0, 0);
  }, [route]);
  return <><SkipLink locale={route.locale} />{route.kind === 'collection' ? <Collection route={route} /> : route.kind === 'project' ? <Project route={route} /> : <NotFound locale={route.locale} />}</>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><GrainLayer /><App /></StrictMode>);
