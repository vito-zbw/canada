---
name: component-patterns
description: Use when building or modifying an Astro component, naming props, designing slot patterns, deciding component composition, splitting a large component, or reviewing component structure. Symptoms - "create a component for…", "where should this live", "make this reusable", any `.astro` file in `src/components/`.
---

# Component Patterns

## Overview

Conventions for Astro components in this project, derived from the 18 components shipped under `src/components/`. Governance rules apply (R4 no hard-coded content, R6 no `client:*` directives by default — interactive components use hoisted `<script>` blocks instead); see `.claude/rules/RULES.md`.

## When to use

- Creating a new `src/components/*.astro` file
- Modifying an existing component's props or slots
- Deciding whether something should be a component, a partial, or inline
- Splitting a component that's grown too large

## Conventions

### Naming

- **Files:** PascalCase (`DayItemCard.astro`, `TransitTimeline.astro`, `Map.astro`).
- **Props interface:** always exported as `Props`, declared right above the destructure: `export interface Props { ... }`.
- **Collection-derived types** alias to a meaningful local name. Example from `DayList.astro`:

```ts
import type { CollectionEntry } from 'astro:content';
type Days = NonNullable<CollectionEntry<'itinerary'>['data']['days']>;
```

### Frontmatter order

A typical component frontmatter goes:

1. Doc comment (`// What this component does. Reference issue # when non-obvious.`)
2. Imports — types first, then components, then data.
3. Type aliases derived from imports.
4. `export interface Props { ... }`.
5. Helper functions (e.g. `kebab`, `formatDuration`).
6. Constants (lookup tables, allowed-enum sets).
7. `const { ... } = Astro.props;` destructure.
8. Derived locals computed from props.
9. `---` to close, then the template.

See `src/components/DayItemCard.astro` for the canonical example.

### Conditional rendering

Use Astro's `{condition && <Component />}` pattern. The render site is the gate, not the component; components that receive a falsy collection return nothing themselves only when it's idiomatic for that component. Example from `legs/[slug].astro`:

```astro
{stays && stays.length > 0 && <StaysList stays={stays} />}
{galleryHas && <PhotoGallery slugs={...} alts={...} />}
```

### Conditional classes

Use Astro's `class:list` for variant-driven class strings — avoid template-string concatenation:

```astro
<div class:list={[
  'map-target relative w-full overflow-hidden rounded-md',
  variant === 'route' && 'aspect-[16/9]',
  variant === 'city' && 'aspect-square',
]}>
```

### Interaction (R6 in practice)

When a component genuinely needs JavaScript:

- **Prefer hoisted `<script>` blocks** inside the component over `client:*` directives. Astro auto-bundles and dedupes hoisted scripts across all instances on a page. The two interactive components in v1 (`Checklist`, `Map`) ship without any `client:*` directive at their call sites.
- **Vanilla JS only** — no Preact, no Alpine, no framework runtime (see `docs/DECISIONS.md` Checklist island entry).
- **Lazy-initialize via `IntersectionObserver`** when the dependency is heavy (e.g. `Map.astro` dynamic-imports `maplibre-gl` only when the figure scrolls into view; the ~80 KB library lives in its own Vite chunk).
- **Soft-fail to server-rendered content** when the script fails to load — `Map.astro`'s `<ol class="map-pin-index">` and `Checklist.astro`'s native `<input type="checkbox">` controls both remain functional without JS.
- **Document the choice** in `docs/DECISIONS.md` per R6's "How to apply" note and R7-adjacent hygiene.

### Component vs. inline

Inline if used once in one place. Extract when used twice OR when the markup carries internal logic (date formatting, conditional branches, accessibility attributes that benefit from named props). `<Hero>`, `<MetaLine>`, and `<LegCard>` were extracted on second use; `<Map>` was extracted because of its internal JS and `<DayItemCard>` because of its image-resolution branching.

### Layout primitives in `<Base>`

`src/layouts/Base.astro` is the page shell — `<html>`, `<head>`, `<body>`, skip link, footer. Routes wrap content in `<Base>` and slot a `<TopNav>` plus their content. To inject into `<head>` (e.g. the `ChecklistPaintGuard` script), use the `head` slot:

```astro
<Base title="..." description="...">
  <Fragment slot="head">
    <ChecklistPaintGuard />
  </Fragment>
  ...
</Base>
```

## Sources to load

| For | Read |
|---|---|
| Hard rules (R4, R6 in particular) | `.claude/rules/RULES.md` |
| Component layout primitives, design tokens | `docs/DESIGN.md` |
| Canonical components to study | `src/components/DayItemCard.astro`, `src/components/Map.astro`, `src/components/Checklist.astro` |
| Astro syntax | Astro docs (canonical; do not duplicate here) |
