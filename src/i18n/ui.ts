// Locale-keyed UI strings + a tiny useTranslations() helper. Every key under
// `en` must exist under `zh`. Per R5, no Chinese label is invented here —
// values pending the user's review carry `TODO_ZH` and are filled in a
// follow-up turn. The two `toggle.*` keys are abbreviations / the Chinese
// language name, intentionally identical across locales.

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const ui = {
  en: {
    'nav.brand': 'Cross-Canada 2026',
    'nav.preTrip': 'Pre-trip',
    'nav.ariaLabel': 'Cross-Canada trip legs',
    'base.skipToContent': 'Skip to content',
    'base.siteTitle': 'Cross-Canada Solo Trip 2026',
    'footer.tagline': 'A personal record, made carefully.',
    'home.metaTitle': 'Cross-Canada Solo Trip 2026',
    'home.metaDescription':
      'Vancouver → Toronto, July 1 – August 23, 2026. The working reference for a seven-week cross-Canada itinerary.',
    'home.heroTitle': 'Cross-Canada Solo Trip 2026',
    'home.heroEyebrow': 'July 1 – August 23, 2026',
    'home.heroSubtitle':
      'Vancouver to Toronto, {nights} nights, {stops} stops, one continent.',
    'home.heroAlt': "Vancouver, the trip's first leg",
    'home.atAGlance': 'Trip at a glance',
    'home.nights': 'Nights',
    'home.stops': 'Stops',
    'home.anchorEvents': 'Anchor events',
    'home.budget': 'Budget',
    'home.theRoute': 'The route',
    'home.routeMapAria': 'Route map of the cross-Canada trip',
    'home.allTenLegs': 'All ten legs',
    'leg.eyebrow': 'Leg {order} of {total}',
    'leg.metaTitle': '{city} — Cross-Canada Solo Trip 2026',
    'leg.metaDescriptionTemplate':
      'Leg {order} of 10: {city}, {province}. {nights} night{plural} from {date}.',
    'leg.heroAltTemplate': '{city}, leg {order} of the cross-Canada trip',
    'leg.previous': 'Previous leg',
    'leg.next': 'Next leg',
    'leg.localMapAria': 'Local map',
    'leg.trainInfoAria': 'Train info',
    'leg.cityMapAriaTemplate': 'City map of {city} with attractions',
    'leg.routeMapAriaTemplate': 'Route map for {city}',
    'leg.tripNavAria': 'Trip navigation',
    'pretrip.eyebrow': 'Before the trip',
    'pretrip.title': 'Pre-trip',
    'pretrip.metaTitle': 'Pre-trip — Cross-Canada Solo Trip 2026',
    'pretrip.metaDescription':
      'Pre-trip checklist: study permit, connectivity, banking, student discounts, packing. Tick items as they are done; new items added here persist on this device.',
    'pretrip.counterTemplate': 'of {total} done',
    'pretrip.counterSrLabel': 'Counter hydrates after load —',
    'pretrip.emptyState': 'No pre-trip topics yet.',
    'notFound.metaTitle': 'Off the route — Cross-Canada Solo Trip 2026',
    'notFound.metaDescription':
      'That page is not part of the trip. Try one of the ten legs.',
    'notFound.eyebrow': '404',
    'notFound.heading': 'Off the route.',
    'notFound.body':
      'That page is not part of the trip. Try one of the ten legs — or head back to the start.',
    'notFound.cta': 'Back to the homepage →',
    'toggle.en': 'EN',
    'toggle.zh': '中文',
    'toggle.ariaLabel': 'Language',
    'toggle.missingTranslationNotice': 'Chinese translation pending.',
  },
  zh: {
    'nav.brand': 'TODO_ZH',
    'nav.preTrip': 'TODO_ZH',
    'nav.ariaLabel': 'TODO_ZH',
    'base.skipToContent': 'TODO_ZH',
    'base.siteTitle': 'TODO_ZH',
    'footer.tagline': 'TODO_ZH',
    'home.metaTitle': 'TODO_ZH',
    'home.metaDescription': 'TODO_ZH',
    'home.heroTitle': 'TODO_ZH',
    'home.heroEyebrow': 'TODO_ZH',
    'home.heroSubtitle': 'TODO_ZH',
    'home.heroAlt': 'TODO_ZH',
    'home.atAGlance': 'TODO_ZH',
    'home.nights': 'TODO_ZH',
    'home.stops': 'TODO_ZH',
    'home.anchorEvents': 'TODO_ZH',
    'home.budget': 'TODO_ZH',
    'home.theRoute': 'TODO_ZH',
    'home.routeMapAria': 'TODO_ZH',
    'home.allTenLegs': 'TODO_ZH',
    'leg.eyebrow': 'TODO_ZH',
    'leg.metaTitle': 'TODO_ZH',
    'leg.metaDescriptionTemplate': 'TODO_ZH',
    'leg.heroAltTemplate': 'TODO_ZH',
    'leg.previous': 'TODO_ZH',
    'leg.next': 'TODO_ZH',
    'leg.localMapAria': 'TODO_ZH',
    'leg.trainInfoAria': 'TODO_ZH',
    'leg.cityMapAriaTemplate': 'TODO_ZH',
    'leg.routeMapAriaTemplate': 'TODO_ZH',
    'leg.tripNavAria': 'TODO_ZH',
    'pretrip.eyebrow': 'TODO_ZH',
    'pretrip.title': 'TODO_ZH',
    'pretrip.metaTitle': 'TODO_ZH',
    'pretrip.metaDescription': 'TODO_ZH',
    'pretrip.counterTemplate': 'TODO_ZH',
    'pretrip.counterSrLabel': 'TODO_ZH',
    'pretrip.emptyState': 'TODO_ZH',
    'notFound.metaTitle': 'TODO_ZH',
    'notFound.metaDescription': 'TODO_ZH',
    'notFound.eyebrow': '404',
    'notFound.heading': 'TODO_ZH',
    'notFound.body': 'TODO_ZH',
    'notFound.cta': 'TODO_ZH',
    'toggle.en': 'EN',
    'toggle.zh': '中文',
    'toggle.ariaLabel': 'TODO_ZH',
    'toggle.missingTranslationNotice': 'TODO_ZH',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof ui)['en'];

export function useTranslations(locale: Locale) {
  return function t(
    key: UIKey,
    vars?: Record<string, string | number>,
  ): string {
    let value =
      (ui[locale][key] as string | undefined) ??
      (ui[defaultLocale][key] as string);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        value = value.replaceAll(`{${k}}`, String(v));
      }
    }
    return value;
  };
}
