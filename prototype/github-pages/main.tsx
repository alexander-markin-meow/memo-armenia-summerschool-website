import { StrictMode, useEffect, useState, type ComponentProps } from 'react';
import { createRoot } from 'react-dom/client';
import { CollectionCollage } from '@/components/CollectionCollage';
import { CollectionIntro } from '@/components/CollectionIntro';
import { GrainLayer } from '@/components/GrainLayer';
import { ProjectArticle } from '@/components/ProjectArticle';
import { ResearchResults } from '@/components/ResearchResults';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeaderBase } from '@/components/SiteHeaderBase';
import { SkipLink } from '@/components/SkipLink';
import { rememberLocale } from '@/lib/browser-state';
import { entries, text, ui, type Locale } from '@/lib/content';
import { localizedHashRoute, parseHashRoute, type HashRoute } from '@/lib/github-pages-routing';
import './pages.css';

function HashLink({ href, children, ...props }: ComponentProps<'a'> & { href: string }) {
  return <a href={href} {...props}>{children}</a>;
}

function Header({ route }: { route: HashRoute }) {
  const view = route.kind === 'collection' ? 'collection' : route.kind === 'research' ? 'research' : 'project';
  return (
    <SiteHeaderBase
      locale={route.locale}
      view={view}
      collectionHref={`#/${route.locale}`}
      researchHref={`#/${route.locale}/research`}
      localizedHref={(locale) => localizedHashRoute(route, locale)}
      LinkComponent={HashLink}
    />
  );
}

function Collection({ route }: { route: Extract<HashRoute, { kind: 'collection' }> }) {
  return (
    <>
      <main className="collection-shell" id="main" lang={route.locale} tabIndex={-1}>
        <Header route={route} />
        <CollectionIntro locale={route.locale} />
        <CollectionCollage entries={entries} locale={route.locale} LinkComponent={HashLink} projectHref={(slug) => `#/${route.locale}/projects/${slug}`} />
      </main>
      <SiteFooter locale={route.locale} />
    </>
  );
}

function Research({ route }: { route: Extract<HashRoute, { kind: 'research' }> }) {
  return <><main className="research-page" id="main" lang={route.locale} tabIndex={-1}>
    <Header route={route} />
    <ResearchResults locale={route.locale} LinkComponent={HashLink} projectHref={(slug) => `#/${route.locale}/projects/${slug}`} />
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
      : route.kind === 'research'
        ? text(ui.research, route.locale)
      : route.kind === 'project'
        ? entries.find((entry) => entry.slug === route.slug)?.project.title[route.locale] || text(ui.notFound, route.locale)
        : text(ui.notFound, route.locale);
    document.title = `${text(ui.siteTitle, route.locale)} — ${routeTitle}`;
    if (route.kind !== 'collection') scrollTo(0, 0);
  }, [route]);
  return <><SkipLink locale={route.locale} />{route.kind === 'collection' ? <Collection route={route} /> : route.kind === 'research' ? <Research route={route} /> : route.kind === 'project' ? <Project route={route} /> : <NotFound locale={route.locale} />}</>;
}

document.documentElement.style.setProperty('--object-atlas-url', "url('./object-atlas.png')");
createRoot(document.getElementById('root')!).render(<StrictMode><GrainLayer /><App /></StrictMode>);
