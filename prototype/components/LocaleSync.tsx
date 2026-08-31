'use client';

import { useEffect } from 'react';
import { rememberLocale } from '@/lib/browser-state';
import type { Locale } from '@/lib/content';

export function LocaleSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    rememberLocale(locale);
  }, [locale]);
  return null;
}
