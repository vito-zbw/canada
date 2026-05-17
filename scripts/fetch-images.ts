// Build-time Pexels image fetcher.
//
// See docs/ARCHITECTURE.md § Image pipeline and issues #35, #109.
//
// Two modes, selected by CLI flag:
//
//   (default)   Fetch one hero image per leg → public/images/<slug>/hero.jpg
//               and a Pexels `tiny` thumbnail as hero.blur.jpg (LQIP source).
//
//   --items     Fetch per-item images for each leg's days[].items[] entries
//               → public/images/<slug>/items/<kebab>.jpg. Items with
//               kind ∈ {attraction, meal, event, transit} are photographed;
//               kind = rest is skipped (no Pexels photo for "afternoon nap").
//               When the literal name yields no Pexels result, the fetcher
//               retries with a kind-themed semantic query (e.g.
//               "<city> train transportation" for transit items). See #107.
//
// Other flags:
//   --leg <slug>   Limit work to one leg (e.g. --leg vancouver).
//   --force        Refetch even when the file already exists. Otherwise the
//                  script is idempotent — existing files and meta.json are
//                  reused without hitting Pexels.
//
// The kebab() function below MUST stay in sync with the one used by
// src/components/DayItemCard.astro (issue #108). If you change one, change
// the other — the convention is the contract between the fetcher and the
// component.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import matter from 'gray-matter';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'itinerary');
const OUT_DIR = path.join(ROOT, 'public', 'images');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');

const API_KEY = process.env.PEXELS_API_KEY;

const argv = process.argv.slice(2);
const FORCE = argv.includes('--force');
const ITEMS_MODE = argv.includes('--items');
const legFlagIdx = argv.indexOf('--leg');
const LEG_FILTER: string | null =
  legFlagIdx >= 0 && legFlagIdx + 1 < argv.length ? argv[legFlagIdx + 1] : null;

const PHOTOGRAPHABLE_KINDS = new Set<DayItemKind>([
  'attraction',
  'meal',
  'event',
  'transit',
]);

// Strip tokens that confuse Pexels search: directional arrows and the
// "via" connector that often appears in transit names like
// "YVR → downtown via SkyTrain Canada Line". The cleaned form is what
// goes to the Pexels query; the kebab() filename is unchanged.
function cleanPexelsQuery(name: string): string {
  return name
    .replace(/[→←↔⇒⇐⇄⇆]/g, ' ')
    .replace(/\bvia\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Kind-themed fallback when the literal-name query returns no results.
// The goal is "semantically similar, not exact" — a SkyTrain photo for
// any transit item, a landmark for any attraction, etc. rest is omitted
// because it never reaches this function (filtered upstream).
const KIND_FALLBACK_QUERY: Partial<Record<DayItemKind, string>> = {
  transit: 'train transportation',
  attraction: 'landmark scenic',
  meal: 'restaurant food',
  event: 'festival crowd',
};

export interface ManifestImage {
  src: string;
  blur: string;
  width: number;
  height: number;
  alt: string;
}

export interface ManifestItem {
  filename: string;
  alt: string;
}

export interface ManifestEntry {
  hero: ManifestImage;
  inline: ManifestImage[];
  items?: Record<string, ManifestItem>;
}

export type Manifest = Record<string, ManifestEntry>;

interface PexelsPhoto {
  width: number;
  height: number;
  alt?: string | null;
  photographer?: string | null;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
}

type DayItemKind = 'attraction' | 'meal' | 'event' | 'transit' | 'rest';

interface DayItem {
  name: string;
  kind: DayItemKind;
  image?: string;
}

interface LegContent {
  slug: string;
  city: string;
  province: string;
  days: Array<{ items: DayItem[] }>;
}

// Must match src/components/DayItemCard.astro. Lowercase, strip diacritics,
// replace any run of non-alphanumeric chars with a single hyphen, trim
// leading/trailing hyphens.
export function kebab(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function readLeg(file: string): Promise<LegContent | null> {
  const raw = await fs.readFile(file, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data as {
    id?: string;
    city?: string;
    province?: string;
    days?: Array<{ items?: Array<Partial<DayItem>> }>;
  };
  if (!data.id || !data.city || !data.province) return null;
  const days = (data.days ?? []).map((d) => ({
    items: (d.items ?? [])
      .filter(
        (it): it is DayItem =>
          typeof it.name === 'string' && typeof it.kind === 'string',
      )
      .map((it) => ({
        name: it.name,
        kind: it.kind,
        image: it.image,
      })),
  }));
  return { slug: data.id, city: data.city, province: data.province, days };
}

async function discoverLegs(): Promise<LegContent[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(CONTENT_DIR);
  } catch {
    return [];
  }
  const files = entries.filter(
    (f) => f.endsWith('.md') || f.endsWith('.mdx'),
  );
  const legs: LegContent[] = [];
  for (const f of files) {
    const leg = await readLeg(path.join(CONTENT_DIR, f));
    if (leg) legs.push(leg);
  }
  return legs;
}

async function pexelsSearch(
  query: string,
  orientation: 'landscape' | 'portrait' | 'square',
  perPage: number,
): Promise<PexelsPhoto[]> {
  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('orientation', orientation);
  url.searchParams.set('per_page', String(perPage));
  url.searchParams.set('size', 'large');

  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: API_KEY ?? '' },
      });
      if (res.status === 429) {
        const delay = 2000 * (attempt + 1);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      if (!res.ok) {
        throw new Error(
          `Pexels search failed: ${res.status} ${res.statusText}`,
        );
      }
      const json = (await res.json()) as PexelsSearchResponse;
      return json.photos ?? [];
    } catch (err) {
      lastErr = err;
      const delay = 1500 * (attempt + 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  const msg = lastErr instanceof Error ? lastErr.message : String(lastErr);
  throw new Error(`Pexels search failed after retries: ${query} (${msg})`);
}

async function downloadTo(url: string, dest: string): Promise<void> {
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Download failed: ${url} → ${res.status}`);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      await fs.writeFile(dest, buf);
      return;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  const msg = lastErr instanceof Error ? lastErr.message : String(lastErr);
  throw new Error(`Download failed after retries: ${url} (${msg})`);
}

async function exists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

export async function fetchHeroForSlug(
  slug: string,
  query: string,
  opts: { force?: boolean } = {},
): Promise<ManifestEntry> {
  const dir = path.join(OUT_DIR, slug);
  await fs.mkdir(dir, { recursive: true });

  const heroPath = path.join(dir, 'hero.jpg');
  const heroBlurPath = path.join(dir, 'hero.blur.jpg');
  const metaPath = path.join(dir, 'hero.meta.json');

  const cached =
    !opts.force &&
    (await exists(heroPath)) &&
    (await exists(heroBlurPath)) &&
    (await exists(metaPath));

  let meta: { width: number; height: number; alt: string };
  if (cached) {
    meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
  } else {
    const photos = await pexelsSearch(query, 'landscape', 5);
    if (photos.length === 0) {
      throw new Error(`No Pexels results for "${query}" (slug=${slug})`);
    }
    const photo = photos[0];
    await downloadTo(photo.src.large2x, heroPath);
    await downloadTo(photo.src.tiny, heroBlurPath);
    meta = {
      width: photo.width,
      height: photo.height,
      // R5: never invent alt text — empty if Pexels did not provide one.
      alt: typeof photo.alt === 'string' ? photo.alt : '',
    };
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2) + '\n');
  }

  return {
    hero: {
      src: `/images/${slug}/hero.jpg`,
      blur: `/images/${slug}/hero.blur.jpg`,
      width: meta.width,
      height: meta.height,
      alt: meta.alt,
    },
    inline: [],
  };
}

// Backwards-compat alias for tests / external callers that imported the
// pre-#109 name.
export const fetchImagesForSlug = fetchHeroForSlug;

interface ItemFetchResult {
  key: string;
  entry: ManifestItem;
}

async function fetchItemImage(
  legSlug: string,
  city: string,
  item: DayItem,
  opts: { force?: boolean },
): Promise<ItemFetchResult | null> {
  if (!PHOTOGRAPHABLE_KINDS.has(item.kind)) return null;
  const key = kebab(item.name);
  if (!key) {
    process.stderr.write(
      `  [warn] empty kebab key for "${item.name}" (${legSlug}); skipping\n`,
    );
    return null;
  }

  const dir = path.join(OUT_DIR, legSlug, 'items');
  await fs.mkdir(dir, { recursive: true });
  const filename = `${key}.jpg`;
  const filepath = path.join(dir, filename);
  const metaPath = path.join(dir, `${key}.meta.json`);

  if (
    !opts.force &&
    (await exists(filepath)) &&
    (await exists(metaPath))
  ) {
    const meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
    return { key, entry: { filename, alt: meta.alt ?? item.name } };
  }

  try {
    const primaryQuery = `${cleanPexelsQuery(item.name)} ${city}`.trim();
    let photos = await pexelsSearch(primaryQuery, 'landscape', 8);

    if (photos.length === 0) {
      const themed = KIND_FALLBACK_QUERY[item.kind];
      if (themed) {
        const fallbackQuery = `${city} ${themed}`;
        process.stderr.write(
          `  [info] no results for "${primaryQuery}"; retrying with "${fallbackQuery}" (${legSlug}:${key})\n`,
        );
        photos = await pexelsSearch(fallbackQuery, 'landscape', 8);
      }
    }

    if (photos.length === 0) {
      process.stderr.write(
        `  [warn] no Pexels results for "${primaryQuery}" or fallback (${legSlug}:${key}); icon will render\n`,
      );
      return null;
    }

    // Pick the first result with width >= 1200 and aspect ratio between 3:4
    // (0.75) and 16:9 (1.78). Fall back to the first photo if no candidate
    // matches — better a broad result than no photo.
    const photo =
      photos.find((p) => {
        if (p.width < 1200) return false;
        const ratio = p.width / p.height;
        return ratio >= 0.75 && ratio <= 1.78;
      }) ?? photos[0];

    await downloadTo(photo.src.large, filepath);

    // R5: never invent alt text. If Pexels provided one, use it; otherwise
    // fall back to the item name (which the user authored, not us).
    const pexelsAlt =
      typeof photo.alt === 'string' && photo.alt.trim() !== ''
        ? photo.alt
        : null;
    const alt = pexelsAlt ?? item.name;

    await fs.writeFile(
      metaPath,
      JSON.stringify(
        {
          alt,
          pexelsAlt,
          photographer: photo.photographer ?? null,
          query: primaryQuery,
          width: photo.width,
          height: photo.height,
        },
        null,
        2,
      ) + '\n',
    );

    return { key, entry: { filename, alt } };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      `  [warn] failed for "${item.name}" (${legSlug}:${key}): ${msg}\n`,
    );
    return null;
  }
}

async function loadManifest(): Promise<Manifest> {
  if (!(await exists(MANIFEST_PATH))) return {};
  try {
    return JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8')) as Manifest;
  } catch {
    return {};
  }
}

async function writeManifest(manifest: Manifest): Promise<void> {
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
}

async function runHeroMode(legs: LegContent[]): Promise<void> {
  const manifest = await loadManifest();
  for (const leg of legs) {
    const query = `${leg.city} ${leg.province}`;
    process.stdout.write(`[${leg.slug}] ${query} … `);
    const entry = await fetchHeroForSlug(leg.slug, query, { force: FORCE });
    // Preserve any pre-existing `items` subtree on this leg.
    const prev = manifest[leg.slug];
    manifest[leg.slug] = {
      ...entry,
      items: prev?.items,
    };
    process.stdout.write('ok\n');
  }
  await writeManifest(manifest);
  process.stdout.write(`Wrote ${MANIFEST_PATH}\n`);
}

async function runItemsMode(legs: LegContent[]): Promise<void> {
  const manifest = await loadManifest();
  for (const leg of legs) {
    process.stdout.write(`[${leg.slug}] items …\n`);
    const flatItems: DayItem[] = leg.days.flatMap((d) => d.items);
    const photographable = flatItems.filter((it) =>
      PHOTOGRAPHABLE_KINDS.has(it.kind),
    );
    process.stdout.write(
      `  ${photographable.length} photographable item(s) of ${flatItems.length}\n`,
    );

    const prev = manifest[leg.slug] ?? {
      hero: {
        src: `/images/${leg.slug}/hero.jpg`,
        blur: `/images/${leg.slug}/hero.blur.jpg`,
        width: 0,
        height: 0,
        alt: '',
      },
      inline: [],
    };
    const items: Record<string, ManifestItem> = { ...(prev.items ?? {}) };
    const seen = new Set<string>();

    for (const item of photographable) {
      const key = kebab(item.name);
      if (seen.has(key)) {
        process.stdout.write(
          `  [note] kebab collision on "${key}" (item "${item.name}") — sharing same image\n`,
        );
        continue;
      }
      seen.add(key);

      const result = await fetchItemImage(leg.slug, leg.city, item, {
        force: FORCE,
      });
      if (result) {
        items[result.key] = result.entry;
        process.stdout.write(`  ✓ ${result.key}.jpg\n`);
      }
    }

    manifest[leg.slug] = { ...prev, items };
  }
  await writeManifest(manifest);
  process.stdout.write(`Wrote ${MANIFEST_PATH}\n`);
}

async function main(): Promise<void> {
  if (!API_KEY) {
    process.stderr.write(
      'PEXELS_API_KEY is not set. Add it to your shell env or the ' +
        'Cloudflare Pages dashboard.\n',
    );
    process.exit(1);
  }

  let legs = await discoverLegs();
  if (legs.length === 0) {
    process.stderr.write(
      'No legs discovered under src/content/itinerary/. ' +
        'Author leg .mdx files first.\n',
    );
    process.exit(1);
  }

  if (LEG_FILTER) {
    legs = legs.filter((l) => l.slug === LEG_FILTER);
    if (legs.length === 0) {
      process.stderr.write(`No leg matches --leg ${LEG_FILTER}.\n`);
      process.exit(1);
    }
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  if (ITEMS_MODE) {
    await runItemsMode(legs);
  } else {
    await runHeroMode(legs);
  }
}

const isDirectRun =
  process.argv[1] !== undefined &&
  process.argv[1].endsWith('fetch-images.ts');
if (isDirectRun) {
  main().catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`fetch-images failed: ${msg}\n`);
    process.exit(1);
  });
}
