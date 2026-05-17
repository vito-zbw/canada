// Batch curation helper: re-fetches per-item images using better Pexels
// queries than the literal "<item name> <city>" default. Reads a JSON list
// of fixes from /tmp/fixes.json (or --plan <path>) and processes each.
//
// Each fix is { leg, key, query, index? }:
//   leg     — itinerary slug (e.g. "toronto")
//   key     — kebab key in items/ (e.g. "casa-loma"). Existing override
//             targets — files directly under public/images/<leg>/<slug>.jpg
//             — are detected by setting override:true.
//   query   — Pexels search query
//   index   — which filtered candidate to pick (default 0). Filter is the
//             same width>=1200 / 0.75<=ratio<=1.78 as scripts/fetch-images.ts.
//
// Writes the new JPG + meta and rewrites the matching manifest entry
// (preserving filename, updating alt). For overrides, the manifest is not
// touched (overrides bypass the manifest in DayItemCard).

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import process from 'node:process';

const API_KEY = process.env.PEXELS_API_KEY;
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public', 'images');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');

interface Fix {
  leg: string;
  key: string;
  query: string;
  index?: number;
  override?: boolean; // true → write to /images/<leg>/<key>.jpg instead of items/
}

interface PexelsPhoto {
  width: number;
  height: number;
  alt?: string | null;
  photographer?: string | null;
  src: { large: string };
}

interface ManifestItem {
  filename: string;
  alt: string;
}
type Manifest = Record<
  string,
  {
    hero?: unknown;
    inline?: unknown;
    items?: Record<string, ManifestItem>;
  }
>;

async function pexelsSearch(query: string): Promise<PexelsPhoto[]> {
  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('per_page', '15');
  url.searchParams.set('size', 'large');

  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: API_KEY ?? '' },
      });
      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
        continue;
      }
      if (!res.ok) {
        throw new Error(`Pexels search ${res.status}: ${query}`);
      }
      const json = (await res.json()) as { photos?: PexelsPhoto[] };
      return json.photos ?? [];
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
  const msg = lastErr instanceof Error ? lastErr.message : String(lastErr);
  throw new Error(`Pexels search failed after retries: ${query} (${msg})`);
}

async function download(url: string, dest: string): Promise<void> {
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`download ${res.status}: ${url}`);
      await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
      return;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
  const msg = lastErr instanceof Error ? lastErr.message : String(lastErr);
  throw new Error(`Download failed: ${url} (${msg})`);
}

function arg(name: string): string | null {
  const i = process.argv.indexOf(name);
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : null;
}

async function main(): Promise<void> {
  if (!API_KEY) {
    process.stderr.write('PEXELS_API_KEY missing.\n');
    process.exit(1);
  }
  const planPath = arg('--plan') ?? '/tmp/fixes.json';
  const fixes = JSON.parse(await fs.readFile(planPath, 'utf8')) as Fix[];

  const manifest = JSON.parse(
    await fs.readFile(MANIFEST_PATH, 'utf8'),
  ) as Manifest;

  let ok = 0;
  let fail = 0;

  for (const fix of fixes) {
    const idx = fix.index ?? 0;
    const target = fix.override
      ? path.join(OUT_DIR, fix.leg, `${fix.key}.jpg`)
      : path.join(OUT_DIR, fix.leg, 'items', `${fix.key}.jpg`);
    const metaPath = target.replace(/\.jpg$/, '.meta.json');

    try {
      const photos = await pexelsSearch(fix.query);
      const filtered = photos.filter((p) => {
        if (p.width < 1200) return false;
        const r = p.width / p.height;
        return r >= 0.75 && r <= 1.78;
      });
      const candidate = filtered[idx] ?? filtered[0] ?? photos[0];
      if (!candidate) {
        process.stderr.write(`  ✗ ${fix.leg}/${fix.key}: no results for "${fix.query}"\n`);
        fail++;
        continue;
      }

      await fs.mkdir(path.dirname(target), { recursive: true });
      await download(candidate.src.large, target);

      const alt =
        typeof candidate.alt === 'string' && candidate.alt.trim() !== ''
          ? candidate.alt
          : '';
      await fs.writeFile(
        metaPath,
        JSON.stringify(
          {
            alt,
            pexelsAlt: alt || null,
            photographer: candidate.photographer ?? null,
            query: fix.query,
            width: candidate.width,
            height: candidate.height,
          },
          null,
          2,
        ) + '\n',
      );

      // Manifest update — only for /items/ paths (overrides bypass manifest).
      // Create the entry if missing; otherwise update its alt while preserving
      // filename.
      if (!fix.override) {
        const legEntry = manifest[fix.leg] ?? {};
        if (!legEntry.items) legEntry.items = {};
        const existing = legEntry.items[fix.key];
        legEntry.items[fix.key] = {
          filename: existing?.filename ?? `${fix.key}.jpg`,
          alt: alt || existing?.alt || '',
        };
        manifest[fix.leg] = legEntry;
      }

      process.stdout.write(
        `  ✓ ${fix.leg}/${fix.key} → ${candidate.width}x${candidate.height} (${alt.slice(0, 60)}…)\n`,
      );
      ok++;

      // Pexels rate limit guard
      await new Promise((r) => setTimeout(r, 250));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`  ✗ ${fix.leg}/${fix.key}: ${msg}\n`);
      fail++;
    }
  }

  await fs.writeFile(
    MANIFEST_PATH,
    JSON.stringify(manifest, null, 2) + '\n',
  );

  process.stdout.write(`\nDone: ${ok} ok, ${fail} fail. Manifest rewritten.\n`);
  if (fail > 0) process.exit(1);
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`curate-images failed: ${msg}\n`);
  process.exit(1);
});
