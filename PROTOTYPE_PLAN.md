The prototype will be a small, public, trilingual digital museum with three working views: a warm, randomized collection of non-overlapping placeholder objects, an object-first project page, and a filterable catalogue. It will use six fictional object/project pairs made from simple CSS shapes, demonstrate the complete visitor flow on phone and desktop, and keep the content easy to replace later with real photographs, text, galleries, and video.

# Prototype build plan

## 1. Prototype goal

Build a convincing but deliberately limited prototype that answers four questions:

1. Does object-first navigation make the participant projects feel discoverable?
2. Can the scattered collection feel playful without becoming confusing or inaccessible?
3. Does one content structure support the visual collection, project pages, catalogue filters, and three languages?
4. Can Alex replace placeholder material with real objects and projects without redesigning the site?

The prototype will be public on the web, while its GitHub repository remains private during development. Making the source public later is a separate launch decision.

## 2. What will be included

### Visual collection (`/:lang`)

- A full-viewport, light and warm field containing six irregular placeholder objects.
- Objects are CSS shapes rather than photographs: a button, a stone, a metal fragment, a leaf, a tile shard, and a thread spool.
- Every new browser session gets a newly shuffled composition.
- Objects never overlap, remain inside safe screen margins, and reflow at mobile, tablet, and desktop sizes.
- Each object is a real link with a visible focus state and a short accessible label.
- Pointer hover or keyboard focus reveals the object name and project title; touch devices show the object name by default.
- Selecting an object opens its project page directly.
- A compact corner menu contains the language switcher and the switch to catalogue view. There is no large hero heading.

### Project page (`/:lang/projects/:slug`)

- A persistent “Back to collection” control returns to the same collection arrangement and scroll position.
- The found object appears first with object name, place, approximate date, short context, and object type.
- The participant project follows with a title, pseudonymous author, medium, short introduction, and one of two representative media layouts:
  - a three-item placeholder gallery; or
  - a privacy-friendly YouTube placeholder that only loads an embed after visitor action.
- Previous/next project links allow sequential exploration without returning to the collection.
- The page demonstrates the final reading hierarchy, but all content is clearly marked as fictional prototype copy.

### Structured catalogue (`/:lang/catalogue`)

- The same six pairs displayed in a calm responsive list/grid.
- Filters for location, object type, and project medium.
- Filters combine with AND logic; “All” resets each group.
- The current filter state is stored in the URL query string, so a view can be shared or refreshed.
- Each entry shows the object shape, object name, place, project title, and medium and links to the same project page.

### Shared shell

- English, Armenian, and Russian interface and placeholder content.
- Language selection persists locally and preserves the current page when switched.
- An understated site name will be used provisionally: **Lori, Found**. The working tagline will be **Objects and stories from MEMO’s summer school**. Both remain easy to replace after approval.
- Responsive navigation, custom not-found page, metadata, favicon, and a simple social-preview image.

## 3. Technical decisions

### Application stack

- **Framework:** React 19 with TypeScript, built with Vite.
- **Routing:** React Router with language-prefixed routes (`/en`, `/hy`, `/ru`). English is the default when no language is present.
- **Styling:** one global design-token file plus component-scoped CSS Modules. No UI framework; the visual language is custom and the component count is small.
- **Content:** typed local TypeScript data files, one record per object/project pair. No database, CMS, user accounts, or server runtime in the prototype.
- **Internationalization:** i18next and react-i18next. Interface strings and project content use the same three-language shape, with an automatic English fallback when a prototype translation is intentionally missing.
- **Package manager/runtime:** npm with a committed lockfile; current Node LTS, recorded in `.nvmrc` and `package.json`.
- **Deployment:** a static production build deployed to Cloudflare Pages from the private GitHub repository. Preview deployments will be produced for branches and pull requests; the production branch will be `main`.
- **Code quality:** ESLint, Prettier, strict TypeScript, and accessible semantic HTML.

This stack keeps the prototype inexpensive and portable. It can later move to another static host without changing the content model. A CMS can be added after the editorial workflow is known rather than guessed now.

### Proposed source structure

```text
src/
  app/                 routing, providers, metadata
  components/          navigation, object shape, filters, gallery
  content/             object/project records and translations
  pages/               collection, project, catalogue, not found
  styles/              tokens, global rules, grain, utilities
  utils/               seeded shuffle, layout, locale helpers
public/                 favicon and social preview
tests/                  layout, filters, routing, accessibility smoke tests
```

### Content record

Each placeholder pairing will conform to one typed schema:

```ts
type LocalizedText = { en: string; hy: string; ru: string }

type MuseumEntry = {
  slug: string
  object: {
    name: LocalizedText
    shape: 'button' | 'stone' | 'metal' | 'leaf' | 'tile' | 'spool'
    location: string
    approximateDate: LocalizedText
    context: LocalizedText
    type: string
  }
  project: {
    title: LocalizedText
    participantName: LocalizedText
    medium: 'text' | 'photo' | 'video' | 'mixed'
    introduction: LocalizedText
    gallery?: Array<{ src: string; alt: LocalizedText; caption?: LocalizedText }>
    youtubeId?: string
  }
  sensitivity: 'public' | 'review-required'
}
```

The `sensitivity` field is included now so real material cannot accidentally be published before consent review. Prototype records will all be fictional and marked `public`.

## 4. Collection layout approach

The scattered layout is the only custom technical feature and will be kept deterministic enough to test:

1. On first visit, create a random seed and store it in `sessionStorage`.
2. Derive object order, rotation, scale, and placement candidates from that seed.
3. Divide the usable viewport into a responsive grid of safe cells, reserve the menu area, and assign at most one object to each cell.
4. Add bounded x/y jitter inside each cell for a natural composition while maintaining a minimum gap.
5. Recalculate cell geometry at responsive breakpoints; debounce ordinary window resizing.
6. Keep the session seed so returning from a project restores the same arrangement. A full new session produces a fresh shuffle.
7. If JavaScript is unavailable or the viewport is unusually small, fall back to a simple non-overlapping CSS grid.

For six objects this cell-and-jitter method is more reliable than real-time collision physics, easier to test, and visually chaotic enough. The layout helper will be independent from the shape renderer so later cut-out images can replace the CSS shapes without changing placement logic.

## 5. Visual system

- **Palette:** parchment background, charcoal text, muted clay, mineral green, oxidized blue, and rust accents.
- **Typography:** a readable variable sans-serif that supports Latin, Armenian, and Cyrillic; one locally served family to avoid script mismatch and third-party font tracking.
- **Objects:** irregular CSS shapes with subtle inner texture, soft contact shadows, and slight rotations. They are placeholders, not attempts to imitate archaeological artefacts.
- **Grain:** a tiny locally stored texture applied as a low-opacity fixed overlay with `pointer-events: none`; disabled in high-contrast mode.
- **Motion:** short fades and gentle object lift only. `prefers-reduced-motion` removes reshuffle transitions and movement.
- **Spacing:** generous reading width on project pages; catalogue uses a quieter regular rhythm to contrast with the collection.

## 6. Language and editorial approach

For the prototype, all interface and fictional content will be translated into English, Armenian, and Russian in the repository. Human review by fluent speakers is required before any public launch with real content.

- Locale is always visible in the URL.
- The language switcher changes the current page rather than returning visitors home.
- Armenian is rendered and tested as a first-class script, not as a later overlay.
- Missing strings fall back to English in development and emit a visible development warning.
- Author names may be real names or chosen pseudonyms; the data model does not distinguish them publicly.
- Real entries will require a documented checklist for participant consent, attribution, interviewee consent, sensitive location information, and image/video rights before changing `sensitivity` to `public`.

## 7. Accessibility and privacy

- Target WCAG 2.2 AA for contrast, keyboard use, focus visibility, landmarks, headings, and labels.
- Decorative grain and shape details are hidden from assistive technology; each object link has a meaningful localized name.
- All functionality works without hover. Touch targets are at least 44 by 44 CSS pixels.
- Project media requires alt text or a documented decorative status.
- YouTube uses `youtube-nocookie.com` and is not loaded until the visitor chooses to play it.
- No analytics in the first prototype. If later requested, use a consent-light, cookieless option and document it separately.

## 8. Implementation sequence

### Phase 1 — Foundation and recognizable first view (1–2 days)

- Create the Vite/React/TypeScript app and quality tooling.
- Add routes, design tokens, provisional site identity, and six typed fictional records.
- Build the smallest working visual collection with object links and one complete project page.
- Deploy the first preview so the direction can be approved early.

### Phase 2 — Complete visitor flow (2–3 days)

- Finish all six placeholder shapes and responsive non-overlap layout.
- Build the reusable object-first project page, gallery, deferred video, and return-state behavior.
- Add the catalogue and URL-based filters.

### Phase 3 — Three languages and care rules (1–2 days)

- Add English, Armenian, and Russian content and navigation.
- Add English fallback warnings, localized metadata, and the consent/sensitivity gate.
- Verify script rendering and text expansion at all target widths.

### Phase 4 — Verification and handoff (1–2 days)

- Test the primary flow on current Chrome, Safari, and Firefox, plus representative phone and desktop widths.
- Run automated checks for routes, seeded placement, non-overlap, filters, keyboard navigation, and missing translations.
- Run an accessibility audit and fix blocking issues.
- Write a short content replacement guide and deploy the agreed prototype.

Expected build time: **5–9 working days**, leaving the rest of September for feedback, real-content trials, and visual refinement before the end-of-September prototype deadline.

## 9. Verification plan

- **Unit tests (Vitest):** seeded random output, placement boundaries, collision checks, locale fallback, and filter logic.
- **Interaction tests (React Testing Library):** object links, keyboard focus, language switcher, filter reset, and return-to-collection behavior.
- **End-to-end smoke tests (Playwright):** collection → project → collection, catalogue → filtered project, direct localized URLs, and not-found routes.
- **Automated accessibility:** axe on the collection, one gallery project, one video project, and the catalogue.
- **Manual visual checks:** 360 px phone, 768 px tablet, 1440 px desktop, zoom at 200%, reduced motion, and high contrast.
- **Performance target:** Lighthouse scores of at least 90 for performance, accessibility, best practices, and SEO on the static placeholder build.

## 10. Prototype acceptance checklist

The prototype is ready for review when:

- six fictional objects appear in a fresh, non-overlapping composition on each new session;
- every object opens the correct object-first project page;
- returning to the collection preserves the visitor’s arrangement;
- catalogue filters work together and survive refresh through the URL;
- all visitor-facing prototype text exists in English, Armenian, and Russian;
- phone, keyboard, reduced-motion, and 200% zoom flows remain usable;
- fictional placeholder content is visibly distinguishable from publishable material;
- the production build, automated tests, and accessibility checks pass;
- a public preview URL and a short content replacement guide are available.

## 11. Explicitly outside this prototype

- Real object photographs, participant projects, final translations, and final site name/identity.
- A CMS, editor login, database, user accounts, search, comments, or analytics.
- Map-based browsing, advanced animated physics, or visitor-created collections.
- Final consent policy or legal review; the prototype only establishes a safe publication gate.
- Public release of the source repository. The private repository can be made public later after content, secrets, licensing, and documentation are reviewed.

## 12. Approval point

Approval of this plan means the first build will use the provisional **Lori, Found** identity, six fictional CSS-shape entries, the three routes and three languages described above, and a static Cloudflare Pages deployment. Naming, real content, and the final public-source decision remain review points rather than blockers for the prototype.
