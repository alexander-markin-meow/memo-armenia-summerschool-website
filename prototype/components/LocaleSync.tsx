'use client';

import { useEffect } from 'react';
import type { Locale } from '@/lib/content';

export function LocaleSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem('lori-found-locale', locale);
  }, [locale]);
  return null;
}
