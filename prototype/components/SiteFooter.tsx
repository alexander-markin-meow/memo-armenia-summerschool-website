import { text, ui, type Locale } from '@/lib/content';

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer" id="site-footer">
      <section>
        <h2>{text(ui.about, locale)}</h2>
        <p>{text(ui.aboutText, locale)}</p>
      </section>
      <section>
        <h2>{text(ui.socialMedia, locale)}</h2>
        <p>{text(ui.socialPending, locale)}</p>
        <ul className="social-placeholders" aria-label={text(ui.socialMedia, locale)}>
          <li>Instagram</li>
          <li>Facebook</li>
          <li>YouTube</li>
        </ul>
      </section>
      <section>
        <h2>{text(ui.credits, locale)}</h2>
        <p>{text(ui.creditsText, locale)}</p>
      </section>
    </footer>
  );
}
