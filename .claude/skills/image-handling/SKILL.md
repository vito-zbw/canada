---
name: image-handling
description: Use when adding, sizing, fetching, or referencing an image; writing alt text; setting srcset; configuring blur-up / LQIP; touching the Pexels fetcher; managing files under public/images/; or reviewing image-related accessibility. Symptoms - hero image, photo gallery, alt text, Image component, raw img tag, `<Image>`, manifest, srcset, lazy loading.
---

# Image Handling

## Overview

Images are fetched at build time from Pexels and cached under `public/images/` (see `docs/ARCHITECTURE.md` § Image pipeline). Pages reference the cached path, never the Pexels URL. **This skill is a routing shell** until the image pipeline matures — see TODOs below.

## When to use

- Adding or replacing an image in any component or page
- Touching `scripts/fetch-images.ts`
- Writing or auditing alt text
- Configuring `<Image>` props (width, format, loading, blur-up)
- Reviewing a page's image-related accessibility

## Hard rules (echoed from RULES.md)

These three are non-negotiable:

1. **Use the Astro `<Image>` component, never raw `<img>`.** (Quality bar in CLAUDE.md.)
2. **Every image has descriptive alt text.** Not "image of …" — describe what's in it. Decorative images use `alt=""` (R3).
3. **Progressive loading.** Blur-up or LQIP placeholder while the full asset loads.

## Sources to load

| For | Read |
|---|---|
| Pipeline architecture | `docs/ARCHITECTURE.md` § Image pipeline |
| Hard rules (R3, R5) | `.claude/rules/RULES.md` |
| Pexels fetcher contract | `scripts/fetch-images.ts` (currently a skeleton) |

## TODO

Expand as the pipeline solidifies. Candidates:

- The exact manifest format for declaring per-leg image queries
- Standard aspect ratios in code (currently documented in DESIGN.md)
- How to handle Pexels rate-limits during builds
- Workflow for replacing a stock image with a real photo after the trip
