---
id: 009
title: Create design-system skill stub
status: groomed
size: S
touches: .claude/skills/design-system/SKILL.md
parent: 008
depends_on: [002]
skills: []
docs: []
---

## Why
CLAUDE.md routes visual styling, typography, color, and spacing tasks to `design-system`. The skill must exist as a discoverable spec-compliant file before any styling-adjacent issue can list it.

## Inputs
- Spec: https://agentskills.io/specification
- Governance: `.claude/rules/RULES.md` (issue 002) and `docs/DESIGN.md` (issue 005)
- Description guidance: triggers-only per the writing-skills meta-skill

## Output
A SKILL.md with:
- Frontmatter: `name: design-system`, `description: Use when ... (triggers: styling, typography, color, spacing, design tokens, Tailwind config) ...`
- Body: `## Overview` (one paragraph pointing at DESIGN.md as source of truth), `## When to use` (bullets matching CLAUDE.md's routing row), `## TODO` (explicit "expand body as patterns emerge" note)
- Total body ≤ 50 lines

## Acceptance criteria
- [ ] Frontmatter has only `name` + `description`
- [ ] `description` starts with "Use when..." and is ≤ 1024 chars
- [ ] `name` matches parent dir `design-system`
- [ ] Body references `docs/DESIGN.md` and `.claude/rules/RULES.md`
- [ ] Body ≤ 50 lines

## Out of scope
- Documenting specific tokens (lives in DESIGN.md)
- Authoring detailed patterns (later issue per skill)
