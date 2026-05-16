---
id: 015
title: Stand up Astro 4 environment with Tailwind and MDX
status: epic
depends_on: []
---

## Why
A working Astro build is the foundation for every later component, page, and content render. The children are mechanically intertwined: Astro must exist before Tailwind/MDX can attach; the content schema needs Astro's collection API; the base layout needs Tailwind's classes. Grouping them as an epic makes the "the dev environment is up" milestone a single checkbox.

## Children
- [ ] 016 — Initialize Astro 4 project (hand-written package.json)
- [ ] 017 — Add Tailwind integration and wire design tokens
- [ ] 018 — Add MDX integration
- [ ] 019 — Define itinerary content collection schema
- [ ] 020 — Create base layout component

## Acceptance
All listed children completed. After the epic closes:
- [ ] `npm install` succeeds from a clean clone
- [ ] `npm run check` passes with zero warnings
- [ ] `npm run build` produces a `dist/` directory
- [ ] `npm run dev` starts a server on `http://localhost:4321`
- [ ] The placeholder index page renders with a Tailwind utility applied

No implementation work happens at the epic level.

## Out of scope
- Any actual page content beyond a placeholder index (home page, leg pages — future epics)
- The Pexels image fetcher (`021`, not part of this epic)
- Cloudflare Pages deploy wiring (future issue)
- Styling polish beyond verifying Tailwind is wired

## Notes
Tailwind and MDX (017, 018) are independent of each other but both depend on 016. They can land in parallel after 016. The content schema (019) depends on the content model docs landing first (004). The base layout (020) depends on Tailwind being available (017) and design tokens being documented (005).
