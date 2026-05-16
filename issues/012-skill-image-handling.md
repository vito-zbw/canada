---
id: 012
title: Create image-handling skill stub
status: groomed
size: S
touches: .claude/skills/image-handling/SKILL.md
parent: 008
depends_on: [002]
skills: []
docs: []
---

## Why
CLAUDE.md routes anything image-related (fetching, sizing, alt text) here. The skill must exist as a discoverable spec-compliant file before image-related issues can list it.

## Inputs
- Spec: https://agentskills.io/specification
- Governance: `.claude/rules/RULES.md` (issue 002)
- Hard rules in scope: use `<Image>` not raw `<img>`, every image needs alt text, progressive loading required
- Description: triggers-only

## Output
A SKILL.md with:
- Frontmatter: `name: image-handling`, `description: Use when ... (triggers: image, photo, hero, gallery, alt text, blur-up, LQIP, Pexels, public/images, fetching, sizing, srcset, responsive image) ...`
- Body: `## Overview` (one paragraph), `## When to use` (bullets), `## Hard rules` (echo the three image rules from RULES.md), `## TODO`
- Total body ≤ 60 lines (slightly larger because the rule echoes belong here)

## Acceptance criteria
- [ ] Frontmatter has only `name` + `description`
- [ ] `description` starts with "Use when..." and is ≤ 1024 chars
- [ ] `name` matches parent dir `image-handling`
- [ ] Body echoes the three image hard rules from RULES.md (Image component, alt text, progressive)
- [ ] Body ≤ 60 lines

## Out of scope
- Pexels API contract (lives in ARCHITECTURE.md + future issue)
- Image manifest format (later issue)
