import Link from 'next/link';
import { locales, text, ui, type Locale } from '@/lib/content';

export function SiteHeader({ locale, view, pathSuffix = '' }: { locale: Locale; view: 'collection' | 'project'; pathSuffix?: string }) {
  return (
    <header className="site-header">
      <Link href={`/${locale}`} className="wordmark" aria-label={`${text(ui.siteTitle, locale)} — ${text(ui.collection, locale)}`}>
        <span>{text(ui.siteTitle, locale)}</span>
      </Link>
      <nav aria-label={text(ui.language, locale)} className="site-nav">
        <Link href={`/${locale}`} aria-current={view === 'collection' ? 'page' : undefined}>{text(ui.collection, locale)}</Link>
        <span className="language-links" aria-label={text(ui.language, locale)}>
          {locales.map((item) => (
            <Link key={item} href={`/${item}${pathSuffix}`} lang={item} aria-current={locale === item ? 'true' : undefined}>{item.toUpperCase()}</Link>
          ))}
        </span>
      </nav>
    </header>
  );
}
