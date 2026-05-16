---
id: 005
title: Document visual design tokens in docs/DESIGN.md
status: groomed
size: M
touches: docs/DESIGN.md
depends_on: []
skills: []
docs: []
---

## Why
CLAUDE.md targets an editorial, magazine-style aesthetic referencing the Visit Singapore itinerary page. Tailwind config (issue 017) and every component depend on a documented token set. Without it, each component invents its own scale.

## Inputs
- Reference: Visit Singapore 7-day itinerary page (analysis lives in `reference/visitsingapore-deconstructed.md`, issue 007)
- Constraints: mobile-first (375px), breakpoints 375/768/1440 (per CLAUDE.md quality bar)
- Constraint: system font stacks initially (no web font network cost); revisit later

## Output
Markdown defining:
- **Color palette**: warm-neutral base (e.g. `stone-50` through `stone-900`), deep-forest accent (e.g. `#1f3d2b` for primary accent, plus tints/shades). All colors with hex values.
- **Type scale**: 5+ sizes from caption to display, with rem values, line heights, and intended use
- **Font families**: `ui-serif` stack for headings, `ui-sans-serif` for body, with concrete fallback lists
- **Spacing rhythm**: 8 px base unit, extensions beyond Tailwind defaults (e.g. `18`, `22`, `30`)
- **Breakpoints**: 375 / 768 / 1440 with Tailwind class names (`sm`, `md`, `lg`, `xl`)
- **Layout primitives**: max content width, gutter sizes per breakpoint
- **Imagery rules**: aspect ratios for hero/inline images, blur-up requirement

## Acceptance criteria
- [ ] All tokens specified with hex/rem values (no `TBD`)
- [ ] Type scale has ≥ 5 entries
- [ ] At least 3 spacing values beyond Tailwind defaults
- [ ] Breakpoints match the CLAUDE.md quality-bar viewports (375/768/1440)
- [ ] Each design decision (palette choice, font choice, spacing scale) is justified in one line

## Out of scope
- Tailwind config implementation (issue 017)
- Per-component patterns (component-patterns skill)
- Web font selection (deferred)

## Notes
Tokens here drive 017 (Tailwind config) — those two files must agree. Any change here requires a follow-up update to 017.
