import { defineCollection, z } from 'astro:content';

// Schema documented in docs/CONTENT-MODEL.md. When the docs and this file
// disagree, CONTENT-MODEL.md wins and the code follows.
const itinerary = defineCollection({
  type: 'content',
  schema: z.object({
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
  }),
});

export const collections = { itinerary };
