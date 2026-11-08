#!/usr/bin/env node
/**
 * HTML deck QA — real Chromium (local Helium binary), no downloads.
 * Checks: slide count, keyboard nav (arrows/Space/Home/End), counter,
 * RTL/LTR, embedded fonts, console errors, and fully-offline operation.
 * Optional screenshots: QA_SHOTS=1 (writes previews/html/slide-NN.png)
 */
import { chromium } from 'playwright-core';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch({
  executablePath: '/opt/helium-browser-bin/chrome',
  args: ['--no-sandbox', '--disable-gpu'],
});
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, offline: true });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto('file://' + join(root, 'kahoot-usability-presentation.html'));
await page.waitForTimeout(700);

const slideCount = await page.locator('.slide').count();
check('10 slides exist', slideCount === 10, `found ${slideCount}`);
check('starts at slide 1', (await page.locator('.slide.active').getAttribute('data-title')) === 'الغلاف');
check('RTL document', (await page.getAttribute('html', 'dir')) === 'rtl');

const activeIndex = () => page.locator('.slide').evaluateAll((els) => els.findIndex((e) => e.classList.contains('active')));
const counter = () => page.locator('#counter').textContent();

await page.keyboard.press('ArrowLeft');            // next in RTL
check('ArrowLeft → slide 2', (await activeIndex()) === 1);
await page.keyboard.press('ArrowRight');           // back
check('ArrowRight → slide 1', (await activeIndex()) === 0);
await page.keyboard.press('Space');
check('Space → slide 2', (await activeIndex()) === 1);
await page.keyboard.press('End');
check('End → slide 10', (await activeIndex()) === 9);
check('counter shows 10 / 10', (await counter()) === '10 / 10', await counter());
await page.keyboard.press('Home');
check('Home → slide 1', (await activeIndex()) === 0);
await page.keyboard.press('ArrowRight');           // clamp at start
check('clamped at slide 1', (await activeIndex()) === 0);

const fonts = await page.evaluate(() => document.fonts.size);
check('fonts embedded & loaded', fonts >= 10, `${fonts} FontFace entries`);
const overflow = await page.locator('.slide').evaluateAll((els) =>
  els.filter((e) => e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2).length);
check('no slide content overflow', overflow === 0, `${overflow} overflowing slides`);
check('no JS / console errors', errors.length === 0, errors.slice(0, 3).join(' | '));

if (process.env.QA_SHOTS === '1') {
  for (let i = 1; i <= 10; i++) {
    await page.evaluate((n) => { location.hash = '#' + n; }, i);
    await page.reload();
    await page.waitForTimeout(600);
    await page.screenshot({ path: join(root, 'previews', 'html', `slide-${String(i).padStart(2, '0')}.png`) });
  }
  console.log('screenshots → previews/html/');
}

await browser.close();
const failed = results.filter((r) => !r.ok).length;
console.log(failed === 0 ? '\nAll HTML QA checks passed (fully offline).' : `\n${failed} check(s) FAILED`);
process.exit(failed === 0 ? 0 : 1);
