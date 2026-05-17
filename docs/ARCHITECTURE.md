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
- `src/pages/pre-trip.astro` → `/pre-trip`
- `src/pages/legs/[slug].astro` → `/legs/<slug>` (dynamic from `getStaticPaths`)
- `src/pages/404.astro` → 404 fallback

Dynamic routes pull entries from the `itinerary` content collection. Each leg slug must match the `id` field in the entry's frontmatter.

## Content pipeline

Content lives in `src/content/itinerary/*.{md,mdx}`. Each file has typed frontmatter validated by the Zod schema in `src/content/config.ts` (per `docs/CONTENT-MODEL.md`).

- The build fails if any entry's frontmatter is missing required fields.
- Pages access entries via `getCollection('itinerary')` and `getEntry('itinerary', slug)`.
- MDX entries can embed Astro components (e.g. a leg-cost callout); regular `.md` entries can't.

The canonical per-leg entries live under `src/content/itinerary/` — 9 city `.mdx` files plus one transit leg (`the-canadian.mdx`). A second collection `prep` (`src/content/prep/*.mdx`) holds the pre-trip checklist sections, rendered by the Checklist island on `/pre-trip`. The pre-split source draft at `content/itinerary/canada-itinerary.md` is retained as historical reference but is no longer the source of truth.

## Image pipeline

`scripts/fetch-images.ts` is the build-time Pexels fetcher. It runs out-of-band — not from `npm run build` — and writes to `public/images/<leg-slug>/` plus a single manifest at `public/images/manifest.json`. The manifest is read by `<DayItemCard>` and any component that needs to look up cached images by convention.

Two modes selected via CLI flag:

| Command | Behavior |
|---|---|
| `npx tsx scripts/fetch-images.ts` | Default: fetch one hero per leg → `public/images/<slug>/hero.jpg` plus `hero.blur.jpg` (LQIP) |
| `npx tsx scripts/fetch-images.ts --items` | Per-item: for each leg's `days[].items[]`, fetch images for `kind ∈ {attraction, meal, event}` → `public/images/<slug>/items/<kebab(name)>.jpg`. Items with `kind ∈ {rest, transit}` are skipped. |

Other flags:
- `--leg <slug>` — limit to one leg (e.g. `--leg vancouver`)
- `--force` — refetch even when the file already exists (default: idempotent, skip existing)

The `kebab(name)` slug function is the contract between the fetcher and `src/components/DayItemCard.astro` — both implementations must match. The canonical regex is documented in `docs/CONTENT-MODEL.md` § Per-item image convention.

Required env var: `PEXELS_API_KEY` (not committed; set in shell). Cloudflare Pages does not need the key because the fetcher is not invoked at deploy time — the committed cache under `public/images/` is what ships. Pages reference the cached path, never the Pexels URL directly. This trades fresh imagery for offline-safe, immutable deploys.

## Deploy

Target: Cloudflare Pages.

- Source: `vito-zbw/canada` on GitHub.
- Build command: `npm run build`.
- Output directory: `dist`.
- Node version: 20.x or 22.x (pin via `.nvmrc` if drift becomes a problem).
- Env vars to set in the Pages dashboard: `PEXELS_API_KEY` (when 021 is implemented).

Cloudflare Pages auto-deploys on push to `main`. Preview deploys are generated for pull requests.
