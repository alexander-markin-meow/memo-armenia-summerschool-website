'use client';

import { useEffect, useRef, useState } from 'react';
import { text, ui, type Locale } from '@/lib/content';

const INTRO_STORAGE_KEY = 'lori-collection-intro-seen';

export function CollectionIntro({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(() =>
    typeof window === 'undefined' || window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== 'true',
  );
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!visible) return;
    document.body.dataset.collectionIntro = 'active';
    button.current?.focus();
    return () => { delete document.body.dataset.collectionIntro; };
  }, [visible]);

  if (!visible) return null;

  const enterCollection = () => {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
    setVisible(false);
  };

  return (
    <section className="collection-intro" role="dialog" aria-modal="true" aria-labelledby="collection-intro-title">
      <div className="collection-intro-inner">
        <p className="eyebrow">{text(ui.siteTitle, locale)}</p>
        <h1 id="collection-intro-title">{text(ui.introTitle, locale)}</h1>
        <p>{text(ui.introText, locale)}</p>
        <button ref={button} type="button" onClick={enterCollection}>{text(ui.startExploring, locale)} <span aria-hidden="true">→</span></button>
        <small>{text(ui.prototype, locale)}</small>
      </div>
    </section>
  );
}
