---
id: 007
title: Create reference/visitsingapore-deconstructed.md placeholder
status: groomed
size: S
touches: reference/visitsingapore-deconstructed.md
depends_on: []
skills: []
docs: []
---

## Why
CLAUDE.md names this file as the visual reference source. A full deconstruction requires inspecting the live page, capturing screenshots, and section-by-section analysis — out of scope for the project-setup turn. A placeholder unblocks DESIGN.md (issue 005) by letting it cite the file path even before the deep analysis lands.

## Inputs
- Reference URL: https://www.visitsingapore.com/travel-tips/travelling-to-singapore/itineraries/7-days-in-singapore/
- Observed high-level patterns (to seed the placeholder): full-bleed hero, day-by-day cards, embedded mini-maps, large serif display type, generous vertical rhythm, neutral palette with single accent, breadcrumb navigation, sticky day-nav on long pages

## Output
A markdown file marked clearly as `STATUS: placeholder`. Contents:
- Frontmatter with `status: placeholder` and a target completion date
- An "Observed elements" bulleted list with the inputs above
- A TODO list naming what the full deconstruction must add: screenshots, section-by-section breakdown, typography measurements, color sampling, motion notes

## Acceptance criteria
- [ ] File exists with explicit `STATUS: placeholder` marker
- [ ] ≥ 5 observed elements listed
- [ ] TODO list names ≥ 4 follow-up tasks
- [ ] DESIGN.md (issue 005) can cite this file without ambiguity

## Out of scope
- Actually visiting the Singapore site and analyzing it (separate future issue)
- Capturing screenshots
- Producing measurement tables
