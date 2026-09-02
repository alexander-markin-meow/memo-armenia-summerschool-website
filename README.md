# Person in History — Pokr Ayrum digital museum prototype

Prototype digital museum based on the “Person in History” summer school in the Lori region of Armenia. The current review build contains a responsive object plane, object-first project pages, and a separate research/process record.

The site implementation is in [`prototype/`](prototype/). The scope and technical decisions live in [PROTOTYPE_PLAN.md](PROTOTYPE_PLAN.md), the responsive placement contract lives in [COLLAGE_ALGORITHM.md](COLLAGE_ALGORITHM.md), and the safe content-replacement process lives in [CONTENT_GUIDE.md](CONTENT_GUIDE.md).

The prototype uses fictional sample content and should not be treated as an archive of real objects, people, dates, or projects.

The active site uses the full Vinext build on OpenAI Sites. The earlier GitHub Pages deployment is retired; its client-only source remains in `prototype/github-pages/` as implementation history and is not an active public target.

Production: https://lori-found-memo.alex-markin.chatgpt.site/

From `prototype/`, run `npm run validate` to test routing and content invariants, type-check, lint, and build the supported source variants.
