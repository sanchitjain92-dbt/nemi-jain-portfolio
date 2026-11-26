import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';

const BASE = process.env.QA_URL || 'http://localhost:4173/';
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
const failures = [];

function check(ok, msg) {
  console.log(`${ok ? '✓' : '✗'} ${msg}`);
  if (!ok) failures.push(msg);
}

const browser = await chromium.launch({ executablePath: CHROME });

async function openPage(viewport, hash = '') {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE + hash, { waitUntil: 'networkidle' });
  return { page, errors };
}

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 300) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(1200);
}

const topOf = (page, id) =>
  page.evaluate((i) => Math.round(document.getElementById(i).getBoundingClientRect().top), id);

// Home page at both sizes
for (const [name, viewport] of [['desktop', DESKTOP], ['mobile', MOBILE]]) {
  const { page, errors } = await openPage(viewport);
  await scrollThrough(page);
  const m = await page.evaluate(() => {
    // Optional owner-added media (Moments, Talks on video) is excluded from the height budget (Ruling 11).
    const h = (el) => {
      if (!el) return 0;
      const cs = getComputedStyle(el);
      return el.getBoundingClientRect().height + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);
    };
    const videos = document.querySelector('.videos');
    const videosTitle = videos?.previousElementSibling?.matches('h3.block-title') ? videos.previousElementSibling : null;
    const optional = h(document.getElementById('moments')) + h(videos) + h(videosTitle);
    return {
      height: Math.round(document.body.scrollHeight - optional),
      hidden: [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).opacity === '0').length,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log(`  ${name} home height (excluding optional media): ${m.height}px`);
  check(m.hidden === 0, `${name}: no content stuck hidden after scrolling (${m.hidden})`);
  check(!m.overflow, `${name}: no horizontal overflow`);
  check(errors.length === 0, `${name}: no console errors ${errors.join(' | ')}`);
  if (name === 'desktop') check(m.height <= 12000, `desktop: home height ≤ 12,000px (${m.height})`);
  await page.close();
}

// Routing
{
  const { page, errors } = await openPage(DESKTOP, '#/publications');
  await page.waitForSelector('.work', { timeout: 5000 }).catch(() => {});
  check((await page.locator('.work').count()) === 38, 'publications deep link lists all 38 works');

  await page.evaluate(() => { location.hash = '#/publications?theme=bioinorganic'; });
  await page.waitForTimeout(400);
  check((await page.locator('.work').count()) === 3, '?theme=bioinorganic pre-filters to 3 works');

  const back = page.locator('.pubs__back');
  if (await back.count()) {
    await back.click();
    await page.waitForTimeout(1500);
    const t = await topOf(page, 'research');
    check(Math.abs(t - 72) <= 4, `"Back to the story" lands on Research (top=${t})`);
  } else check(false, '"Back to the story" link exists');

  await page.evaluate(() => { location.hash = '#/publications'; });
  await page.waitForTimeout(400);
  await page.click('.nav__links a[href="#career"]').catch(() => {});
  await page.waitForTimeout(1500);
  const c = await page.evaluate(() => document.getElementById('career') ? Math.round(document.getElementById('career').getBoundingClientRect().top) : null);
  check(c !== null && Math.abs(c - 72) <= 4, `nav anchor from Publications lands on Career (top=${c})`);
  check(errors.length === 0, `routing: no console errors ${errors.join(' | ')}`);
  await page.close();
}

// Print
{
  const { page } = await openPage(DESKTOP);
  await page.emulateMedia({ media: 'print' });
  const p = await page.evaluate(() => ({
    navHidden: getComputedStyle(document.querySelector('.nav')).display === 'none',
    hidden: [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).opacity === '0').length,
    bars: [...document.querySelectorAll('.gantt__bar')].map((e) => e.getBoundingClientRect().width),
  }));
  check(p.navHidden, 'print: navigation hidden');
  check(p.hidden === 0, `print: all content visible without scrolling (${p.hidden} hidden)`);
  check(p.bars.length > 0 && p.bars.every((w) => w > 0), 'print: service timeline bars visible');
  const pdf = path.join(os.tmpdir(), 'nemi-jain-print.pdf');
  await page.pdf({ path: pdf, format: 'Letter', printBackground: false });
  console.log(`  print PDF: ${pdf}`);
  await page.close();

  const { page: narrow } = await openPage({ width: 700, height: 900 });
  await narrow.emulateMedia({ media: 'print' });
  const pr = await narrow.evaluate(() => ({
    chapters: [...document.querySelectorAll('.jy-print > li')].filter((li) => li.getBoundingClientRect().height > 0).length,
    route: [...document.querySelectorAll('.jy-route path')].map((p) => parseFloat(getComputedStyle(p).strokeDashoffset)),
  }));
  check(pr.chapters === 7, `print: all 7 career chapters listed (${pr.chapters})`);
  check(pr.route.length === 5 && pr.route.every((o) => o === 0), 'print: full journey route drawn on the map');
  await narrow.close();
}

// Career journey interaction (reduced motion => instant moves)
{
  const page = await browser.newPage({ viewport: DESKTOP, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const title = () => page.locator('.jy-chapter__lead h3').innerText();
  await page.click('.jy-next');
  check((await title()) === 'Teaching the next generation', '"Next stop" advances to chapter 2');
  await page.locator('.jy-tab').nth(5).click();
  check((await title()) === 'Building labs, leading people', 'stop tab jumps to Cleveland');
  await page.keyboard.press('ArrowRight');
  check((await title()) === 'Giving it forward', 'arrow key moves to the next chapter while focus is in the journey');
  await page.locator('.jy-mark').first().click();
  check((await title()) === 'A chemist in the making', 'ruler marker returns to Jaipur');
  check(errors.length === 0, `journey: no console errors ${errors.join(' | ')}`);
  await page.close();
}

await browser.close();
if (failures.length) {
  console.log(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nAll checks passed');
