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
    // --- Core (always required for a leg) ---
    id: z.string().regex(/^[a-z0-9-]+$/),       // url slug, kebab-case
    order: z.number().int().min(1),              // sequence in the trip (1 = first)
    city: z.string(),                            // display name
    province: z.string(),                        // e.g. "BC", "AB", "ON"
    arriveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),  // ISO 8601 (YYYY-MM-DD)
    nights: z.number().int().min(0),             // 0 allowed for transit-only legs
    cost: z.number().int().optional(),           // CAD, whole dollars (single-number total)
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

    // --- Structured per-leg data (all optional; migrated leg-by-leg) ---
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

    highlights: z.array(z.string()).max(4).optional(),

    days: z.array(z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      label: z.string().optional(),
      items: z.array(z.object({
        pin: z.number().int().min(1).optional(),
        name: z.string(),
        kind: z.enum(['attraction', 'meal', 'event', 'transit', 'rest']),
        time: z.string().optional(),
        durationMin: z.number().int().optional(),
        cost: z.number().int().optional(),
        coords: z.object({ lat: z.number(), lng: z.number() }).optional(),
        note: z.string().optional(),
        image: z.string().optional(),
      })),
    })).optional(),

    stays: z.array(z.object({
      name: z.string(),
      neighborhood: z.string().optional(),
      checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      nightlyCAD: z.number().int(),
      bookingNote: z.string().optional(),
    })).optional(),

    transport: z.array(z.object({
      purpose: z.string(),
      mode: z.string(),
      costCAD: z.number().int().optional(),
      note: z.string().optional(),
    })).optional(),

    costBreakdown: z.object({
      lodging: z.number().int().optional(),
      food: z.number().int().optional(),
      transportLocal: z.number().int().optional(),
      activities: z.number().int().optional(),
      buffer: z.number().int().optional(),
    }).optional(),

    gallery: z.array(z.object({
      slug: z.string(),
      alt: z.string(),
    })).optional(),

    cityMap: z.object({
      centerLat: z.number(),
      centerLng: z.number(),
      radiusKm: z.number(),
      provider: z.enum(['svg', 'maplibre']).default('svg'),
    }).optional(),
  }),
});

export const collections = { itinerary };
```

## Field reference

### Core fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | kebab-case string | ✓ | Becomes the URL slug at `/legs/<id>`. Must be unique. |
| `order` | int ≥ 1 | ✓ | Sequence in the trip. Used to sort the timeline. |
| `city` | string | ✓ | Display name. May include diacritics (e.g. "Québec City"). |
| `province` | string | ✓ | 2-letter abbreviation or full name. Convention: 2-letter for Canada (`BC`, `AB`, `ON`, `MB`, `QC`). |
| `arriveDate` | ISO 8601 date | ✓ | `YYYY-MM-DD`. Used for chronological sort. |
| `nights` | int ≥ 0 | ✓ | 0 for transit-only legs (e.g. the VIA Rail crossing has its own page but no overnight in one place). |
| `cost` | int (CAD) | optional | Whole dollars, single-number total. Reconciled against `costBreakdown` when both are present. |
| `coords` | `{lat, lng}` | ✓ | For the route map. Decimals; use the city's downtown reference point. |
| `anchorEvent` | object | optional | Cannot-miss event tied to this leg (e.g. Calgary Stampede, Osheaga). |
| `legType` | `'city' \| 'transit'` | default `'city'` | `'transit'` for VIA Rail and similar. |

### Structured per-leg fields

All fields below are optional. Legs are migrated to the structured layout one at a time; un-migrated legs simply omit these fields and continue to render via the legacy prose fallback.

| Field | Type | Required | Notes |
|---|---|---|---|
| `updated` | ISO 8601 date | optional | When the leg's data was last verified. Surfaces as "Estimated, updated YYYY-MM-DD" in cost / day tables. Edit this whenever you touch a leg's facts. |
| `highlights` | `string[]`, max 4 | optional | Homepage card teaser, e.g. `["Stanley Park", "Granville Island", "MOA"]`. Joined with ` · ` for display. |
| `days` | array of day objects | optional | Day-by-day schedule. Each entry has `date` (ISO), optional `label`, and an `items[]` array of activities. See "Day item shape" below. |
| `stays` | array of stay objects | optional | Lodging segments. Each `{ name, neighborhood?, checkIn, checkOut, nightlyCAD, bookingNote? }`. |
| `transport` | array of transport rows | optional | Local-transport options. Each `{ purpose, mode, costCAD?, note? }`. |
| `costBreakdown` | object | optional | Whole-CAD ints by category: `{ lodging?, food?, transportLocal?, activities?, buffer? }`. Used to render the cost table; the sum is validated against `cost`. |
| `gallery` | array of `{ slug, alt }` | optional | Photo gallery filenames under `/public/images/<leg-slug>/`. `alt` is required per R3 — no decorative alts in galleries. |
| `cityMap` | object | optional | `{ centerLat, centerLng, radiusKm, provider }`. `provider` defaults to `'svg'`; `'maplibre'` is reserved for future per-leg opt-in. |

#### Day item shape

Each entry in `days[].items[]`:

| Field | Type | Required | Notes |
|---|---|---|---|
| `pin` | int ≥ 1 | optional | Map pin number, unique within the leg. Items without a `pin` (e.g. `kind: 'rest'`) do not appear on the city map. |
| `name` | string | ✓ | Display name of the activity / stop. |
| `kind` | enum | ✓ | One of `'attraction' \| 'meal' \| 'event' \| 'transit' \| 'rest'`. |
| `time` | string | optional | `'09:00'` or a fuzzy label like `'morning'` / `'evening'`. The renderer emits `<time datetime>` only for ISO-shaped values. |
| `durationMin` | int | optional | Minutes. Rendered as `Xh Ym`. |
| `cost` | int | optional | CAD whole dollars. |
| `coords` | `{lat, lng}` | optional | Required when `pin` is set (the pin needs a position on the map). |
| `note` | string | optional | One-line hint, ≤ 80 chars. |
| `image` | string | optional | File slug under `/public/images/<leg-slug>/`. |

#### Invariants enforced by content, not the schema

- Every `items[]` element with a `pin` must also have `coords` (the map needs a position).
- `pin` numbers must be unique within a leg.
- `stays[]` `checkIn` → `checkOut` ranges should cover the leg's full date span without gaps.
- When `costBreakdown` is set alongside `cost`, the sum of the breakdown fields should equal `cost` (or fall within $5 — the `CostTable` component surfaces mismatches as an editorial warning).

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

## Example frontmatter (structured leg with day-by-day data)

A leg that has been migrated to the structured layout adds `updated`, `highlights`, `days`, `stays`, `transport`, `costBreakdown`, and `cityMap` alongside the core fields.

```yaml
---
# core
id: vancouver
order: 1
city: Vancouver
province: BC
arriveDate: 2026-07-01
nights: 7
cost: 1750
coords:
  lat: 49.2827
  lng: -123.1207
legType: city

# structured
updated: 2026-05-17
highlights:
  - Stanley Park
  - Granville Island
  - MOA at UBC
  - Victoria day trip

days:
  - date: 2026-07-01
    label: Arrival
    items:
      - pin: 1
        name: YVR → downtown via SkyTrain Canada Line
        kind: transit
        time: afternoon
        cost: 11
        coords: { lat: 49.1939, lng: -123.1843 }
        note: Tap-and-go fare via Compass card
      - pin: 2
        name: Canada Day fireworks at Canada Place
        kind: event
        time: evening
        coords: { lat: 49.2890, lng: -123.1115 }

  - date: 2026-07-02
    items:
      - pin: 3
        name: Stanley Park Seawall bike loop
        kind: attraction
        time: morning
        durationMin: 180
        coords: { lat: 49.3017, lng: -123.1417 }
        note: Mobi bike rental from West End station

stays:
  - name: HI Vancouver Downtown
    neighborhood: West End
    checkIn: 2026-07-01
    checkOut: 2026-07-08
    nightlyCAD: 69
    bookingNote: Booked via Hostelling International member rate

transport:
  - purpose: Airport → downtown
    mode: SkyTrain Canada Line
    costCAD: 11
  - purpose: Around downtown
    mode: Walk / Mobi bike share
    costCAD: 12
    note: Mobi day pass

costBreakdown:
  lodging: 480
  food: 560
  transportLocal: 80
  activities: 390
  buffer: 240

gallery:
  - slug: stanley-park-seawall
    alt: Stanley Park seawall path with cyclists and Burrard Inlet beyond
  - slug: granville-island-market
    alt: Granville Island Public Market interior with fresh produce stalls

cityMap:
  centerLat: 49.2827
  centerLng: -123.1207
  radiusKm: 20
  provider: svg
---
```

The above is illustrative — actual values for Vancouver are filled in by the leg's data-fill issue, not this docs page.

## Validation behavior

- A missing required field → `npm run check` fails with a Zod path pointing at the file and field.
- A mistyped value (e.g. `arriveDate: "July 1"` instead of ISO) → fails the regex.
- A duplicate `id` across files → Astro's collection loader catches it.

## Second collection: `prep`

Pre-trip topics (study permit activation, packing, connectivity, banking, student discounts) live in a parallel `prep` collection — distinct in shape from `itinerary` because they have no city, coords, or nights.

- **Entries:** `src/content/prep/<slug>.{md,mdx}`
- **Schema:** also in `src/content/config.ts`

```ts
const prep = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'kebab-case'),
    order: z.number().int().min(1),
    title: z.string(),
    summary: z.string(),
    lastReviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    items: z.array(z.object({
      id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      text: z.string(),
      detail: z.string().optional(),
      dueRelative: z.string().optional(),
      link: z.string().url().optional(),
    })).default([]),
  }),
});
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | kebab-case | ✓ | URL slug fragment (e.g. `study-permit`). |
| `order` | int ≥ 1 | ✓ | Sequence on the prep page. |
| `title` | string | ✓ | Section heading text. |
| `summary` | string | ✓ | One-line index summary. |
| `lastReviewed` | ISO 8601 date | ✓ | When the section's facts were last verified. |
| `items` | array of checklist items | defaults to `[]` | Structured tickable items rendered by the `Checklist` island. Each item: `{ id, text, detail?, dueRelative?, link? }`. |

#### Stable IDs

Each item's `id` is the **localStorage key** the `Checklist` island uses to persist its checked state (`canada:prep:tick:v1[sectionId][itemId]`). Once an item is shipped, **do not rename its `id`** — doing so silently resets every visitor's tick state for that item. Treat the `id` as part of the public contract; change `text` freely, but pick the `id` carefully on first ship and keep it forever.

## What's not modeled (yet)

- Budget rollup — derived at build from the `cost` fields.
- Photos — added when the image pipeline is implemented (issue 021 onward).

Update this document **before** changing the schema in `src/content/config.ts`. The docs are the source of truth; the code follows.
