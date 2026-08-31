import { isLocale, type Locale } from './content.ts';

export type HashRoute =
  | { kind: 'collection'; locale: Locale }
  | { kind: 'project'; locale: Locale; slug: string }
  | { kind: 'not-found'; locale: Locale };

export function parseHashRoute(hash: string): HashRoute {
  const raw = hash.replace(/^#\/?/, '');
  const [path = 'en'] = raw.split('?');
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return { kind: 'collection', locale: 'en' };

  const locale = isLocale(segments[0]) ? segments[0] : 'en';
  if (!isLocale(segments[0])) return { kind: 'not-found', locale };
  if (segments.length === 1) return { kind: 'collection', locale };
  if (segments.length === 3 && segments[1] === 'projects' && segments[2]) {
    return { kind: 'project', locale, slug: segments[2] };
  }
  return { kind: 'not-found', locale };
}

export function localizedHashRoute(route: HashRoute, locale: Locale) {
  if (route.kind === 'project') return `#/${locale}/projects/${route.slug}`;
  return `#/${locale}`;
}
