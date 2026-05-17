# Decisions Log

Append-only record of non-obvious choices. Newest entries on top. Each entry must include **Decision / Why / Alternatives / Reversibility**.

A new entry is mandatory for: adding a dependency (R7), choosing one approach over another that was actively considered, or any structural choice future-me would want context on.

---

## 2026-05-17 — 404 page: single bilingual stacked, not per-locale

- **Decision:** `src/pages/404.astro` renders English + Simplified Chinese sections stacked vertically, separated by an `<hr>`. The page's primary `<html lang>` is `en`; the Chinese block carries an inner `<section lang="zh-Hans">` so screen readers switch voices for that block. There is no `/zh/404` route.
- **Why:** Cloudflare Pages serves a single file (`/404.html`) for every unmatched URL — including paths under `/zh/`. A locale-prefixed Chinese 404 would be unreachable for unknown paths anyway. Stacking both languages on the single fallback is the only reliable way for a Chinese reader who hits a bad URL to immediately see Chinese.
- **Alternatives considered:** Per-locale `404.astro` files (Cloudflare Pages can't route 404s by URL prefix without a Worker, and the v1 site has no Worker); JavaScript-based locale detection (R6 — no client JS); Accept-Language header detection (Cloudflare static serving doesn't read it before falling back); a smart redirect from `/zh/<bad>` to `/zh/` (would require either a `_redirects` rule with limited matching or a Worker — both heavier than just showing both languages).
- **Reversibility:** Easy. Removing the Chinese block reverts to an English-only 404. Adding a Worker later could replace the stacked page with locale-routed 404s if we ever introduce one.

## 2026-05-17 — Deploy configuration: `wrangler.toml`, no build-time image fetch

- **Decision:** Cloudflare Pages reads `wrangler.toml` at the repo root for project config. The file sets `name = "canada-itinerary"`, `compatibility_date = "2026-05-17"`, and `pages_build_output_dir = "./dist"`. The Pages dashboard build command is `npm run build`; no environment variables are required at deploy time. The Pexels fetcher (`scripts/fetch-images.ts`) is a local dev-only tool — it runs on demand, commits its output under `public/images/`, and is never invoked by `npm run build`. `wrangler` itself is *not* added as a devDependency: the config file is read by the Pages platform directly, and the CLI is only needed for `wrangler pages` local emulation, which we don't use.
- **Why:** `wrangler.toml` is the modern repo-versioned configuration surface for Pages (preferred over dashboard-only setup since late 2024). Keeping the image fetch out of the deploy build means `PEXELS_API_KEY` does not need to live in the Pages dashboard secrets store — the API key is a local-machine concern only, eliminating one secret-leak surface. Committing the image cache (per the 2026-05-16 image-pipeline decision) is what makes this clean separation possible. Skipping the `wrangler` CLI dep keeps R7 churn down and avoids a ~30 MB native-binary install for a feature we don't use.
- **Alternatives considered:** `_routes.json` only (works but addresses route exclusion, not the broader build config — `wrangler.toml` is the right primary file); run the image fetcher at deploy time (would require `PEXELS_API_KEY` in Pages secrets, add ~10–20 s of build time per deploy, and create a Pexels-API-uptime dependency for every deploy — no upside given the cache is already committed); add `wrangler` as a devDependency for local `wrangler pages dev` (overkill — `astro dev` already serves the site locally).
- **Reversibility:** Easy on every axis. Switching to deploy-time image fetch is two changes: add `PEXELS_API_KEY` to the Pages dashboard, prepend `npm run fetch:images` to the build command. Adding `wrangler` later is one `npm install` away.

## 2026-05-17 — Maps: MapLibre GL JS + OpenFreeMap tiles (R6 broadened)

- **Decision:** All three trip maps (country route, per-leg city, per-leg transit corridor) render via MapLibre GL JS pointed at OpenFreeMap's hosted `positron` style. Added `maplibre-gl@^4.7.1` as a `dependency`. The unified `src/components/Map.astro` component dynamic-imports MapLibre inside a vanilla `<script>` block guarded by an IntersectionObserver — so the ~80 KB library lives in its own Vite chunk and ships only when a viewer scrolls a map into view. The server-rendered `<ol class="map-pin-index">` inside the figure is the soft-fail content: if the dynamic import or tile fetch fails the static list remains visible. R6 (no client JS unless required) is consciously broadened: this is the v1 site's second client island class after the Checklist (see entry below), distinguished by being `IntersectionObserver`-gated rather than eager-hydrated.
- **Why:** Hand-rolled SVG maps could not scale to real-world cartography. The country map's city labels collided (Banff/Calgary, Ottawa/Montréal); per-leg downtown pins clustered illegibly; transit station labels overran the viewBox. MapLibre handles label collision, padding, and zoom-resolved overlap natively, and OpenFreeMap removes the per-map per-week hand-trace cost paid by #99. The single shared component subsumes three legacy components (RouteMap / CityMap / TransitMap) into one bundle, and the static `<ol>` fallback keeps the figure readable even when JS or tiles fail.
- **Alternatives considered:** Continue with hand-rolled SVG (rejected — collision/overlap unsolvable without runtime logic, defeating the simplicity argument); Leaflet (similar runtime footprint, fewer modern features, raster-tile bias); Mapbox GL JS (BSL-licensed and requires an access token, MapLibre is the OSS fork and behaves identically for our needs); a static raster pre-render at build time (loses interactivity that the city-variant zoom-to-hide-labels behavior depends on); self-hosted Protomaps PMTiles from day one (operational overhead before knowing OpenFreeMap is unreliable — kept as a runbook fallback, single-line style-URL swap).
- **Reversibility:** Easy on the tile-provider axis — OpenFreeMap is referenced by one URL string in `Map.astro`; swap to a self-hosted Protomaps PMTiles file on Cloudflare Pages if the public host degrades. Moderate on the library axis — removing MapLibre would require a different interactive map library (or returning to static SVG), but the `MapMarker` prop shape is generic and would map onto Leaflet's API one-for-one.

## 2026-05-17 — Checklist island: vanilla JS + localStorage, no backend

- **Decision:** The pre-trip Checklist component (`src/components/Checklist.astro`) is one of v1's two client-side islands (the other is `Map`, below). It uses vanilla JS in an Astro `<script>` block — no React, Vue, Svelte, or other framework — and persists tick state + user-added items to `localStorage` under versioned keys (`canada:prep:tick:v1`, `canada:prep:custom:v1`). A separate inline pre-paint script (`ChecklistPaintGuard`, #88) removes the `no-js` class and stamps initial tick state onto `<html>` before first paint to keep the FOUC tight.

  *Update 2026-05-17 (#111):* Two additional `localStorage` keys added under the same architectural pattern: `canada:prep:hide:v1` (soft-hidden default items) and `canada:prep:edit:v1` (edited item text). The storage contract is now four versioned keys, not two. The pre-paint guard was extended to apply hidden-item rules before paint; edited text may briefly flash original — documented trade-off.
- **Why:** The pre-trip checklist must persist across reloads and accept user-added items — neither is expressible in static HTML alone, which is the only thing R6 permits an island for. Vanilla JS keeps the bundle ≤ 3 KB minified and avoids the runtime cost of a framework for a single component. localStorage is the right persistence layer for a personal site: per-device by design, no backend to operate, no sync surface to debug. Versioned keys (`:v1`) let a future schema migration silently abandon old data without name collisions.
- **Alternatives considered:** Preact island (≥ 9 KB runtime even with `astro/preact`; gains nothing here), Alpine.js (~12 KB; ergonomic but a framework dep), Cloudflare KV or D1 backend (cross-device sync that no one asked for; adds an operational surface), no persistence at all (defeats the point of a checklist), localStorage *without* the pre-paint guard (visible flash on every load).
- **Reversibility:** Easy — the storage shape is small (two flat objects keyed by sectionId/itemId), so swapping to a framework or a backend would mostly be a one-time export. Storage keys are versioned so the contract is explicit if migration is needed.

## 2026-05-16 — Dep: `@astrojs/sitemap` pinned to 3.2.1

- **Decision:** Add `@astrojs/sitemap@3.2.1` as a `devDependency`. Pinned (not caret) to avoid drifting to 3.7+ which targets Astro 5 internals.
- **Why:** Generates `sitemap-index.xml` + `sitemap-0.xml` from all built routes at zero hand-maintenance cost. The 3.7 latest depends on Astro 5's route metadata shape (`_routes.reduce` fails on Astro 4); 3.2.1 is the last release that works against Astro 4.16.
- **Alternatives considered:** Hand-rolled sitemap script (would re-implement route discovery), skip sitemap until the Astro 5 upgrade (loses search-indexing benefit), upgrade to Astro 5 (breaks the framework pin per architecture doc).
- **Reversibility:** Easy — bump to 3.7+ once Astro is upgraded to 5.x; the integration's config shape is unchanged.

## 2026-05-16 — Site URL placeholder: `https://canada.pages.dev`

- **Decision:** \`astro.config.mjs\` \`site:\` and the OG / sitemap / robots URLs all reference \`https://canada.pages.dev\` as a temporary canonical URL. Update to the real Cloudflare Pages or custom-domain URL once the project is deployed (single change, one config line).
- **Why:** OG metadata (#57), sitemap (#58), and robots.txt (#59) all need a baked-in canonical host. Cloudflare Pages assigns a \`<project>.pages.dev\` domain by default; \`canada.pages.dev\` matches that pattern and is highly likely to be the eventual default. The placeholder unblocks shipping the metadata work; replacing it is a one-line edit when the real URL is known.
- **Alternatives considered:** Block #57-#59 on the domain (delays the entire SEO milestone), use a wildcard CDN URL (Cloudflare's preview URLs aren't suitable for canonical), invent the domain (would actively mislead crawlers).
- **Reversibility:** Easy — change \`site:\` in \`astro.config.mjs\`, the sitemap line in \`public/robots.txt\`, and rebuild.

## 2026-05-16 — Axe via jsdom (no browser binary)

- **Decision:** Run axe-core through `jsdom` via `scripts/check-axe.ts`, not via `@axe-core/cli`. Added `axe-core` and `jsdom` as `devDependencies`.
- **Why:** The build environment is sandboxed and has no Chrome binary. `@axe-core/cli` quietly launches a real Chromium under the hood; without one it hangs forever. `jsdom` is a JavaScript-only DOM that parses HTML and runs axe-core's static rules (alt text, heading order, landmarks, lang, ARIA) — the rules that catch real WCAG 2.1 AA violations on static editorial pages. It does not run CSS layout, so it cannot check computed contrast or hidden-by-CSS rules; those are still verified manually against the design tokens (already AAA).
- **Alternatives considered:** `@axe-core/cli` (blocked by sandbox), `pa11y` (also Chromium-based), Playwright + axe (Playwright also wants a browser binary), defer all a11y checks to manual audit (loses automation per CLAUDE.md's "zero axe violations" bar).
- **Reversibility:** Easy — once a browser binary is available, switch `check-axe.ts` to driver Playwright or use `@axe-core/cli` directly. The script's interface (`tsx scripts/check-axe.ts <url>`) stays the same.

## 2026-05-16 — Dev deps: `@types/node` and `tsx`

- **Decision:** Add `@types/node` (^22) and `tsx` (^4) as `devDependencies`.
- **Why:** `scripts/fetch-images.ts` needs typed Node built-ins (`node:fs`, `node:path`, `Buffer`, `process`) to satisfy `astro check`. `tsx` runs the TS script directly (`npx tsx scripts/fetch-images.ts`) without a separate compile step. The previous skeleton avoided `@types/node` because it only touched `process.env`; the real fetcher needs the full Node typings.
- **Alternatives considered:** ts-node (heavier, slower cold start), compile to JS via `tsc` (extra build step + dist artifact in the repo), Bun (would replace the whole runtime — too disruptive for one script).
- **Reversibility:** Easy — remove both packages and the script's Node-typed imports if the fetcher is ever rewritten as plain JS.

## 2026-05-16 — Image LQIP: reuse Pexels `src.tiny` instead of `sharp`

- **Decision:** The Pexels fetcher saves the API's own `src.tiny` thumbnail (280×200 JPEG) as `<slug>/hero.blur.jpg`. The Image component applies a CSS `filter: blur()` to that thumbnail until the full hero loads.
- **Why:** Avoids pulling in `sharp` (~30 MB native binary, postinstall surface area) for what is purely a placeholder. The CSS blur masks the thumbnail's lack of true Gaussian blur; the visual result is indistinguishable in the swap window.
- **Alternatives considered:** `sharp` (one extra dep + native compile failures in sandboxed CI), inline base64 LQIP in the manifest (bloats the JSON; no easy fade-out), `plaiceholder` (wraps sharp anyway).
- **Reversibility:** Moderate — re-running the fetcher with a sharp-based path produces drop-in replacements at the same file names.

## 2026-05-16 — Deploy target: Cloudflare Pages

- **Decision:** Deploy via Cloudflare Pages with GitHub integration.
- **Why:** Free tier covers a personal site; global CDN; zero-config from a Git repo; generous build minutes.
- **Alternatives considered:** Netlify (same shape, slightly fewer free build minutes), Vercel (overkill for static-only and has stricter free-tier function limits), GitHub Pages (works but lacks build previews per PR).
- **Reversibility:** Easy — output is a static `dist/`, can switch hosts in minutes.

## 2026-05-16 — Git identity uses GitHub noreply email

- **Decision:** This repo's local git config sets `user.email = 96376400+vito-zbw@users.noreply.github.com`.
- **Why:** Keeps the user's work email out of personal-project commit metadata. The numeric-prefix form is required if GitHub email privacy is ever enabled.
- **Alternatives considered:** Personal real email (committed once; harder to scrub), no email (commits would attribute to whatever is in global config — risk of leaking work email).
- **Reversibility:** Easy — `git config user.email <new>` in this repo.

## 2026-05-16 — Color palette: warm neutrals + deep-forest accent

- **Decision:** Tailwind `stone-*` as the neutral base, custom `forest-{50,700,900}` accent.
- **Why:** Stone is warmer than Tailwind `gray`; suits the editorial-paper feel. Forest green evokes Canadian wilderness without being literal. Single accent enforces design restraint.
- **Alternatives considered:** Tailwind `gray` (too cool), Tailwind `zinc` (too neutral, lacks paper warmth), red-maple accent (too on-the-nose), no accent at all (loses anchor for action elements).
- **Reversibility:** Easy — palette values live in `docs/DESIGN.md` and `tailwind.config.mjs`; one config change.

## 2026-05-16 — Typography: system font stacks (no web fonts)

- **Decision:** Use `ui-serif` and `ui-sans-serif` stacks; no Google Fonts or paid web fonts in v1.
- **Why:** Zero network cost, instant first paint, no FOUT. The editorial feel is achievable with system serifs (Georgia, Cambria) at large display sizes. Web fonts can be added later if a specific look becomes essential.
- **Alternatives considered:** Source Serif Pro + Inter via Google Fonts (looks great but adds ~80–120 KB and a network round-trip), self-hosted Fraunces (more bespoke but adds build complexity).
- **Reversibility:** Easy — swap font families in `tailwind.config.mjs`, add `<link>` to base layout.

## 2026-05-16 — Images: Pexels API, build-time fetch, committed cache

- **Decision:** Use Pexels API for stock imagery; fetch at build time; cache files under `public/images/`; commit the cache.
- **Why:** Royalty-free with clear licensing; predictable URLs; build-time fetch means the deployed site has no third-party image dependency at runtime; committing the cache keeps the site reproducible from a clone.
- **Alternatives considered:** Unsplash (also free but rate-limited harder; license terms slightly weaker for personal use), self-shot photos (don't exist yet — trip is in 2026), hot-link Wikipedia images (license inconsistent).
- **Reversibility:** Moderate — fetcher script can target a different API; committed cache may need cleanup.

## 2026-05-16 — Content authoring: MDX inside an Astro collection

- **Decision:** Itinerary content is MDX entries in an Astro content collection with a Zod schema.
- **Why:** MDX lets prose embed Astro components (callouts, mini-maps, cost rollups) without leaving the content file. Content collections enforce typed frontmatter at build time — a missing leg cost fails the build instead of rendering blank.
- **Alternatives considered:** Plain markdown without MDX (loses component embedding), JSON entries (loses prose ergonomics), database / CMS (massive overkill for a personal static site).
- **Reversibility:** Moderate — switching off MDX is easy; rewriting all entries away from frontmatter would be tedious.

## 2026-05-16 — Styling: Tailwind CSS with token-driven config

- **Decision:** Tailwind 3.x via `@astrojs/tailwind`. All custom values flow through `tailwind.config.mjs` (no ad-hoc CSS files outside `src/styles/`).
- **Why:** Utility-first matches Astro's component model. Tokens centralized in config make design changes one-file edits. Token-driven prevents the gradual sprawl of one-off CSS classes.
- **Alternatives considered:** CSS modules (more boilerplate, less consistent), vanilla CSS with custom-properties (works but loses ergonomic utilities), Panda CSS / Vanilla Extract (excellent but overkill for a personal site).
- **Reversibility:** Hard — removing Tailwind after components are written would be a major refactor.

## 2026-05-16 — Framework: Astro 4.x

- **Decision:** Astro 4.x (pinned, do not upgrade to 5.x without an ADR).
- **Why:** Static-first MPA; content collections give typed frontmatter; "islands" model lets us add interactive bits (a Leaflet map) without shipping a full React runtime. Editorial sites are exactly Astro's sweet spot.
- **Alternatives considered:** Next.js (overkill for static content, larger JS payload), 11ty (excellent but lacks first-class TypeScript on content), plain HTML + a build script (too primitive; would re-invent partials).
- **Reversibility:** Hard — components and routing model are framework-specific.
