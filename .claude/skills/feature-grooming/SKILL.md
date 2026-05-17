---
name: feature-grooming
description: Use when receiving a vague task, multi-part ask, or any request not yet captured as a groomed GitHub issue (label `groomed`). Symptoms - "build X", "add Y page", "set up Z", requests joined by "and", any task naming more than one file or component, or any work asked for without referencing an existing GitHub issue number. Decomposes work into single-attempt, single-artifact GitHub issues before any code is touched.
---

# Feature Grooming

## Overview

LLMs have a finite context window. Implementation reliability collapses when one attempt has to hold the codebase, the design system, and several loosely related changes at once. **Grooming is the discipline of cutting work down to one focused change small enough to be done correctly in a single attempt.**

A **groomed issue** is a GitHub issue (label `groomed`) that:

- Touches **one** component, function, route, config file, or content file
- Has explicit inputs, outputs, and acceptance criteria
- Lists which skills and docs to read at implementation time
- Has no "and then" coupling — every "and" is a signal to split

When work is too big for one issue but coheres as a unit, write an **epic** — a parent GitHub issue (label `epic`) with no implementation, whose body lists its child issue numbers as a task list. Each child is a regular groomed issue whose body cites `**Parent:** #N`. The epic itself is never implemented directly — only its children are. See **Epics and sub-issues** below.

**Grooming and building are separate turns.** This skill produces issues; a later turn implements one. Violating the letter of that separation violates its spirit.

## When to use

Invoke when you see any of:

- A multi-sentence feature request ("build the home page and wire the map")
- Verbs like "build / add / set up / scaffold / wire" applied to a feature, not a single line
- The word "and" connecting two distinct artifacts
- An ask that names more than one file or component
- An ask that does not reference an existing GitHub issue number (e.g. "#5", "issue 12")
- You are about to write code without a groomed issue's contents open

**Do NOT use** when:

- The user references a groomed GitHub issue by its number (e.g. "implement #5")
- The task is a single literal edit to an existing file ("fix typo on line 42")
- The user explicitly says "skip grooming"

## The flow

```dot
digraph grooming {
  rankdir=TB;
  node [shape=box, fontname="Helvetica"];
  "Raw request";
  "Multi-part?" [shape=diamond];
  "Unknowns remain?" [shape=diamond];
  "Decompose into\ncandidate issues";
  "Ask user, do not guess" [style=filled, fillcolor="#fff3cd"];
  "Each candidate\npasses scope test?" [shape=diamond];
  "Split further\n(or write as epic + children if L)";
  "Create GitHub issue\nfor each candidate";
  "Present list to user, STOP" [shape=doublecircle];

  "Raw request" -> "Multi-part?";
  "Multi-part?" -> "Decompose into\ncandidate issues" [label="yes"];
  "Multi-part?" -> "Unknowns remain?" [label="no"];
  "Decompose into\ncandidate issues" -> "Unknowns remain?";
  "Unknowns remain?" -> "Ask user, do not guess" [label="yes"];
  "Unknowns remain?" -> "Each candidate\npasses scope test?" [label="no"];
  "Ask user, do not guess" -> "Each candidate\npasses scope test?";
  "Each candidate\npasses scope test?" -> "Split further\n(or write as epic + children if L)" [label="no"];
  "Split further\n(or write as epic + children if L)" -> "Each candidate\npasses scope test?";
  "Each candidate\npasses scope test?" -> "Create GitHub issue\nfor each candidate" [label="yes"];
  "Create GitHub issue\nfor each candidate" -> "Present list to user, STOP";
}
```

## Scope test

Every issue must satisfy **all** of these. If any check fails, split or clarify and re-check.

| Check | Pass criterion |
|---|---|
| Single artifact | Touches at most one of: one component, one page route, one function, one config file, one content file |
| File count | Changes ≤ 3 files total (primary + at most one wiring import + one styles or test file) |
| No conjunctive scope | The goal sentence contains no "and" / "then" / "also" connecting distinct artifacts |
| Concrete acceptance | 3–7 acceptance bullets, each independently verifiable by reading rendered HTML, running `npm run check`, or running `npm run build` |
| No open research | Every input value, path, and dependency is named explicitly. No "figure out X" sub-tasks |
| Estimated size ≤ M | See sizing table below; anything L re-decomposes |

## Sizing heuristic

| Size | New/changed lines | Files | Decision |
|---|---|---|---|
| S | ≤ 50 | 1 | Groom and go |
| M | ≤ 150 | 2–3 | Groom and go |
| L | > 150 or 4+ files | — | **Write as an epic + child issues.** The epic groups the work; each child is a regular S/M issue whose body cites `**Parent:** #N`. |

Estimate *new or changed* lines, not total file size. When uncertain, round up. An L is always wrong as a single implementable issue — but the epic + children pattern lets you preserve the conceptual grouping.

### Decomposition triggers

Split the candidate issue (or escalate to an epic) if **any** of these is true:

| Trigger | Action |
|---|---|
| Title contains "and" / "then" / "also" connecting distinct artifacts | One issue per artifact, wire up `**Depends on:**` |
| Touches > 3 files | Group changes by layer; one issue per layer |
| Acceptance criteria balloons past 7 bullets | Two issues are hiding in one — split |
| You cannot name the props, content fields, or inputs explicitly | A spike (research) issue must come first |
| Implementation would require inventing trip facts (R5) | Stop — surface the missing values to the user |
| Estimate creeps past M | Convert to an epic + children |

## Epics and sub-issues

Some work is too big for one issue but coheres as a unit — a multi-file feature, a templated bulk creation, a UI surface with several independent pieces. Use an **epic** to group it.

An epic is a GitHub issue labeled `epic` (no `size:S` / `size:M` label). It does not get implemented directly. Its body lists its child issues as a GitHub task list (`- [ ] #N — summary`) — GitHub auto-renders these with checkboxes and creates a "Tracked by" backlink on each child. Each child is a regular groomed issue whose body cites `**Parent:** #N`.

**Use an epic when:**

- The work naturally splits into ≥ 3 child issues
- The children share enough context that bundling the explanation in one place avoids repetition
- You want a single "is this done?" checkbox to track the group

**Do NOT use an epic when:**

- 1–2 issues would suffice — just write them with explicit `**Depends on:** #N` cross-refs in the bodies
- The "grouping" is just coincidence (different work that happens to land in the same week)
- You are tempted to put implementation steps in the epic body. Implementation lives in children. Epic bodies only describe and list.

**Epic body must include:**

- A `## Children` section: GitHub task list of child issue numbers (`- [ ] #N — summary`)
- `## Acceptance`: "all children completed" — no other criteria belong on the epic
- `## Out of scope`: anything not picked up by any child

Children remain subject to **all** scope-test rules. The epic absorbs the conceptual grouping; each child is still a single-artifact, single-attempt S/M issue.

### Epic creation

```bash
gh issue create \
  --repo <owner>/<repo> \
  --title "<imperative phrase, ≤ 70 chars>" \
  --label "epic" \
  --body "$(cat <<'EOF'
**Depends on:** #N, #M    <!-- omit line entirely if no deps -->

## Why
<1–2 sentences of motivation.>

## Children
- [ ] #N — <one-line summary>
- [ ] #N — <one-line summary>
- [ ] #N — <one-line summary>

## Acceptance
All listed children completed. No implementation work happens at the epic level.

## Out of scope
<Bulleted list of work intentionally not picked up by any child.>

## Notes
<Optional. Why this is an epic vs. a single issue.>
EOF
)"
```

When the children don't yet exist (you're creating the epic before its children), use placeholder lines (`- [ ] (pending) — summary`) and patch the body with `gh issue edit <epic#> --body-file -` once the children have numbers.

## Issue creation

Create one GitHub issue per candidate. Title is imperative, ≤ 70 chars. Apply labels:

- `groomed` (always — marks the issue as passed the scope test)
- `size:S` or `size:M` (one or the other)

Body starts with a metadata block (omit a line entirely if the field is empty), then the standard sections. **Optional sections** below (`## Files`, `## Signatures`, `## Test plan`) may be omitted only when truly inapplicable — see the per-section guidance.

```bash
gh issue create \
  --repo <owner>/<repo> \
  --title "<imperative phrase, ≤ 70 chars>" \
  --label "groomed,size:S" \
  --body "$(cat <<'EOF'
**Touches:** `<single file path or component name>`
**Parent:** #N                                       <!-- omit if not a child -->
**Depends on:** #N, #M                               <!-- omit if no deps -->
**Skills:** .claude/skills/<name>/SKILL.md, ...      <!-- omit if none -->
**Docs:** docs/<NAME>.md, ...                        <!-- omit if none -->

## Why
<1–2 sentences. Tie back to a CLAUDE.md goal, a design reference, or a hard rule.>

## Inputs
<Every piece of information the implementer needs. Be explicit:
- Prop signatures, TypeScript types, defaults
- Content collection entries and frontmatter fields
- API endpoints and expected response shapes
- Exact file paths to read
- Exact values, URLs, environment variable names>

## Files
<Include when the issue touches more than one file. One row per file. Action is Create | Modify | Delete.>

| File | Action | Purpose |
|---|---|---|
| `src/components/Foo.astro` | Create | <one-line reason> |
| `src/pages/index.astro` | Modify | <one-line reason> |

## Signatures
<Include for new components, functions, content schemas, or manifest shapes. Paste the literal TypeScript / JSON so the implementer cannot invent a different shape. Omit only when the issue produces no API surface (e.g. a config-only change).>

```ts
export interface FooProps {
  imageSlug: string;
  title: string;
  eyebrow?: string;
}
```

## Output
<Concrete description of the artifact when the issue is done. One paragraph max.>

## Acceptance criteria
- [ ] <Independently verifiable. E.g. "renders at /legs/vancouver">
- [ ] <E.g. "passes `npm run check` with no errors">
- [ ] <E.g. "matches mobile layout in reference/visitsingapore-deconstructed.md §3">
- [ ] <E.g. "no axe-core violations on the rendered page">
- [ ] <E.g. "image uses <Image> component, not raw <img>">

## Test plan
<Required for any issue with behavioral logic — fetchers, scripts, conditional rendering, dynamic routes, build-time generators. Each scenario names the input, the expected observable, and how to verify.>

- **Happy path:** <input / state> → <observable> (verify via <method>)
- **Error case:** <input / state> → <observable> (verify via <method>)
- **Edge case:** <input / state> → <observable> (verify via <method>)

<For pure static-render issues without conditional logic (a Hero, a 404, a `robots.txt`), replace the scenarios above with a viewport check list:>

- [ ] 375 px viewport — no horizontal scroll, layout coherent (R2)
- [ ] 768 px viewport — stacked / sided per design
- [ ] 1440 px viewport — desktop alignment matches reference

## Verification
<Exact shell commands the implementer runs before marking the issue done. Always include `npm run check && npm run build`. Add issue-specific commands underneath.>

```bash
npm run check && npm run build
# plus issue-specific (delete what does not apply):
npm run dev              # then open http://localhost:4321/<route> in browser
npx @axe-core/cli http://localhost:4321/<route>
npx tsx scripts/<thing>.ts
```

## Out of scope
<Bulleted list. Anything tempting to include but deferred. Cite the issue that picks it up if one exists.>

## Notes / Gotchas
<Risks, edge cases, alternate approaches considered. Surface rule reminders here when relevant:
- R5: "ask the user for <missing copy>, do not invent"
- R6: "no `client:` directive — animation is CSS-only"
- R7: "if adding <dep>, log in docs/DECISIONS.md">
EOF
)"
```

### Writing implementation-ready acceptance criteria

The acceptance criteria are the contract the implementer is held to. Vague predicates produce vague code. Replace mood with measurable observables:

| Vague (do not write) | Precise (write this) |
|---|---|
| "Make the hero look nice" | "Render `<Hero>` with `imageSlug='vancouver'`, `title=entry.data.city`, dark gradient overlay, serif title at the `text-display` token" |
| "Handle the empty case" | "If `getCollection('itinerary')` returns `[]`, render the layout with a single `<p>No legs yet.</p>` inside `<main>`" |
| "Add tests" / "Add appropriate tests" | Enumerate in `## Test plan`: happy path slug exists, missing slug returns 404, manifest entry without `alt` renders an empty `alt` attribute |
| "Use the right colors" | "Use `bg-forest-700` for the accent, `text-stone-50` for hero text — see `docs/DESIGN.md` § Color tokens" |
| "Should be accessible" | "Title rendered as `<h1>`; contrast ≥ 4.5:1 on overlay; axe-core: zero violations on `/legs/vancouver`" |
| "Pass the build" | "`npm run check` clean; `npm run build` completes with no warnings" |

## How to decompose a multi-part ask

1. **List artifacts.** Write down every distinct component, page, function, config file, or content file the request implies. One artifact per line.
2. **One issue per artifact.** Each line becomes a candidate issue.
3. **Order by dependency.** Foundation work (configs, layouts, schemas, shared types) before leaves (specific pages, specific content). Each issue's `**Depends on:**` must point only to already-existing or already-planned predecessors.
4. **Apply the scope test to each candidate.** If any is L, recurse: split that one and re-order.
5. **Surface unknowns.** Every input you cannot fill from `CLAUDE.md`, `docs/`, or `content/` becomes a question for the user. **Do not invent values** — invented values silently violate the "MUST NOT invent itinerary content" rule.

## Filling the Skills metadata

Use the routing table in `CLAUDE.md` ("Skill routing"). The implementer will load only the skills you list, so omissions hurt and over-listing wastes context. Typical pairings:

| Issue type | Skills to list |
|---|---|
| New component | `component-patterns`, `design-system`, plus `responsive-layout` if it has a layout |
| New page route | `content-rendering`, `component-patterns`, plus `image-handling` if it renders images |
| Image fetcher / cache | `image-handling` |
| Tailwind config / tokens | `design-system` |
| Content file (markdown/MDX) | `content-rendering` |
| Accessibility fix | `accessibility` |

## Common mistakes

| Mistake | Fix |
|---|---|
| Title hides a conjunction ("Add hero **and** intro") | Split into two issues with explicit `**Depends on:** #N` cross-refs |
| Acceptance is vague ("looks good", "matches design") | Replace with measurable predicates: viewport size, axe pass, file produced, page renders |
| Inputs say "use reasonable defaults" | Either name the defaults explicitly or ask the user |
| `**Touches:**` line lists multiple paths | Convert to an epic (label `epic`, no `**Touches:**`, no size label) and split into child issues whose bodies cite `**Parent:** #N` |
| Skill creates issues then continues to implement | Re-read the Stop condition below. Stop. Hand back to the user. |
| One issue depends on something you haven't groomed yet | Groom the prerequisite first; never write `**Depends on:** ???` |
| "Tests will be added during implementation" | Enumerate the scenarios in `## Test plan` now — happy / error / edge — or replace with a viewport check list |
| `## Verification` is missing or says "it works" | List the exact shell commands. At minimum `npm run check && npm run build`. |
| `## Inputs` says "see the design doc" | Paste the prop types / content fields / endpoints inline. The implementer should not have to context-switch to start. |
| Component issue with no prop signature | Add a `## Signatures` block with a literal TypeScript interface |
| Multi-file issue with no Files table | Add a `## Files` table with `File / Action / Purpose` rows |
| Acceptance criteria mention "appropriate tests" | "Appropriate" is mood, not predicate. Replace with named scenarios. |

## Red flags — STOP and re-groom

You are about to violate the discipline if you catch yourself thinking:

- "I'll do this small extra thing while I'm in the file"
- "It's faster to bundle these two"
- "The acceptance criteria are obvious — I'll skip them"
- "I'll figure out the prop shape during implementation"
- "This is technically one feature so it's one issue"
- "I'll guess the missing value; the user will correct me if it's wrong"

Each one means: stop, split, name the value, or ask.

## Pre-flight checklist

Run this against every candidate before calling `gh issue create`. If any check fails, fix the issue body first.

- [ ] Title is imperative, ≤ 70 chars, no trailing punctuation, no embedded conjunctions
- [ ] `**Touches:**` lists exactly one artifact (or there is no `**Touches:**` line because this is an epic)
- [ ] Every `**Depends on:**` cites a real issue number or an already-planned predecessor in this grooming pass
- [ ] `## Inputs` names every value, path, prop, type, env var, and endpoint — no "use a reasonable default", no "see the design"
- [ ] `## Signatures` is present whenever the issue produces a typed surface (component props, function signature, content schema, manifest shape)
- [ ] `## Files` is present whenever the issue touches > 1 file
- [ ] `## Acceptance criteria` has 3–7 bullets, each independently verifiable
- [ ] `## Test plan` enumerates named scenarios (happy/error/edge) OR a viewport check list — never "add tests"
- [ ] `## Verification` lists exact shell commands, beginning with `npm run check && npm run build`
- [ ] No invented trip facts (R5). Missing facts are surfaced to the user, not guessed.
- [ ] Sizing label (`size:S` or `size:M`) matches the estimate from the sizing table
- [ ] Skills listed match the skill-routing table in `CLAUDE.md`
- [ ] Out-of-scope list explicitly defers anything tempting but adjacent

## Stop condition

The skill ends by:

1. Creating each groomed GitHub issue via `gh issue create` (with the correct labels and metadata-prefixed body).
2. For epics, editing the epic body via `gh issue edit <epic#> --body-file -` after children exist, so the `## Children` task list cites real `#N` numbers.
3. Printing a numbered list of issue URLs back to the user. Indent children beneath their epic. For each line include the one-line summary and either the `size:S` / `size:M` label (regular issues) or `epic` (for epics), plus `Parent` / `Depends on` cross-refs where set.
4. **Not** invoking any implementation skill. **Not** editing any file in the repo. **Not** running `npm` commands. **Not** scaffolding directories the issues will later create.

The user's next turn picks one issue by number (e.g. "implement #5") and asks for it to be implemented.
