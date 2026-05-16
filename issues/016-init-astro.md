---
id: 016
title: Initialize Astro 4 project (hand-written package.json)
status: groomed
size: M
touches: package.json
parent: 015
depends_on: []
skills: []
docs: [docs/ARCHITECTURE.md]
---

## Why
`npm create astro@latest` is interactive and fragile in a non-empty directory. Hand-writing `package.json` and a minimal Astro config gives total control and is reproducible.

## Inputs
- Astro 4.x (latest 4-series; do NOT upgrade to 5.x — CLAUDE.md pins 4.x)
- TypeScript strict mode (per CLAUDE.md tech stack)
- Project name: `canada-itinerary`
- Dependencies: `astro@^4`, `@astrojs/check`, `typescript@^5`
- Scripts: `dev`, `start`, `build` (runs `astro check && astro build`), `preview`, `check`, `astro`

## Output
- `package.json` with `"type": "module"`, the listed dependencies, and the listed scripts
- `astro.config.mjs` — minimal (`import { defineConfig } from 'astro/config'; export default defineConfig({});`)
- `tsconfig.json` extending `astro/tsconfigs/strict`
- `src/pages/index.astro` — placeholder page with `<h1>Canada</h1>` and a `<p>` so we can verify rendering
- `npm install` runs successfully
- `npm run check` and `npm run build` complete with zero warnings/errors
- `dist/` directory produced after build

## Acceptance criteria
- [ ] `npm install` exits 0
- [ ] `npm run check` exits 0 with no warnings
- [ ] `npm run build` exits 0 with no warnings; produces `dist/index.html`
- [ ] `npm run dev` starts on `http://localhost:4321` (manual verify is OK)
- [ ] `package.json` `"type"` is `"module"`
- [ ] `tsconfig.json` extends `astro/tsconfigs/strict`

## Out of scope
- Tailwind (issue 017)
- MDX (issue 018)
- Content collection schema (issue 019)
- Base layout (issue 020)
- Any styling

## Notes
The placeholder `index.astro` must remain barebones — it gets replaced when 020 lands. Keep it ≤ 10 lines.
