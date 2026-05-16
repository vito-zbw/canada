---
id: 003
title: Document architecture in docs/ARCHITECTURE.md
status: groomed
size: S
touches: docs/ARCHITECTURE.md
depends_on: []
skills: []
docs: []
---

## Why
CLAUDE.md instructs implementers to read this file when touching build config, routing, or tooling. The file doesn't exist yet. Without it, implementers either guess or re-derive the architecture each turn.

## Inputs
- CLAUDE.md "Tech stack" + "Repository map" sections
- Tech: Astro 4.x, Tailwind CSS, MDX, Pexels API (build-time), TypeScript strict, Cloudflare Pages deployment

## Output
Markdown document with these H2 sections at minimum:
- **Stack** — each technology, version pin policy, why it was chosen (one line each)
- **Build & dev** — `npm run dev/build/check`, what each does, output paths
- **Routing** — file-based routes via `src/pages/`, dynamic routes pattern
- **Content pipeline** — content collections, frontmatter validation, MDX rendering
- **Image pipeline** — Pexels build-time fetch, `/public/images/` cache, manifest concept
- **Deploy** — Cloudflare Pages via GitHub integration, build command, output directory

## Acceptance criteria
- [ ] All 6 H2 sections present
- [ ] `package.json` scripts referenced match the actual scripts (cross-checked with issue 016)
- [ ] No invented commands or paths
- [ ] Cloudflare Pages section names the exact build command and output dir

## Out of scope
- Visual design (lives in DESIGN.md)
- Content shape (lives in CONTENT-MODEL.md)
- Specific component conventions (lives in component-patterns skill)
