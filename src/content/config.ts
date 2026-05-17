import { defineCollection, z } from 'astro:content';

// Schema documented in docs/CONTENT-MODEL.md. When the docs and this file
// disagree, CONTENT-MODEL.md wins and the code follows.
const itinerary = defineCollection({
  type: 'content',
  schema: z.object({
    // Core
    id: z.string().regex(/^[a-z0-9-]+$/),
    order: z.number().int().min(1),
    city: z.string(),
    province: z.string(),
    arriveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    nights: z.number().int().min(0),
    cost: z.number().int().optional(),
    coords: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    anchorEvent: z
      .object({
        name: z.string(),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
      .optional(),
    legType: z.enum(['city', 'transit']).default('city'),

    // Structured per-leg data — all optional; migrated leg by leg.
    updated: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'ISO 8601 date YYYY-MM-DD')
      .optional(),

    highlights: z.array(z.string()).max(4).optional(),

    days: z
      .array(
        z.object({
          date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          label: z.string().optional(),
          items: z.array(
            z.object({
              pin: z.number().int().min(1).optional(),
              name: z.string(),
              kind: z.enum(['attraction', 'meal', 'event', 'transit', 'rest']),
              time: z.string().optional(),
              durationMin: z.number().int().optional(),
              cost: z.number().int().optional(),
              coords: z
                .object({ lat: z.number(), lng: z.number() })
                .optional(),
              note: z.string().optional(),
              image: z.string().optional(),
            }),
          ),
        }),
      )
      .optional(),

    stays: z
      .array(
        z.object({
          name: z.string(),
          neighborhood: z.string().optional(),
          checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          nightlyCAD: z.number().int(),
          bookingNote: z.string().optional(),
        }),
      )
      .optional(),

    transport: z
      .array(
        z.object({
          purpose: z.string(),
          mode: z.string(),
          costCAD: z.number().int().optional(),
          note: z.string().optional(),
        }),
      )
      .optional(),

    costBreakdown: z
      .object({
        lodging: z.number().int().optional(),
        food: z.number().int().optional(),
        transportLocal: z.number().int().optional(),
        activities: z.number().int().optional(),
        buffer: z.number().int().optional(),
      })
      .optional(),

    gallery: z
      .array(
        z.object({
          slug: z.string(),
          alt: z.string(),
        }),
      )
      .optional(),

    cityMap: z
      .object({
        centerLat: z.number(),
        centerLng: z.number(),
        radiusKm: z.number(),
        provider: z.enum(['svg', 'maplibre']).default('svg'),
      })
      .optional(),
  }),
});

// Pre-trip topics (study permit, packing, banking, connectivity). Shape
// differs from itinerary — no city, no coords, no nights. `items[]`
// is consumed by the Checklist island; each item's `id` is the
// localStorage key for its tick state (see CONTENT-MODEL.md).
const prep = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'kebab-case'),
    order: z.number().int().min(1),
    title: z.string(),
    summary: z.string(),
    lastReviewed: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'ISO 8601 date YYYY-MM-DD'),
    items: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
          text: z.string(),
          detail: z.string().optional(),
          dueRelative: z.string().optional(),
          link: z.string().url().optional(),
        }),
      )
      .default([]),
  }),
});

export const collections = { itinerary, prep };
