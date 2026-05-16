---
id: 020
title: Create base layout component
status: groomed
size: M
touches: src/layouts/Base.astro
parent: 015
depends_on: [016, 017, 005]
skills: [.claude/skills/component-patterns/SKILL.md, .claude/skills/responsive-layout/SKILL.md, .claude/skills/accessibility/SKILL.md]
docs: [docs/DESIGN.md]
---

## Why
Every page needs a shared HTML document shell (head meta, semantic body, footer). Without a base layout, every page reimplements the document outline and a11y baseline.

## Inputs
- Props: `title: string` (required), `description?: string`
- Slot: `<slot />` for page content
- Design tokens: from `docs/DESIGN.md` (background, base text size, container width, gutters)
- A11y requirements: `lang="en"` on `<html>`, semantic `<main>`, skip-to-content link, focus-visible styles
- Mobile-first per CLAUDE.md: 375px first; no horizontal scroll at any breakpoint

## Output
`src/layouts/Base.astro` rendering:
- `<!DOCTYPE html>` + `<html lang="en">`
- `<head>` with charset, viewport (`width=device-width, initial-scale=1`), title from prop, description meta, theme-color meta
- `<body>` with Tailwind base classes from DESIGN.md
- A skip-to-content link as the first focusable element
- `<main id="main">` wrapping `<slot />`
- A minimal `<footer>` with a copyright line
- `src/pages/index.astro` updated to use the layout

## Acceptance criteria
- [ ] `Base.astro` accepts `title` and optional `description` props
- [ ] Built HTML for `index.astro` passes axe-core with zero violations
- [ ] HTML5 validates (no nesting errors)
- [ ] At 375px viewport, no horizontal scroll
- [ ] At 768px and 1440px, layout adapts (verify by changing viewport in browser)
- [ ] Skip-to-content link present and is the first focusable element
- [ ] `<html lang="en">` set
- [ ] `npm run check` and `npm run build` pass

## Out of scope
- Site nav (later issue once nav structure is decided)
- Footer beyond copyright
- Open Graph / Twitter meta (later SEO issue)
- Per-page schema.org JSON-LD

## Notes
This layout is consumed by every page. Changes here cascade — verify all pages still render before declaring done in a future turn.
