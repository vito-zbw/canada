---
name: content-rendering
description: Use when rendering itinerary content into pages, reading the content collection, calling getCollection or getEntry, using MDX in Astro, designing content schema changes, working with leg pages, or touching content frontmatter. Symptoms - leg page, route, slug, getStaticPaths, getCollection, getEntry, frontmatter, content/itinerary/, `.mdx` file.
---

# Content Rendering

## Overview

Two content collections live under `src/content/`:

- **`itinerary`** (`src/content/itinerary/*.mdx`) — 10 leg entries: 9 cities plus the transit leg `the-canadian.mdx`. Schema in `src/content/config.ts`; field reference in `docs/CONTENT-MODEL.md`.
- **`prep`** (`src/content/prep/*.mdx`) — pre-trip checklist sections (banking, study permit, connectivity, packing, student discounts). Rendered via the Checklist island on `/pre-trip`.

CONTENT-MODEL.md is the source of truth — when docs and code disagree, update the docs first, then the schema.

## When to use

- Creating or editing a route that consumes itinerary or prep content
- Adding or editing a `.mdx` entry under `src/content/`
- Modifying the content schema (`src/content/config.ts`)
- Reviewing how a component reads from a collection

## Hard rules (echoed from RULES.md)

- **R4 — Content lives only in `/content/`.** Never hard-code trip facts (cities, dates, costs, prose) inside components or layouts.
- **R5 — Never invent content.** If a field is missing for a real leg, stop and ask the user — do not guess plausible values.

## Rendering patterns in this codebase

### Leg detail route (`src/pages/legs/[slug].astro`)

Three render branches selected in this order:

1. **Transit branch** — when `entry.data.legType === 'transit'` AND `days[]` is populated. Renders the train info card (derived from `transport[0]`), `<TransitTimeline>`, `<Map variant="transit">`, `<CostTable>`, `<PhotoGallery>`, plus the MDX `<Content />` as remarks at the bottom.
2. **Structured city branch** — when `days[]` is populated and `legType === 'city'`. Two-column grid at `lg:` (`grid-cols-[1fr_minmax(0,360px)]`): sticky `<Map variant="city">` aside on the right, `<DayList>` + `<StaysList>` + `<TransportTable>` + `<CostTable>` + `<PhotoGallery>` stacked on the left.
3. **Legacy fallback** — when `days[]` is absent. Just renders `<Hero>` + `<MetaLine>` + `<Content />`. Lets un-migrated legs keep working through leg-by-leg migration.

The page also derives three projections from `entry.data.days`:

- `cityMarkers` — flat-mapped items with `pin` and `coords`, projected to `MapMarker` (`label = String(pin)`).
- `transitMarkers` — flat-mapped items with `kind === 'transit'` and `coords`, in document order; `label = item.name`.
- `dayJumpItems` — one per `days[].date`, formatted `Day N · MMM D` via `Intl.DateTimeFormat('en-CA')`.

### `getStaticPaths` with prev/next

```ts
export const getStaticPaths = (async () => {
  const all = (await getCollection('itinerary')).sort(
    (a, b) => a.data.order - b.data.order,
  );
  return all.map((entry, i) => ({
    params: { slug: entry.slug },
    props: {
      entry,
      prev: i > 0 ? all[i - 1] : null,
      next: i < all.length - 1 ? all[i + 1] : null,
    },
  }));
}) satisfies GetStaticPaths;
```

The `prev` / `next` props power the inter-leg nav at the bottom of each page. Sort by `data.order`, not by `arriveDate` — order is the source of truth for sequence.

### Pre-trip route (`src/pages/pre-trip.astro`)

Reads all `prep` entries sorted by `data.order`, renders one `<Checklist>` per entry. Slots `<ChecklistPaintGuard />` into `<head>` (via `<Fragment slot="head">`) so saved tick state and hidden-item rules apply before first paint.

### Optional-field handling

Optional schema fields are gated at the render site, not inside the component:

```astro
{anchorEvent && <AnchorEventBadge ... />}
{stays && stays.length > 0 && <StaysList stays={stays} />}
{galleryHas && <PhotoGallery slugs={...} alts={...} />}
```

This keeps components free of "render-nothing" branches and keeps the render order obvious at the page level.

## Sources to load

| For | Read |
|---|---|
| Schema and field reference | `docs/CONTENT-MODEL.md` |
| Hard rules (R4, R5) | `.claude/rules/RULES.md` |
| Architecture context | `docs/ARCHITECTURE.md` § Content pipeline |
| Canonical render site | `src/pages/legs/[slug].astro` |
