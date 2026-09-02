import { text, ui, type Locale } from '@/lib/content';

export function CollectionIntro({ locale }: { locale: Locale }) {
  return (
    <section className="collection-intro" aria-labelledby="collection-intro-title">
      <div className="collection-intro-inner">
        <p className="eyebrow">{text(ui.siteTitle, locale)}</p>
        <h1 id="collection-intro-title">{text(ui.introTitle, locale)}</h1>
        <p>{text(ui.introText, locale)}</p>
        <p className="collection-instruction" id="collage-instruction">
          <span aria-hidden="true">↓</span>
          {text(ui.chooseObject, locale)}
        </p>
      </div>
    </section>
  );
}
