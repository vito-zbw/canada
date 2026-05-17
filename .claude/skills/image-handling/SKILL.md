---
name: image-handling
description: Use when adding, sizing, fetching, or referencing an image; writing alt text; setting srcset; configuring blur-up / LQIP; touching the Pexels fetcher; managing files under public/images/; or reviewing image-related accessibility. Symptoms - hero image, photo gallery, alt text, Image component, raw img tag, `<Image>`, manifest, srcset, lazy loading.
---

# Image Handling

## Overview

Images are fetched at build time from Pexels and cached under `public/images/`. Pages reference the cached path, never the Pexels URL. The pipeline is fully implemented — see `docs/ARCHITECTURE.md` § Image pipeline for the fetcher's modes and CLI.

Two image categories:

- **Per-leg hero** — `public/images/<slug>/hero.jpg` + `hero.blur.jpg` (LQIP). Used by `<Hero>` on the homepage and leg pages.
- **Per-item attraction images** — `public/images/<slug>/items/<kebab(name)>.jpg`. Used by `<DayItemCard>` for items with `kind ∈ {attraction, meal, event}`. Items with `kind ∈ {rest, transit}` fall back to a kind glyph (no photo for "afternoon nap" or "09:00 SkyTrain").

The manifest at `public/images/manifest.json` is the canonical index — both the fetcher and `DayItemCard` read it.

## When to use

- Adding or replacing an image anywhere
- Running `scripts/fetch-images.ts` (default or `--items` mode)
- Writing or auditing alt text
- Reviewing image-related accessibility
- Overriding a Pexels result that's wrong for a specific item

## Hard rules (echoed from RULES.md)

1. **No ad-hoc `<img>` outside the image components.** Heroes go through `<Image>`; per-item images go through `<DayItemCard>`'s internal rendering (which already wires `loading="lazy"` and `decoding="async"`). The image components carry the blur-up and lazy-load behavior.
2. **Every image has descriptive alt text** (R3). Not "image of …" — describe what's in it. Decorative images use `alt=""`.
3. **Progressive loading.** Hero images use blur-up via Pexels's `tiny` thumbnail (`hero.blur.jpg`); inline / per-item images use `loading="lazy"` and `decoding="async"`.

## Per-item image convention

`scripts/fetch-images.ts` writes `<kebab(name)>.jpg` filenames into `public/images/<legSlug>/items/` and records entries in `public/images/manifest.json` under `[legSlug].items[kebab(name)]`.

`src/components/DayItemCard.astro` resolves images in this order:

1. **Explicit `item.image`** in frontmatter (override) → `/images/<slug>/<image>.jpg`
2. **Convention via manifest lookup** for `kind ∈ {attraction, meal, event}` → `/images/<slug>/items/<filename>`
3. **Kind-glyph fallback** (always for `kind ∈ {rest, transit}`, or when neither override nor manifest entry exists)

The `kebab()` function is the **contract** between the fetcher and the component. Both implementations must match exactly. The regex is documented in `docs/CONTENT-MODEL.md` § Per-item image convention.

## Common operations

| Goal | Command |
|---|---|
| Fetch hero images only (all legs) | `npx tsx scripts/fetch-images.ts` |
| Fetch per-item images for one leg | `npx tsx scripts/fetch-images.ts --leg vancouver --items` |
| Refetch existing files | add `--force` to any of the above |
| Override a bad image for one item | set `image: 'custom-slug'` on the item in frontmatter; manually drop the file at `public/images/<leg>/custom-slug.jpg` |

## Sources to load

| For | Read |
|---|---|
| Pipeline architecture and CLI flags | `docs/ARCHITECTURE.md` § Image pipeline |
| Schema and per-item convention regex | `docs/CONTENT-MODEL.md` § Per-item image convention |
| Hard rules (R3, R5) | `.claude/rules/RULES.md` |
| Fetcher implementation | `scripts/fetch-images.ts` |
| Resolution logic in component | `src/components/DayItemCard.astro` |
