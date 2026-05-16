---
id: 006
title: Initialize decision log in docs/DECISIONS.md
status: groomed
size: S
touches: docs/DECISIONS.md
depends_on: []
skills: []
docs: []
---

## Why
CLAUDE.md mandates logging every non-obvious choice. The decision log needs to exist with the initial scaffold decisions captured so the trail starts from the beginning, not mid-project.

## Inputs
Decisions made during initial scaffold:
1. Use Astro 4.x (vs Next.js or 11ty)
2. Use Tailwind CSS (vs CSS modules or vanilla)
3. Use MDX for itinerary content (vs raw markdown)
4. Use Pexels API for build-time images (vs Unsplash or self-hosted)
5. Use system font stacks initially (vs Google Fonts / paid web fonts)
6. Warm-neutral + deep-forest palette (per DESIGN.md)
7. Use GitHub noreply email for git commits in this repo (privacy)
8. Use Cloudflare Pages for deploy (vs Netlify / Vercel)

## Output
ADR-lite log. Each entry has:
- `## YYYY-MM-DD — <decision title>`
- **Decision:** what was chosen
- **Why:** the rationale (≤ 2 sentences)
- **Alternatives considered:** comma-separated list
- **Reversibility:** easy / moderate / hard

## Acceptance criteria
- [ ] At least 8 dated entries covering the inputs above
- [ ] Each entry has Decision / Why / Alternatives / Reversibility fields
- [ ] Dates use ISO format (`YYYY-MM-DD`)
- [ ] Entries are in reverse chronological order (newest on top)

## Out of scope
- Decisions not yet made (future entries land as they happen)
- Generating ADRs from git history retroactively
