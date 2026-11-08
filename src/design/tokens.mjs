/**
 * Design tokens — Hybrid: Kahoot × Editorial.
 * Shared by the HTML build (inlined as CSS custom properties) and the PPTX build.
 * Colors are hex WITHOUT '#' for PptxGenJS; the HTML build prefixes them.
 */
export const colors = {
  primaryPurple: '46178F',
  deepPurple: '250B50',
  accent: 'FF3355',
  white: 'FFFFFF',
  lightBg: 'F6F4FA',
  darkBg: '17121F',
  secondaryText: '77717F',
  border: 'E7E2ED',
  // supporting neutrals / tints (kept within identity)
  darkText: '241B31',
  purpleTint: 'EDE6F7',
  purpleMid: '7A5BC0',
  darkSurface: '221A30',
  darkBorder: '3A2D50',
  darkMuted: 'A79EBB',
};

export const fonts = {
  headingAr: 'thmanyah sans',          // Arabic display headings
  bodyAr: 'IBM Plex Sans Arabic',      // Arabic body text
  latin: 'Inter',                      // numbers & English terms
};

export const stage = { w: 1600, h: 900 };          // HTML stage px (16:9)
export const slideIn = { w: 13.333, h: 7.5 };      // PPTX LAYOUT_WIDE inches

export const EMPTY = '—';                           // empty metric glyph
export const AWAITING_AR = 'بانتظار بيانات الاختبار الفعلي';
export const AWAITING_EN = 'Awaiting Real Test Data';
