---
name: design-system
description: Use when working on visual styling, typography, color, spacing, design tokens, or Tailwind configuration. Symptoms - "make this look like…", "what color is the accent", "match the design", "update the type scale", "edit tailwind.config", any reference to fonts/colors/spacing values. Routes implementers to the canonical design tokens.
---

# Design System

## Overview

The canonical source of truth for visual design tokens is `docs/DESIGN.md`. **This skill exists as a routing shell** — it points work back to that document and to the hard rules in `.claude/rules/RULES.md`. Tokens in `tailwind.config.mjs` are derived from DESIGN.md; the docs win when they disagree.

## When to use

- Adding or editing color, type, spacing, or breakpoint values
- Authoring or modifying `tailwind.config.mjs`
- Asking "what color / size / spacing should I use here?"
- Reviewing a component's class list for token compliance

## Sources to load

| For | Read |
|---|---|
| Token values (palette, type scale, spacing) | `docs/DESIGN.md` |
| Hard rules (mobile-first, WCAG AA, no hand-rolled CSS outside `src/styles/`) | `.claude/rules/RULES.md` |
| Reference aesthetic | `reference/visitsingapore-deconstructed.md` |

## TODO

Expand this skill's body as patterns emerge — e.g. naming conventions for custom utility classes, when to extend Tailwind theme vs. add a new key, how to handle one-off design values that don't yet have a token. Each addition should be a real pattern observed in the codebase, not speculation.
