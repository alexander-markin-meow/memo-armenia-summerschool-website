The prototype is a small, public, trilingual digital museum with two working views: a warm, randomized collection of closely clustered placeholder objects and an object-first project page. It uses thirty fictional object/project pairs made from simple CSS shapes, demonstrates the complete visitor flow on phone and desktop, and keeps the content easy to replace later with real photographs, text, galleries, and video.

# Prototype build plan

## 1. Prototype goal

Build a convincing but deliberately limited prototype that answers four questions:

1. Does object-first navigation make the participant projects feel discoverable?
2. Can the scattered collection feel playful without becoming confusing or inaccessible?
3. Does one content structure support the visual collection, project pages, and three languages?
4. Can Alex replace placeholder material with real objects and projects without redesigning the site?

The prototype will be public on the web, while its GitHub repository remains private during development. Making the source public later is a separate launch decision.

## 2. What will be included

### Visual collection (`/:lang`)

- A light and warm free-form field containing thirty irregular placeholder objects. Desktop keeps the whole collection in view; narrow screens use a taller scrollable field.
- Objects are CSS shapes rather than photographs: a button, a stone, a metal fragment, a leaf, a tile shard, and a thread spool.
- Every new browser session gets a newly shuffled composition.
- Objects remain inside safe screen margins, reflow at mobile, tablet, and desktop sizes, and may gently overlap on larger screens.
- Each object is a real link with a visible focus state and a short accessible label.
- Pointer hover or keyboard focus reveals the object name and project title; touch devices show the object name by default.
- Selecting an object opens its project page directly.
- A compact corner menu contains the language switcher. There is no large hero heading.

### Project page (`/:lang/projects/:slug`)

- A persistent “Back to collection” control returns to the same collection arrangement and scroll position.
- The found object appears first with object name, place, approximate date, short context, and object type.
- The participant project follows with a title, pseudonymous author, medium, short introduction, and one of two representative media layouts:
  - a three-item placeholder gallery; or
  - a privacy-friendly YouTube placeholder that only loads an embed after visitor action.
- Previous/next project links allow sequential exploration without returning to the collection.
- The page demonstrates the final reading hierarchy, but all content is clearly marked as fictional prototype copy.

### Shared shell

- English, Armenian, and Russian interface and placeholder content.
- Language selection persists locally and preserves the current page when switched.
- The approved site name is **Lost and Found: Pokr Ayrum**. The landing page uses no subtitle.
- Responsive navigation, custom not-found page, metadata, favicon, and a simple social-preview image.

## 3. Technical decisions

### Application stack

- **Framework:** React 19 with TypeScript using the Vinext/Next App Router starter for OpenAI Sites.
- **Routing:** file-based, language-prefixed routes (`/en`, `/hy`, `/ru`). The unprefixed root shows English without an extra redirect.
- **Styling:** one global design-token file plus component-scoped CSS Modules. No UI framework; the visual language is custom and the component count is small.
- **Content:** typed local TypeScript data files, one record per object/project pair. No database, CMS, user accounts, or server runtime in the prototype.
- **Internationalization:** a small typed local translation layer. Interface strings and project content use the same three-language shape, with English as the explicit development fallback.
- **Package manager/runtime:** npm with a committed lockfile; current Node LTS, recorded in `.nvmrc` and `package.json`.
- **Deployment:** an OpenAI Sites production build on Cloudflare infrastructure, sourced from the private GitHub repository. The production branch is `main`.
- **Code quality:** ESLint, Prettier, strict TypeScript, and accessible semantic HTML.

This stack keeps the prototype inexpensive and portable. It can later move to another static host without changing the content model. A CMS can be added after the editorial workflow is known rather than guessed now.

### Proposed source structure

```text
prototype/
  app/                 routes, pages, metadata, global design system
  components/          navigation, object shapes, randomized collection
  lib/                  typed object/project records and translations
  public/               social preview and public assets
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

1. On first landing-page load, create a random seed and store it in `sessionStorage`; a hard refresh starts a fresh composition.
2. Use the seed to derive each object’s rotation, scale, and many continuous placement candidates inside a safe canvas.
3. Place larger objects first and score candidates for close proximity, gentle overlap on larger screens, edge safety, broad coverage, and avoidance of obvious rows, columns, and symmetry.
4. Reserve the header and the prototype notice; labels and link hit areas remain usable while visual shapes may overlap slightly.
5. Recalculate from the same seed on resize. Narrow screens expand vertically so labels and touch targets remain legible.
6. If an unusually narrow canvas cannot fit a composition, reduce scale and spacing before extending the canvas rather than clipping or colliding objects.

The focused layout helper is independent from the shape renderer and shared with the GitHub Pages build, so later cut-out images can replace CSS shapes without duplicating placement logic.

## 5. Visual system

- **Palette:** parchment background, charcoal text, muted clay, mineral green, oxidized blue, and rust accents.
- **Typography:** a readable variable sans-serif that supports Latin, Armenian, and Cyrillic; one locally served family to avoid script mismatch and third-party font tracking.
- **Objects:** irregular CSS shapes with subtle inner texture, soft contact shadows, and slight rotations. They are placeholders, not attempts to imitate archaeological artefacts.
- **Grain:** a large high-resolution animated texture applied as a low-opacity fixed top layer with `pointer-events: none`; reduced motion disables the animation.
- **Motion:** short fades and gentle object lift only. `prefers-reduced-motion` removes reshuffle transitions and movement.
- **Spacing:** generous reading width on project pages and a fluid, open rhythm in the collection.

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
- Add routes, design tokens, provisional site identity, and thirty typed fictional records.
- Build the smallest working visual collection with object links and one complete project page.
- Deploy the first preview so the direction can be approved early.

### Phase 2 — Complete visitor flow (2–3 days)

- Finish the thirty placeholder entries and responsive non-overlap layout.
- Build the reusable object-first project page, gallery, deferred video, and return-state behavior.
- Refine the collection and project navigation.

### Phase 3 — Three languages and care rules (1–2 days)

- Add English, Armenian, and Russian content and navigation.
- Add English fallback warnings, localized metadata, and the consent/sensitivity gate.
- Verify script rendering and text expansion at all target widths.

### Phase 4 — Verification and handoff (1–2 days)

- Test the primary flow on current Chrome, Safari, and Firefox, plus representative phone and desktop widths.
- Run automated checks for routes, seeded placement, non-overlap, keyboard navigation, and missing translations.
- Run an accessibility audit and fix blocking issues.
- Write a short content replacement guide and deploy the agreed prototype.

Expected build time: **5–9 working days**, leaving the rest of September for feedback, real-content trials, and visual refinement before the end-of-September prototype deadline.

## 9. Verification plan

- **Unit tests (Vitest):** seeded random output, placement boundaries, collision checks, and locale fallback.
- **Interaction tests (React Testing Library):** object links, keyboard focus, language switcher, and return-to-collection behavior.
- **End-to-end smoke tests (Playwright):** collection → project → collection, direct localized URLs, and not-found routes.
- **Automated accessibility:** axe on the collection, one gallery project, and one video project.
- **Manual visual checks:** 360 px phone, 768 px tablet, 1440 px desktop, zoom at 200%, reduced motion, and high contrast.
- **Performance target:** Lighthouse scores of at least 90 for performance, accessibility, best practices, and SEO on the static placeholder build.

## 10. Prototype acceptance checklist

The prototype is ready for review when:

- thirty fictional objects appear in a fresh, non-overlapping composition on each new session;
- every object opens the correct object-first project page;
- returning to the collection preserves the visitor’s arrangement;
- all visitor-facing prototype text exists in English, Armenian, and Russian;
- phone, keyboard, reduced-motion, and 200% zoom flows remain usable;
- fictional placeholder content is visibly distinguishable from publishable material;
- the production build, automated tests, and accessibility checks pass;
- a public preview URL and a short content replacement guide are available.

## 11. Explicitly outside this prototype

- Real object photographs, participant projects, final translations, and final site name/identity.
- A CMS, editor login, database, user accounts, search, comments, or analytics.
- Map-based browsing, a structured catalogue, advanced animated physics, or visitor-created collections.
- Final consent policy or legal review; the prototype only establishes a safe publication gate.
- Public release of the source repository. The private repository can be made public later after content, secrets, licensing, and documentation are reviewed.

## 12. Approval point

The current redesign uses the approved **Lost and Found: Pokr Ayrum** identity, thirty fictional CSS-shape entries, collection and project routes in three languages, and the configured Sites and GitHub Pages deployments. Real content and social destinations remain review points rather than blockers for the prototype.
