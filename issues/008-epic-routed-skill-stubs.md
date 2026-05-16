---
id: 008
title: Create routed skill stubs for the 6 skills referenced in CLAUDE.md
status: epic
depends_on: [002]
---

## Why
CLAUDE.md's skill-routing table points to 6 skills (`design-system`, `component-patterns`, `responsive-layout`, `image-handling`, `content-rendering`, `accessibility`). None exist yet. Each must be a discoverable, spec-compliant `SKILL.md` so future grooming runs can populate the `skills:` field on issues without dangling references.

This is an epic because the children are templated bulk creation — six near-identical files that share the same template, the same governance source (RULES.md), and the same "stub now, body grows as patterns emerge" philosophy. Grouping makes the shared rationale live in one place.

## Children
- [ ] 009 — design-system skill stub
- [ ] 010 — component-patterns skill stub
- [ ] 011 — responsive-layout skill stub
- [ ] 012 — image-handling skill stub
- [ ] 013 — content-rendering skill stub
- [ ] 014 — accessibility skill stub

## Acceptance
All listed children completed. No implementation work happens at the epic level.

## Out of scope
- Authoring the substantive body of any skill (each stub is minimal — "expand as patterns emerge")
- Adding skills not listed in CLAUDE.md's routing table
- Building tooling to validate skills (consider later)

## Notes
Each child uses an identical structure: spec-compliant frontmatter, brief Overview pointing at RULES.md and CLAUDE.md, an explicit "TODO: expand body as patterns emerge" note. Skills are useful as discoverable shells even when their bodies are thin — they let other tooling and skills route to them without errors.
