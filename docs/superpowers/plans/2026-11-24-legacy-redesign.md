# Legacy Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single long page into a story-first home page plus a lazy-loaded Publications page, and close the measured accessibility/SEO/performance gaps, with opt-in photo/video sections.

**Architecture:** Hash-based routing (`#/publications?theme=…`) parsed by a pure `parseHash()` and exposed through a `useRoute()` hook; section anchors (`#career`) keep working on the home route. Pure logic (routing, citation formatting, media visibility) is unit-tested with Vitest; page-level behaviour is verified by a Playwright (system Chrome) QA script that encodes the spec's acceptance criteria.

**Tech Stack:** React 18, Vite 5, Framer Motion 11, lucide-react, Vitest 2, playwright-core 1 (driving `/Applications/Google Chrome.app`), @fontsource (Instrument Serif, Inter).

**Spec:** `docs/superpowers/specs/2026-11-24-legacy-redesign-design.md`

## Global Constraints

- Node is at `~/.local/node/bin` — prefix commands with `export PATH="$HOME/.local/node/bin:$PATH"`.
- Run all commands from `nemi-jain-portfolio/`.
- The project is **not a git repository**; "checkpoint" steps replace commits (run the stated checks, then continue).
- No placeholders in the UI: `gallery` / `videos` empty ⇒ nothing rendered.
- Lighthouse targets: Accessibility 100, SEO 100, Best Practices 100, Performance ≥ 96.
- Desktop (1440×900) home height ≤ 12,000px (revised by Ruling 6; was 11,000).
- Colour token `--soft` must be `#636872` (≥ 4.5:1 on `#f7f5f0`, `#efebe3`, `#ffffff`).
- Heading levels must never skip (h2 → h3 → h4).
- Section numbering stays: Profile 01, Career 02, Research 03, Expertise 04, Leadership 05, Service 06, Connect 07.

## File Map

| File | Responsibility |
|---|---|
| `src/lib/route.js` (new) | `parseHash(hash)`, `publicationsHref(theme?)` — pure |
| `src/lib/citation.js` (new) | `formatCitation(work)` — pure |
| `src/hooks/useRoute.js` (new) | Subscribes to `hashchange`, returns parsed route |
| `src/components/Publications.jsx` (new, lazy) | Full bibliography page |
| `src/components/CopyButton.jsx` (new) | Clipboard button with "Copied" state |
| `src/components/Media.jsx` (new) | `Moments` (photos) and `Videos` (click-to-load) |
| `src/components/BackToTop.jsx` (new) | Floating back-to-top button |
| `scripts/qa.mjs` (new) | End-to-end acceptance checks |
| `src/App.jsx` | Route switch, skip link, section scrolling |
| `src/components/Nav.jsx` | New links, Publications link, progress bar |
| `src/components/Research.jsx` | Rewritten as "highlights" |
| `src/components/About.jsx`, `Expertise.jsx`, `Service.jsx`, `ui.jsx` | Trims / heading fixes / `AuthorList` |
| `src/data/profile.js`, `src/data/research.js` | De-dup, `gallery`, `videos`, `landmark` flags |
| `src/styles.css` | Tokens, new components, mobile, print |
| `index.html`, `public/robots.txt`, `src/main.jsx` | SEO meta, JSON-LD, fonts |

---

### Task 1: Test tooling and acceptance script

**Files:**
- Modify: `package.json`
- Create: `scripts/qa.mjs`

**Interfaces:**
- Produces: `npm test` (Vitest, `src/**/*.test.{js,jsx}`), `npm run qa` (expects a server at `QA_URL`, default `http://localhost:4173/`).

- [ ] **Step 1: Install dev tooling**

Run: `npm i -D vitest@2 playwright-core@1`

- [ ] **Step 2: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "qa": "node scripts/qa.mjs"
}
```

- [ ] **Step 3: Write `scripts/qa.mjs`**

```js
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
  const m = await page.evaluate(() => ({
    height: document.body.scrollHeight,
    hidden: [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).opacity === '0').length,
    overflow: document.documentElement.scrollWidth > window.innerWidth,
  }));
  console.log(`  ${name} home height: ${m.height}px`);
  check(m.hidden === 0, `${name}: no content stuck hidden after scrolling (${m.hidden})`);
  check(!m.overflow, `${name}: no horizontal overflow`);
  check(errors.length === 0, `${name}: no console errors ${errors.join(' | ')}`);
  if (name === 'desktop') check(m.height <= 11000, `desktop: home height ≤ 11,000px (${m.height})`);
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
  }));
  check(p.navHidden, 'print: navigation hidden');
  check(p.hidden === 0, `print: all content visible without scrolling (${p.hidden} hidden)`);
  const pdf = path.join(os.tmpdir(), 'nemi-jain-print.pdf');
  await page.pdf({ path: pdf, format: 'Letter', printBackground: false });
  console.log(`  print PDF: ${pdf}`);
  await page.close();
}

await browser.close();
if (failures.length) {
  console.log(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nAll checks passed');
```

- [ ] **Step 4: Run it against the current site to confirm it fails**

Run: `npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 2 && npm run qa`
Expected: FAIL — at least "desktop: home height ≤ 11,000px", "publications deep link lists all 38 works", "print: navigation hidden".

- [ ] **Step 5: Checkpoint** — `npm test` reports "No test files found" (exit 1 is acceptable at this stage).

---

### Task 2: Routing, citation formatting and the Publications page

**Files:**
- Create: `src/lib/route.js`, `src/lib/route.test.js`, `src/lib/citation.js`, `src/lib/citation.test.js`, `src/hooks/useRoute.js`, `src/components/CopyButton.jsx`, `src/components/Publications.jsx`
- Modify: `src/components/ui.jsx` (add `AuthorList`), `src/App.jsx`, `src/components/Nav.jsx`, `src/styles.css`

**Interfaces:**
- Produces: `parseHash(hash: string) → { page: 'home'|'publications', theme: string|null, section: string|null }`; `publicationsHref(theme?: string) → string`; `formatCitation(work) → string`; `useRoute() → route`; `<AuthorList authors="A, N. C. Jain" />`; `<CopyButton text label? />`; `<Publications theme={string|null} />`; `<Nav page="home"|"publications" />`.

- [ ] **Step 1: Write failing tests**

`src/lib/route.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { parseHash, publicationsHref } from './route.js';

const HOME = { page: 'home', theme: null, section: null };

describe('parseHash', () => {
  it('treats empty, root and unknown routes as home', () => {
    for (const h of ['', '#', '#/', '#/unknown']) expect(parseHash(h)).toEqual(HOME);
  });
  it('keeps section anchors on the home page', () => {
    expect(parseHash('#career')).toEqual({ page: 'home', theme: null, section: 'career' });
  });
  it('parses the publications route with and without a theme', () => {
    expect(parseHash('#/publications')).toEqual({ page: 'publications', theme: null, section: null });
    expect(parseHash('#/publications?theme=bioinorganic').theme).toBe('bioinorganic');
  });
  it('round-trips publicationsHref', () => {
    expect(parseHash(publicationsHref('surfaces')).theme).toBe('surfaces');
    expect(parseHash(publicationsHref())).toEqual({ page: 'publications', theme: null, section: null });
  });
});
```

`src/lib/citation.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { formatCitation } from './citation.js';

describe('formatCitation', () => {
  it('formats authors, year, title, venue and DOI URL', () => {
    expect(
      formatCitation({
        year: 1978,
        title: 'Volatile Double Isopropoxides of Tin with Aluminium',
        venue: 'Journal of Inorganic and Nuclear Chemistry 40, 349–351',
        doi: '10.1016/0022-1902(78)80139-0',
        authors: 'R. C. Mehrotra, A. K. Rai, N. C. Jain',
      })
    ).toBe(
      'R. C. Mehrotra, A. K. Rai, N. C. Jain (1978). Volatile Double Isopropoxides of Tin with Aluminium. Journal of Inorganic and Nuclear Chemistry 40, 349–351. https://doi.org/10.1016/0022-1902(78)80139-0'
    );
  });
  it('handles a missing year and DOI', () => {
    expect(formatCitation({ title: 'X', venue: 'Y', authors: 'A' })).toBe('A (n.d.). X. Y.');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test`
Expected: FAIL — "Failed to resolve import './route.js'" and "./citation.js".

- [ ] **Step 3: Implement the pure modules**

`src/lib/route.js`:
```js
export const PUBLICATIONS = 'publications';

export function parseHash(hash = '') {
  const raw = hash.replace(/^#/, '');
  if (raw.startsWith('/')) {
    const [path, query = ''] = raw.slice(1).split('?');
    if (path === PUBLICATIONS) {
      const theme = new URLSearchParams(query).get('theme');
      return { page: PUBLICATIONS, theme: theme || null, section: null };
    }
    return { page: 'home', theme: null, section: null };
  }
  return { page: 'home', theme: null, section: raw || null };
}

export function publicationsHref(theme) {
  return theme ? `#/${PUBLICATIONS}?theme=${encodeURIComponent(theme)}` : `#/${PUBLICATIONS}`;
}
```

`src/lib/citation.js`:
```js
export function formatCitation(work) {
  const parts = [`${work.authors} (${work.year ?? 'n.d.'}).`, `${work.title}.`];
  if (work.venue) parts.push(`${work.venue}.`);
  if (work.doi) parts.push(`https://doi.org/${work.doi}`);
  return parts.join(' ');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (6 tests).

- [ ] **Step 5: Hook, shared components**

`src/hooks/useRoute.js`:
```js
import { useEffect, useState } from 'react';
import { parseHash } from '../lib/route.js';

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
```

Append to `src/components/ui.jsx`:
```jsx
export function AuthorList({ authors, highlight = 'N. C. Jain' }) {
  const names = authors.split(', ');
  return (
    <>
      {names.map((a, i) => (
        <span key={a}>
          {a === highlight ? <strong>{a}</strong> : a}
          {i < names.length - 1 && ', '}
        </span>
      ))}
    </>
  );
}
```

`src/components/CopyButton.jsx`:
```jsx
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyButton({ text, label = 'Copy citation' }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" className="copy-btn" onClick={copy}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </button>
  );
}
```

- [ ] **Step 6: Publications page** — `src/components/Publications.jsx`:
```jsx
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import CopyButton from './CopyButton.jsx';
import { AuthorList } from './ui.jsx';
import { orcid, themes, works, typeLabels } from '../data/research.js';
import { formatCitation } from '../lib/citation.js';

const validTheme = (t) => (t && themes[t] ? t : 'all');

export default function Publications({ theme: requestedTheme }) {
  const [theme, setTheme] = useState(validTheme(requestedTheme));
  const [type, setType] = useState('all');

  useEffect(() => setTheme(validTheme(requestedTheme)), [requestedTheme]);

  useEffect(() => {
    const previous = document.title;
    document.title = 'Publications — Dr. Nemi Jain';
    return () => {
      document.title = previous;
    };
  }, []);

  const filtered = works.filter((w) => (theme === 'all' || w.theme === theme) && (type === 'all' || w.type === type));
  const cited = works.filter((w) => w.doi);

  return (
    <div className="pubs">
      <div className="container">
        <a href="#research" className="pubs__back">
          <ArrowLeft size={16} /> Back to the story
        </a>
        <header className="pubs__head">
          <span className="kicker">Publications</span>
          <h1 className="pubs__title">Research record, 1976–2009</h1>
          <p className="sh__intro">
            {works.length} journal articles, conference papers, presentations and posters — from coordination chemistry to
            coatings science.
          </p>
          <a className="orcid-link" href={orcid.url} target="_blank" rel="noreferrer">
            <span className="orcid-badge">iD</span> ORCID {orcid.id}
          </a>
        </header>

        <section aria-labelledby="cited-title">
          <h2 id="cited-title" className="block-title">Journal articles with DOI</h2>
          <ol className="cites">
            {cited.map((w) => (
              <li key={w.doi} className="cite">
                <span className="cite__year">{w.year}</span>
                <div>
                  <a href={`https://doi.org/${w.doi}`} target="_blank" rel="noreferrer" className="cite__title">
                    {w.title}
                  </a>
                  <p className="cite__authors">
                    <AuthorList authors={w.authors} />
                  </p>
                  <p className="cite__venue">
                    <em>{w.venue}</em> · doi:{w.doi}
                  </p>
                  <CopyButton text={formatCitation(w)} />
                </div>
                <ArrowUpRight size={18} className="cite__arrow" aria-hidden />
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="all-title">
          <h2 id="all-title" className="block-title">All works</h2>
          <div className="filters-row">
            <div className="tabs" role="group" aria-label="Filter by type">
              {['all', ...Object.keys(typeLabels)].map((t) => (
                <button key={t} aria-pressed={type === t} className={type === t ? 'is-active' : ''} onClick={() => setType(t)}>
                  {t === 'all' ? 'All types' : typeLabels[t]}
                </button>
              ))}
            </div>
            <div className="tabs" role="group" aria-label="Filter by research theme">
              {['all', ...Object.keys(themes)].map((k) => (
                <button key={k} aria-pressed={theme === k} className={theme === k ? 'is-active' : ''} onClick={() => setTheme(k)}>
                  {k !== 'all' && <i className="tabs__dot" style={{ background: themes[k].color }} />}
                  {k === 'all' ? 'All themes' : themes[k].short}
                </button>
              ))}
            </div>
          </div>
          <p className="biblio__count" aria-live="polite">
            Showing {filtered.length} of {works.length}
          </p>
          <ul className="works">
            {filtered.map((w) => (
              <li key={w.title} className="work">
                <span className="work__year">{w.year ?? 'n.d.'}</span>
                <span className="work__dot" style={{ background: themes[w.theme].color }} title={themes[w.theme].label} />
                <div className="work__body">
                  {w.doi ? (
                    <a href={`https://doi.org/${w.doi}`} target="_blank" rel="noreferrer" className="work__title">
                      {w.title} <ArrowUpRight size={14} aria-hidden />
                    </a>
                  ) : (
                    <span className="work__title">{w.title}</span>
                  )}
                  <span className="work__venue">{w.venue}</span>
                </div>
                <span className="work__type">{typeLabels[w.type]}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Route switch in `src/App.jsx`** (full file):
```jsx
import { lazy, Suspense, useEffect } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Career from './components/Career.jsx';
import Research from './components/Research.jsx';
import Expertise from './components/Expertise.jsx';
import Leadership from './components/Leadership.jsx';
import Service from './components/Service.jsx';
import Contact from './components/Contact.jsx';
import { useRoute } from './hooks/useRoute.js';

const Publications = lazy(() => import('./components/Publications.jsx'));

function skipToMain(e) {
  e.preventDefault();
  document.getElementById('main')?.focus();
}

export default function App() {
  const route = useRoute();
  const onPublications = route.page === 'publications';

  // Same-page anchors scroll natively; this handles first load and returning from Publications.
  useEffect(() => {
    if (onPublications) {
      window.scrollTo(0, 0);
      return;
    }
    if (route.section) {
      requestAnimationFrame(() => document.getElementById(route.section)?.scrollIntoView());
    }
  }, [route.page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <a className="skip-link" href="#main" onClick={skipToMain}>
        Skip to content
      </a>
      <Nav page={route.page} />
      <main id="main" tabIndex={-1}>
        {onPublications ? (
          <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
            <Publications theme={route.theme} />
          </Suspense>
        ) : (
          <>
            <Hero />
            <About />
            <Career />
            <Research />
            <Expertise />
            <Leadership />
            <Service />
          </>
        )}
      </main>
      <Contact />
    </>
  );
}
```

- [ ] **Step 8: Nav** — replace `src/components/Nav.jsx`:
```jsx
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { publicationsHref } from '../lib/route.js';

const LINKS = [
  { id: 'profile', label: 'Story' },
  { id: 'career', label: 'Career' },
  { id: 'research', label: 'Research' },
  { id: 'service', label: 'Service' },
  { id: 'contact', label: 'Connect' },
];

export default function Nav({ page }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      setScrolled(window.scrollY > 24);
      if (page !== 'home') {
        setActive('');
        return;
      }
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current = '';
      for (const { id } of LINKS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [page]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled || page !== 'home' ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__brand" onClick={close}>
          Nemi Jain<span>, Ph.D.</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? 'is-active' : ''}
              aria-current={active === l.id ? 'location' : undefined}
              onClick={close}
            >
              {l.label}
            </a>
          ))}
          <a
            href={publicationsHref()}
            className={`nav__pub ${page === 'publications' ? 'is-active' : ''}`}
            aria-current={page === 'publications' ? 'page' : undefined}
            onClick={close}
          >
            Publications
          </a>
        </nav>
        <button
          className="nav__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className="nav__progress" aria-hidden>
        <span ref={barRef} />
      </div>
    </header>
  );
}
```

- [ ] **Step 9: Styles** — append before `/* ---------- responsive ---------- */` in `src/styles.css`:
```css
/* ---------- publications page ---------- */
.pubs {
  padding: 128px 0 112px;
}
.pubs__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 40px;
}
.pubs__back:hover {
  color: var(--ink);
}
.pubs__head {
  max-width: 780px;
  margin-bottom: 24px;
}
.pubs__title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: clamp(44px, 6vw, 80px);
  line-height: 1.02;
  margin: 16px 0 20px;
}
.pubs__head .orcid-link {
  margin-top: 20px;
}
.filters-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tabs__dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}
.tabs button {
  display: inline-flex;
  align-items: center;
}
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 5px 10px;
  border: 1px solid var(--line);
  font-size: 12.5px;
  color: var(--muted);
  transition: all 0.2s;
}
.copy-btn:hover {
  color: var(--ink);
  border-color: var(--ink);
}
.page-loading {
  min-height: 100vh;
}

/* ---------- nav additions ---------- */
.nav__links .nav__pub {
  padding: 6px 14px;
  margin: -7px 0;
  border: 1px solid var(--ink);
  color: var(--ink);
}
.nav__links .nav__pub::after {
  display: none;
}
.nav__links .nav__pub:hover,
.nav__links .nav__pub.is-active {
  background: var(--ink);
  color: var(--paper);
}
.nav__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  pointer-events: none;
}
.nav__progress span {
  display: block;
  height: 100%;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: 0 50%;
}
```
And inside `@media (max-width: 900px)` add:
```css
  .nav--open .nav__links .nav__pub {
    margin: 14px 0 0;
    padding: 12px 16px;
    text-align: center;
  }
  .pubs {
    padding: 104px 0 80px;
  }
```

- [ ] **Step 10: Verify**

Run: `npm test && npm run build && npm run qa`
Expected: unit tests PASS; QA routing checks ("deep link lists all 38", "pre-filters to 3", "Back to the story", "nav anchor from Publications") PASS. Home-height and print checks still FAIL (later tasks).

- [ ] **Step 11: Checkpoint** — open `http://localhost:4173/#/publications` and confirm the page renders.

---

### Task 3: Story-first home (Research highlights, de-duplication, heading order)

**Files:**
- Modify: `src/components/Research.jsx` (replace), `src/components/About.jsx` (replace), `src/components/Expertise.jsx`, `src/components/Service.jsx`, `src/data/research.js`, `src/data/profile.js`, `src/styles.css`

**Interfaces:**
- Consumes: `publicationsHref`, `AuthorList` (Task 2).
- Produces: `works[i].landmark: boolean` on three works; `Research` no longer renders the bibliography.

- [ ] **Step 1: Mark landmark papers in `src/data/research.js`** — add `landmark: true` to the works whose `doi` is `10.1021/ic00269a008`, `10.1016/0022-1902(78)80139-0`, `10.1515/znb-1980-1214`. Example:
```js
  { year: 1987, theme: 'bioinorganic', type: 'article', landmark: true, title: 'Synthetic Model Approach to the Active Site of Cytochrome c Oxidase: …', venue: 'Inorganic Chemistry 26(22), 3655–3659', doi: '10.1021/ic00269a008', authors: 'C. M. Elliott, N. C. Jain, B. K. Cranmer, A. W. Hamburg' },
```

- [ ] **Step 2: Replace `src/components/Research.jsx`**
```jsx
import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { AuthorList, Reveal, SectionHeader } from './ui.jsx';
import { themes, works, speaking, venues } from '../data/research.js';
import { publicationsHref } from '../lib/route.js';

const FIRST = 1976;
const LAST = 2009;
const YEARS = Array.from({ length: LAST - FIRST + 1 }, (_, i) => FIRST + i);

export default function Research() {
  const [hover, setHover] = useState(null);

  const { byTheme, articles, countries, byYear } = useMemo(() => {
    const byTheme = Object.fromEntries(Object.keys(themes).map((k) => [k, 0]));
    const byYear = Object.fromEntries(YEARS.map((y) => [y, []]));
    works.forEach((w) => {
      byTheme[w.theme]++;
      if (w.year) byYear[w.year].push(w);
    });
    return {
      byTheme,
      byYear,
      articles: works.filter((w) => w.type === 'article').length,
      countries: new Set(venues.map((v) => v.country)).size,
    };
  }, []);

  const landmarks = works.filter((w) => w.landmark);
  const summary = Object.entries(themes)
    .map(([k, t]) => `${byTheme[k]} on ${t.label.toLowerCase()} (${t.years})`)
    .join('; ');

  return (
    <section id="research" className="section">
      <div className="container">
        <SectionHeader
          num="03"
          label="Research"
          title="Fifty years of published science."
          intro="From synthetic inorganic chemistry in Jaipur and Delhi, to enzyme-model chemistry in Virginia and Colorado, to analytical and surface science for the coatings industry."
        />

        <Reveal>
          <dl className="r-stats">
            <div><dt>{works.length}</dt><dd>Publications & presentations</dd></div>
            <div><dt>{articles}</dt><dd>Peer-reviewed journal articles</dd></div>
            <div><dt>{venues.length}</dt><dd>Cities presented in</dd></div>
            <div><dt>{countries}</dt><dd>Countries</dd></div>
          </dl>
        </Reveal>

        <Reveal>
          <figure className="output">
            <figcaption className="output__head">
              <span className="mini-title">Output by year, {FIRST}–{LAST}</span>
              <span className="output__hint" aria-hidden>
                {hover ? (
                  <>
                    <strong>{hover.year}</strong> · {hover.title}
                  </>
                ) : (
                  'Hover a dot to see the work · click to explore that theme'
                )}
              </span>
            </figcaption>
            <p className="sr-only">Works by research theme: {summary}.</p>
            <div className="output__plot" aria-hidden onMouseLeave={() => setHover(null)}>
              {YEARS.map((y) => (
                <div key={y} className="output__col">
                  <div className="output__stack">
                    {byYear[y].map((w) => (
                      <a
                        key={w.title}
                        href={publicationsHref(w.theme)}
                        tabIndex={-1}
                        className="output__dot"
                        style={{ background: themes[w.theme].color }}
                        onMouseEnter={() => setHover(w)}
                      />
                    ))}
                  </div>
                  <span className={`output__year ${y % 5 === 0 || y === FIRST || y === LAST ? 'is-label' : ''}`}>{y}</span>
                </div>
              ))}
            </div>
          </figure>
        </Reveal>

        <div className="themes">
          {Object.entries(themes).map(([k, t], i) => (
            <Reveal key={k} delay={i * 0.05}>
              <a className="theme" style={{ '--c': t.color }} href={publicationsHref(k)}>
                <span className="theme__bar" />
                <span className="theme__meta">
                  <span>{t.years}</span>
                  <span>{byTheme[k]} works</span>
                </span>
                <h3>{t.label}</h3>
                <span className="theme__where">{t.where}</span>
                <p>{t.text}</p>
                <span className="theme__link">
                  View works <ArrowRight size={14} aria-hidden />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <h3 className="block-title">Landmark papers</h3>
        <ol className="cites">
          {landmarks.map((w) => (
            <Reveal as="li" key={w.doi} className="cite">
              <span className="cite__year">{w.year}</span>
              <div>
                <a href={`https://doi.org/${w.doi}`} target="_blank" rel="noreferrer" className="cite__title">
                  {w.title}
                </a>
                <p className="cite__authors">
                  <AuthorList authors={w.authors} />
                </p>
                <p className="cite__venue">
                  <em>{w.venue}</em>
                </p>
              </div>
              <ArrowUpRight size={18} className="cite__arrow" aria-hidden />
            </Reveal>
          ))}
        </ol>
        <a href={publicationsHref()} className="btn btn--solid see-all">
          See all {works.length} works <ArrowRight size={16} aria-hidden />
        </a>

        <h3 className="block-title">Speaking, teaching & chairing</h3>
        <ul className="talks">
          {speaking.map((s) => (
            <Reveal as="li" key={s.year + s.title} className="talk">
              <span className="talk__year">{s.year}</span>
              <span className="talk__role">{s.role}</span>
              <div>
                <h4>{s.title}</h4>
                <span>{s.venue}</span>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <div className="venues">
            <span className="mini-title">Research presented in</span>
            <p>
              {venues.map((v, i) => (
                <span key={v.city}>
                  {v.city}
                  {i < venues.length - 1 && <b aria-hidden> · </b>}
                </span>
              ))}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Replace `src/components/About.jsx`** (education list removed)
```jsx
import { Reveal, SectionHeader } from './ui.jsx';
import { about } from '../data/profile.js';

export default function About() {
  return (
    <section id="profile" className="section">
      <div className="container">
        <SectionHeader num="01" label="Profile" title="Where rigorous science meets a life of service." />
        <div className="split">
          <div />
          <div>
            <Reveal>
              <p className="lead">{about.lead}</p>
            </Reveal>
            <Reveal className="about__body">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Reveal>
          </div>
        </div>
        <Reveal>
          <div className="focus">
            {about.focus.map((f, i) => (
              <div key={f.title} className="focus__item">
                <span className="focus__num">0{i + 1}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Expertise** — in `src/components/Expertise.jsx`, change the import to `import { markets, toolkit } from '../data/profile.js';`, delete the "Core competencies" `<h3>` and its `<Reveal>` block, and replace the toolkit block with:
```jsx
        <h3 className="block-title">Analytical toolkit</h3>
        <Reveal>
          <dl className="toolkit">
            {toolkit.map((g) => (
              <div key={g.group} className="toolkit__col">
                <dt className="mini-title">{g.group}</dt>
                <dd>
                  {g.items.map(([abbr, full], i) => (
                    <span key={abbr}>
                      <abbr title={full}>{abbr}</abbr>
                      {i < g.items.length - 1 && <b aria-hidden> · </b>}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
```

- [ ] **Step 5: Service heading order** — in `src/components/Service.jsx` change `<h4>{s.org}</h4>` to `<h3>{s.org}</h3>`.

- [ ] **Step 6: De-duplicate `src/data/profile.js`**
  - Delete the `export const education = [...]` block and the `export const competencies = [...]` block.
  - In `eras[0].entries` delete the `{ year: '1983', title: 'National Scholarship for Study Abroad', … }` entry.
  - In `eras[1].entries` delete the entries titled `'Grand Awards Judge, Chemistry'`, `'Session Chair & Meeting Organizer'`, `'President, Board of Trustees'`, `'Invited speaker on 150 years of innovation'`.
  - In `eras[2].entries` delete the entries titled `'Editorial Board Member'` and `'Chemical Consultant'`.

- [ ] **Step 7: Styles** — in `src/styles.css`:
  - Delete the rule blocks for `.about__cols`, `.about__body p`, `.edu*`, `.competencies*`, `.more*`, `.biblio__head`, `.block-title--flush`, `.theme.is-dim`, `.toolkit li*`, `.toolkit strong`, and change `.cause h4` → `.cause h3`; remove `.about__cols`, `.competencies` and `.toolkit` from the media-query selector lists.
  - Add:
```css
.about__body {
  columns: 2;
  column-gap: 56px;
}
.about__body p {
  color: var(--ink-2);
  margin-bottom: 20px;
  break-inside: avoid;
}
.theme__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 16px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ink);
}
.theme:hover .theme__link svg {
  transform: translateX(3px);
}
.theme__link svg {
  transition: transform 0.25s var(--ease);
}
.see-all {
  margin-top: 32px;
}
.output__dot {
  display: block;
}
.toolkit {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin: 0;
}
.toolkit__col {
  padding-top: 16px;
  border-top: 1px solid var(--line);
}
.toolkit dd {
  margin: 0;
  font-family: var(--serif);
  font-size: 24px;
  line-height: 1.5;
}
.toolkit abbr {
  text-decoration: none;
  cursor: help;
  border-bottom: 1px dotted var(--soft);
}
.toolkit b {
  font-weight: 400;
  color: var(--accent);
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
```
  - Inside `@media (max-width: 900px)` add `.about__body { columns: 1; }`.

- [ ] **Step 8: Verify**

Run: `npm test && npm run build && npm run qa`
Expected: PASS on "desktop: home height ≤ 11,000px" and all routing checks; console reports home height < 11,000. Print checks may still fail.

- [ ] **Step 9: Checkpoint** — Lighthouse heading-order check is re-verified in Task 6.

---

### Task 4: Reading experience (contrast, type, orientation aids, mobile, print)

**Files:**
- Create: `src/components/BackToTop.jsx`
- Modify: `src/App.jsx`, `src/styles.css`

**Interfaces:**
- Consumes: App from Task 2.
- Produces: `<BackToTop />` rendered after `<Contact />`.

- [ ] **Step 1: `src/components/BackToTop.jsx`**
```jsx
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <button className={`to-top ${show ? 'is-visible' : ''}`} onClick={toTop} aria-label="Back to top" tabIndex={show ? 0 : -1}>
      <ArrowUp size={18} />
    </button>
  );
}
```
In `src/App.jsx` add `import BackToTop from './components/BackToTop.jsx';` and render `<BackToTop />` after `<Contact />`.

- [ ] **Step 2: Tokens & type** — in `:root` set `--soft: #636872;`; in `body` set `font-size: 17px;`; change `.portrait { max-width: 340px; }` to `max-width: 280px;`.

- [ ] **Step 3: Add accessibility and orientation styles** (before the responsive section):
```css
/* ---------- accessibility & orientation ---------- */
.skip-link {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 100;
  padding: 10px 16px;
  background: var(--ink);
  color: var(--paper);
  font-size: 14px;
  transform: translateY(-200%);
  transition: transform 0.2s;
}
.skip-link:focus {
  transform: none;
}
main:focus {
  outline: none;
}
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
.section--dark :focus-visible,
.contact :focus-visible {
  outline-color: #d98b7f;
}
.to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 40;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--ink);
  color: var(--paper);
  box-shadow: 0 10px 24px -10px rgba(22, 26, 34, 0.6);
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
  transition: opacity 0.3s, transform 0.3s var(--ease), background 0.2s;
}
.to-top.is-visible {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
.to-top:hover {
  background: var(--accent);
}
```

- [ ] **Step 4: Mobile refinements** — inside `@media (max-width: 900px)`: change `.section { padding: 88px 0; }` to `padding: 72px 0;`, change `.era__sticky { position: static; }` to the block below, and add:
```css
  .era__aside {
    position: sticky;
    top: 72px;
    z-index: 5;
    margin: 0 -20px;
    padding: 12px 20px;
    background: var(--paper-2);
    border-bottom: 1px solid var(--line);
  }
  .era__sticky {
    position: static;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }
  .era__title {
    font-size: 24px;
    margin: 0;
  }
  .era__idx,
  .era__summary {
    display: none;
  }
  .to-top {
    right: 16px;
    bottom: 16px;
  }
```
Also in the same block reorder the `era__range` after the title by adding `.era__range { order: 2; white-space: nowrap; font-size: 12px; }`.

- [ ] **Step 5: Print stylesheet** — append at the end of `src/styles.css`:
```css
@media print {
  @page {
    margin: 16mm;
  }
  body {
    background: #fff;
    color: #000;
    font-size: 11pt;
  }
  .nav,
  .skip-link,
  .to-top,
  .hero__actions,
  .see-all,
  .copy-btn,
  .output__hint,
  .nav__progress {
    display: none !important;
  }
  main *,
  .contact * {
    opacity: 1 !important;
    transform: none !important;
  }
  .section,
  .section--tint,
  .section--dark,
  .contact {
    background: #fff !important;
    color: #000 !important;
    padding: 24pt 0;
  }
  .section--dark *,
  .contact * {
    color: #000 !important;
  }
  .hero {
    padding-top: 0;
  }
  .era__sticky {
    position: static;
  }
  .entry,
  .cite,
  .talk,
  .honor,
  .chip,
  .role,
  .theme,
  .cause {
    break-inside: avoid;
  }
  .sh__title,
  .block-title {
    break-after: avoid;
  }
}
```

- [ ] **Step 6: Verify**

Run: `npm run build && npm run qa`
Expected: all checks PASS, including "print: navigation hidden" and "print: all content visible without scrolling".

- [ ] **Step 7: Checkpoint** — Tab from the top of `http://localhost:4173/`: the first Tab reveals "Skip to content"; focused links show a red outline.

---

### Task 5: Opt-in photos and video

**Files:**
- Create: `src/components/Media.jsx`, `src/components/Media.test.jsx`
- Modify: `src/data/profile.js`, `src/App.jsx`, `src/components/Research.jsx`, `src/styles.css`, `README.md`

**Interfaces:**
- Produces: `gallery: Array<{ src, alt, caption?, year? }>`, `videos: Array<{ title, youtubeId, event?, year? }>` exported from `profile.js`; `<Moments items />`, `<Videos items />` return `null` when empty.

- [ ] **Step 1: Write the failing test** — `src/components/Media.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Moments, Videos } from './Media.jsx';

describe('media sections', () => {
  it('render nothing when no content is provided', () => {
    expect(renderToString(<Moments items={[]} />)).toBe('');
    expect(renderToString(<Videos items={[]} />)).toBe('');
  });
  it('render provided photos and videos', () => {
    const photos = renderToString(<Moments items={[{ src: '/a.jpg', alt: 'At the lab', caption: 'Lab', year: 1990 }]} />);
    expect(photos).toContain('alt="At the lab"');
    const vids = renderToString(<Videos items={[{ title: 'ACS talk', youtubeId: 'abc123', year: 2016 }]} />);
    expect(vids).toContain('Play video: ACS talk');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test`
Expected: FAIL — "Failed to resolve import './Media.jsx'".

- [ ] **Step 3: Implement `src/components/Media.jsx`**
```jsx
import { useState } from 'react';
import { Play } from 'lucide-react';
import { Reveal } from './ui.jsx';

export function Moments({ items }) {
  if (!items?.length) return null;
  return (
    <section id="moments" className="section moments" aria-labelledby="moments-title">
      <div className="container">
        <h2 id="moments-title" className="block-title moments__title">Moments</h2>
        <div className="moments__strip">
          {items.map((p) => (
            <Reveal as="figure" key={p.src} className="moment">
              <img src={p.src} alt={p.alt} loading="lazy" />
              {(p.caption || p.year) && (
                <figcaption>
                  {p.caption}
                  {p.year && <span> · {p.year}</span>}
                </figcaption>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Videos({ items }) {
  if (!items?.length) return null;
  return (
    <>
      <h3 className="block-title">Talks on video</h3>
      <div className="videos">
        {items.map((v) => (
          <VideoCard key={v.youtubeId} video={v} />
        ))}
      </div>
    </>
  );
}

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="video">
      <div className="video__frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            className="video__poster"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${video.title}`}
            style={{ backgroundImage: `url(https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg)` }}
          >
            <span className="video__play">
              <Play size={22} />
            </span>
          </button>
        )}
      </div>
      <figcaption>
        <strong>{video.title}</strong>
        <span>{[video.event, video.year].filter(Boolean).join(' · ')}</span>
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (8 tests).

- [ ] **Step 5: Wire data and sections**
  - Append to `src/data/profile.js`:
```js
// Photos: put files in /public/photos and list them here, e.g.
// { src: '/photos/acs-2016.jpg', alt: 'Dr. Jain speaking at the Cleveland ACS section', caption: 'Cleveland ACS', year: 2016 }
export const gallery = [];

// YouTube talks: the id is the part after "v=" in the URL, e.g.
// { title: 'Analytical Sciences for Formulators', youtubeId: 'dQw4w9WgXcQ', event: 'Sink or Swim', year: 2012 }
export const videos = [];
```
  - `src/App.jsx`: `import { Moments } from './components/Media.jsx';` and `import { gallery } from './data/profile.js';`; render `<Moments items={gallery} />` between `<About />` and `<Career />`.
  - `src/components/Research.jsx`: `import { Videos } from './Media.jsx';` and `import { videos } from '../data/profile.js';`; render `<Videos items={videos} />` immediately before the venues `<Reveal>`.

- [ ] **Step 6: Styles** (before the responsive section):
```css
/* ---------- media (opt-in) ---------- */
.moments__title {
  margin-top: 0;
}
.moments__strip {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(260px, 1fr);
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 12px;
}
.moment {
  margin: 0;
  scroll-snap-align: start;
}
.moment img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
.moment figcaption {
  margin-top: 10px;
  font-size: 14px;
  color: var(--muted);
}
.videos {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.video {
  margin: 0;
}
.video__frame {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--ink);
}
.video__frame iframe,
.video__poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.video__poster {
  background-size: cover;
  background-position: center;
}
.video__play {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin: auto;
  border-radius: 50%;
  background: rgba(22, 26, 34, 0.85);
  color: var(--paper);
  transition: background 0.2s;
}
.video__poster:hover .video__play {
  background: var(--accent);
}
.video figcaption {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
}
.video figcaption strong {
  font-family: var(--serif);
  font-weight: 400;
  font-size: 22px;
}
.video figcaption span {
  font-size: 13.5px;
  color: var(--muted);
}
```
Inside `@media (max-width: 900px)` add `.videos { grid-template-columns: 1fr; }`.

- [ ] **Step 7: README** — append:
```markdown
## Content to send later

These sections stay hidden until content is added to `src/data/profile.js`:

- [ ] High-resolution portrait (replace `public/nemi.jpg`, ideally ≥ 800×800)
- [ ] Career and event photos → `public/photos/` + `gallery` list (shows a "Moments" strip)
- [ ] YouTube links of talks → `videos` list (shows "Talks on video" in Research)
- [ ] Optional public contact email (add to the Connect section)
```

- [ ] **Step 8: Verify the opt-in behaviour end-to-end** — temporarily set `gallery = [{ src: '/nemi.jpg', alt: 'Test', caption: 'Test', year: 2025 }]` and `videos = [{ title: 'Test', youtubeId: 'abc123' }]`, run `npm run dev`, confirm both sections appear on `http://localhost:5173/`, then restore both to `[]` and confirm they disappear.

---

### Task 6: SEO, sharing and performance

**Files:**
- Modify: `index.html`, `src/main.jsx`, `package.json`
- Create: `public/robots.txt`

- [ ] **Step 1: Self-host fonts**

Run: `npm i @fontsource/instrument-serif @fontsource/inter`

Add to the top of `src/main.jsx`:
```js
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
```

- [ ] **Step 2: Replace `index.html`**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dr. Nemi Jain — Chemist, R&amp;D Leader, Mentor</title>
    <meta name="description" content="Dr. Nemi Jain — chemist, former R&amp;D senior manager at The Sherwin-Williams Company, ACS Career Consultant, mentor and United Nations volunteer. Five decades of science, leadership and service." />
    <meta name="theme-color" content="#f7f5f0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <meta property="og:type" content="profile" />
    <meta property="og:title" content="Dr. Nemi Jain — Chemist, R&amp;D Leader, Mentor" />
    <meta property="og:description" content="Five decades of chemistry, 35 years of coatings R&amp;D at Sherwin-Williams, 38 publications, and two decades of community and global service." />
    <meta property="og:image" content="/nemi.jpg" />
    <meta property="profile:first_name" content="Nemi" />
    <meta property="profile:last_name" content="Jain" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Dr. Nemi Jain — Chemist, R&amp;D Leader, Mentor" />
    <meta name="twitter:image" content="/nemi.jpg" />

    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Nemi Jain",
        "honorificPrefix": "Dr.",
        "jobTitle": "Chemist; former R&D Senior Manager",
        "description": "Chemist and R&D leader; ACS Career Consultant; mentor and United Nations volunteer.",
        "image": "/nemi.jpg",
        "address": { "@type": "PostalAddress", "addressLocality": "Cleveland", "addressRegion": "OH", "addressCountry": "US" },
        "alumniOf": [
          { "@type": "CollegeOrUniversity", "name": "University of Rajasthan" },
          { "@type": "CollegeOrUniversity", "name": "University of Virginia" },
          { "@type": "CollegeOrUniversity", "name": "Colorado State University" }
        ],
        "worksFor": { "@type": "Organization", "name": "The Sherwin-Williams Company" },
        "memberOf": [
          { "@type": "Organization", "name": "American Chemical Society" },
          { "@type": "Organization", "name": "Cleveland Coatings Society" }
        ],
        "sameAs": [
          "https://www.linkedin.com/in/nemijain",
          "https://orcid.org/0000-0002-4617-4183",
          "https://www.acs.org/careers/career-consultants/nemi-jain.html",
          "https://chemconsultants.org/Sys/PublicProfile/96262278"
        ]
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 3: `public/robots.txt`**
```
User-agent: *
Allow: /
```

- [ ] **Step 4: Verify**

Run: `npm run build && npm run qa`
Expected: PASS; `dist/assets` contains `.woff2` files and `index.html` has no `fonts.googleapis.com` reference (`grep -c googleapis dist/index.html` → `0`).

---

### Task 7: Final verification against the spec

- [ ] **Step 1: Unit tests** — `npm test` → 8 passed.
- [ ] **Step 2: Acceptance** — `npm run build && npm run qa` (preview running on 4173) → "All checks passed".
- [ ] **Step 3: Lighthouse**

Run:
```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npx lighthouse http://localhost:4173/ --quiet --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh-after.json
node -e "const d=require('/tmp/lh-after.json');for(const[k,c]of Object.entries(d.categories))console.log(k,Math.round(c.score*100))"
```
Expected: accessibility 100, seo 100, best-practices 100, performance ≥ 96. If not, fix the listed audits and repeat.
- [ ] **Step 4: Visual review** — capture desktop and mobile screenshots of Hero, Research, Career (mobile sticky chapter header) and Publications; inspect for layout regressions.
- [ ] **Step 5: Stop the preview server** and leave the dev server on 5173 running.
