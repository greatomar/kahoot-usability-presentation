#!/usr/bin/env node
/**
 * PPTX builder — mirrors the final 12-slide HTML deck with native, editable elements.
 * Single source of truth: data/*.json via computeMetrics().
 */
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { colors as C, fonts as F, EMPTY } from '../src/design/tokens.mjs';
import { computeMetrics } from './compute-metrics.mjs';

const require = createRequire(import.meta.url);
const pptxgen = require('pptxgenjs');
const { warnIfSlideHasOverlaps, warnIfSlideElementsOutOfBounds } = require('../pptx/pptxgenjs_helpers/layout.js');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOGO = {
  wordmarkWhite: join(root, 'assets/logos/kahoot-wordmark-white.png'),
  wordmarkPurple: join(root, 'assets/logos/kahoot-wordmark-purple.png'),
  iconMutedLight: join(root, 'assets/logos/kahoot-icon-muted-light.png'),
  iconMutedDark: join(root, 'assets/logos/kahoot-icon-muted-dark.png'),
};
const SHOT = (name) => join(root, 'assets/screenshots', name);

const m = computeMetrics();
const pptx = new pptxgen();
pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'WIDE';
pptx.author = 'HCI Project Team';
pptx.title = 'Usability Testing of Kahoot Android Application';
pptx.theme = { headFontFace: F.headingAr, bodyFontFace: F.bodyAr, lang: 'ar-SA' };

/* ---------------- primitives ---------------- */
const M = 0.67;
const W = 13.333, H = 7.5;
const CW = W - 2 * M;

const rect = (s, x, y, w, h, fill, opts = {}) =>
  s.addShape('rect', { x, y, w, h, fill: { color: fill }, line: { type: 'none' }, ...opts });
const rrect = (s, x, y, w, h, fill, line, radius = 0.12) =>
  s.addShape('roundRect', { x, y, w, h, rectRadius: radius, fill: { color: fill }, line: line ?? { type: 'none' } });
const line = (s, x, y, w, color, opts = {}) =>
  s.addShape('line', { x, y, w, h: 0, line: { color, width: 1, ...opts } });

const t = (s, text, x, y, w, h, o = {}) =>
  s.addText(text, {
    x, y, w, h, fontFace: F.bodyAr, fontSize: 11, color: C.darkText,
    align: 'right', rtlMode: true, valign: 'top', margin: 0, ...o,
  });
const lat = (s, text, x, y, w, h, o = {}) =>
  t(s, text, x, y, w, h, { fontFace: F.latin, rtlMode: false, align: 'left', ...o });

const head = (s, kicker, title, sub, dark = false) => {
  rect(s, W - M - 0.28, 0.72, 0.28, 0.025, C.accent);
  lat(s, kicker, W - M - 5.2, 0.58, 4.9, 0.26, { fontSize: 9, bold: true, charSpacing: 1.8, color: dark ? C.darkMuted : C.primaryPurple, align: 'right' });
  t(s, title, M, 0.92, CW, 0.72, { fontFace: F.headingAr, fontSize: 30, bold: true, color: dark ? C.white : C.deepPurple });
  if (sub) t(s, sub, M, 1.65, CW, 0.45, { fontSize: 11.5, color: dark ? C.darkMuted : C.secondaryText, lineSpacingMultiple: 1.2 });
};

const foot = (s, dark = false) => {
  s.addImage({ path: dark ? LOGO.iconMutedDark : LOGO.iconMutedLight, x: W / 2 - 0.075, y: 7.115, w: 0.15, h: 0.158, altText: 'Kahoot' });
};

const add = (build) => {
  const s = pptx.addSlide();
  build(s);
  warnIfSlideHasOverlaps(s, pptx);
  warnIfSlideElementsOutOfBounds(s, pptx);
  return s;
};

const mmss = (v) => {
  if (typeof v !== 'number') return EMPTY;
  const z = Math.round(v), min = Math.floor(z / 60), sec = z % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};
const statusAr = (v) => (v === 'completed' ? 'مكتملة' : v === 'incomplete' ? 'ناقصة' : EMPTY);
const countAr = (n) => (n >= 11 ? `${n} مشاركاً` : `${n} مشاركين`);

/* ================= 01 Cover ================= */
add((s) => {
  s.background = { color: C.deepPurple };
  s.addImage({ path: LOGO.wordmarkWhite, x: W / 2 - 1.15, y: 1.35, w: 2.3, h: 0.79, altText: 'Kahoot' });
  t(s, [
    { text: 'اختبار قابلية استخدام\n', options: { fontFace: F.headingAr, fontSize: 38, bold: true, color: C.white } },
    { text: 'تطبيق ', options: { fontFace: F.headingAr, fontSize: 38, bold: true, color: C.white } },
    { text: 'Kahoot', options: { fontFace: F.latin, fontSize: 38, bold: true, color: 'B79BE8' } },
    { text: ' على Android', options: { fontFace: F.headingAr, fontSize: 38, bold: true, color: C.white } },
  ], 1.4, 2.55, W - 2.8, 1.55, { align: 'center', lineSpacingMultiple: 1.2, valign: 'middle' });
  t(s, 'دراسة اختبار قابلية الاستخدام ومقارنة بين طلاب الثانوية وطلاب المتوسط', 1.8, 4.5, W - 3.6, 0.45, { align: 'center', fontSize: 14.5, color: C.darkMuted });
  foot(s, true);
});

/* ================= 02 Inside the app ================= */
add((s) => {
  s.background = { color: C.lightBg };
  head(s, '02 · INSIDE THE APP', 'التطبيق من الداخل', 'خمس لقطات حقيقية من التطبيق على Android توضح المسارات الأساسية التي تمر بها مهام الاختبار.');
  const shots = [
    ['01-home.jpg', 'الرئيسية', 'الوصول السريع إلى المكتبة والإنشاء والاستكشاف'],
    ['02-explore.jpg', 'الاستكشاف', 'البحث عن اختبار حسب الموضوع'],
    ['05-join.jpg', 'الانضمام', 'إدخال رمز اللعبة والانضمام إلى غرفة مباشرة'],
    ['03-create.jpg', 'الإنشاء', 'إنشاء اختبار أو مسار دراسي جديد'],
    ['04-library.jpg', 'المكتبة', 'الألعاب والتقارير والمواد التعليمية'],
  ];
  const pw = 1.73, ph = 3.85, gap = 0.18;
  const totalW = 5 * pw + 4 * gap;
  for (let i = 0; i < shots.length; i++) {
    const x = (W - totalW) / 2 + (shots.length - 1 - i) * (pw + gap);
    const [file, label, desc] = shots[i];
    s.addShape('rect', { x: x - 0.015, y: 2.125, w: pw + 0.03, h: ph + 0.03, fill: { type: 'none' }, line: { color: C.border, width: 1 } });
    s.addImage({ path: SHOT(file), x, y: 2.14, w: pw, h: ph, altText: label });
    lat(s, String(i + 1).padStart(2, '0'), x, 6.04, pw, 0.18, { fontSize: 8, bold: true, color: C.accent, align: 'center', charSpacing: 1.5 });
    t(s, label, x, 6.25, pw, 0.24, { fontSize: 11.5, bold: true, color: C.deepPurple, align: 'center' });
    t(s, desc, x, 6.5, pw, 0.45, { fontSize: 7.8, color: C.secondaryText, align: 'center', lineSpacingMultiple: 1.1 });
  }
  foot(s);
});

/* ================= 03 About ================= */
add((s) => {
  s.background = { color: C.lightBg };
  rect(s, W - M - 0.28, 0.72, 0.28, 0.025, C.accent);
  lat(s, '03 · ABOUT THE APP', W - M - 5.2, 0.58, 4.9, 0.26, { fontSize: 9, bold: true, charSpacing: 1.8, color: C.primaryPurple, align: 'right' });
  t(s, 'ما هو', W - M - 1.45, 0.92, 1.45, 0.7, { fontFace: F.headingAr, fontSize: 30, bold: true, color: C.deepPurple, align: 'right' });
  s.addImage({ path: LOGO.wordmarkPurple, x: W - M - 3.55, y: 1.0, w: 2.0, h: 0.69, altText: 'Kahoot' });
  t(s, '؟', W - M - 3.9, 0.92, 0.32, 0.7, { fontFace: F.headingAr, fontSize: 30, bold: true, color: C.deepPurple, align: 'left' });

  t(s, 'منصة تعليمية تفاعلية تعتمد على الاختبارات القصيرة المصممة بأسلوب الألعاب (Game-based Learning)، ويتيح تطبيق Android إنشاء الاختبارات والبحث عنها واللعب الفردي أو الجماعي ومراجعة النتائج ومشاركة الروابط.',
    M, 1.92, CW, 0.9, { fontSize: 12.5, color: C.darkText, lineSpacingMultiple: 1.55 });

  const funcs = [
    ['01', 'البحث والاستكشاف', 'الوصول إلى اختبارات جاهزة بالبحث بالموضوع — يرتبط بالمهمتين T01 وT02.'],
    ['02', 'صفحة تفاصيل الاختبار', 'عرض العنوان وعدد الأسئلة ومعلومات الاختبار قبل اللعب — ترتبط بالمهمة T02.'],
    ['03', 'أوضاع اللعب والإجابة', 'اختيار Classic Solo وبدء الأسئلة والإجابة عنها — يرتبط بالمهمة T03.'],
    ['04', 'المكتبة والتقارير والانضمام', 'مراجعة النتائج والتقارير والانضمام إلى غرفة مباشرة — يرتبط بالمهمتين T04 وT05.'],
  ];
  const gap = 0.24, cw = (CW - gap) / 2, ch = 1.62;
  funcs.forEach(([n, ti, d], i) => {
    const x = i % 2 === 0 ? M + cw + gap : M;
    const y = i < 2 ? 3.05 : 4.85;
    rrect(s, x, y, cw, ch, C.white, { color: C.border, width: 1 }, 0.14);
    lat(s, n, x + cw - 0.62, y + 0.32, 0.45, 0.3, { fontSize: 11, bold: true, color: C.accent, align: 'center' });
    t(s, ti, x + 0.28, y + 0.28, cw - 1.0, 0.35, { fontSize: 13, bold: true, color: C.deepPurple });
    t(s, d, x + 0.28, y + 0.78, cw - 0.56, 0.62, { fontSize: 9.2, color: C.secondaryText, lineSpacingMultiple: 1.25 });
  });
  foot(s);
});

/* ================= 04 Participants ================= */
add((s) => {
  s.background = { color: C.lightBg };
  head(s, '04 · PARTICIPANTS', 'الفئتان المستهدفتان', 'مقارنة سلوك الاستخدام بين طلاب الثانوية وطلاب المتوسط، بعد تنفيذ الاختبار مع المشاركين العشرين.');
  const gap = 0.35, cw = (CW - gap) / 2, y = 2.25, ch = 4.35;
  m.groups.forEach((g, gi) => {
    const pg = m.perGroup[g.id];
    const x = gi === 0 ? M + cw + gap : M;
    rrect(s, x, y, cw, ch, C.white, { color: C.border, width: 1 }, 0.16);
    rect(s, x + 0.3, y, cw - 0.6, 0.035, gi === 0 ? C.primaryPurple : C.accent);
    lat(s, String(pg.participant_count), x + 0.35, y + 0.35, 1.0, 0.7, { fontSize: 30, bold: true, color: C.primaryPurple, align: 'center' });
    t(s, 'مشارك · ' + (g.id === 'highschool' ? 'High School Students' : 'Middle School Students'), x + 0.02, y + 1.02, 1.9, 0.25, { fontSize: 7.0, color: C.secondaryText, align: 'center' });
    t(s, g.labelAr, x + 1.7, y + 0.4, cw - 2.0, 0.5, { fontFace: F.headingAr, fontSize: 19, bold: true, color: C.deepPurple });
    t(s, g.id === 'highschool'
      ? 'مشاركون من طلاب المرحلة الثانوية، يمثلون فئة عمرية أكبر خبرةً بالاختبارات الرقمية والاستخدام اليومي للتطبيقات.'
      : 'مشاركون من طلاب المرحلة المتوسطة، يمثلون فئة أصغر سناً بأنماط استخدام وخبرات رقمية مختلفة.',
      x + 0.3, y + 1.45, cw - 0.6, 0.75, { fontSize: 10, color: C.secondaryText, lineSpacingMultiple: 1.3 });
    const facts = [
      ['الفئة العمرية', pg.age_min != null ? `${pg.age_min}–${pg.age_max}` : EMPTY],
      ['متوسط العمر', pg.avg_age ?? EMPTY],
      ['نسبة الإكمال', pg.completion_rate != null ? `${pg.completion_rate}%` : EMPTY],
      ['متوسط SUS', m.sus[g.id] ?? EMPTY],
    ];
    const fw = (cw - 0.6 - 0.3) / 2;
    facts.forEach(([k, v], i) => {
      const fx = x + 0.3 + (i % 2) * (fw + 0.3);
      const fy = y + 2.45 + Math.floor(i / 2) * 0.9;
      line(s, fx, fy, fw, C.border);
      t(s, [
        { text: k + '\n', options: { fontSize: 8.5, color: C.secondaryText } },
        { text: String(v), options: { fontFace: F.latin, fontSize: 17, bold: true, color: C.primaryPurple } },
      ], fx, fy + 0.08, fw, 0.62, { fontSize: 8.5, color: C.secondaryText });
    });
  });
  foot(s);
});

/* ================= 05 Methodology ================= */
add((s) => {
  s.background = { color: C.lightBg };
  head(s, '05 · METHODOLOGY', 'منهجية الاختبار', 'سبع خطوات متسلسلة تُطبق على كل مشارك بالطريقة نفسها لضمان قابلية المقارنة بين الفئتين.');
  const steps = [
    ['الاختبار الداخلي', 'أعضاء الفريق ينفذون المهام الخمس بأنفسهم'],
    ['الوقت المعياري', 'حساب متوسط وقت الفريق لكل مهمة'],
    ['تعريف المشارك', 'نبذة مختصرة عن التطبيق'],
    ['الاستكشاف الحر', '3–4 دقائق دون أي تدخل'],
    ['تنفيذ المهام', 'المهام الخمس بالترتيب نفسه'],
    ['المراقبة والتسجيل', 'الوقت والأخطاء وحالة الإكمال'],
    ['استبيان SUS', 'بعد انتهاء جميع المهام'],
  ];
  const sw = CW / 7, cy = 2.8;
  line(s, M + 0.35, cy + 0.26, CW - 0.7, C.border, { width: 1.5 });
  steps.forEach(([ti, d], i) => {
    const x = W - M - sw * (i + 1);
    s.addShape('ellipse', { x: x + sw / 2 - 0.26, y: cy, w: 0.52, h: 0.52, fill: { color: C.white }, line: { color: C.primaryPurple, width: 1.5 } });
    lat(s, String(i + 1), x + sw / 2 - 0.26, cy + 0.11, 0.52, 0.3, { fontSize: 13, bold: true, color: C.primaryPurple, align: 'center' });
    t(s, ti, x + 0.06, cy + 0.68, sw - 0.12, 0.55, { fontSize: 10.5, bold: true, align: 'center', lineSpacingMultiple: 1.15 });
    t(s, d, x + 0.08, cy + 1.25, sw - 0.16, 0.75, { fontSize: 8, color: C.secondaryText, align: 'center', lineSpacingMultiple: 1.2 });
  });
  rrect(s, M, 5.05, CW, 0.95, C.purpleTint, { type: 'none' }, 0.14);
  s.addShape('ellipse', { x: W - M - 0.75, y: 5.27, w: 0.5, h: 0.5, fill: { type: 'none' }, line: { color: C.primaryPurple, width: 1.75 } });
  const clockX = W - M - 0.5, clockY = 5.52;
  rect(s, clockX - 0.01, clockY - 0.13, 0.02, 0.13, C.primaryPurple);
  rect(s, clockX, clockY - 0.01, 0.1, 0.02, C.primaryPurple);
  t(s, [
    { text: 'آلية الوقت: ', options: { bold: true, color: C.primaryPurple } },
    { text: 'الوقت المعياري (Standard Time) هو متوسط أوقات أعضاء الفريق في التجربة الداخلية لكل مهمة. إذا أنهى المشارك مبكراً تُسجل المهمة مكتملة بالوقت الفعلي، وإذا انتهى الوقت دون إتمامها تُمنح مهلة إضافية ', options: {} },
    { text: '5–10 ثوانٍ', options: { bold: true, color: C.primaryPurple } },
    { text: ' تُسجل عند استخدامها، وبعدها تُسجل المهمة غير مكتملة.', options: {} },
  ], M + 0.3, 5.2, CW - 1.35, 0.7, { fontSize: 10.5, color: C.deepPurple, lineSpacingMultiple: 1.3 });
  t(s, 'ما يُسجل لكل مشارك ولكل مهمة: Participant ID · Group · Task ID · Standard Time · Actual Time · Error Count · Error Description · Completion Status · Assistance Required · Observer Notes',
    M, 6.25, CW, 0.35, { fontSize: 8.5, color: C.secondaryText, align: 'center' });
  foot(s);
});

/* ================= 06 Tasks ================= */
add((s) => {
  s.background = { color: C.lightBg };
  head(s, '06 · TESTING TASKS', 'المهام الخمس المعتمدة', 'تُنفذ المهام بالترتيب نفسه لجميع المشاركين، وكل مهمة توضح السيناريو وخطوات الإنجاز وما نقيسه.');
  const y0 = 2.05, rh = 0.9;
  m.tasks.forEach((task, i) => {
    const y = y0 + i * rh;
    line(s, M, y, CW, C.border);
    lat(s, task.task_id, W - M - 0.62, y + 0.18, 0.55, 0.32, { fontSize: 16, bold: true, color: i % 2 ? C.primaryPurple : C.purpleMid, align: 'right' });
    t(s, task.name_ar, W - M - 3.2, y + 0.1, 2.5, 0.35, { fontFace: F.headingAr, fontSize: 11.5, bold: true, color: C.deepPurple, lineSpacingMultiple: 1.05 });
    lat(s, task.name_en, W - M - 3.2, y + 0.48, 2.5, 0.2, { fontSize: 7, color: C.secondaryText, align: 'right' });
    t(s, task.scenario || task.description, 3.68, y + 0.08, 5.55, 0.28, { fontSize: 7.8, color: C.secondaryText, lineSpacingMultiple: 1.1 });
    task.steps.forEach((st, j) => {
      t(s, [
        { text: `${j + 1}. `, options: { fontFace: F.latin, fontSize: 7.1, bold: true, color: C.accent } },
        { text: st, options: { fontSize: 7.1, color: C.deepPurple } },
      ], 3.68, y + 0.36 + j * 0.18, 5.55, 0.18, { fontSize: 7.1, color: C.deepPurple, align: 'right' });
    });
    line(s, M + 2.92, y + 0.2, 0, C.accent, { width: 2 });
    t(s, 'ما نقيسه', M, y + 0.12, 2.7, 0.2, { fontSize: 7.5, color: C.secondaryText });
    t(s, task.measure, M, y + 0.36, 2.7, 0.45, { fontSize: 8.2, color: C.deepPurple, bold: true, lineSpacingMultiple: 1.15 });
  });
  line(s, M, y0 + 5 * rh, CW, C.border);
  t(s, 'ملاحظة تحقق قبل الاختبار: يجب التأكد من أن الاختبار المختار يدعم Classic Solo وأن وظائف البحث والمكتبة والانضمام متاحة في إصدار Android المستخدم.',
    M, 6.72, CW, 0.3, { fontSize: 8, color: C.secondaryText, align: 'center' });
  foot(s);
});

/* ================= 07/08 Results ================= */
const resultsSlide = (gid, kicker, title, withInsights) => add((s) => {
  s.background = { color: C.lightBg };
  const rows = m.participantResults.filter((p) => p.group === gid);
  const pg = m.perGroup[gid];
  const t4 = m.tasks.find((x) => x.task_id === 'T04');
  head(s, kicker, title, `${countAr(rows.length)} · ${rows.length * 5} محاولة · الزمن لكل مهمة وحالة الإكمال والأخطاء وSUS.`);

  const chips = [
    ['المشاركون', String(rows.length)],
    ['الإكمال', `${pg.completion_rate}%`],
    ['الأخطاء', String(pg.total_errors)],
    ['متوسط SUS', String(m.sus[gid])],
  ];
  const chipW = 1.45, chipGap = 0.12, chipY = 2.12;
  chips.forEach(([k, v], i) => {
    const x = W - M - chipW - i * (chipW + chipGap);
    rrect(s, x, chipY, chipW, 0.42, C.white, { color: C.border, width: 1 }, 0.1);
    t(s, [
      { text: k + '\n', options: { fontSize: 7.2, color: C.secondaryText } },
      { text: v, options: { fontFace: F.latin, fontSize: 10.5, bold: true, color: C.primaryPurple } },
    ], x + 0.1, chipY + 0.04, chipW - 0.2, 0.34, { fontSize: 7.2, color: C.secondaryText, align: 'center', lineSpacingMultiple: 0.9 });
  });

  const tw = CW, colW = [1.1, 1.65, 1.65, 1.65, 1.65, 1.65, 1.25, 1.4];
  const hOpt = { bold: true, color: C.white, fill: { color: C.deepPurple }, fontSize: 7.5 };
  const header = [
    { text: 'المشارك', options: hOpt },
    ...m.tasks.map((x) => ({ text: x.task_id, options: hOpt })),
    { text: 'الأخطاء', options: hOpt },
    { text: 'SUS', options: hOpt },
  ];
  const body = rows.map((p, ri) => [
    { text: p.participant_id, options: { fontFace: F.latin, bold: true, color: C.deepPurple } },
    ...p.tasks.map((x) => ({
      text: [
        { text: mmss(x.time_seconds), options: { fontFace: F.latin, bold: true, color: C.deepPurple } },
        { text: `  ${statusAr(x.completion_status)}`, options: { fontFace: F.bodyAr, fontSize: 6.5, color: x.completion_status === 'completed' ? C.primaryPurple : C.accent } },
      ],
      options: { fill: { color: x.completion_status === 'completed' ? (ri % 2 ? 'FAF9FC' : 'FFFFFF') : 'FBDDE3' } },
    })),
    { text: String(p.total_errors), options: { fontFace: F.latin, bold: true, color: p.total_errors ? C.accent : C.deepPurple } },
    { text: String(p.sus ?? EMPTY), options: { fontFace: F.latin, bold: true, color: p.sus >= 80 ? C.primaryPurple : p.sus < 60 ? C.accent : C.deepPurple } },
  ]);

  s.addTable([header, ...body], {
    x: M, y: 2.68, w: tw, colW,
    rowH: [0.3, ...Array(rows.length).fill(0.255)],
    fontFace: F.bodyAr, fontSize: 7.8, color: C.secondaryText,
    align: 'center', valign: 'middle', margin: 0.02,
    border: { type: 'solid', color: C.border, pt: 0.4 },
    fill: { color: C.white },
  });
  const noteY = withInsights ? 4.95 : 6.42;
  rrect(s, M, noteY, CW, 0.52, C.white, { color: C.border, width: 1 }, 0.1);
  rect(s, W - M - 0.04, noteY, 0.04, 0.52, C.accent);
  t(s, `${t4.groups[gid].total_errors} أخطاء في المهمة 4، ولم تكتمل المهمة 4 لدى ${t4.groups[gid].incomplete} مشارك.  متوسط SUS لهذه الفئة: ${m.sus[gid]} مقابل ${m.sus[gid === 'highschool' ? 'middle' : 'highschool']} للفئة الأخرى.`,
    M + 0.15, noteY + 0.1, CW - 0.3, 0.34, { fontSize: 8.3, color: C.secondaryText, align: 'center' });

  if (withInsights) {
    const assists = m.tasks.reduce((a, x) => a + x.groups[gid].assistance_count, 0);
    const gap = Math.round((m.sus.highschool - m.sus.middle) * 10) / 10;
    const items = [
      ['أكثر مهمة أخطاءً', `${t4.task_id} · ${t4.groups[gid].total_errors}`],
      ['طلبات المساعدة', String(assists)],
      ['فارق SUS عن الثانوية', `−${gap}`],
    ];
    const iw = (CW - 0.28) / 3;
    items.forEach(([k, v], i) => {
      const x = W - M - iw - i * (iw + 0.14);
      rrect(s, x, 5.7, iw, 0.7, C.white, { color: C.border, width: 1 }, 0.1);
      t(s, [
        { text: k + '\n', options: { fontSize: 7.5, color: C.secondaryText } },
        { text: v, options: { fontFace: F.latin, fontSize: 13, bold: true, color: C.primaryPurple } },
      ], x + 0.16, 5.8, iw - 0.32, 0.5, { fontSize: 7.5, color: C.secondaryText });
    });
  }
  foot(s);
});
resultsSlide('highschool', '07 · RESULTS — HIGH SCHOOL', 'نتائج طلاب الثانوية', false);
resultsSlide('middle', '08 · RESULTS — MIDDLE SCHOOL', 'نتائج طلاب المتوسط', true);

/* ================= 09 Analysis ================= */
add((s) => {
  s.background = { color: C.lightBg };
  head(s, '09 · ANALYSIS', 'لوحة التحليل', 'مقارنة شاملة للإكمال والأوقات والأخطاء بين طلاب الثانوية وطلاب المتوسط.');
  const done = m.perGroup.highschool.tasks_completed + m.perGroup.middle.tasks_completed;
  const total = done + m.perGroup.highschool.tasks_incomplete + m.perGroup.middle.tasks_incomplete;
  const overall = total ? Math.round((done / total) * 1000) / 10 : null;
  const slowest = [...m.tasks].map((x) => ({ x, avg: ((x.groups.highschool.avg_actual_time_seconds ?? 0) + (x.groups.middle.avg_actual_time_seconds ?? 0)) / 2 })).sort((a, b) => b.avg - a.avg)[0];
  const mostErrors = [...m.tasks].map((x) => ({ x, n: x.groups.highschool.total_errors + x.groups.middle.total_errors })).sort((a, b) => b.n - a.n)[0];
  const topErr = m.topErrorTypes[0];
  const gap = 0.2, cw = (CW - gap) / 2, ch = 2.3;
  const cards = [
    { x: M + cw + gap, y: 2.12 },
    { x: M, y: 2.12 },
    { x: M + cw + gap, y: 4.57 },
    { x: M, y: 4.57 },
  ];
  cards.forEach((c) => rrect(s, c.x, c.y, cw, ch, C.white, { color: C.border, width: 1 }, 0.16));

  // Completion card
  let c = cards[0];
  t(s, 'معدل الإكمال  Completion', c.x + 0.25, c.y + 0.18, cw - 0.5, 0.3, { fontSize: 12, bold: true, color: C.deepPurple });
  s.addChart(pptx.ChartType.doughnut, [{ name: 'Completion', labels: ['مكتملة', 'غير مكتملة'], values: [done, total - done] }], {
    x: c.x + cw - 1.75, y: c.y + 0.52, w: 1.4, h: 1.2, holeSize: 62,
    chartColors: [C.primaryPurple, C.purpleTint], showLegend: false, showTitle: false,
    showValue: false, showPercent: false, showSerName: false, showCategoryName: false,
    border: { pt: 0, color: 'FFFFFF' },
  });
  lat(s, `${overall}%`, c.x + cw - 1.75, c.y + 0.95, 1.4, 0.35, { fontSize: 15, bold: true, color: C.deepPurple, align: 'center' });
  const kpis = [['مكتملة', String(done)], ['غير مكتملة', String(total - done)], ['محاولة', String(total)]];
  kpis.forEach(([k, v], i) => {
    t(s, [
      { text: k + '\n', options: { fontSize: 8.5, color: C.secondaryText } },
      { text: v, options: { fontFace: F.latin, fontSize: 13, bold: true, color: C.primaryPurple } },
    ], c.x + 0.25, c.y + 0.55 + i * 0.45, 1.5, 0.4, { fontSize: 8.5, color: C.secondaryText });
  });
  t(s, [
    { text: 'طلاب الثانوية  ', options: { fontSize: 8, color: C.secondaryText } },
    { text: `${m.perGroup.highschool.completion_rate}%`, options: { fontFace: F.latin, fontSize: 11, bold: true, color: C.deepPurple } },
  ], c.x + 0.25, c.y + ch - 0.4, 2.3, 0.25, { fontSize: 8, color: C.secondaryText });
  t(s, [
    { text: 'طلاب المتوسط  ', options: { fontSize: 8, color: C.secondaryText } },
    { text: `${m.perGroup.middle.completion_rate}%`, options: { fontFace: F.latin, fontSize: 11, bold: true, color: C.deepPurple } },
  ], c.x + cw - 2.55, c.y + ch - 0.4, 2.3, 0.25, { fontSize: 8, color: C.secondaryText });

  // Time card
  c = cards[1];
  t(s, 'متوسط الأوقات  Seconds', c.x + 0.25, c.y + 0.18, cw - 0.5, 0.3, { fontSize: 12, bold: true, color: C.deepPurple });
  const timeRows = [
    [{ text: 'المهمة', options: { bold: true } }, { text: 'ثانوية', options: { bold: true } }, { text: 'متوسط', options: { bold: true } }],
    ...m.tasks.map((x) => [{ text: x.task_id }, { text: String(x.groups.highschool.avg_actual_time_seconds ?? EMPTY) }, { text: String(x.groups.middle.avg_actual_time_seconds ?? EMPTY) }]),
  ];
  s.addTable(timeRows, {
    x: c.x + 0.25, y: c.y + 0.5, w: cw - 0.5, colW: [(cw - 0.5) * 0.4, (cw - 0.5) * 0.3, (cw - 0.5) * 0.3],
    rowH: 0.2, fontFace: F.bodyAr, fontSize: 7.5, color: C.deepPurple,
    align: 'center', valign: 'middle', margin: 0.01,
    border: { type: 'solid', color: C.border, pt: 0.4 }, fill: { color: C.white },
  });
  t(s, `أبطأ مهمة: ${slowest.x.task_id} بمتوسط ${Math.round(slowest.avg * 10) / 10} ثانية.`, c.x + 0.25, c.y + ch - 0.35, cw - 0.5, 0.25, { fontSize: 8, color: C.secondaryText });

  // Errors card
  c = cards[2];
  t(s, 'الأخطاء حسب المهمة  Errors', c.x + 0.25, c.y + 0.18, cw - 0.5, 0.3, { fontSize: 12, bold: true, color: C.deepPurple });
  const errRows = [
    [{ text: 'المهمة', options: { bold: true } }, { text: 'ثانوية', options: { bold: true } }, { text: 'متوسط', options: { bold: true } }],
    ...m.tasks.map((x) => [{ text: x.task_id }, { text: String(x.groups.highschool.total_errors) }, { text: String(x.groups.middle.total_errors) }]),
    [{ text: 'الإجمالي', options: { bold: true, color: C.primaryPurple } }, { text: String(m.perGroup.highschool.total_errors), options: { bold: true, color: C.primaryPurple } }, { text: String(m.perGroup.middle.total_errors), options: { bold: true, color: C.primaryPurple } }],
  ];
  s.addTable(errRows, {
    x: c.x + 0.25, y: c.y + 0.5, w: cw - 0.5, colW: [(cw - 0.5) * 0.4, (cw - 0.5) * 0.3, (cw - 0.5) * 0.3],
    rowH: 0.19, fontFace: F.bodyAr, fontSize: 7.5, color: C.deepPurple,
    align: 'center', valign: 'middle', margin: 0.01,
    border: { type: 'solid', color: C.border, pt: 0.4 }, fill: { color: C.white },
  });
  t(s, `أكثر المهام أخطاءً: ${mostErrors.x.task_id} (${mostErrors.n} أخطاء).`, c.x + 0.25, c.y + ch - 0.35, cw - 0.5, 0.25, { fontSize: 8, color: C.secondaryText });

  // Findings card
  c = cards[3];
  t(s, 'أبرز النتائج  Key Findings', c.x + 0.25, c.y + 0.18, cw - 0.5, 0.3, { fontSize: 12, bold: true, color: C.deepPurple });
  const bullets = [
    `${overall}% معدل إكمال إجمالي عبر ${total} محاولة.`,
    `أكثر خطأ تكراراً: ${topErr ? topErr.description : EMPTY}${topErr ? ` (${topErr.count})` : ''}.`,
    `فجوة SUS: الثانوية ${m.sus.highschool} مقابل المتوسط ${m.sus.middle}.`,
    'طلاب المتوسط يحتاجون دعماً أكبر في مسارات المكتبة والانضمام.',
  ];
  bullets.forEach((b, i) => {
    const yy = c.y + 0.57 + i * 0.26;
    rect(s, c.x + cw - 0.52, yy + 0.05, 0.055, 0.055, C.accent);
    t(s, b, c.x + 0.35, yy, cw - 0.95, 0.22, { fontSize: 8.1, color: C.secondaryText, align: 'right' });
  });
  const barY = c.y + 1.68;
  [['SUS الثانوية', m.sus.highschool, C.primaryPurple], ['SUS المتوسط', m.sus.middle, C.accent]].forEach(([label, val, color], i) => {
    const yy = barY + i * 0.3;
    t(s, label, c.x + 0.35, yy, 1.0, 0.18, { fontSize: 7.5, color: C.secondaryText });
    rrect(s, c.x + 1.45, yy + 0.05, cw - 2.2, 0.08, C.purpleTint, { type: 'none' }, 0.04);
    rrect(s, c.x + 1.45, yy + 0.05, (cw - 2.2) * (val / 100), 0.08, color, { type: 'none' }, 0.04);
    lat(s, String(val), c.x + cw - 0.65, yy - 0.02, 0.45, 0.2, { fontSize: 8, bold: true, color: C.deepPurple, align: 'right' });
  });
  foot(s);
});

/* ================= 10 SUS ================= */
add((s) => {
  s.background = { color: C.darkBg };
  head(s, '10 · USER FEEDBACK & SUS', 'استبيان SUS وآراء المشاركين', 'مقياس System Usability Scale القياسي من 10 عبارات وخمس درجات إجابة، يُقدم للمشارك بعد إنهاء المهام الخمس.', true);
  const pw = (CW - 0.4) / 2;
  const rx = M, lx = M + pw + 0.4, py = 2.2, ph = 4.4;
  for (const x of [rx, lx]) rrect(s, x, py, pw, ph, C.darkSurface, { color: C.darkBorder, width: 1 }, 0.16);

  // SUS panel on the right
  t(s, 'درجة قابلية الاستخدام · SUS Score (0–100)', lx + 0.3, py + 0.25, pw - 0.6, 0.35, { fontSize: 12, bold: true, color: C.white });
  const tw = pw - 1.2;
  ['3A2D50', '4A3570', '5C4494', '7A5BC0'].forEach((col, i) => rect(s, lx + 0.6 + (tw / 4) * i, py + 0.9, tw / 4, 0.16, col));
  ['0', '25', '50', '75', '100'].forEach((v, i) =>
    lat(s, v, lx + 0.6 + (tw / 4) * i - 0.2, py + 1.15, 0.4, 0.22, { fontSize: 8, color: C.darkMuted, align: 'center' }));
  const avgs = [['طلاب المتوسط', m.sus.middle], ['طلاب الثانوية', m.sus.highschool], ['المتوسط العام', m.sus.overall]];
  avgs.forEach(([lbl, v], i) => {
    const bw = (pw - 1.0) / 3, bx = lx + 0.3 + i * (bw + 0.2);
    rrect(s, bx, py + 1.7, bw, 1.25, C.darkSurface, { color: C.darkBorder, width: 1, dashType: 'dash' }, 0.12);
    lat(s, String(v ?? EMPTY), bx, py + 1.95, bw, 0.45, { fontSize: 22, bold: true, color: 'B79BE8', align: 'center' });
    t(s, lbl, bx, py + 2.5, bw, 0.28, { fontSize: 9, color: C.darkMuted, align: 'center' });
  });

  // Quotes panel on the left
  t(s, 'آراء المشاركين ونقاط القصور والاقتراحات', rx + 0.3, py + 0.25, pw - 0.6, 0.35, { fontSize: 12, bold: true, color: C.white });
  const quotes = [
    'لم تُسجل اقتباسات نصية مباشرة في أداة التتبع.\nتعتمد الملاحظات النوعية على سجلات المراقب وأوصاف الأخطاء.',
    'أبرز ما رصده المراقبون: مألوفية الواجهة، وصعوبة قراءة بعض النصوص، والحاجة إلى توجيه في مسارات المكتبة والانضمام.',
  ];
  quotes.forEach((q, i) => {
    const yy = py + 0.85 + i * 1.55;
    rrect(s, rx + 0.3, yy, pw - 0.6, 1.3, C.darkSurface, { color: C.darkBorder, width: 1, dashType: 'dash' }, 0.12);
    t(s, q, rx + 0.5, yy + 0.25, pw - 1.0, 0.8, { fontSize: 9.2, color: C.darkMuted, align: 'center', lineSpacingMultiple: 1.3 });
  });
  foot(s, true);
});

/* ================= 11 Conclusion ================= */
add((s) => {
  s.background = { color: C.deepPurple };
  head(s, '11 · CONCLUSION', 'المشكلات والتوصيات والخلاصة', 'أبرز المشكلات المرصودة فعلياً أثناء الاختبار، والتوصيات المرتبطة بها، ومقارنة الفئتين.', true);
  const cards = [
    ['01', 'المشكلات الملاحظة', [
      'مسار خاطئ متكرر في البحث واختيار الاختبار: 9 حالات.',
      'صعوبة الوصول إلى المكتبة والتقارير: 9 حالات بين الفئتين.',
      'الانضمام للغرفة: خطأ في رمز اللعبة 2 وعدم انتباه لزر الانضمام 2.',
      'طلاب المتوسط سجلوا أخطاء أكثر: 14 مقابل 8 لطلاب الثانوية.',
    ]],
    ['02', 'التوصيات', [
      'إبراز المكتبة والتقارير في الصفحة الرئيسية وتوحيد مسار الوصول إليها.',
      'تبسيط مسار البحث واختيار الاختبار وتقليل الخيارات المتشابهة.',
      'تحسين شاشة الانضمام: تحقق فوري من رمز اللعبة وتلميح واضح لزر الانضمام.',
      'دعم طلاب المتوسط بنصوص أكبر وإرشاد مصور داخل التطبيق.',
    ]],
    ['03', 'ملاحظات فريق المراقبة', [
      'الواجهة مألوفة لدى الطلاب ذوي الخبرة، والتنقل بين الصفحات سريع.',
      'بعض المشاركين احتاجوا وقتاً لقراءة النصوص بسبب صغر الخط.',
      'تردد واضح عند اختيار الاسم المستعار وإدخال رمز اللعبة.',
      'إعجاب بطريقة عرض النتائج والتقارير النهائية.',
    ]],
    ['04', 'مقارنة الفئتين والاستنتاج', [
      'الإكمال: الثانوية 98.5% · المتوسط 97.1%.',
      'الأخطاء: الثانوية 8 · المتوسط 14.',
      'SUS: الثانوية 84.4 · المتوسط 61.8.',
      'الاستنتاج: قابلية استخدام جيدة عموماً، مع حاجة أكبر للدعم في فئة المتوسط ومسارات المكتبة والانضمام.',
    ]],
  ];
  const cw = (CW - 0.35) / 2, chh = 2.32;
  cards.forEach(([n, ti, items], i) => {
    const x = i % 2 === 0 ? M + cw + 0.35 : M;
    const y = i < 2 ? 2.1 : 4.6;
    rrect(s, x, y, cw, chh, C.darkSurface, { color: C.darkBorder, width: 1 }, 0.14);
    rrect(s, x + cw - 0.75, y + 0.18, 0.5, 0.3, C.darkSurface, { color: C.darkBorder, width: 1 }, 0.05);
    lat(s, n, x + cw - 0.75, y + 0.23, 0.5, 0.2, { fontSize: 9, color: 'B79BE8', align: 'center' });
    t(s, ti, x + 0.3, y + 0.18, cw - 1.2, 0.35, { fontFace: F.headingAr, fontSize: 15, bold: true, color: C.white });
    items.forEach((it, j) => {
      const yy = y + 0.68 + j * 0.34;
      rect(s, x + cw - 0.56, yy + 0.05, 0.055, 0.055, 'B79BE8');
      t(s, it, x + 0.3, yy, cw - 0.95, 0.3, { fontSize: 7.9, color: C.darkMuted, align: 'right' });
    });
  });
  foot(s, true);
});

/* ================= 12 Team ================= */
add((s) => {
  s.background = { color: C.deepPurple };
  s.addImage({ path: LOGO.wordmarkWhite, x: W / 2 - 1.15, y: 1.35, w: 2.3, h: 0.79, altText: 'Kahoot' });
  t(s, 'أعضاء الفريق', 1.5, 2.55, W - 3.0, 0.75, { fontFace: F.headingAr, fontSize: 36, bold: true, color: C.white, align: 'center' });
  const names = ['عبدالله باسلامة', 'عمر عبدالله برهيش', 'عمر سعيد برهيش', 'عبدالله بامطرف', 'عوض بن وبر', 'علي مقيبل'];
  names.forEach((n, i) => {
    const col = 2 - (i % 3), row = Math.floor(i / 3);
    const cw = 3.4, x = W / 2 - (3 * cw) / 2 + col * cw;
    const y = 3.85 + row * 0.72;
    t(s, n, x, y, cw, 0.4, { fontSize: 16, color: 'D3C8E6', align: 'center' });
  });
  foot(s, true);
});

const out = join(root, 'kahoot-usability-presentation.pptx');
await pptx.writeFile({ fileName: out });
console.log(`PPTX → ${out} (${pptx._slides.length} slides, native editable elements)`);
