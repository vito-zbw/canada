// Audit helper: lists every photographable item in /content/itinerary/ and
// reports manifest coverage. Prints three sections:
//   1. MISSING — items present in content but absent from manifest (icon
//      fallback at render time)
//   2. STALE — manifest entries whose kebab key no longer corresponds to
//      any current item in that leg
//   3. SUSPECT — items whose manifest alt looks off-topic (heuristic:
//      no significant token from the item name appears in the alt text)

import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'itinerary');
const MANIFEST_PATH = path.join(ROOT, 'public', 'images', 'manifest.json');

const PHOTOGRAPHABLE = new Set(['attraction', 'meal', 'event', 'transit', 'rest']);

function kebab(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface Item {
  name: string;
  kind: string;
  image?: string;
}

interface Leg {
  slug: string;
  items: Item[];
}

const STOPWORDS = new Set([
  'a', 'an', 'and', 'or', 'the', 'of', 'at', 'in', 'on', 'for', 'with', 'to',
  'from', 'by', 'into', 'after', 'before', 'over', 'up', 'down', 'walk',
  'morning', 'afternoon', 'evening', 'night', 'optional', 'free', 'tour',
  'visit', 'show', 'day', 'lunch', 'dinner', 'breakfast', 'arrival',
  'arrive', 'depart', 'board', 'station', 'ride', 'pickup', 'open', 'opens',
  'opening', 'go', 'into', 'time', 'hour', 'min', 'minutes', 'pm', 'am',
  'self', 'directed', 'neighborhood', 'neighbourhood', 'wander', 'recovery',
  'splurge', 'mode', 'logistics', 'block', 'closing', 'eastbound',
  'westbound', 'optional', 'taller', 'than', 'canonical', 'half', 'rate',
  'east', 'west', 'north', 'south', 'st', 'ste',
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

async function readLeg(file: string): Promise<Leg | null> {
  const raw = await fs.readFile(file, 'utf8');
  const data = matter(raw).data as {
    id?: string;
    days?: Array<{ items?: Array<Partial<Item>> }>;
  };
  if (!data.id) return null;
  const items: Item[] = [];
  for (const d of data.days ?? []) {
    for (const it of d.items ?? []) {
      if (
        typeof it.name === 'string' &&
        typeof it.kind === 'string' &&
        PHOTOGRAPHABLE.has(it.kind)
      ) {
        items.push({ name: it.name, kind: it.kind, image: it.image });
      }
    }
  }
  return { slug: data.id, items };
}

async function main(): Promise<void> {
  const files = (await fs.readdir(CONTENT_DIR)).filter(
    (f) => f.endsWith('.md') || f.endsWith('.mdx'),
  );
  const legs: Leg[] = [];
  for (const f of files) {
    const leg = await readLeg(path.join(CONTENT_DIR, f));
    if (leg) legs.push(leg);
  }
  const manifest = JSON.parse(
    await fs.readFile(MANIFEST_PATH, 'utf8'),
  ) as Record<string, { items?: Record<string, { filename: string; alt: string }> }>;

  const missing: Array<{ leg: string; key: string; name: string }> = [];
  const stale: Array<{ leg: string; key: string; alt: string }> = [];
  const suspect: Array<{ leg: string; key: string; name: string; alt: string }> = [];

  for (const leg of legs) {
    const manifestKeys = new Set(Object.keys(manifest[leg.slug]?.items ?? {}));
    const contentKeys = new Set<string>();
    for (const item of leg.items) {
      if (item.image) continue; // explicit override — not manifest-driven
      const key = kebab(item.name);
      if (!key) continue;
      contentKeys.add(key);
      if (!manifestKeys.has(key)) {
        missing.push({ leg: leg.slug, key, name: item.name });
      } else {
        const alt = manifest[leg.slug]!.items![key]!.alt;
        const nameTokens = tokens(item.name);
        const altLower = alt.toLowerCase();
        const hasOverlap = nameTokens.some((t) => altLower.includes(t));
        if (!hasOverlap && nameTokens.length >= 1) {
          suspect.push({ leg: leg.slug, key, name: item.name, alt });
        }
      }
    }
    for (const key of manifestKeys) {
      if (!contentKeys.has(key)) {
        stale.push({
          leg: leg.slug,
          key,
          alt: manifest[leg.slug]!.items![key]!.alt,
        });
      }
    }
  }

  process.stdout.write(`\n=== MISSING (${missing.length}) — show icon fallback ===\n`);
  for (const m of missing) {
    process.stdout.write(`  ${m.leg}/${m.key}   ← "${m.name}"\n`);
  }
  process.stdout.write(`\n=== STALE (${stale.length}) — manifest has entry but no item ===\n`);
  for (const s of stale) {
    process.stdout.write(`  ${s.leg}/${s.key}\n`);
  }
  process.stdout.write(`\n=== SUSPECT (${suspect.length}) — name tokens not in alt ===\n`);
  for (const s of suspect) {
    process.stdout.write(`  ${s.leg}/${s.key}\n     name: "${s.name}"\n     alt:  "${s.alt}"\n`);
  }
}

main().catch((err) => {
  process.stderr.write(
    `audit failed: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});
