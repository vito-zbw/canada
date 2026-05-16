---
id: 004
title: Document itinerary content schema in docs/CONTENT-MODEL.md
status: groomed
size: M
touches: docs/CONTENT-MODEL.md
depends_on: []
skills: []
docs: []
---

## Why
Astro content collections require an explicit Zod schema. Implementation issues (`019` content config, future leg page rendering) need a documented source of truth. CLAUDE.md mandates reading this file for content tasks.

## Inputs
- Source itinerary at `content/itinerary/canada-itinerary.md` (after issue 001)
- Observed leg structure: city, province, arrival/departure dates, nights, cost, optional anchor event, consistent subsections (arrival, where to stay, getting around, must-do, events, food, next leg)
- Anchor events present in CLAUDE.md context: Calgary Stampede, VIA Rail Canadian, Osheaga, Toronto move-in

## Output
Markdown documenting:
- The `itinerary` collection name and its directory (`src/content/itinerary/` for entries, source files at `content/itinerary/`)
- Per-entry frontmatter schema with: `id` (slug), `order` (number), `city`, `province`, `arriveDate` (ISO), `nights` (int), `cost` (CAD int, optional), `coords` ({ lat, lng }), `anchorEvent` (optional object: name + dates)
- For each field: type, required/optional, example value, validation rules
- A concrete frontmatter example for the Vancouver leg

## Acceptance criteria
- [ ] Schema covers all 9 legs without missing fields
- [ ] Every field has a documented type and an example
- [ ] ISO 8601 date format specified (`YYYY-MM-DD`)
- [ ] At least one full frontmatter example block matches a real leg
- [ ] Zod types are valid (e.g. `z.string()`, `z.number().int()`, `z.object({...})`)

## Out of scope
- Implementing the schema in `src/content/config.ts` (issue 019)
- Splitting the source markdown into per-leg files (deferred epic)
- Schema for non-leg content (prep pages, budget page) — add later

## Notes
The schema should match what gets implemented in 019. If 019 surfaces a needed field not in this doc, this doc must be updated before 019 lands.
