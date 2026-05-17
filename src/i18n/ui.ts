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
    'nav.brand': '加拿大横贯之旅 2026',
    'nav.preTrip': '行前准备',
    'nav.ariaLabel': '加拿大横贯之旅各段',
    'base.skipToContent': '跳到正文',
    'base.siteTitle': '加拿大横贯独行之旅 2026',
    'footer.tagline': '一份用心整理的私人记录。',
    'home.metaTitle': '加拿大横贯独行之旅 2026',
    'home.metaDescription':
      '温哥华 → 多伦多,2026 年 7 月 1 日至 8 月 23 日。一段为期七周的横贯加拿大行程的工作参考。',
    'home.heroTitle': '加拿大横贯独行之旅 2026',
    'home.heroEyebrow': '2026 年 7 月 1 日 – 8 月 23 日',
    'home.heroSubtitle':
      '温哥华到多伦多,{nights} 晚,{stops} 站,横跨一片大陆。',
    'home.heroAlt': '温哥华,本次旅程的第一站',
    'home.atAGlance': '行程一览',
    'home.nights': '住宿晚数',
    'home.stops': '城市站点',
    'home.anchorEvents': '重头活动',
    'home.budget': '预算',
    'home.theRoute': '路线',
    'home.routeMapAria': '加拿大横贯之旅路线图',
    'home.allTenLegs': '十段全程',
    'leg.eyebrow': '第 {order} 段 / 共 {total} 段',
    'leg.metaTitle': '{city} — 加拿大横贯独行之旅 2026',
    'leg.metaDescriptionTemplate':
      '第 {order} 段(共 10 段):{city},{province}。自 {date} 起住 {nights} 晚。',
    'leg.heroAltTemplate': '{city},加拿大横贯之旅的第 {order} 段',
    'leg.previous': '上一段',
    'leg.next': '下一段',
    'leg.localMapAria': '本地地图',
    'leg.trainInfoAria': '列车信息',
    'leg.cityMapAriaTemplate': '{city} 城市地图与景点标注',
    'leg.routeMapAriaTemplate': '{city} 路线地图',
    'leg.tripNavAria': '行程导航',
    'pretrip.eyebrow': '出发之前',
    'pretrip.title': '行前准备',
    'pretrip.metaTitle': '行前准备 — 加拿大横贯独行之旅 2026',
    'pretrip.metaDescription':
      '行前清单:学签、通讯、银行、学生折扣、行李打包。完成的项目逐项勾选;本设备新增项目会被保留。',
    'pretrip.counterTemplate': '已完成,共 {total} 项',
    'pretrip.counterSrLabel': '计数器在加载后自动更新 —',
    'pretrip.emptyState': '暂无行前准备主题。',
    'notFound.metaTitle': '偏离路线 — 加拿大横贯独行之旅 2026',
    'notFound.metaDescription': '该页面不属于本次旅程。请试试十段中的某一段。',
    'notFound.eyebrow': '404',
    'notFound.heading': '偏离了路线。',
    'notFound.body':
      '该页面不属于本次旅程。请试试十段中的某一段,或回到首页。',
    'notFound.cta': '返回首页 →',
    'toggle.en': 'EN',
    'toggle.zh': '中文',
    'toggle.ariaLabel': '语言',
    'toggle.missingTranslationNotice': '中文翻译尚未补齐。',
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
