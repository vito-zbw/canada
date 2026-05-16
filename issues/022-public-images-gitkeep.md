---
id: 022
title: Create public/images/.gitkeep
status: groomed
size: S
touches: public/images/.gitkeep
depends_on: []
skills: []
docs: []
---

## Why
CLAUDE.md repo map specifies `public/images/` as the cached-image directory and notes the cache is "committed". Empty directories aren't tracked by git, so the path needs a `.gitkeep` placeholder until real images land.

## Inputs
- Path: `public/images/.gitkeep`
- Content: empty file (the file exists only to make the directory trackable)

## Output
An empty file at `public/images/.gitkeep`.

## Acceptance criteria
- [ ] `public/images/.gitkeep` exists
- [ ] `git ls-files public/images/` lists `.gitkeep`
- [ ] No other file in `public/images/`

## Out of scope
- Fetching any actual images
- Adding `.gitkeep` to other empty directories pre-emptively (do them when needed)
