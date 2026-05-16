---
id: 010
title: Create component-patterns skill stub
status: groomed
size: S
touches: .claude/skills/component-patterns/SKILL.md
parent: 008
depends_on: [002]
skills: []
docs: []
---

## Why
CLAUDE.md routes "building or modifying a component" to `component-patterns`. The skill must exist as a discoverable spec-compliant file before any component issue can list it.

## Inputs
- Spec: https://agentskills.io/specification
- Governance: `.claude/rules/RULES.md` (issue 002)
- Description guidance: triggers-only per the writing-skills meta-skill

## Output
A SKILL.md with:
- Frontmatter: `name: component-patterns`, `description: Use when ... (triggers: building Astro component, modifying existing component, naming props, slot patterns, component composition) ...`
- Body: `## Overview` (one paragraph), `## When to use` (bullets), `## TODO` ("expand body as patterns emerge")
- Total body ≤ 50 lines

## Acceptance criteria
- [ ] Frontmatter has only `name` + `description`
- [ ] `description` starts with "Use when..." and is ≤ 1024 chars
- [ ] `name` matches parent dir `component-patterns`
- [ ] Body references `.claude/rules/RULES.md`
- [ ] Body ≤ 50 lines

## Out of scope
- Documenting specific component conventions (later issue)
- Astro syntax reference (Astro docs are authoritative)
