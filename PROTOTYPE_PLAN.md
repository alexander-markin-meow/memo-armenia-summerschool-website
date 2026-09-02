The prototype is a small, public, trilingual digital museum with three working views: a seeded field of placeholder objects, object-first project pages, and a separate summer-school research/process record. It uses thirty fictional object/project pairs made from simple CSS shapes, demonstrates the complete visitor flow on phone and desktop, and keeps the content easy to replace later with real photographs, text, galleries, and video.

# Prototype build plan

## 1. Prototype goal

Build a convincing but deliberately limited prototype that answers five questions:

1. Does object-first navigation make the participant projects feel discoverable?
2. Can a quirky, non-hierarchical collage remain understandable and accessible to visitors who are less confident with websites?
3. Can a separate research record connect projects, interviews, ideas, concepts, experiments, and trials without becoming a duplicate catalogue?
4. Does one content structure support the collage, project pages, research page, and three languages?
5. Can Alex replace placeholder material with real objects and projects without redesigning the site?

The prototype and its source repository are public for review. Project-owned hosting, domain, and repository arrangements remain a launch handoff decision.

## 2. What will be included

### Object collage (`/:lang`)

- A light, warm, expanding canvas containing all thirty irregular placeholder objects in one or two-object vertical bands.
- Objects are CSS shapes rather than photographs, with varied forms and colours.
- A new visit seed controls order, size, rotation, and approximate position. A refresh reshuffles; ordinary resizing within a breakpoint does not.
- Desktop allows controlled visible overlap up to roughly 20%, while protected central click zones stay exposed. Mobile retains every object and prevents hit-area overlap.
- Each object is a semantic link with a padded target, useful accessible label, visible name, project title, and link arrow.
- Pointer hover and keyboard focus raise the object, correct its rotation, strengthen its shadow, and never rearrange the canvas. Reduced-motion visitors get the same cue without movement.
- Selecting an object opens its project page directly.
- A first-use instruction says “Choose an object to open its project.”

### Project page (`/:lang/projects/:slug`)

- A persistent “Back to collection” control returns to the collection grid.
- The found object appears first with object name, place, approximate date, short context, and object type.
- The participant project follows with a title, pseudonymous author, medium, short introduction, and one of two representative media layouts:
  - a three-item placeholder gallery; or
  - a privacy-friendly YouTube placeholder that only loads an embed after visitor action.
- Previous/next project links allow sequential exploration without returning to the collection.
- The page demonstrates the final reading hierarchy, but all content is clearly marked as fictional prototype copy.

### Summer-school research (`/:lang/research`)

- A separate, somewhat structured working record for project paths, interviews, shared questions and concepts, experiments, trials, and backstage process notes.
- It links selectively into project pages but is not a catalogue and does not duplicate the collage.
- Current copy is explicitly fictional/provisional. Real excerpts wait for translation, attribution, consent, and sensitivity review.
- Map browsing remains a later possibility and is deliberately outside this update.

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
- **Deployment:** an OpenAI Sites production build plus a static GitHub Pages preview, sourced from the public GitHub repository. The production branch is `main`.
- **Code quality:** ESLint, Prettier, strict TypeScript, and accessible semantic HTML.

This stack keeps the prototype inexpensive and portable. It can later move to another static host without changing the content model. A CMS can be added after the editorial workflow is known rather than guessed now.

### Proposed source structure

```text
prototype/
  app/                 routes, pages, metadata, global design system
  components/          navigation, object shapes, collage, project and research views
  lib/                  typed records, translations, seeded layout and route helpers
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
  collage: {
    projectPath: string
    dimensions: { width: number; height: number }
    visibleBounds: { top: number; right: number; bottom: number; left: number }
    hitPadding: number
    label: LocalizedText
    altText: LocalizedText
    visualWeight?: number
  }
}
```

The `sensitivity` field is included now so real material cannot accidentally be published before consent review. Prototype records will all be fictional and marked `public`.

## 4. Collage layout baseline

The active collection is a deterministic composition generated from a random per-visit seed. Source order is shuffled, then one or two objects are assigned to each invisible vertical band. The layout stores separate desktop and mobile positions from the same seed: desktop permits limited visible overlap but protects a central 48×48 click zone; mobile uses smaller objects and separated hit rectangles. CSS switches between those two stable arrangements only at the responsive breakpoint.

## 5. Visual system

- **Palette:** parchment background, charcoal text, muted clay, mineral green, oxidized blue, and rust accents.
- **Typography:** a readable variable sans-serif that supports Latin, Armenian, and Cyrillic; one locally served family to avoid script mismatch and third-party font tracking.
- **Objects:** irregular CSS shapes with subtle inner texture, soft contact shadows, and varied colours. They are placeholders, not attempts to imitate archaeological artefacts.
- **Grain:** a large high-resolution animated texture applied as a low-opacity fixed top layer with `pointer-events: none`; reduced motion disables the animation.
- **Motion:** short fades and gentle object lift only. `prefers-reduced-motion` removes movement.
- **Spacing:** generous reading width on project pages, an irregular collage rhythm, and a structured but non-catalogue research record.

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
- All functionality works without hover. Touch targets are at least 48 by 48 CSS pixels.
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

- Finish the thirty placeholder entries and responsive seeded collage.
- Build the reusable object-first project page, gallery, deferred video, and return-to-collage behavior.
- Add the separate research/process record and refine navigation across all three page types.

### Phase 3 — Three languages and care rules (1–2 days)

- Add English, Armenian, and Russian content and navigation.
- Add English fallback warnings, localized metadata, and the consent/sensitivity gate.
- Verify script rendering and text expansion at all target widths.

### Phase 4 — Verification and handoff (1–2 days)

- Test the primary flow on current Chrome, Safari, and Firefox, plus representative phone and desktop widths.
- Run automated checks for routes, collage geometry, keyboard navigation, and missing translations.
- Run an accessibility audit and fix blocking issues.
- Write a short content replacement guide and deploy the agreed prototype.

Expected build time: **5–9 working days**, leaving the rest of September for feedback, real-content trials, and visual refinement before the end-of-September prototype deadline.

## 9. Verification plan

- **Unit tests:** content completeness, research routes, locale coverage, seed repeatability, vertical-band occupancy, metadata, desktop alpha-overlap limits, exposed click zones, and mobile hit-area separation.
- **Interaction tests (React Testing Library):** object links, keyboard focus, language switcher, and return-to-collection behavior.
- **End-to-end smoke tests (Playwright):** collection → project → collection, direct localized URLs, and not-found routes.
- **Automated accessibility:** axe on the collection, one gallery project, and one video project.
- **Manual visual checks:** 360 px phone, 768 px tablet, 1440 px desktop, zoom at 200%, reduced motion, and high contrast.
- **Performance target:** Lighthouse scores of at least 90 for performance, accessibility, best practices, and SEO on the static placeholder build.

## 10. Prototype acceptance checklist

The prototype is ready for review when:

- thirty fictional objects appear in a seeded, scrollable collage;
- every object opens the correct object-first project page;
- returning to the collage restores the current visit and approximate scroll position;
- a separate research/process page is reachable in all three languages;
- all visitor-facing prototype text exists in English, Armenian, and Russian;
- phone, keyboard, reduced-motion, and 200% zoom flows remain usable;
- fictional placeholder content is visibly distinguishable from publishable material;
- the production build, automated tests, and accessibility checks pass;
- a public preview URL and a short content replacement guide are available.

## 11. Explicitly outside this prototype

- Real object photographs, participant projects, final translations, and final site name/identity.
- A CMS, editor login, database, user accounts, search, comments, or analytics.
- Map-based browsing, a structured catalogue, ambient/resting movement, advanced animated physics, or visitor-created collections.
- Final consent policy or legal review; the prototype only establishes a safe publication gate.
- A final transfer of repository, domain, hosting, or service ownership to the project organization.

## 12. Approval point

The current redesign uses the approved **Lost and Found: Pokr Ayrum** identity, thirty fictional CSS-shape entries, collage, project, and research routes in three languages, and the configured Sites and GitHub Pages deployments. Real content and social destinations remain review points rather than blockers for the prototype.
