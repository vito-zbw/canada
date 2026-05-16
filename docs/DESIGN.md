# Visual Design

Read this when touching styling, typography, color, spacing, or anything visual. These tokens drive `tailwind.config.mjs` — when DESIGN.md and the Tailwind config disagree, **DESIGN.md wins** and the config follows.

Reference aesthetic: editorial / long-form travel magazine. Specific pattern source: Visit Singapore 7-day itinerary (deconstruction at `reference/visitsingapore-deconstructed.md`).

## Aesthetic principles

1. **Generous whitespace.** Vertical rhythm is more important than horizontal density. Default to `space-y-` and large section padding.
2. **Editorial typography.** Serif display for hierarchy, clean sans-serif for body. Large display sizes — this is a magazine, not a dashboard.
3. **Full-bleed imagery.** Hero and section images extend edge-to-edge on mobile, contained at desktop with generous gutters.
4. **One accent, lots of neutrals.** Warm-neutral base; a single deep-forest accent for action and emphasis. Never two accents competing.
5. **Trust the content.** No decorative chrome, no gradients on UI, no shadows on cards. Type and image carry the design.

## Color palette

Tailwind `stone` is the neutral base (warm gray, paper-like). The accent is a deep forest green chosen to evoke Canadian wilderness without being on-the-nose.

| Token | Hex | Use |
|---|---|---|
| `stone-50` | `#FAFAF9` | Page background |
| `stone-100` | `#F5F5F4` | Card/section panels |
| `stone-200` | `#E7E5E4` | Rules, dividers |
| `stone-500` | `#78716C` | Muted text (captions, metadata) |
| `stone-700` | `#44403C` | Secondary body text |
| `stone-900` | `#1C1917` | Primary body text, headings |
| `forest-700` | `#1F3D2B` | Primary accent — links, primary action, key emphasis |
| `forest-900` | `#13251A` | Hover/active on accent |
| `forest-50` | `#EEF4F0` | Accent surface (e.g. anchor-event callout) |

Contrast: `stone-900` on `stone-50` is ≈ 19:1 (AAA). `forest-700` on `stone-50` is ≈ 9:1 (AAA).

## Typography

### Font families

System stacks — no web font network cost in v1. Revisit when the site has photos and we're confident the perf budget can absorb a webfont.

- **Display / headings:** `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`
- **Body / UI:** `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Mono (rare; metadata, codes):** `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`

### Type scale

| Token | rem | px (≈) | Line height | Use |
|---|---|---|---|---|
| `display` | `4rem` | 64 | 1.05 | Hero title |
| `h1` | `2.75rem` | 44 | 1.1 | Page title |
| `h2` | `2rem` | 32 | 1.15 | Section title |
| `h3` | `1.375rem` | 22 | 1.25 | Subsection |
| `lead` | `1.25rem` | 20 | 1.5 | Intro paragraph below H1 |
| `body` | `1.0625rem` | 17 | 1.65 | Default paragraph |
| `meta` | `0.875rem` | 14 | 1.4 | Captions, dates, costs |

Body line length: target ~70 characters per line (`max-w-[68ch]`) at all breakpoints above mobile.

## Spacing rhythm

Base unit: 8 px (Tailwind's default 1 ≈ 0.25 rem = 4 px; so Tailwind 2 = 8 px).

Custom extensions beyond Tailwind's default scale, for editorial section breaks:

| Token | rem | px |
|---|---|---|
| `18` | `4.5rem` | 72 |
| `22` | `5.5rem` | 88 |
| `30` | `7.5rem` | 120 |
| `40` | `10rem` | 160 |

Use these for vertical section gaps (`my-22`, `py-30`), not for component-internal padding.

## Breakpoints

Mobile-first. Per `CLAUDE.md` quality bar, designs must verify at 375 / 768 / 1440.

| Tailwind prefix | Width |
|---|---|
| (none) | 0 – 639 (mobile, design target: 375) |
| `sm` | ≥ 640 |
| `md` | ≥ 768 (tablet design target) |
| `lg` | ≥ 1024 |
| `xl` | ≥ 1280 (desktop design target ≥ 1440) |

We use Tailwind defaults — no custom breakpoints. The 1440 target falls into `xl`.

## Layout primitives

- **Page max width:** `max-w-7xl` (1280 px). Wider hurts editorial line lengths.
- **Reading column max width:** `max-w-[68ch]` (~70 chars).
- **Gutters:** `px-5` at mobile, `px-8` at `md`, `px-16` at `lg`+.
- **Section vertical gap:** `py-18` mobile, `py-22` `md`, `py-30` `lg`+.

## Imagery rules

- **Hero (top of page):** aspect ratio 4:3 on mobile, 16:9 at `md`+. Full-bleed on mobile.
- **Inline images:** aspect ratio 3:2 by default; let `<Image>` component choose width by breakpoint.
- **Blur-up required:** every image renders a low-quality placeholder while the full asset loads.
- **Alt text mandatory** (R3): descriptive, not "image of …".

## Motion

Out of scope for v1. No transitions, no parallax, no scroll-driven animation. Re-evaluate after content is in place.

---

**Token changes here cascade.** When you edit a value above, the next action is to update `tailwind.config.mjs` and search for hardcoded references in components.
