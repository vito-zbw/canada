---
id: 013
title: Create content-rendering skill stub
status: groomed
size: S
touches: .claude/skills/content-rendering/SKILL.md
parent: 008
depends_on: [002]
skills: []
docs: []
---

## Why
CLAUDE.md routes "rendering itinerary content into pages" tasks here. The skill must exist as a discoverable spec-compliant file before any content-rendering issue can list it.

## Inputs
- Spec: https://agentskills.io/specification
- Governance: `.claude/rules/RULES.md` (issue 002)
- Reference: `docs/CONTENT-MODEL.md` (issue 004)
- Hard rule in scope: never hard-code trip details inside components
- Description: triggers-only

## Output
A SKILL.md with:
- Frontmatter: `name: content-rendering`, `description: Use when ... (triggers: rendering itinerary content, page from collection, getEntry, getCollection, MDX in Astro, content collection schema, leg page, frontmatter) ...`
- Body: `## Overview` (one paragraph linking CONTENT-MODEL.md), `## When to use`, `## TODO`
- Total body ≤ 50 lines

## Acceptance criteria
- [ ] Frontmatter has only `name` + `description`
- [ ] `description` starts with "Use when..." and is ≤ 1024 chars
- [ ] `name` matches parent dir `content-rendering`
- [ ] Body references `docs/CONTENT-MODEL.md` and the "no hard-coded trip details" rule
- [ ] Body ≤ 50 lines

## Out of scope
- Schema design (lives in CONTENT-MODEL.md)
- MDX component slots (later issue)
