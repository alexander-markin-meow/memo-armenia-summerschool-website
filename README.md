# person in history — Lori digital museum prototype

Prototype digital museum based on the “person in history” summer school in the Lori region of Armenia.

The site implementation is in [`prototype/`](prototype/). The scope and technical decisions live in [PROTOTYPE_PLAN.md](PROTOTYPE_PLAN.md), and the safe content-replacement process lives in [CONTENT_GUIDE.md](CONTENT_GUIDE.md).

The prototype uses fictional sample content and should not be treated as an archive of real objects, people, dates, or projects.

The primary site uses the full Vinext build. `prototype/github-pages/` contains a client-only, hash-routed build for GitHub Pages. Run `npm run build:pages` inside `prototype/` to produce it; compiled output is published from this repository’s `gh-pages` branch.

Sites production: https://lori-found-memo.alex-markin.chatgpt.site/

GitHub Pages preview: https://alexander-markin-meow.github.io/memo-armenia-summerschool-website/

From `prototype/`, run `npm run validate` to test the collection and content invariants, type-check, lint, and build both deployment targets.
