# Cross-Canada Solo Trip 2026

## What this project is

A personal multi-page itinerary website documenting a 7-week solo trip across Canada (Jul–Aug 2026). The site is editorial in style — like a long-form travel magazine — and is shared privately with family. Reference design: `https://www.visitsingapore.com/travel-tips/travelling-to-singapore/itineraries/7-days-in-singapore/`. See `reference/visitsingapore-deconstructed.md` for the specific visual elements to imitate.

## Tech stack

- **Astro 4.x** (static-first multi-page framework)
- **Tailwind CSS** for styling — no custom CSS files unless tokenized in `tailwind.config.js`
- **MDX** for itinerary content with embedded components
- **Pexels API** for build-time image fetching, cached locally to `/public/images/`
- **TypeScript** strict mode
- Deployment: **Cloudflare Pages** via GitHub integration

## Repository map

```
/
├── CLAUDE.md                          ← you are here
├── docs/                              ← stable reference, read on demand
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   ├── CONTENT-MODEL.md
│   └── DECISIONS.md                   ← log every non-obvious choice
├── .claude/
│   ├── skills/                        ← task-triggered playbooks
│   └── rules/RULES.md                 ← hard must/must-not (authoritative)
├── content/
│   └── itinerary/                     ← source of truth for trip content
├── reference/
│   └── visitsingapore-deconstructed.md
├── src/
│   ├── pages/                         ← Astro file-based routes
│   ├── components/
│   ├── layouts/
│   └── styles/
├── scripts/
│   └── fetch-images.ts                ← Pexels build-time fetcher
└── public/images/                     ← cached fetched images (committed)
```

## Roadmap

The site is being built milestone by milestone. Each milestone is tracked by an `epic` GitHub issue; its children are `groomed` issues. **Tick a child's box here when its issue closes; tick a milestone's box once all its children are done.** A new Claude session opening this repo should read this section first to know what's left.

MVP = milestones 1–4 (home + 10 leg pages + nav + images). The site is shippable once those are complete. Milestones 5–9 round out the full website.

### MVP

- [x] **Milestone 1 — Image pipeline** ([#44](https://github.com/vito-zbw/canada/issues/44))
  - [x] [#35](https://github.com/vito-zbw/canada/issues/35) — Implement Pexels fetcher script
  - [x] [#37](https://github.com/vito-zbw/canada/issues/37) — Build `<Image>` component with blur-up and alt enforcement
  - [x] [#41](https://github.com/vito-zbw/canada/issues/41) — Run image fetcher for all 10 legs and commit cache
- [x] **Milestone 2 — Shared components and nav** ([#45](https://github.com/vito-zbw/canada/issues/45))
  - [x] [#38](https://github.com/vito-zbw/canada/issues/38) — Build Hero component
  - [x] [#33](https://github.com/vito-zbw/canada/issues/33) — Build MetaLine component
  - [x] [#39](https://github.com/vito-zbw/canada/issues/39) — Build LegCard component
  - [x] [#34](https://github.com/vito-zbw/canada/issues/34) — Build AnchorEventBadge component
  - [x] [#40](https://github.com/vito-zbw/canada/issues/40) — Build TopNav component
  - [x] [#36](https://github.com/vito-zbw/canada/issues/36) — Enhance Base.astro footer with trip metadata
- [x] **Milestone 3 — Per-leg content (10 entries)** ([#46](https://github.com/vito-zbw/canada/issues/46))
  - [x] [#23](https://github.com/vito-zbw/canada/issues/23) — Author vancouver.mdx
  - [x] [#24](https://github.com/vito-zbw/canada/issues/24) — Author calgary.mdx
  - [x] [#25](https://github.com/vito-zbw/canada/issues/25) — Author banff.mdx
  - [x] [#26](https://github.com/vito-zbw/canada/issues/26) — Author jasper.mdx
  - [x] [#27](https://github.com/vito-zbw/canada/issues/27) — Author the-canadian.mdx (VIA Rail transit leg)
  - [x] [#28](https://github.com/vito-zbw/canada/issues/28) — Author winnipeg.mdx
  - [x] [#29](https://github.com/vito-zbw/canada/issues/29) — Author ottawa.mdx
  - [x] [#30](https://github.com/vito-zbw/canada/issues/30) — Author montreal.mdx
  - [x] [#31](https://github.com/vito-zbw/canada/issues/31) — Author quebec-city.mdx
  - [x] [#32](https://github.com/vito-zbw/canada/issues/32) — Author toronto.mdx
- [x] **Milestone 4 — Pages** ([#47](https://github.com/vito-zbw/canada/issues/47))
  - [x] [#42](https://github.com/vito-zbw/canada/issues/42) — Rebuild homepage as editorial overview
  - [x] [#43](https://github.com/vito-zbw/canada/issues/43) — Build leg detail dynamic route `/legs/[slug]`

**MVP is shippable when M1–M4 are all ticked.**

### Post-MVP

- [x] **Milestone 5 — Pre-trip essentials** ([#64](https://github.com/vito-zbw/canada/issues/64))
  - [x] [#48](https://github.com/vito-zbw/canada/issues/48) — Extend content schema with prep collection
  - [x] [#49](https://github.com/vito-zbw/canada/issues/49) — Author pre-trip.mdx with 5 sections
  - [x] [#50](https://github.com/vito-zbw/canada/issues/50) — Build /pre-trip route
- [x] **Milestone 6 — Route map** ([#65](https://github.com/vito-zbw/canada/issues/65))
  - [x] [#51](https://github.com/vito-zbw/canada/issues/51) — Build static RouteMap SVG component
  - [x] [#52](https://github.com/vito-zbw/canada/issues/52) — Add RouteMap to homepage
  - [x] [#53](https://github.com/vito-zbw/canada/issues/53) — Add inset RouteMap to leg pages
- [x] **Milestone 7 — Richer content components** ([#66](https://github.com/vito-zbw/canada/issues/66))
  - [x] [#54](https://github.com/vito-zbw/canada/issues/54) — Build PullQuote component
  - [x] [#55](https://github.com/vito-zbw/canada/issues/55) — Build PhotoGallery component
  - [x] [#56](https://github.com/vito-zbw/canada/issues/56) — Build DayJumpNav component
- [x] **Milestone 8 — SEO, OG metadata, and error pages** ([#67](https://github.com/vito-zbw/canada/issues/67))
  - [x] [#57](https://github.com/vito-zbw/canada/issues/57) — Add OG metadata to Base layout
  - [x] [#58](https://github.com/vito-zbw/canada/issues/58) — Generate sitemap.xml via @astrojs/sitemap
  - [x] [#59](https://github.com/vito-zbw/canada/issues/59) — Add robots.txt
  - [x] [#60](https://github.com/vito-zbw/canada/issues/60) — Build /404 page
- [x] **Milestone 9 — Deploy and CI verification** ([#68](https://github.com/vito-zbw/canada/issues/68))
  - [x] [#61](https://github.com/vito-zbw/canada/issues/61) — Configure Cloudflare Pages deploy
  - [x] [#62](https://github.com/vito-zbw/canada/issues/62) — Wire axe-core into pre-commit or CI
  - [x] [#63](https://github.com/vito-zbw/canada/issues/63) — Add Lighthouse CI workflow on PRs
- [x] **Milestone 10 — English / Chinese language toggle (infrastructure)** ([#172](https://github.com/vito-zbw/canada/issues/172))
  - [x] [#173](https://github.com/vito-zbw/canada/issues/173) — Configure Astro i18n routing in `astro.config.mjs`
  - [x] [#174](https://github.com/vito-zbw/canada/issues/174) — Create UI strings dictionary and `useTranslations` helper
  - [x] [#175](https://github.com/vito-zbw/canada/issues/175) — Extend content schema with optional `lang` field
  - [x] [#176](https://github.com/vito-zbw/canada/issues/176) — Build `LanguageToggle` component
  - [x] [#177](https://github.com/vito-zbw/canada/issues/177) — Localize `TopNav` and integrate `LanguageToggle`
  - [x] [#178](https://github.com/vito-zbw/canada/issues/178) — Localize `Base` layout (html lang, hreflang, footer)
  - [x] [#179](https://github.com/vito-zbw/canada/issues/179) — Add per-locale homepage route (en + zh)
  - [x] [#180](https://github.com/vito-zbw/canada/issues/180) — Add per-locale leg dynamic route (en + zh)
  - [x] [#181](https://github.com/vito-zbw/canada/issues/181) — Add per-locale pre-trip route (en + zh)
  - [x] [#182](https://github.com/vito-zbw/canada/issues/182) — Add per-locale 404 page (en + zh)

- [ ] **Milestone 11 — Chinese content + sub-component localization** ([#183](https://github.com/vito-zbw/canada/issues/183))
  - [x] [#184](https://github.com/vito-zbw/canada/issues/184) — Localize shared sub-components for /zh/* pages
  - [x] [#185](https://github.com/vito-zbw/canada/issues/185) — Author zh translation: Vancouver leg
  - [x] [#193](https://github.com/vito-zbw/canada/issues/193) — Author zh translation: Calgary leg
  - [x] [#186](https://github.com/vito-zbw/canada/issues/186) — Author zh translation: Banff leg
  - [x] [#187](https://github.com/vito-zbw/canada/issues/187) — Author zh translation: Jasper leg
  - [x] [#188](https://github.com/vito-zbw/canada/issues/188) — Author zh translation: The Canadian leg
  - [x] [#189](https://github.com/vito-zbw/canada/issues/189) — Author zh translation: Winnipeg leg
  - [x] [#194](https://github.com/vito-zbw/canada/issues/194) — Author zh translation: Ottawa leg
  - [x] [#190](https://github.com/vito-zbw/canada/issues/190) — Author zh translation: Montreal leg
  - [ ] [#191](https://github.com/vito-zbw/canada/issues/191) — Author zh translation: Quebec City leg
  - [ ] [#192](https://github.com/vito-zbw/canada/issues/192) — Author zh translation: Toronto leg
  - [ ] [#195](https://github.com/vito-zbw/canada/issues/195) — Author zh translation: prep — advance-bookings
  - [ ] [#200](https://github.com/vito-zbw/canada/issues/200) — Author zh translation: prep — banking
  - [ ] [#196](https://github.com/vito-zbw/canada/issues/196) — Author zh translation: prep — connectivity
  - [ ] [#197](https://github.com/vito-zbw/canada/issues/197) — Author zh translation: prep — packing
  - [ ] [#198](https://github.com/vito-zbw/canada/issues/198) — Author zh translation: prep — student-discounts
  - [ ] [#199](https://github.com/vito-zbw/canada/issues/199) — Author zh translation: prep — study-permit

**Resuming protocol:** when picking up a session, scan from the top for the first unticked child. That's your next implementation candidate (subject to its `**Depends on:**` cross-refs in the issue body — verify those are already closed).

## How to work in this repo

### Before writing code, always

1. **Confirm the task is a groomed GitHub issue** (on `vito-zbw/canada`, label `groomed`). If it isn't, invoke `.claude/skills/feature-grooming/SKILL.md` and stop. Grooming and building are separate turns.
2. Read this file.
3. Read `docs/ARCHITECTURE.md` if touching build config, routing, or tooling.
4. Consult the relevant skill in `.claude/skills/` per the routing table below.
5. If the task touches content, read `docs/CONTENT-MODEL.md` first.
6. If anything is ambiguous, **stop and ask** rather than guess.

### Skill routing

| Task | Read first |
|---|---|
| Vague task, multi-faceted ask, or anything not yet a groomed GitHub issue | `.claude/skills/feature-grooming/SKILL.md` |
| Visual styling, typography, color, spacing | `.claude/skills/design-system/SKILL.md` + `docs/DESIGN.md` |
| Building or modifying a component | `.claude/skills/component-patterns/SKILL.md` |
| Responsive behavior, breakpoints, mobile layout | `.claude/skills/responsive-layout/SKILL.md` |
| Anything image-related (fetching, sizing, alt text) | `.claude/skills/image-handling/SKILL.md` |
| Rendering itinerary content into pages | `.claude/skills/content-rendering/SKILL.md` + `docs/CONTENT-MODEL.md` |
| Accessibility concerns | `.claude/skills/accessibility/SKILL.md` |

### After changes, always

- Run `npm run build` and confirm it completes without warnings.
- Run `npm run check` (Astro type check) and confirm clean.
- If a new dependency was added, log it in `docs/DECISIONS.md` with one-sentence rationale.

### After implementing a groomed issue, always

When you finish implementing a groomed issue (a `groomed`-labeled GitHub issue — standalone or an epic child), perform these steps before reporting the work complete:

1. **Commit the issue's scope locally** on `main` in a single commit per issue:
   - Stage only the files changed for THIS issue (`git add <specific files>` — never `git add -A` / `git add .`). If unrelated working-tree changes are present, leave them uncommitted and surface them to the user separately.
   - Message: imperative summary ≤ 70 chars, ending with the issue number in parentheses. Example: `Replace homepage prose with trip-facts strip (#100)`.
   - Optional body explaining *why* if not obvious from the title.
   - Include the standard `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer.
   - Tick the corresponding child in this file's Roadmap section in the same commit so the doc stays in sync with reality.
2. **Close the issue** via `gh issue close <num>`.
3. **If the closed issue is the last open child of an epic**, also close the epic via `gh issue close <epic#>`. Epics never get their own commit — their children's commits constitute the work.

Do **not** push to GitHub from this workflow — pushing is a separate, user-initiated step.

## Hard rules (highlights)

The authoritative list is `.claude/rules/RULES.md`. The easiest-to-forget ones:

- **MUST NOT** begin coding from a vague request. Groom first via `.claude/skills/feature-grooming/SKILL.md`.
- **MUST** be mobile-first responsive — design for 375px viewport first, scale up.
- **MUST** meet WCAG 2.1 AA: semantic HTML, alt text on every image, focusable interactive elements, sufficient contrast.
- **MUST** keep itinerary content in `/content/` only. Never hard-code trip details inside components.
- **MUST NOT** invent itinerary content. If a field is missing, ask.
- **MUST NOT** ship client-side JavaScript unless an interaction genuinely requires it.
- **MUST NOT** add a dependency without logging the choice in `docs/DECISIONS.md`.

## Quality bar

A page is "done" when:

- Lighthouse mobile score ≥ 95 across Performance, Accessibility, Best Practices, SEO.
- No axe-core accessibility violations.
- Visually coherent with `reference/visitsingapore-deconstructed.md` — same density, hierarchy, and editorial feel.
- Renders correctly at 375px, 768px, and 1440px.
- Images load progressively (blur-up or LQIP), have alt text, and use the `<Image>` component (not raw `<img>`).

## Workflow expectations

- Work in small, reviewable increments. Build one component, render one page, then iterate.
- When in doubt about visual decisions, propose two options with rationale rather than picking silently.
- Never silently expand scope. If a "small change" reveals deeper work, surface it before doing it.

## What this project is NOT

- Not a CMS — content authoring is just editing markdown/JSON files by hand.
- Not a blog or aggregator — no comments, no RSS, no analytics.
- Not multilingual — English only.
- Not a portfolio piece — built for personal use; ship pragmatically.
