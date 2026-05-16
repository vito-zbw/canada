---
name: accessibility
description: Use when concerned about accessibility, WCAG compliance, semantic HTML, ARIA attributes, alt text, contrast ratios, keyboard navigation, focus management, screen-reader behavior, or axe-core violations. Symptoms - a11y, accessibility, WCAG, axe, semantic, ARIA, focus, screen reader, contrast, keyboard navigation, skip link, tab order.
---

# Accessibility

## Overview

CLAUDE.md sets a non-negotiable bar: **WCAG 2.1 AA, zero axe-core violations** on every page. **This skill is a routing shell** that points at the rule, the quality bar, and the relevant docs. Component-specific a11y patterns will accrete here as real components are built.

## When to use

- Reviewing a page or component for accessibility before declaring it done
- Adding or modifying an interactive element (focus, keyboard nav, ARIA)
- Writing alt text
- Auditing color contrast
- Investigating an axe-core violation

## Quality bar (echoed from CLAUDE.md)

A page is **not done** until:

- Zero axe-core violations on the rendered HTML
- Semantic HTML (no `<div>` where a `<button>`, `<nav>`, `<main>`, `<article>`, or `<section>` is correct)
- Every image has alt text (R3)
- Every interactive element is keyboard-focusable with a visible focus indicator
- Text contrast ≥ 4.5:1 (normal) or ≥ 3:1 (large) — see DESIGN.md token contrasts
- `<html lang="en">` is set
- Skip-to-content link is the first focusable element on every page

## Sources to load

| For | Read |
|---|---|
| Hard rule (R3) | `.claude/rules/RULES.md` |
| Token contrasts | `docs/DESIGN.md` |
| WCAG 2.1 AA criteria | https://www.w3.org/WAI/WCAG21/quickref/ (external, canonical) |

## TODO

Expand as patterns emerge — focus-visible styling conventions, ARIA-live regions for dynamic content (when that becomes relevant), keyboard testing checklist, axe-core integration into the build.
