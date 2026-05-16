---
id: 001
title: Move source itinerary into content/itinerary/
status: groomed
size: S
touches: content/itinerary/canada-itinerary.md
depends_on: []
skills: []
docs: []
---

## Why
CLAUDE.md's repo map locates trip content at `content/itinerary/`. The source markdown currently sits at the repo root after a rename. Moving it now establishes the canonical content location before any code reads from it.

## Inputs
- Source path: `canada-itinerary.md` (repo root)
- Target path: `content/itinerary/canada-itinerary.md`

## Output
The file lives at `content/itinerary/canada-itinerary.md`. The root copy is removed. `git status` shows a rename (R100), not delete + add, so blame history is preserved.

## Acceptance criteria
- [ ] `content/itinerary/canada-itinerary.md` exists with identical content to the prior root file
- [ ] `canada-itinerary.md` is no longer at the repo root
- [ ] `git status` records a rename, not separate delete + add lines
- [ ] No other file references the old path

## Out of scope
- Splitting the file into per-leg markdown entries (deferred — separate epic later)
- Reformatting or rewriting any prose
