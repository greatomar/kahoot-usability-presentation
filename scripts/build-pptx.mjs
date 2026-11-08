#!/usr/bin/env node
/**
 * PPTX builder — native, fully editable PowerPoint elements.
 * Same content + design tokens + metrics as the HTML deck (single source of truth).
 * Empty study → designed empty states. With real data in data/*.json, the
 * completion/time/error visuals become NATIVE editable PowerPoint charts.
 *
 * Output: kahoot-usability-presentation.pptx  (+ pptx/build-deck source is this file)
 */
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { colors as C, fonts as F, EMPTY, AWAITING_AR, AWAITING_EN } from '../src/design/tokens.mjs';
import { computeMetrics } from './compute-metrics.mjs';

const require = createRequire(import.meta.url);
const pptxgen = require('pptxgenjs');
const { warnIfSlideHasOverlaps, warnIfSlideElementsOutOfBounds } = require('../pptx/pptxgenjs_helpers/layout.js');

const m = computeMetrics();
const pptx = new pptxgen();
pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'WIDE';
pptx.author = 'HCI Project Team';
pptx.title = 'Usability Testing of Kahoot Android Application';
pptx.theme = { headFontFace: F.headingAr, bodyFontFace: F.bodyAr, lang: 'ar-SA' };

/* ---------------- primitives ---------------- */
const M = 0.67;                       // side margin (80px @120px/in)
const W = 13.333, H = 7.5;
const CW = W - 2 * M;                 // content width

const rect = (s, x, y, w, h, fill, opts = {}) =>
  s.addShape('rect', { x, y, w, h, fill: { color: fill }, line: { type: 'none' }, ...opts });
const rrect = (s, x, y, w, h, fill, line, radius = 0.12) =>
  s.addShape('roundRect', { x, y, w, h, rectRadius: radius, fill: { color: fill }, line: line ?? { type: 'none' } });
const line = (s, x, y, w, color, opts = {}) =>
  s.addShape('line', { x, y, w, h: 0, line: { color, width: 1, ...opts } });
const dashLine = { color: C.purpleMid, width: 1, dashType: 'dash' };

const t = (s, text, x, y, w, h, o = {}) =>
  s.addText(text, {
    x, y, w, h, fontFace: F.bodyAr, fontSize: 12, color: C.darkText,
    align: 'right', rtlMode: true, valign: 'top', margin: 0, ...o,
  });
const lat = (s, text, x, y, w, h, o = {}) =>
  t(s, text, x, y, w, h, { fontFace: F.latin, rtlMode: false, align: 'left', ...o });

const emptyTag = (s, x, y, w, dark = false) => {
  rrect(s, x, y, w, 0.42, dark ? C.darkBg : C.purpleTint, { ...dashLine, color: dark ? C.darkBorder : C.purpleMid }, 0.21);
  t(s, [
    { text: AWAITING_AR + '  ', options: { fontSize: 11, color: dark ? C.darkMuted : C.primaryPurple } },
    { text: AWAITING_EN, options: { fontFace: F.latin, fontSize: 9, rtlMode: false, color: dark ? C.darkMuted : C.purpleMid } },
  ], x, y + 0.09, w, 0.3, { align: 'center' });
};

const head = (s, kicker, title, sub, dark = false) => {
  rect(s, W - M - 0.28, 0.72, 0.28, 0.025, C.accent);
  lat(s, kicker, W - M - 4.5, 0.6, 4.2, 0.26, { fontSize: 10, bold: true, charSpacing: 2, color: dark ? C.darkMuted : C.primaryPurple, align: 'right' });
  t(s, title, M, 0.95, CW, 0.72, { fontFace: F.headingAr, fontSize: 30, bold: true, color: dark ? C.white : C.deepPurple });
  if (sub) t(s, sub, M, 1.68, CW, 0.5, { fontSize: 12.5, color: dark ? C.darkMuted : C.secondaryText, lineSpacingMultiple: 1.25 });
};

const foot = (s, n, dark = false) => {
  const c = dark ? C.darkMuted : C.secondaryText;
  lat(s, `${String(n).padStart(2, '0')} / 10`, W - M - 0.8, 7.08, 0.8, 0.22, { fontSize: 8.5, color: c, align: 'right', charSpacing: 1 });
  line(s, M + 3.1, 7.18, CW - 3.9, dark ? C.darkBorder : C.border);
  lat(s, 'KAHOOT USABILITY · HCI PROJECT', M, 7.08, 3.0, 0.22, { fontSize: 8.5, color: c, charSpacing: 1 });
};

const add = (build) => {
  const s = pptx.addSlide();
  build(s);
  warnIfSlideHasOverlaps(s, pptx);
  warnIfSlideElementsOutOfBounds(s, pptx);
  return s;
};

/* ---------------- 01 Cover ---------------- */
add((s) => {
  s.background = { color: C.deepPurple };
  // geometric composition (native shapes, editable)
  s.addShape('triangle', { x: 1.05, y: 0.85, w: 1.5, h: 1.35, rotate: 348, fill: { color: C.primaryPurple }, line: { type: 'none' } });
  s.addShape('ellipse', { x: 0.35, y: 2.5, w: 1.0, h: 1.0, fill: { type: 'none' }, line: { color: 'B79BE8', width: 14 } });
  s.addShape('ellipse', { x: 2.1, y: 3.2, w: 1.45, h: 1.45, fill: { color: C.accent }, line: { type: 'none' } });
  s.addShape('roundRect', { x: 0.7, y: 4.85, w: 1.3, h: 1.3, rectRadius: 0.08, rotate: 14, fill: { color: '6D3FC0' }, line: { type: 'none' } });
  line(s, 2.25, 6.2, 1.6, C.darkBorder, { width: 2 });

  const x = 5.1, w = W - M - x;
  rrect(s, x + 2.6, 1.05, w - 2.6, 0.4, C.deepPurple, { color: C.darkBorder, width: 1 }, 0.2);
  t(s, [
    { text: 'مشروع مقرر تفاعل الإنسان والحاسوب · ', options: { fontSize: 10.5, color: C.darkMuted } },
    { text: 'Human–Computer Interaction', options: { fontFace: F.latin, rtlMode: false, fontSize: 10, color: C.darkMuted } },
  ], x + 2.6, 1.14, w - 2.6, 0.26, { align: 'center' });

  lat(s, [
    { text: 'Usability Testing of\n', options: { color: C.white } },
    { text: 'Kahoot Android\n', options: { color: 'B79BE8' } },
    { text: 'Application', options: { color: C.white } },
  ], x, 2.05, w, 2.4, { fontSize: 40, bold: true, lineSpacingMultiple: 1.12 });

  t(s, 'دراسة اختبار قابلية الاستخدام ومقارنة بين طلاب الجامعة وطلاب الثانوية', x, 4.6, w, 0.4, { fontSize: 15, color: C.darkMuted });

  const rows = [
    ['أعضاء الفريق — Group A', 'أعضاء الفريق — Group B'],
    ['اسم المقرر', 'اسم الدكتور'],
    ['تاريخ العرض', ''],
  ];
  rows.forEach(([a, b], i) => {
    const y = 5.35 + i * 0.52;
    t(s, a, x + w / 2 + 0.2, y, w / 2 - 0.2, 0.3, { fontSize: 11, color: C.darkMuted });
    line(s, x + w / 2 + 0.25, y + 0.34, 1.6, C.darkBorder, { width: 1.5 });
    if (b) {
      t(s, b, x, y, w / 2 - 0.4, 0.3, { fontSize: 11, color: C.darkMuted });
      line(s, x + 0.05, y + 0.34, 1.6, C.darkBorder, { width: 1.5 });
    }
  });
  foot(s, 1, true);
});

/* ---------------- 02 About ---------------- */
add((s) => {
  s.background = { color: C.lightBg };
  head(s, '02 · ABOUT KAHOOT', 'ما هو Kahoot؟');
  // phone placeholder (native shapes — replace inner area with a real Android screenshot later)
  const px = W - M - 2.85, py = 1.85, pw = 2.85, ph = 4.95;
  rrect(s, px, py, pw, ph, C.white, { color: C.deepPurple, width: 2.25 }, 0.35);
  rrect(s, px + pw / 2 - 0.45, py + 0.14, 0.9, 0.18, C.deepPurple, null, 0.09);
  s.addShape('rect', { x: px + 1.1, y: py + 1.7, w: 0.65, h: 0.55, fill: { type: 'none' }, line: { color: C.purpleMid, width: 1.5 } });
  t(s, 'مكان مخصص للقطة شاشة حقيقية\nمن تطبيق Kahoot Android', px + 0.3, py + 2.5, pw - 0.6, 0.9, { fontSize: 11, color: C.secondaryText, align: 'center', lineSpacingMultiple: 1.3 });
  lat(s, 'Screenshot placeholder', px + 0.3, py + 3.45, pw - 0.6, 0.3, { fontSize: 10, color: C.secondaryText, align: 'center' });

  const tx = M, tw = CW - 3.35;
  t(s, [
    { text: 'Kahoot', options: { bold: true, color: C.primaryPurple, fontFace: F.latin, rtlMode: false } },
    { text: ' منصة تعليمية تفاعلية تعتمد على الاختبارات القصيرة المصممة بأسلوب الألعاب (Game-based Learning)، ويتيح تطبيق Android إنشاء الاختبارات والبحث عنها واللعب الفردي أو الجماعي ومراجعة النتائج ومشاركة الروابط.', options: {} },
  ], tx, 1.85, tw, 0.85, { fontSize: 13, lineSpacingMultiple: 1.35 });

  const funcs = [
    ['01', 'البحث والاستكشاف', 'الوصول إلى اختبارات جاهزة بالبحث بالموضوع — يرتبط بالمهمتين T01 وT02.'],
    ['02', 'صفحة تفاصيل الاختبار', 'عرض العنوان وعدد الأسئلة ومعلومات الاختبار قبل اللعب — ترتبط بالمهمة T02.'],
    ['03', 'أوضاع اللعب واللعب الفردي', 'اختيار Classic Solo وبدء الأسئلة والإجابة عنها — يرتبط بالمهمتين T03 وT04.'],
    ['04', 'النتيجة والمشاركة', 'مراجعة النتيجة النهائية ثم مشاركة الاختبار ونسخ الرابط — ترتبط بالمهمة T05.'],
  ];
  funcs.forEach(([n, ti, d], i) => {
    const y = 2.85 + i * 1.02;
    rrect(s, tx, y, tw, 0.9, C.white, { color: C.border, width: 1 });
    lat(s, n, tx + tw - 0.55, y + 0.24, 0.35, 0.3, { fontSize: 12, bold: true, color: C.accent });
    t(s, ti, tx + 0.25, y + 0.12, tw - 0.95, 0.3, { fontSize: 12.5, bold: true });
    t(s, d, tx + 0.25, y + 0.46, tw - 0.95, 0.36, { fontSize: 10.5, color: C.secondaryText });
  });
  foot(s, 2);
});

/* ---------------- 03 Participants ---------------- */
add((s) => {
  s.background = { color: C.lightBg };
  head(s, '03 · PARTICIPANTS', 'الفئتان المستهدفتان',
    'مقارنة سلوك الاستخدام بين فئتين عمريتين ودراسيتين مختلفتين، دون افتراض عدد نهائي للمشاركين قبل تنفيذ الدراسة.');
  const cw = (CW - 0.35) / 2;
  m.groups.forEach((g, gi) => {
    const x = gi === 0 ? M + cw + 0.35 : M;   // university on the right (RTL)
    const y = 2.35, ch = 4.35;
    rrect(s, x, y, cw, ch, C.white, { color: C.border, width: 1 });
    rect(s, x + 0.3, y, cw - 0.6, 0.035, gi === 0 ? C.primaryPurple : C.accent);
    t(s, g.labelAr, x + 1.5, y + 0.25, cw - 1.8, 0.5, { fontFace: F.headingAr, fontSize: 21, bold: true, color: C.deepPurple });
    const count = m.hasData.participants ? String(m.perGroup[g.id].participant_count) : EMPTY;
    lat(s, count, x + 0.3, y + 0.22, 1.1, 0.55, { fontSize: 28, bold: true, color: C.primaryPurple, align: 'center' });
    t(s, 'مشارك · ' + g.labelEn, x + 0.25, y + 0.8, 1.2, 0.3, { fontSize: 8.5, color: C.secondaryText, align: 'center' });
    t(s, g.id === 'university'
      ? 'مشاركون من طلاب الجامعة، يمتلكون خبرة أوسع نسبياً بالتطبيقات التعليمية والتفاعل الرقمي اليومي.'
      : 'مشاركون من طلاب المرحلة الثانوية، يمثلون فئة أصغر سناً بأنماط استخدام وخبرات رقمية مختلفة.',
      x + 0.3, y + 1.25, cw - 0.6, 0.6, { fontSize: 11, color: C.secondaryText, lineSpacingMultiple: 1.25 });
    t(s, 'الحد الأدنى في الدراسة الفعلية: 4 مشاركين على الأقل لكل فئة — العدد النهائي يُحدد بعد التنفيذ.',
      x + 0.3, y + 1.9, cw - 0.6, 0.55, { fontSize: 10, color: C.primaryPurple, lineSpacingMultiple: 1.2 });
    for (let i = 0; i < 4; i++) {
      const sw = (cw - 0.6 - 0.3) / 4;
      const sx = x + 0.3 + i * (sw + 0.1);
      s.addShape('roundRect', { x: sx, y: y + 2.6, w: sw, h: 1.15, rectRadius: 0.08, fill: { color: C.lightBg }, line: { color: C.border, width: 1.25, dashType: 'dash' } });
      s.addShape('ellipse', { x: sx + sw / 2 - 0.09, y: y + 2.95, w: 0.18, h: 0.18, fill: { type: 'none' }, line: { color: C.secondaryText, width: 1.25 } });
      s.addShape('rect', { x: sx + sw / 2 - 0.13, y: y + 3.18, w: 0.26, h: 0.12, fill: { type: 'none' }, line: { color: C.secondaryText, width: 1.25 } });
    }
    t(s, 'أماكن مخصصة لصور المشاركين أثناء الاختبار — تُضاف بعد الحصول على موافقتهم فقط.',
      x + 0.3, y + 3.9, cw - 0.6, 0.35, { fontSize: 9, color: C.secondaryText });
  });
  foot(s, 3);
});

/* ---------------- 04 Methodology ---------------- */
add((s) => {
  s.background = { color: C.lightBg };
  head(s, '04 · METHODOLOGY', 'منهجية الاختبار',
    'سبع خطوات متسلسلة تُطبق على كل مشارك بالطريقة نفسها لضمان قابلية المقارنة بين الفئتين.');
  const steps = [
    ['الاختبار الداخلي', 'أعضاء الفريق ينفذون المهام الخمس بأنفسهم'],
    ['الوقت المعياري', 'حساب متوسط وقت الفريق لكل مهمة'],
    ['تعريف المشارك', 'نبذة مختصرة عن التطبيق'],
    ['الاستكشاف الحر', '3–4 دقائق دون أي تدخل'],
    ['تنفيذ المهام', 'المهام الخمس بالترتيب نفسه'],
    ['المراقبة والتسجيل', 'الوقت والأخطاء وحالة الإكمال'],
    ['استبيان SUS', 'بعد انتهاء جميع المهام'],
  ];
  const sw = CW / 7, cy = 2.85;
  line(s, M + 0.35, cy + 0.26, CW - 0.7, C.border, { width: 1.5 });
  steps.forEach(([ti, d], i) => {
    const x = W - M - sw * (i + 1);          // RTL: step 1 rightmost
    const last = i === steps.length - 1;
    s.addShape('ellipse', { x: x + sw / 2 - 0.26, y: cy, w: 0.52, h: 0.52, fill: { color: last ? C.primaryPurple : C.white }, line: { color: C.primaryPurple, width: 1.5 } });
    lat(s, String(i + 1), x + sw / 2 - 0.26, cy + 0.11, 0.52, 0.3, { fontSize: 13, bold: true, color: last ? C.white : C.primaryPurple, align: 'center' });
    t(s, ti, x + 0.06, cy + 0.68, sw - 0.12, 0.55, { fontSize: 11.5, bold: true, align: 'center', lineSpacingMultiple: 1.15 });
    t(s, d, x + 0.08, cy + 1.25, sw - 0.16, 0.75, { fontSize: 9, color: C.secondaryText, align: 'center', lineSpacingMultiple: 1.2 });
  });
  rrect(s, M, 5.1, CW, 0.95, C.purpleTint);
  s.addShape('ellipse', { x: W - M - 0.75, y: 5.32, w: 0.5, h: 0.5, fill: { type: 'none' }, line: { color: C.primaryPurple, width: 1.75 } });
  line(s, W - M - 0.5, 5.42, 0, C.primaryPurple);
  t(s, [
    { text: 'آلية الوقت: ', options: { bold: true, color: C.primaryPurple } },
    { text: 'الوقت المعياري (Standard Time) هو متوسط أوقات أعضاء الفريق في التجربة الداخلية لكل مهمة. إذا أنهى المشارك مبكراً تُسجل المهمة مكتملة بالوقت الفعلي، وإذا انتهى الوقت دون إتمامها تُمنح مهلة إضافية ', options: {} },
    { text: '5–10 ثوانٍ', options: { bold: true, color: C.primaryPurple } },
    { text: ' تُسجل عند استخدامها، وبعدها تُسجل المهمة غير مكتملة.', options: {} },
  ], M + 0.3, 5.25, CW - 1.35, 0.7, { fontSize: 11.5, color: C.deepPurple, lineSpacingMultiple: 1.3 });
  t(s, [
    { text: 'ما يُسجل لكل مشارك ولكل مهمة: ', options: { bold: true } },
    { text: 'Participant ID · Group · Task ID · Standard Time · Actual Time · Error Count · Error Description · Completion Status · Assistance Required · Observer Notes', options: { fontFace: F.latin, rtlMode: false, fontSize: 9 } },
  ], M, 6.3, CW, 0.4, { fontSize: 10.5, color: C.secondaryText, align: 'center' });
  foot(s, 4);
});

/* ---------------- 05 Tasks ---------------- */
add((s) => {
  s.background = { color: C.lightBg };
  head(s, '05 · TESTING TASKS', 'المهام الخمس المعتمدة',
    'تُنفذ المهام بالترتيب نفسه لجميع المشاركين، والوقت المعياري يُحسب من التجربة الداخلية قبل الاختبار الفعلي.');
  const y0 = 2.3, rh = 0.78;
  m.tasks.forEach((task, i) => {
    const y = y0 + i * rh;
    line(s, M, y, CW, C.border);
    lat(s, task.task_id, W - M - 0.85, y + 0.16, 0.8, 0.4, { fontSize: 20, bold: true, color: i % 2 ? C.primaryPurple : C.purpleMid, align: 'right' });
    t(s, task.name_ar, W - M - 3.5, y + 0.07, 2.5, 0.46, { fontFace: F.headingAr, fontSize: 14, bold: true, color: C.deepPurple, lineSpacingMultiple: 1.05 });
    lat(s, task.name_en, W - M - 3.5, y + 0.55, 2.5, 0.2, { fontSize: 8, color: C.secondaryText, align: 'right' });
    t(s, task.description, M + 1.45, y + 0.13, CW - 5.05, 0.55, { fontSize: 10, color: C.secondaryText, lineSpacingMultiple: 1.2 });
    lat(s, task.standard_time_seconds ?? EMPTY, M + 0.15, y + 0.1, 1.1, 0.35, { fontSize: 16, bold: true, color: C.primaryPurple, align: 'center' });
    t(s, 'الوقت المعياري (ثانية)', M + 0.1, y + 0.47, 1.2, 0.24, { fontSize: 8, color: C.secondaryText, align: 'center' });
  });
  line(s, M, y0 + 5 * rh, CW, C.border);
  t(s, 'ملاحظة تحقق قبل الاختبار: يجب التأكد من أن الاختبار المختار يدعم Classic Solo وأن وظائف البحث والمشاركة متاحة في إصدار Android المستخدم — لم يتم التحقق منها بعد.',
    M, 6.45, CW, 0.35, { fontSize: 9.5, color: C.secondaryText, align: 'center' });
  foot(s, 5);
});

/* ---------------- 06 Completion ---------------- */
add((s) => {
  s.background = { color: C.lightBg };
  head(s, '06 · TASK COMPLETION', 'تحليل إكمال المهام',
    'معدل إكمال كل مهمة لكل فئة، مع عدد المهام المكتملة وغير المكتملة — تُحسب جميعها من سجلات الملاحظة بعد الدراسة.');
  const cx = M + 2.85, cw = CW - 2.85, cy = 2.3, ch = 4.5;
  rrect(s, cx, cy, cw, ch, C.white, { color: C.border, width: 1 });
  t(s, [
    { text: 'معدل الإكمال حسب المهمة والفئة  ', options: { bold: true, fontSize: 12, color: C.deepPurple } },
    { text: 'Completion Rate %', options: { fontFace: F.latin, rtlMode: false, fontSize: 9, color: C.secondaryText } },
  ], cx + 0.25, cy + 0.18, cw - 0.5, 0.3, {});

  if (m.hasData.observations) {
    // Native, editable PowerPoint chart (real data only)
    s.addChart(pptx.ChartType.bar, [
      { name: 'University', labels: m.tasks.map((x) => x.task_id), values: m.tasks.map((x) => x.groups.university.completion_rate ?? 0) },
      { name: 'High School', labels: m.tasks.map((x) => x.task_id), values: m.tasks.map((x) => x.groups.highschool.completion_rate ?? 0) },
    ], {
      x: cx + 0.25, y: cy + 0.6, w: cw - 0.5, h: ch - 1.0,
      barDir: 'col', catAxisLabelFontFace: F.latin, valAxisLabelFontFace: F.latin,
      valAxisMaxVal: 100, valAxisMajorUnit: 25, chartColors: [C.primaryPurple, C.accent],
      showLegend: true, legendPos: 'b', legendFontFace: F.latin, legendFontSize: 10,
      valAxisLabelFontSize: 9, catAxisLabelFontSize: 10, showValue: false,
    });
  } else {
    // empty-state chart skeleton: axes + scale, no values
    const gx = cx + 0.75, gw = cw - 1.3, gy = cy + 0.75, gh = 2.9;
    for (const v of [0, 25, 50, 75, 100]) {
      const yy = gy + gh - (v / 100) * gh;
      line(s, gx, yy, gw, C.border);
      lat(s, v + '%', gx - 0.62, yy - 0.11, 0.55, 0.22, { fontSize: 9, color: C.secondaryText, align: 'right' });
    }
    line(s, gx, gy, 0, C.secondaryText);
    m.tasks.forEach((task, i) => {
      lat(s, task.task_id, gx + (gw / 5) * i, gy + gh + 0.12, gw / 5, 0.25, { fontSize: 10, bold: true, color: C.deepPurple, align: 'center' });
    });
    emptyTag(s, cx + cw / 2 - 1.55, gy + gh / 2 - 0.21, 3.1);
  }
  // manual legend only in empty state (native chart renders its own legend)
  if (!m.hasData.observations) {
  rect(s, cx + 0.35, cy + ch - 0.42, 0.14, 0.14, C.primaryPurple);
  t(s, 'طلاب الجامعة', cx + 0.53, cy + ch - 0.47, 1.15, 0.25, { fontSize: 9.5, color: C.secondaryText });
  rect(s, cx + 1.75, cy + ch - 0.42, 0.14, 0.14, C.accent);
  t(s, 'طلاب الثانوية', cx + 1.93, cy + ch - 0.47, 1.15, 0.25, { fontSize: 9.5, color: C.secondaryText });
  }

  const stats = [
    ['معدل الإكمال — طلاب الجامعة', m.perGroup.university.completion_rate != null ? m.perGroup.university.completion_rate + '%' : EMPTY],
    ['معدل الإكمال — طلاب الثانوية', m.perGroup.highschool.completion_rate != null ? m.perGroup.highschool.completion_rate + '%' : EMPTY],
    ['المهام المكتملة / غير المكتملة', m.hasData.observations
      ? `${m.perGroup.university.tasks_completed + m.perGroup.highschool.tasks_completed} / ${m.perGroup.university.tasks_incomplete + m.perGroup.highschool.tasks_incomplete}` : EMPTY],
  ];
  stats.forEach(([lbl, val], i) => {
    const y = 2.3 + i * 1.13;
    rrect(s, M, y, 2.6, 1.0, C.white, { color: C.border, width: 1 });
    t(s, lbl, M + 0.18, y + 0.14, 2.24, 0.4, { fontSize: 10.5, color: C.secondaryText });
    lat(s, val, M + 0.18, y + 0.56, 2.24, 0.36, { fontSize: 22, bold: true, color: C.primaryPurple });
  });
  rrect(s, M, 5.72, 2.6, 1.08, C.white, { color: C.border, width: 1 });
  t(s, 'تُعرض الأعمدة هنا تلقائياً فور إدخال سجلات الملاحظة في ملف البيانات.', M + 0.18, 5.9, 2.24, 0.75, { fontSize: 10, color: C.secondaryText, lineSpacingMultiple: 1.25 });
  foot(s, 6);
});

/* ---------------- 07 Time ---------------- */
add((s) => {
  s.background = { color: C.lightBg };
  head(s, '07 · TIME ANALYSIS', 'تحليل الأوقات',
    'مقارنة الوقت المعياري بمتوسط الوقت الفعلي لكل مهمة ولكل فئة، ثم الزمن الكلي لكل مشارك.');
  const cx = M + 2.85, cw = CW - 2.85, cy = 2.3, ch = 4.5;
  rrect(s, cx, cy, cw, ch, C.white, { color: C.border, width: 1 });
  t(s, [
    { text: 'الوقت المعياري مقابل متوسط الوقت الفعلي  ', options: { bold: true, fontSize: 12, color: C.deepPurple } },
    { text: 'Seconds', options: { fontFace: F.latin, rtlMode: false, fontSize: 9, color: C.secondaryText } },
  ], cx + 0.25, cy + 0.18, cw - 0.5, 0.3, {});

  if (m.hasData.observations && m.hasData.standard_times) {
    s.addChart(pptx.ChartType.bar, [
      { name: 'Standard', labels: m.tasks.map((x) => x.task_id), values: m.tasks.map((x) => x.standard_time_seconds ?? 0) },
      { name: 'University', labels: m.tasks.map((x) => x.task_id), values: m.tasks.map((x) => x.groups.university.avg_actual_time_seconds ?? 0) },
      { name: 'High School', labels: m.tasks.map((x) => x.task_id), values: m.tasks.map((x) => x.groups.highschool.avg_actual_time_seconds ?? 0) },
    ], {
      x: cx + 0.25, y: cy + 0.6, w: cw - 0.5, h: ch - 1.0,
      barDir: 'col', catAxisLabelFontFace: F.latin, valAxisLabelFontFace: F.latin,
      chartColors: [C.purpleMid, C.primaryPurple, C.accent],
      showLegend: true, legendPos: 'b', legendFontFace: F.latin, legendFontSize: 10,
      valAxisLabelFontSize: 9, catAxisLabelFontSize: 10, showValue: false,
    });
  } else {
    const rows = m.tasks.map((task) => [
      { text: task.task_id + ' — ' + task.name_ar, options: { fontSize: 9.5, align: 'right', rtlMode: true } },
      { text: String(task.standard_time_seconds ?? EMPTY), options: { fontFace: F.latin, align: 'center' } },
      { text: EMPTY, options: { align: 'center' } },
      { text: EMPTY, options: { align: 'center' } },
    ]);
    s.addTable([
      [
        { text: 'المهمة', options: { bold: true, align: 'right', rtlMode: true } },
        { text: 'الوقت المعياري', options: { bold: true, align: 'center', rtlMode: true } },
        { text: 'متوسط الفعلي — جامعة', options: { bold: true, align: 'center', rtlMode: true } },
        { text: 'متوسط الفعلي — ثانوية', options: { bold: true, align: 'center', rtlMode: true } },
      ],
      ...rows,
    ], {
      x: cx + 0.25, y: cy + 0.65, w: cw - 0.5, colW: [(cw - 0.5) * 0.4, (cw - 0.5) * 0.2, (cw - 0.5) * 0.2, (cw - 0.5) * 0.2],
      rowH: 0.42, fontFace: F.bodyAr, fontSize: 9.5, color: C.secondaryText,
      border: { type: 'solid', color: C.border, pt: 0.75 }, fill: { color: C.white }, valign: 'middle', margin: 0.04,
    });
    emptyTag(s, cx + cw / 2 - 1.55, cy + ch - 0.72, 3.1);
  }

  rrect(s, M, 2.3, 2.6, 2.6, C.white, { color: C.border, width: 1 });
  t(s, 'الزمن الكلي لكل مشارك (Total Time)', M + 0.18, 2.45, 2.24, 0.55, { fontSize: 10.5, color: C.secondaryText, lineSpacingMultiple: 1.2 });
  const totRows = m.hasData.observations
    ? m.totalTimePerParticipant.slice(0, 5).map((p) => [p.participant_id, p.group === 'university' ? 'جامعة' : 'ثانوية', String(p.total_time_seconds ?? EMPTY)])
    : Array.from({ length: 3 }, () => [EMPTY, EMPTY, EMPTY]);
  if (m.totalTimePerParticipant.length > 5) totRows.push(['…', '…', '…']);
  s.addTable([
    [{ text: 'المشارك', options: { bold: true } }, { text: 'الفئة', options: { bold: true } }, { text: 'الزمن (ث)', options: { bold: true } }],
    ...totRows,
  ], {
    x: M + 0.18, y: 3.05, w: 2.24, rowH: 0.34, fontFace: F.bodyAr, fontSize: 9, align: 'center',
    color: C.secondaryText, border: { type: 'solid', color: C.border, pt: 0.5 }, fill: { color: C.white }, margin: 0.03,
  });
  rrect(s, M, 5.1, 2.6, 1.7, C.white, { color: C.border, width: 1 });
  t(s, 'عند توفر البيانات يتحول الجدول إلى مخطط أعمدة أصلي قابل للتحرير (Native Chart) للمقارنة المباشرة.', M + 0.18, 5.28, 2.24, 1.3, { fontSize: 10, color: C.secondaryText, lineSpacingMultiple: 1.3 });
  foot(s, 7);
});

/* ---------------- 08 Errors ---------------- */
add((s) => {
  s.background = { color: C.lightBg };
  head(s, '08 · ERROR ANALYSIS', 'تحليل الأخطاء والمساعدة',
    'تمييز واضح بين الخطأ وطلب المساعدة والتردد، مع توثيق وصف كل خطأ فعلي أثناء الملاحظة.');
  const chips = [
    ['خطأ · Error', 'تنفيذ إجراء خاطئ أثناء المهمة، مثل الضغط على خيار غير مطلوب أو مسار غير صحيح.', C.primaryPurple],
    ['مساعدة · Assistance', 'طلب المشارك مساعدة أو اضطرار المراقب للتدخل — تُسجل مستقلة عن الأخطاء.', C.accent],
    ['تردد · Hesitation', 'تأخر أو توقف ملحوظ دون وقوع خطأ بالضرورة — يُدوّن في ملاحظات المراقب.', C.purpleMid],
  ];
  const cw3 = (CW - 0.5) / 3;
  chips.forEach(([ti, d, col], i) => {
    const x = W - M - cw3 * (i + 1) - 0.25 * i;
    rrect(s, x, 2.25, cw3, 1.15, C.white, { color: C.border, width: 1 });
    rect(s, x + cw3 - 0.045, 2.25, 0.045, 1.15, col);
    t(s, ti, x + 0.2, 2.38, cw3 - 0.4, 0.3, { fontSize: 12.5, bold: true, color: C.deepPurple });
    t(s, d, x + 0.2, 2.72, cw3 - 0.4, 0.6, { fontSize: 10, color: C.secondaryText, lineSpacingMultiple: 1.2 });
  });

  const cx = M + 2.85, cw = CW - 2.85, cy = 3.65, ch = 3.15;
  rrect(s, cx, cy, cw, ch, C.white, { color: C.border, width: 1 });
  t(s, [
    { text: 'الأخطاء حسب المهمة  ', options: { bold: true, fontSize: 12, color: C.deepPurple } },
    { text: 'Errors per Task', options: { fontFace: F.latin, rtlMode: false, fontSize: 9, color: C.secondaryText } },
  ], cx + 0.25, cy + 0.16, cw - 0.5, 0.3, {});
  if (m.hasData.errors) {
    s.addChart(pptx.ChartType.bar, [
      { name: 'University', labels: m.tasks.map((x) => x.task_id), values: m.tasks.map((x) => x.groups.university.total_errors) },
      { name: 'High School', labels: m.tasks.map((x) => x.task_id), values: m.tasks.map((x) => x.groups.highschool.total_errors) },
    ], {
      x: cx + 0.25, y: cy + 0.55, w: cw - 0.5, h: ch - 0.85,
      barDir: 'col', catAxisLabelFontFace: F.latin, valAxisLabelFontFace: F.latin,
      chartColors: [C.primaryPurple, C.accent], showLegend: true, legendPos: 'b',
      legendFontFace: F.latin, legendFontSize: 10, valAxisLabelFontSize: 9, catAxisLabelFontSize: 10,
    });
  } else {
    s.addTable([
      [{ text: 'المهمة', options: { bold: true, align: 'right' } }, { text: 'جامعة', options: { bold: true, align: 'center' } }, { text: 'ثانوية', options: { bold: true, align: 'center' } }],
      ...m.tasks.map((task) => [
        { text: task.task_id, options: { fontFace: F.latin, align: 'right' } },
        { text: EMPTY, options: { align: 'center' } },
        { text: EMPTY, options: { align: 'center' } },
      ]),
    ], {
      x: cx + 0.25, y: cy + 0.55, w: cw - 0.5, rowH: 0.33, fontFace: F.bodyAr, fontSize: 9.5,
      color: C.secondaryText, border: { type: 'solid', color: C.border, pt: 0.5 }, fill: { color: C.white }, margin: 0.03,
    });
    emptyTag(s, cx + cw / 2 - 1.55, cy + ch - 0.52, 3.1);
  }

  rrect(s, M, 3.65, 2.6, 1.45, C.white, { color: C.border, width: 1 });
  t(s, 'إجمالي الأخطاء / متوسط الأخطاء لكل مشارك', M + 0.18, 3.8, 2.24, 0.6, { fontSize: 10.5, color: C.secondaryText, lineSpacingMultiple: 1.2 });
  lat(s, EMPTY, M + 0.18, 4.45, 2.24, 0.4, { fontSize: 22, bold: true, color: C.primaryPurple });
  rrect(s, M, 5.3, 2.6, 1.5, C.white, { color: C.border, width: 1 });
  t(s, 'أكثر أنواع الأخطاء تكراراً وأوصافها الفعلية', M + 0.18, 5.45, 2.24, 0.55, { fontSize: 10.5, color: C.secondaryText, lineSpacingMultiple: 1.2 });
  lat(s, EMPTY, M + 0.18, 6.05, 2.24, 0.35, { fontSize: 20, bold: true, color: C.primaryPurple });
  t(s, 'تُستخرج من أوصاف الأخطاء المسجلة في سجلات الملاحظة.', M + 0.18, 6.42, 2.24, 0.35, { fontSize: 9, color: C.secondaryText });
  foot(s, 8);
});

/* ---------------- 09 SUS ---------------- */
add((s) => {
  s.background = { color: C.darkBg };
  head(s, '09 · USER FEEDBACK & SUS', 'استبيان SUS وآراء المشاركين',
    'مقياس System Usability Scale القياسي من 10 عبارات وخمس درجات إجابة، يُقدم للمشارك بعد إنهاء المهام الخمس.', true);
  const pw = (CW - 0.4) / 2;
  const rx = M, lx = M + pw + 0.4, py = 2.35, ph = 4.35;
  for (const x of [rx, lx]) rrect(s, x, py, pw, ph, C.darkSurface, { color: C.darkBorder, width: 1 });

  t(s, 'درجة قابلية الاستخدام · SUS Score (0–100)', lx + 0.3, py + 0.25, pw - 0.6, 0.35, { fontSize: 13, bold: true, color: C.white });
  const tw = pw - 1.2;
  ['3A2D50', '4A3570', '5C4494', '7A5BC0'].forEach((c, i) => rect(s, lx + 0.6 + (tw / 4) * i, py + 0.95, tw / 4, 0.16, c));
  ['0', '25', '50', '75', '100'].forEach((v, i) =>
    lat(s, v, lx + 0.6 + (tw / 4) * i - 0.2, py + 1.2, 0.4, 0.22, { fontSize: 9, color: C.darkMuted, align: 'center' }));
  const avgs = [['المتوسط العام', m.sus.overall], ['طلاب الجامعة', m.sus.university], ['طلاب الثانوية', m.sus.highschool]];
  avgs.forEach(([lbl, v], i) => {
    const bw = (pw - 1.0) / 3, bx = lx + 0.3 + i * (bw + 0.2);
    rrect(s, bx, py + 1.65, bw, 1.05, C.darkSurface, { color: C.darkBorder, width: 1, dashType: 'dash' });
    lat(s, v ?? EMPTY, bx, py + 1.8, bw, 0.45, { fontSize: 24, bold: true, color: 'B79BE8', align: 'center' });
    t(s, lbl, bx, py + 2.32, bw, 0.28, { fontSize: 10, color: C.darkMuted, align: 'center' });
  });
  t(s, [
    { text: 'طريقة الحساب القياسية: ', options: { bold: true } },
    { text: 'للبنود الفردية (1,3,5,7,9) الدرجة المعدلة = الإجابة − 1، وللبنود الزوجية (2,4,6,8,10) الدرجة المعدلة = 5 − الإجابة، ثم SUS = Σ Adjusted × 2.5.\nتفسير النتيجة يُضاف بعد توفر البيانات الفعلية.', options: {} },
  ], lx + 0.3, py + 2.95, pw - 0.6, 1.2, { fontSize: 10, color: C.darkMuted, lineSpacingMultiple: 1.35 });

  t(s, 'آراء المشاركين ونقاط القصور والاقتراحات', rx + 0.3, py + 0.25, pw - 0.6, 0.35, { fontSize: 13, bold: true, color: C.white });
  for (const [yy, txt] of [[py + 0.85, 'تُضاف اقتباسات المشاركين الحقيقية وملاحظاتهم الإيجابية والسلبية هنا بعد الدراسة.'], [py + 2.75, 'اقتراحات التحسين كما صاغها المشاركون — دون إضافة أو اختلاق.']]) {
    rrect(s, rx + 0.3, yy, pw - 0.6, 1.55, C.darkSurface, { color: C.darkBorder, width: 1, dashType: 'dash' });
    t(s, txt, rx + 0.5, yy + 0.75, pw - 1.0, 0.6, { fontSize: 10.5, color: C.darkMuted, align: 'center', lineSpacingMultiple: 1.3 });
  }
  emptyTag(s, rx + pw / 2 - 1.8, py + 1.0, 3.6, true);
  foot(s, 9, true);
});

/* ---------------- 10 Conclusion ---------------- */
add((s) => {
  s.background = { color: C.deepPurple };
  head(s, '10 · CONCLUSION', 'المشكلات والتوصيات والخلاصة',
    'أقسام جاهزة للتعبئة بعد تنفيذ الدراسة الفعلية — لا تُعرض أي مشكلة أو استنتاج قبل رصدها فعلياً في الاختبار.', true);
  const cards = [
    ['01', 'المشكلات الملاحظة', 'مشكلتان على الأقل ظهرتا في الاختبار الفعلي، موثقتان من سجلات الملاحظة وأوصاف الأخطاء.'],
    ['02', 'التوصيات', 'اقتراح تحسين محدد لكل مشكلة مرصودة، مرتبط مباشرة بما لوحظ أثناء تنفيذ المهام.'],
    ['03', 'ملاحظات فريق المراقبة', 'انطباعات أعضاء الفريق أثناء المراقبة المباشرة: التردد، طلبات المساعدة، وسلوك الاستكشاف.'],
    ['04', 'مقارنة الفئتين والاستنتاج', 'مقارنة طلاب الجامعة وطلاب الثانوية في الإكمال والوقت والأخطاء وSUS، ثم الاستنتاج النهائي.'],
  ];
  const cw2 = (CW - 0.35) / 2;
  cards.forEach(([n, ti, hint], i) => {
    const x = i % 2 === 0 ? M + cw2 + 0.35 : M;
    const y = i < 2 ? 2.3 : 4.55;
    rrect(s, x, y, cw2, 2.05, C.darkSurface, { color: C.darkBorder, width: 1 });
    rrect(s, x + cw2 - 0.75, y + 0.22, 0.5, 0.32, C.darkSurface, { color: C.darkBorder, width: 1 }, 0.06);
    lat(s, n, x + cw2 - 0.75, y + 0.28, 0.5, 0.22, { fontSize: 10, color: 'B79BE8', align: 'center' });
    t(s, ti, x + 0.3, y + 0.2, cw2 - 1.2, 0.4, { fontFace: F.headingAr, fontSize: 17, bold: true, color: C.white });
    [0, 1, 2].forEach((li) => line(s, x + (li === 2 ? cw2 * 0.35 : 0.3), y + 0.85 + li * 0.18, li === 2 ? cw2 * 0.65 - 0.3 : cw2 - 0.6, C.darkBorder, { width: 1.5 }));
    t(s, hint, x + 0.3, y + 1.5, cw2 - 0.6, 0.5, { fontSize: 10, color: C.darkMuted, lineSpacingMultiple: 1.25 });
  });
  t(s, [
    { text: 'بانتظار بيانات الاختبار الفعلي — ', options: { color: C.darkMuted } },
    { text: 'تُستكمل هذه الشريحة فور انتهاء الدراسة الميدانية وإدخال البيانات.', options: { bold: true, color: C.white } },
  ], M, 6.78, CW, 0.3, { fontSize: 11.5, align: 'center' });
  foot(s, 10, true);
});

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'kahoot-usability-presentation.pptx');
await pptx.writeFile({ fileName: out });
console.log(`PPTX → ${out} (${pptx._slides.length} slides, native editable elements)`);
