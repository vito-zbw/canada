---
status: placeholder
target-completion: before any leg-page implementation begins
source: https://www.visitsingapore.com/travel-tips/travelling-to-singapore/itineraries/7-days-in-singapore/
---

# Visit Singapore Itinerary — Visual Deconstruction (placeholder)

**STATUS: placeholder.** This document is a stub. A full deconstruction requires capturing screenshots and measuring the live page; that work is out of scope for the initial project setup and is tracked as a future issue.

## Why this reference

CLAUDE.md names the Visit Singapore 7-day itinerary page as the visual reference for this site's editorial aesthetic. The full deconstruction will inform `docs/DESIGN.md` decisions and the leg-page component design.

## Observed elements (initial pass — refine in full deconstruction)

- Full-bleed hero image at the top with a large serif title overlay
- Breadcrumb navigation under the global nav
- Day-by-day cards in a vertical stack on mobile, two-column on desktop
- Each day card: a wide image, a day number eyebrow, a serif heading, and 3–5 bulleted activities
- Embedded mini-map per day showing the route
- Sticky day navigation (jump to Day 1, Day 2, …) on long pages
- Generous vertical rhythm: 80–120 px between major sections
- Neutral background with a single accent color for links and primary actions
- Body type is sans-serif at ~17 px with comfortable line height (≈ 1.6)
- No scroll-driven animations or parallax — content carries the design
- Footer with broad site navigation, not specific to the itinerary

## TODO — full deconstruction needs to add

- [ ] Capture screenshots at 375 / 768 / 1440 viewports and store under `reference/screenshots/`
- [ ] Section-by-section anatomy with annotated callouts
- [ ] Typography measurements: exact rem sizes, line heights, font families (use browser inspector)
- [ ] Color sampling: hex values for background, text, accent, dividers
- [ ] Spacing audit: section padding, card gutter, image margin values
- [ ] Image aspect-ratio audit (hero vs day cards vs inline)
- [ ] Interaction notes: focus styles, hover states, breadcrumb behavior
- [ ] Performance notes from a Lighthouse run (what's their LCP, CLS, INP?)
- [ ] Identify what to imitate vs. what to deliberately skip (e.g. their mega-footer is not for us)

This document graduates from "placeholder" to "complete" only when every TODO above is checked and `STATUS:` is updated to `complete`.
