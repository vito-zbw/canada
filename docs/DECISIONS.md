# Decisions Log

Append-only record of non-obvious choices. Newest entries on top. Each entry must include **Decision / Why / Alternatives / Reversibility**.

A new entry is mandatory for: adding a dependency (R7), choosing one approach over another that was actively considered, or any structural choice future-me would want context on.

---

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
