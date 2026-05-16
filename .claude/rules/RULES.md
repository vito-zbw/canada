# Hard Rules

This file is the **authoritative** list of must-follow and must-not rules for this project. Every rule maps to a directive in `CLAUDE.md`. When a skill, doc, or commit message references a rule, it refers to one of the rules below by its anchor.

If CLAUDE.md and this file disagree, **CLAUDE.md wins** and this file must be updated to match — never the other way around.

---

## R1. MUST NOT begin coding from a vague request

**Rule:** No code is written until the work is captured in a groomed issue file at `/issues/NNN-*.md` (per the `feature-grooming` skill).

**Why:** LLM implementation reliability collapses when a single attempt has to hold the codebase, design system, and several loosely related changes at once. Grooming first bounds the scope to one focused change.

**How to apply:** If the user asks for "build X" or any multi-faceted change without referencing an issue path, invoke `.claude/skills/feature-grooming/SKILL.md` and stop. Grooming and building are separate turns unless the user explicitly overrides.

---

## R2. MUST be mobile-first responsive

**Rule:** Every page and component is designed at 375 px first, then scaled up to 768 px and 1440 px. No horizontal scroll at any of those viewports.

**Why:** This site is primarily an on-trip reference — phones first, desktops second. Designing desktop-first and squeezing for mobile produces brittle layouts.

**How to apply:** Default Tailwind utilities target mobile. Use `md:` / `lg:` / `xl:` prefixes for progressive enhancement. Verify at 375 / 768 / 1440 before declaring a page done.

---

## R3. MUST meet WCAG 2.1 AA

**Rule:** Semantic HTML, alt text on every image, every interactive element keyboard-focusable, contrast ratios ≥ 4.5:1 for normal text and ≥ 3:1 for large text.

**Why:** Accessibility is the cheapest quality bar to hit at build time and the most expensive to retrofit. Also a CLAUDE.md quality bar (zero axe-core violations).

**How to apply:** Run axe-core (or equivalent) against every rendered page before commit. No raw `<div>` where `<button>`, `<nav>`, `<main>`, `<article>`, or `<section>` is correct.

---

## R4. MUST keep itinerary content in /content/ only

**Rule:** Trip facts — cities, dates, costs, prose — live only under `/content/`. Components, layouts, and configs must not contain hard-coded trip details.

**Why:** Editing prose by changing component code couples editorial work to engineering. The content-model boundary is what makes the site editable without touching `.astro` files.

**How to apply:** When tempted to inline a date, city name, or paragraph, stop and add the field to the content schema instead. Routes pull from `getCollection('itinerary')`, never from constants.

---

## R5. MUST NOT invent itinerary content

**Rule:** Never fabricate trip facts. If a value is missing, ask the user.

**Why:** This is a personal itinerary. Inventing a flight time, cost, or address creates a false record that may be acted on. Hallucinated content here has real-world consequences.

**How to apply:** If implementing requires a field not present in the source markdown or content schema, stop and surface the question. Do not infer plausible values from context.

---

## R6. MUST NOT ship client-side JavaScript unless an interaction genuinely requires it

**Rule:** Astro components are static by default. `client:` directives are only added for genuinely interactive elements (e.g. a map, an interactive checklist), not for animations or hover effects.

**Why:** This site's value is content. JS payload hurts mobile performance (CLAUDE.md targets Lighthouse ≥ 95) and offline behavior. Most interactivity can be CSS-only.

**How to apply:** Default to no `client:*` directive. If reaching for one, first ask "could this be CSS, or pure HTML?" Document the choice in `docs/DECISIONS.md` when adding a client-side island.

---

## R7. MUST NOT add a dependency without logging it in docs/DECISIONS.md

**Rule:** Every new entry in `package.json` `dependencies` or `devDependencies` is accompanied by a dated entry in `docs/DECISIONS.md` with the one-sentence rationale and at least one alternative considered.

**Why:** Dependencies are a long-term liability. The log forces a moment of thought and creates a paper trail when something needs to be removed later.

**How to apply:** Stage the `package.json` change and the `DECISIONS.md` change in the same commit. PRs that touch `package.json` without `DECISIONS.md` are incomplete.
