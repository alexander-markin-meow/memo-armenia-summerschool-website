import type { ComponentType, ReactNode } from 'react';
import { locales, text, ui, type Locale } from '@/lib/content';

type HeaderLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  lang?: string;
  'aria-current'?: 'page' | 'true';
  'aria-label'?: string;
};

export function SiteHeaderBase({
  locale,
  view,
  collectionHref,
  localizedHref,
  LinkComponent,
}: {
  locale: Locale;
  view: 'collection' | 'project';
  collectionHref: string;
  localizedHref: (locale: Locale) => string;
  LinkComponent: ComponentType<HeaderLinkProps>;
}) {
  return (
    <header className="site-header" lang={locale}>
      <LinkComponent href={collectionHref} className="wordmark" aria-label={`${text(ui.siteTitle, locale)} — ${text(ui.collection, locale)}`}>
        <span>{text(ui.siteTitle, locale)}</span>
      </LinkComponent>
      <nav aria-label={text(ui.siteTitle, locale)} className="site-nav">
        <LinkComponent href={collectionHref} aria-current={view === 'collection' ? 'page' : undefined}>{text(ui.collection, locale)}</LinkComponent>
        <span className="language-links" role="group" aria-label={text(ui.language, locale)}>
          {locales.map((item) => (
            <LinkComponent key={item} href={localizedHref(item)} lang={item} aria-current={locale === item ? 'true' : undefined}>{item.toUpperCase()}</LinkComponent>
          ))}
        </span>
      </nav>
    </header>
  );
}
