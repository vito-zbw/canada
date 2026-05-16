---
id: 018
title: Add MDX integration to Astro
status: groomed
size: S
touches: astro.config.mjs
parent: 015
depends_on: [016]
skills: []
docs: []
---

## Why
CLAUDE.md tech stack uses MDX for itinerary content with embedded components. Must land before any leg-rendering work.

## Inputs
- Command: `npx astro add mdx --yes`
- No further config changes needed at this stage — the integration registers itself

## Output
- `@astrojs/mdx` installed and registered in `astro.config.mjs`
- A throwaway test entry `src/pages/_mdx-test.mdx` (or similar) that confirms MDX renders. Delete after verification — do NOT commit the test file.

## Acceptance criteria
- [ ] `@astrojs/mdx` appears in `package.json` dependencies
- [ ] `astro.config.mjs` registers the integration alongside Tailwind
- [ ] `npm run check` and `npm run build` pass with zero warnings
- [ ] A temporary MDX test file renders correctly during local verification (then deleted)
- [ ] No MDX test file committed to git after this issue closes

## Out of scope
- Actual MDX content (legs land in future issues)
- MDX component slots (later issue)
- MDX shortcodes / custom components

## Notes
MDX and Tailwind (017, 018) are independent — they can be implemented in either order after 016.
