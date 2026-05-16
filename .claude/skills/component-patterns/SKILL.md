---
name: component-patterns
description: Use when building or modifying an Astro component, naming props, designing slot patterns, deciding component composition, splitting a large component, or reviewing component structure. Symptoms - "create a component for…", "where should this live", "make this reusable", any `.astro` file in `src/components/`.
---

# Component Patterns

## Overview

Conventions for how Astro components are structured, named, composed, and tested in this project. **This skill is a routing shell** until concrete patterns emerge from real components — see `## TODO` below. For governance rules that apply to every component (R4 no hard-coded content, R6 no client-side JS by default), see `.claude/rules/RULES.md`.

## When to use

- Creating a new `src/components/*.astro` file
- Modifying an existing component's props or slots
- Deciding whether something should be a component vs. a partial vs. inline
- Splitting a component that's grown too large

## Sources to load

| For | Read |
|---|---|
| Hard rules (R4, R6 in particular) | `.claude/rules/RULES.md` |
| Component layout primitives | `docs/DESIGN.md` |
| Astro syntax | Astro docs (canonical; do not duplicate here) |

## TODO

Expand as patterns emerge. Candidates to capture once observed in real code:

- Naming conventions (PascalCase filename, props interface name)
- When to split slots vs. props
- How to type props with TypeScript
- When to use a layout vs. a component
- Standard order of frontmatter / template / style in `.astro` files

Do not pre-emptively invent patterns. Wait until the codebase reveals them.
