# MEMO Armenia summer school museum

Prototype digital museum based on MEMO’s summer school in the Lori region of Armenia.

The site implementation is in [`prototype/`](prototype/). The scope and technical decisions live in [PROTOTYPE_PLAN.md](PROTOTYPE_PLAN.md), and the safe content-replacement process lives in [CONTENT_GUIDE.md](CONTENT_GUIDE.md).

The prototype uses fictional sample content and should not be treated as an archive of real objects, people, dates, or projects.

The primary site uses the full Vinext build. `prototype/github-pages/` contains a client-only, hash-routed build for deployment from a separate public GitHub Pages repository while keeping this source repository private. Run `npm run build:pages` inside `prototype/` to produce it.
