# Architecture

Read this when touching build config, routing, tooling, or anything that crosses component boundaries.

## Stack

| Layer | Choice | Version pin | Why |
|---|---|---|---|
| Framework | Astro | `^4` (do NOT upgrade to 5.x) | Static-first MPA; content collections; islands only where needed (R6). |
| Styling | Tailwind CSS | `^3` | Token-driven utility CSS; integrates via `@astrojs/tailwind`. No hand-rolled CSS files outside `src/styles/`. |
| Content | MDX | via `@astrojs/mdx` | Markdown with embedded Astro components for itinerary prose. |
| Images | Pexels (build-time) | n/a (HTTPS API) | Royalty-free; fetched at build, cached to `public/images/`, committed. |
| Language | TypeScript | strict mode | Type-safety on content collections + scripts. |
| Type-check | `@astrojs/check` | `^0.9` | Wraps `astro check` for fast CI. |
| Deploy | Cloudflare Pages | via GitHub integration | Free static hosting, global CDN, zero-config from a repo. |

Pin policy: minor updates allowed (`^`); major upgrades require a `docs/DECISIONS.md` entry (R7).

## Build & dev

```bash
npm install           # install dependencies
npm run dev           # start dev server on http://localhost:4321
npm run check         # type-check via @astrojs/check (must pass before commit)
npm run build         # check + build → dist/
npm run preview       # serve dist/ locally to verify the production build
```

The `build` script runs `astro check && astro build`, so a type error blocks the build. The Cloudflare Pages build command runs `npm run build`; output directory is `dist`.

## Routing

File-based via `src/pages/`. Conventions:

- `src/pages/index.astro` → `/`
- `src/pages/prep/<name>.astro` → `/prep/<name>`
- `src/pages/legs/[slug].astro` → `/legs/<slug>` (dynamic from `getStaticPaths`)

Dynamic routes pull entries from the `itinerary` content collection. Each leg slug must match the `id` field in the entry's frontmatter.

## Content pipeline

Content lives in `src/content/itinerary/*.{md,mdx}`. Each file has typed frontmatter validated by the Zod schema in `src/content/config.ts` (per `docs/CONTENT-MODEL.md`).

- The build fails if any entry's frontmatter is missing required fields.
- Pages access entries via `getCollection('itinerary')` and `getEntry('itinerary', slug)`.
- MDX entries can embed Astro components (e.g. a leg-cost callout); regular `.md` entries can't.

Source prose for the trip currently lives at `content/itinerary/canada-itinerary.md` as one long document. It will be split into per-leg entries under `src/content/itinerary/` in a later epic.

## Image pipeline

`scripts/fetch-images.ts` is a build-time fetcher (currently a skeleton; see issue 021).

Concept: for each leg, read a manifest of Pexels search queries; download top results to `public/images/<leg-slug>/`; commit the cache. Pages reference the cached path, never the Pexels URL directly. This trades fresh imagery for offline-safe, immutable deploys.

Required env var: `PEXELS_API_KEY` (not committed; set in shell or Cloudflare Pages dashboard).

Until 021 is fleshed out, the build does not invoke this script. Images can be added manually under `public/images/` without breaking the build.

## Deploy

Target: Cloudflare Pages.

- Source: `vito-zbw/canada` on GitHub.
- Build command: `npm run build`.
- Output directory: `dist`.
- Node version: 20.x or 22.x (pin via `.nvmrc` if drift becomes a problem).
- Env vars to set in the Pages dashboard: `PEXELS_API_KEY` (when 021 is implemented).

Cloudflare Pages auto-deploys on push to `main`. Preview deploys are generated for pull requests.
