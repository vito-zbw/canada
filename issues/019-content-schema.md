---
id: 019
title: Define itinerary content collection schema
status: groomed
size: M
touches: src/content/config.ts
parent: 015
depends_on: [016, 004]
skills: [.claude/skills/content-rendering/SKILL.md]
docs: [docs/CONTENT-MODEL.md]
---

## Why
Astro content collections require an explicit Zod schema. Implements the schema documented in `docs/CONTENT-MODEL.md` so the build validates leg frontmatter and TypeScript gains typed access.

## Inputs
- Schema definitions from `docs/CONTENT-MODEL.md` (issue 004)
- Collection name: `itinerary`
- Source files glob: `src/content/itinerary/**/*.{md,mdx}` (Astro convention)
- Required Zod imports: `defineCollection`, `z` from `astro:content`

## Output
- `src/content/config.ts` exporting the `itinerary` collection
- Schema covers every field from CONTENT-MODEL.md with correct Zod types
- `collections` export wires the collection up
- One throwaway example entry `src/content/itinerary/_example.mdx` validates against the schema (delete after verification; do NOT commit)

## Acceptance criteria
- [ ] `src/content/config.ts` exists and exports `collections`
- [ ] Every field from CONTENT-MODEL.md is represented with correct Zod type
- [ ] `npm run check` passes
- [ ] A throwaway example entry validates successfully (then deleted before commit)
- [ ] Missing a required field in a test entry causes `npm run check` to fail (proves validation works)
- [ ] TypeScript types are inferred (no `any`)

## Out of scope
- Moving the source itinerary into entries (deferred epic)
- Rendering leg pages (later issue)
- Schema for non-leg content (prep, budget)

## Notes
If CONTENT-MODEL.md needs a change to match implementation reality, update 004 first, then re-validate against the schema.
