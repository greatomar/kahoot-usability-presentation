#!/usr/bin/env node
/**
 * Builds the self-contained, fully offline HTML deck:
 * fonts (base64 woff2) + CSS + slide markup + metrics JSON + runtime JS
 * are all inlined into kahoot-usability-presentation.html.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { colors } from '../src/design/tokens.mjs';
import { renderSlides } from '../src/content/slides-html.mjs';
import { computeMetrics } from './compute-metrics.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const b64 = (p) => readFileSync(join(root, p)).toString('base64');

/* ---- fonts ---- */
const face = (family, weight, file, style = 'normal') =>
  `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${b64('assets/fonts/' + file)}) format('woff2');}`;
const fontCss = [
  face('thmanyah sans', 400, 'thmanyah-sans-Regular.woff2'),
  face('thmanyah sans', 500, 'thmanyah-sans-Medium.woff2'),
  face('thmanyah sans', 700, 'thmanyah-sans-Bold.woff2'),
  face('thmanyah sans', 900, 'thmanyah-sans-Black.woff2'),
  ...readdirSync(join(root, 'assets/fonts'))
    .filter((f) => /^(IBMPlexSansArabic|Inter)-\d+-(arabic|latin)\.woff2$/.test(f))
    .map((f) => {
      const [fam, wt] = f.split('-');
      return face(fam === 'Inter' ? 'Inter' : 'IBM Plex Sans Arabic', wt, f);
    }),
].join('\n');

/* ---- design tokens → CSS custom properties ---- */
const vars = `:root{${Object.entries(colors).map(([k, v]) => `--${k}:#${v};`).join('')}}`;

const metrics = computeMetrics();
const html = read('src/template.html')
  .replace('__FONTS__', fontCss)
  .replace('__CSS__', vars + '\n' + read('src/styles/presentation.css'))
  .replace('__SLIDES__', renderSlides(metrics))
  .replace('__METRICS__', JSON.stringify(metrics))
  .replace('__SCRIPT__', read('src/scripts/presentation.js'));

const out = process.env.BUILD_OUT ?? join(root, 'kahoot-usability-presentation.html');
writeFileSync(out, html);
console.log(`HTML → ${out} (${(html.length / 1024).toFixed(0)} KB, fully offline)`);
