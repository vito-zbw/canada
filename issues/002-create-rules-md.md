---
id: 002
title: Codify hard rules in .claude/rules/RULES.md
status: groomed
size: S
touches: .claude/rules/RULES.md
depends_on: []
skills: []
docs: []
---

## Why
CLAUDE.md names `.claude/rules/RULES.md` as the **authoritative** rule list, but the file does not exist yet. Skills route to it for governance. It must exist before skill stubs reference it.

## Inputs
- Source of rules: CLAUDE.md "Hard rules (highlights)" section
- Format: one rule per heading. Each rule has **Rule** (the MUST/MUST NOT statement), **Why** (one-line rationale), **How to apply** (one-line guidance)

## Output
A single markdown file enumerating every hard rule from CLAUDE.md plus rationale and application guidance. Rules from CLAUDE.md to include verbatim and expand:
1. MUST NOT begin coding from a vague request
2. MUST be mobile-first responsive (375px first)
3. MUST meet WCAG 2.1 AA
4. MUST keep itinerary content in /content/ only
5. MUST NOT invent itinerary content
6. MUST NOT ship client-side JS unless required by an interaction
7. MUST NOT add a dependency without logging in DECISIONS.md

## Acceptance criteria
- [ ] File contains all 7 rules from CLAUDE.md
- [ ] Each rule has a Rule / Why / How-to-apply triplet
- [ ] No rule contradicts CLAUDE.md
- [ ] No rule is invented (each maps to a CLAUDE.md source line)

## Out of scope
- Adding additional rules beyond CLAUDE.md
- Rewriting CLAUDE.md's hard-rules section
