import type { Locale } from './content';

type StorageLike = Pick<Storage, 'setItem'>;

const PREFERRED_LOCALE_KEY = 'lori-found-locale';

function getStorage(kind: 'localStorage' | 'sessionStorage'): StorageLike | null {
  try {
    return window[kind];
  } catch {
    return null;
  }
}

function write(storage: StorageLike | null, key: string, value: string) {
  try {
    storage?.setItem(key, value);
  } catch {
    // Storage may be disabled or full. The site remains usable without persistence.
  }
}

export function rememberLocale(locale: Locale) {
  write(getStorage('localStorage'), PREFERRED_LOCALE_KEY, locale);
}
