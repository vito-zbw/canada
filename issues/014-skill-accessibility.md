---
id: 014
title: Create accessibility skill stub
status: groomed
size: S
touches: .claude/skills/accessibility/SKILL.md
parent: 008
depends_on: [002]
skills: []
docs: []
---

## Why
CLAUDE.md routes accessibility concerns here. The skill must exist as a discoverable spec-compliant file before accessibility-related issues can list it.

## Inputs
- Spec: https://agentskills.io/specification
- Governance: `.claude/rules/RULES.md` (issue 002 — includes WCAG 2.1 AA rule)
- Quality bar from CLAUDE.md: zero axe-core violations; semantic HTML; alt text; focus; contrast
- Description: triggers-only

## Output
A SKILL.md with:
- Frontmatter: `name: accessibility`, `description: Use when ... (triggers: a11y, accessibility, WCAG, semantic HTML, ARIA, alt text, contrast, keyboard navigation, focus, screen reader, axe-core, axe violation) ...`
- Body: `## Overview` (one paragraph), `## When to use`, `## Quality bar` (echo the CLAUDE.md a11y bar), `## TODO`
- Total body ≤ 60 lines

## Acceptance criteria
- [ ] Frontmatter has only `name` + `description`
- [ ] `description` starts with "Use when..." and is ≤ 1024 chars
- [ ] `name` matches parent dir `accessibility`
- [ ] Body cites WCAG 2.1 AA explicitly
- [ ] Body ≤ 60 lines

## Out of scope
- Component-specific a11y patterns (later issue)
- Tooling setup (axe-core integration is a future issue)
