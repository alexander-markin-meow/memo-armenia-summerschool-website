import type { Locale } from './content';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const COLLECTION_SEED_KEY = 'lori-collage-seed';
const COLLECTION_SCROLL_KEY = 'lori-collage-scroll';
const PREFERRED_LOCALE_KEY = 'lori-found-locale';
const MAX_SEED = 0xffffffff;

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

function read(storage: StorageLike | null, key: string) {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function remove(storage: StorageLike | null, key: string) {
  try {
    storage?.removeItem(key);
  } catch {
    // Storage is optional; an unavailable scroll position is harmless.
  }
}

export function parseStoredSeed(value: string | null) {
  if (value === null || !/^\d+$/.test(value)) return null;
  const seed = Number(value);
  return Number.isSafeInteger(seed) && seed >= 0 && seed <= MAX_SEED ? seed : null;
}

export function randomSeed() {
  try {
    return crypto.getRandomValues(new Uint32Array(1))[0];
  } catch {
    return Math.floor(Math.random() * (MAX_SEED + 1));
  }
}

/** Keeps one composition while browsing; a browser reload deliberately creates another. */
export function collectionSeed(navigationType?: PerformanceNavigationTiming['type']) {
  const storage = getStorage('sessionStorage');
  const stored = parseStoredSeed(read(storage, COLLECTION_SEED_KEY));
  const seed = stored !== null && navigationType !== 'reload' ? stored : randomSeed();
  write(storage, COLLECTION_SEED_KEY, String(seed));
  return seed;
}

export function rememberCollectionScroll(scrollY: number) {
  if (!Number.isFinite(scrollY) || scrollY < 0) return;
  write(getStorage('sessionStorage'), COLLECTION_SCROLL_KEY, String(Math.round(scrollY)));
}

export function consumeCollectionScroll() {
  const storage = getStorage('sessionStorage');
  const value = read(storage, COLLECTION_SCROLL_KEY);
  remove(storage, COLLECTION_SCROLL_KEY);
  if (value === null || !/^\d+$/.test(value)) return null;
  const scrollY = Number(value);
  return Number.isSafeInteger(scrollY) && scrollY >= 0 ? scrollY : null;
}

export function rememberLocale(locale: Locale) {
  write(getStorage('localStorage'), PREFERRED_LOCALE_KEY, locale);
}
