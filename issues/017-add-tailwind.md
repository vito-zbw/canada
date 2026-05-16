---
id: 017
title: Add Tailwind integration to Astro
status: groomed
size: S
touches: astro.config.mjs
parent: 015
depends_on: [016]
skills: [.claude/skills/design-system/SKILL.md]
docs: [docs/DESIGN.md]
---

## Why
CLAUDE.md tech stack specifies Tailwind CSS. Every component depends on Tailwind classes being available. Should land immediately after the Astro init.

## Inputs
- Command: `npx astro add tailwind --yes`
- Design tokens to apply: from `docs/DESIGN.md` (issue 005) — palette, type scale, spacing extensions, breakpoint confirmations
- Constraint: no custom CSS files unless tokenized through `tailwind.config.mjs` (CLAUDE.md tech stack)

## Output
- `@astrojs/tailwind` installed and registered in `astro.config.mjs`
- `tailwind.config.mjs` created and extended with the tokens from DESIGN.md (theme.extend.colors, theme.extend.fontFamily, theme.extend.spacing, theme.extend.screens if needed)
- A base style file (`src/styles/base.css`) with the `@tailwind` directives, imported in the base layout (or `index.astro` until 020 lands)
- A Tailwind utility (e.g. `bg-stone-50`) applied to the placeholder index page to prove it works

## Acceptance criteria
- [ ] `npm run check` and `npm run build` still pass with zero warnings
- [ ] Built HTML in `dist/index.html` contains a Tailwind utility class
- [ ] `tailwind.config.mjs` references the design tokens from `docs/DESIGN.md` (no token left to default if it has a DESIGN.md value)
- [ ] No custom CSS file exists outside `src/styles/` (lint via `find src -name "*.css" -not -path "src/styles/*"` returns nothing)

## Out of scope
- MDX integration (issue 018)
- Any specific component styling
- Custom plugins beyond the official Tailwind preset

## Notes
If DESIGN.md (issue 005) and this issue disagree on a token value, DESIGN.md wins; update this issue and re-run.
