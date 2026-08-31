'use client';

import type { MouseEvent } from 'react';
import { text, ui, type Locale } from '@/lib/content';

export function SkipLink({ locale }: { locale: Locale }) {
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const main = document.getElementById('main');
    main?.focus({ preventScroll: true });
    main?.scrollIntoView();
  };

  return <a className="skip-link" href="#main" onClick={skip}>{text(ui.skipToContent, locale)}</a>;
}
