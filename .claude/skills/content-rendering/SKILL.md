---
name: content-rendering
description: Use when rendering itinerary content into pages, reading the content collection, calling getCollection or getEntry, using MDX in Astro, designing content schema changes, working with leg pages, or touching content frontmatter. Symptoms - leg page, route, slug, getStaticPaths, getCollection, getEntry, frontmatter, content/itinerary/, `.mdx` file.
---

# Content Rendering

## Overview

All itinerary content lives in the `itinerary` content collection (`src/content/itinerary/`) and is validated by the Zod schema in `src/content/config.ts`. The schema is documented in `docs/CONTENT-MODEL.md` — **the docs are the source of truth; the code follows**. **This skill is a routing shell** for now; patterns will accrete as leg-rendering work begins.

## When to use

- Creating a route that consumes itinerary content (`src/pages/legs/[slug].astro`, etc.)
- Adding or editing a `.mdx` entry under `src/content/itinerary/`
- Modifying the content schema (`src/content/config.ts`)
- Reviewing how a component reads from the collection

## Hard rules (echoed from RULES.md)

- **R4 — Content lives only in `/content/`.** Never hard-code trip facts (cities, dates, costs, prose) inside components or layouts.
- **R5 — Never invent content.** If a field is missing for a real leg, stop and ask the user — do not guess plausible values.

## Sources to load

| For | Read |
|---|---|
| Schema and field reference | `docs/CONTENT-MODEL.md` |
| Hard rules (R4, R5) | `.claude/rules/RULES.md` |
| Architecture context | `docs/ARCHITECTURE.md` § Content pipeline |

## TODO

Expand as patterns emerge — e.g. canonical `getStaticPaths` for leg pages, how to render anchor-event callouts inside MDX, how prep pages differ from leg pages, how to handle missing optional fields (cost, anchorEvent).
