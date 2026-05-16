---
id: 011
title: Create responsive-layout skill stub
status: groomed
size: S
touches: .claude/skills/responsive-layout/SKILL.md
parent: 008
depends_on: [002]
skills: []
docs: []
---

## Why
CLAUDE.md routes "responsive behavior, breakpoints, mobile layout" tasks here. The skill must exist as a discoverable spec-compliant file before any layout issue can list it.

## Inputs
- Spec: https://agentskills.io/specification
- Governance: `.claude/rules/RULES.md` (issue 002 — includes the mobile-first 375px rule)
- Description: triggers-only

## Output
A SKILL.md with:
- Frontmatter: `name: responsive-layout`, `description: Use when ... (triggers: responsive, breakpoints, mobile, viewport, horizontal scroll, grid/flex layout, container queries) ...`
- Body: `## Overview` linking the mobile-first 375px → 768px → 1440px progression from CLAUDE.md, `## When to use`, `## TODO`
- Total body ≤ 50 lines

## Acceptance criteria
- [ ] Frontmatter has only `name` + `description`
- [ ] `description` starts with "Use when..." and is ≤ 1024 chars
- [ ] `name` matches parent dir `responsive-layout`
- [ ] Body names the 375/768/1440 breakpoint targets
- [ ] Body ≤ 50 lines

## Out of scope
- Tailwind-specific syntax reference
- Detailed responsive patterns (later issue)
