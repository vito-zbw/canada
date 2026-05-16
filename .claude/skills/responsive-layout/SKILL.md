---
name: responsive-layout
description: Use when working on responsive behavior, breakpoints, mobile layout, viewport sizing, horizontal-scroll bugs, grid or flex layout, container queries, or any task targeting 375 / 768 / 1440 px viewports. Symptoms - "looks wrong on mobile", "fix the layout at this width", "stack on mobile", `md:` / `lg:` Tailwind prefixes.
---

# Responsive Layout

## Overview

Mobile-first is rule **R2** in `.claude/rules/RULES.md`. Every page and component is designed at **375 px** first, then progressively enhanced at **768 px** and **1440 px**. No horizontal scroll at any of those viewports. **This skill is a routing shell** for now — concrete patterns will accrete as real layouts ship.

## When to use

- Adding or editing layout (Tailwind flex / grid / container utilities)
- Debugging a horizontal-scroll issue
- Deciding which breakpoint a change should target
- Reviewing a component for mobile correctness

## Breakpoint targets

| Target viewport | Tailwind prefix |
|---|---|
| 375 px (phone) | (no prefix — default) |
| 768 px (tablet) | `md:` |
| 1440 px (desktop) | `xl:` |

Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) cover this — no custom breakpoints needed.

## Sources to load

| For | Read |
|---|---|
| Hard rule (R2) | `.claude/rules/RULES.md` |
| Layout primitives (gutters, max widths) | `docs/DESIGN.md` |

## TODO

Expand as patterns emerge — e.g. standard container component, how to handle viewport-specific imagery, when to use container queries vs. media queries. Do not speculate.
