// Build-time Pexels image fetcher (skeleton).
//
// Per docs/ARCHITECTURE.md § Image pipeline, this script will eventually:
//   1. Read a manifest of per-leg image search queries,
//   2. Fetch top results from the Pexels API,
//   3. Cache them under public/images/<leg-slug>/.
//
// The body is intentionally a placeholder — calling fetchImages() throws so a
// future caller cannot mistake the skeleton for a working implementation.
// The build does NOT invoke this script.

// Avoid pulling in @types/node just for process.env access at this stage.
declare const process: { env: Record<string, string | undefined> };

const API_KEY = process.env.PEXELS_API_KEY;

export async function fetchImages(): Promise<void> {
  if (!API_KEY) {
    throw new Error(
      'PEXELS_API_KEY is not set. Add it to your shell env or the Cloudflare Pages dashboard.',
    );
  }
  throw new Error(
    'TODO: implement Pexels fetcher — see docs/ARCHITECTURE.md § Image pipeline.',
  );
}
