---
id: 021
title: Create scripts/fetch-images.ts skeleton
status: groomed
size: S
touches: scripts/fetch-images.ts
depends_on: [016]
skills: [.claude/skills/image-handling/SKILL.md]
docs: [docs/ARCHITECTURE.md]
---

## Why
CLAUDE.md repo map specifies a build-time Pexels image fetcher at `scripts/fetch-images.ts`. A skeleton lets us iterate on the contract (env var, manifest format, output paths) without committing to the API logic yet, and makes the file path real for ARCHITECTURE.md to reference.

## Inputs
- API key env var name: `PEXELS_API_KEY`
- Cache directory: `public/images/<leg-slug>/`
- Manifest concept: per-leg list of image search queries (where this lives is TBD — note in TODO)
- Language: TypeScript (compiled or run via tsx — TBD in implementation)

## Output
`scripts/fetch-images.ts` with:
- Top-of-file comment explaining purpose and that the body is a skeleton
- Imports needed for the env-read (`process.env`)
- Exported async function `fetchImages()` whose body is a single `throw new Error('TODO: implement Pexels fetcher — see docs/ARCHITECTURE.md "Image pipeline"')`
- Guard: throw a clear error if `PEXELS_API_KEY` is not set
- No top-level side effects (importing the file must be safe)

## Acceptance criteria
- [ ] File exists at `scripts/fetch-images.ts`
- [ ] `npm run check` includes the file in the project (no TS errors)
- [ ] Calling the exported function throws the documented TODO error
- [ ] Importing the file does not throw (no side effects)
- [ ] Missing `PEXELS_API_KEY` produces a clear error message
- [ ] `docs/ARCHITECTURE.md` "Image pipeline" section references this file path

## Out of scope
- Actual Pexels API call
- Manifest file format definition
- Build integration (`postbuild`, etc.)
- Caching strategy details

## Notes
This skeleton intentionally fails loudly when called — it's a placeholder. Future issues will fill the body. Until then, the build does NOT call it.
