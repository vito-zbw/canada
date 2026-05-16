# Content Model

Read this when adding, editing, or rendering itinerary content.

The site is built around one Astro content collection: **`itinerary`**. Each entry represents one trip leg (a city or a multi-day transit). The collection has a strict Zod schema; the build fails if any entry's frontmatter is invalid.

## Collection location

- **Entries:** `src/content/itinerary/<slug>.{md,mdx}`
- **Schema:** `src/content/config.ts`
- **Source draft (not yet split):** `content/itinerary/canada-itinerary.md`

## Schema

```ts
import { defineCollection, z } from 'astro:content';

const itinerary = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),       // url slug, kebab-case
    order: z.number().int().min(1),              // sequence in the trip (1 = first)
    city: z.string(),                            // display name
    province: z.string(),                        // e.g. "BC", "AB", "ON"
    arriveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),  // ISO 8601 (YYYY-MM-DD)
    nights: z.number().int().min(0),             // 0 allowed for transit-only legs
    cost: z.number().int().optional(),           // CAD, whole dollars
    coords: z.object({                           // for the route map
      lat: z.number(),
      lng: z.number(),
    }),
    anchorEvent: z.object({                      // optional cannot-miss event
      name: z.string(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }).optional(),
    legType: z.enum(['city', 'transit']).default('city'),
  }),
});

export const collections = { itinerary };
```

## Field reference

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | kebab-case string | ✓ | Becomes the URL slug at `/legs/<id>`. Must be unique. |
| `order` | int ≥ 1 | ✓ | Sequence in the trip. Used to sort the timeline. |
| `city` | string | ✓ | Display name. May include diacritics (e.g. "Québec City"). |
| `province` | string | ✓ | 2-letter abbreviation or full name. Convention: 2-letter for Canada (`BC`, `AB`, `ON`, `MB`, `QC`). |
| `arriveDate` | ISO 8601 date | ✓ | `YYYY-MM-DD`. Used for chronological sort. |
| `nights` | int ≥ 0 | ✓ | 0 for transit-only legs (e.g. the VIA Rail crossing has its own page but no overnight in one place). |
| `cost` | int (CAD) | optional | Whole dollars. Omitted for transit (cost rolled into the transit leg). |
| `coords` | `{lat, lng}` | ✓ | For the route map. Decimals; use the city's downtown reference point. |
| `anchorEvent` | object | optional | Cannot-miss event tied to this leg (e.g. Calgary Stampede, Osheaga). |
| `legType` | `'city' \| 'transit'` | default `'city'` | `'transit'` for VIA Rail and similar. |

## Example frontmatter (Vancouver)

```yaml
---
id: vancouver
order: 1
city: Vancouver
province: BC
arriveDate: 2026-07-01
nights: 7
cost: 1850
coords:
  lat: 49.2827
  lng: -123.1207
legType: city
---

(body content in markdown or MDX)
```

## Example frontmatter (Calgary, with anchor event)

```yaml
---
id: calgary
order: 2
city: Calgary
province: AB
arriveDate: 2026-07-08
nights: 4
cost: 1600
coords:
  lat: 51.0447
  lng: -114.0719
anchorEvent:
  name: Calgary Stampede
  startDate: 2026-07-10
  endDate: 2026-07-12
legType: city
---
```

## Validation behavior

- A missing required field → `npm run check` fails with a Zod path pointing at the file and field.
- A mistyped value (e.g. `arriveDate: "July 1"` instead of ISO) → fails the regex.
- A duplicate `id` across files → Astro's collection loader catches it.

## What's not modeled (yet)

- Prep pages (study permit, packing) — distinct schema later.
- Budget rollup — derived at build from the `cost` fields.
- Photos — added when the image pipeline is implemented (issue 021 onward).

Update this document **before** changing the schema in `src/content/config.ts`. The docs are the source of truth; the code follows.
