# Legacy Redesign — Design Spec

**Date:** 2026-11-24 · **Status:** Approved in chat, pending written-spec review

## Goal

Refine Dr. Nemi Jain's website into a legacy-focused experience: a concise, story-first home page for colleagues, community and family, with full research detail on a separate Publications page. Fix measured accessibility, SEO and performance gaps, and prepare the site to accept photos and video later without placeholders.

**Primary audience:** professional community, family and friends appreciating his career and legacy (not a sales/consulting funnel).

## Baseline (measured 2026-11-24, production build)

| Lighthouse | Score |
|---|---|
| Performance | 96 |
| Accessibility | 95 — contrast failures (`--soft` #8a8f99, 2.7–3.0:1), heading order |
| Best Practices | 100 |
| SEO | 92 — invalid robots.txt |

Home page height: ~16,700px desktop (1440w), ~27,900px mobile (390w). Render-blocking Google Fonts ≈ 600 ms.

## 1. Structure & content

**Approach A — story home + separate Publications page.** Routing is hash-based (`#/publications`), no router dependency. Section anchors (`#career`, etc.) continue to work on the home route.

### Home (in order)

| # | Section | Change |
|---|---|---|
| — | Hero | Unchanged content; stats: 35 years SW · 38 publications · $45K+ raised · 20+ years service |
| 01 | Profile | Lead + bio + four focus pillars. **Remove** the education list (duplicated in Career) |
| 02 | Career | Three chapters kept; de-duplicate entries |
| 03 | Research highlights | Stats, output-by-year chart, four research phases, **3 landmark papers**, talks list, cities line. Phase cards link to `#/publications?theme=<key>`. Full bibliography **removed** from home; "See all 38 works →" link |
| 04 | Expertise | Paint-chip markets + compact analytical-toolkit strip. **Remove** core-competencies list |
| 05 | Leadership & mentoring | Roles, honors, writing — unchanged |
| 06 | Service | Unchanged |
| 07 | Connect | LinkedIn, ORCID, ACS, Chemical Consultants Network |

Landmark papers: Inorganic Chemistry 1987 (cytochrome c oxidase), J. Inorg. Nucl. Chem. 1978 (tin–aluminium isopropoxides), Z. Naturforsch. B 1980 (alcoholato cobalt(II) chlorides).

### Publications page (`#/publications`)

Header with "← Back to the story", stats line, type tabs + theme filter (pre-selected from `?theme=`), all 38 works (no "show more" cap), six DOI citations with **Copy citation** buttons, ORCID link. Lazy-loaded chunk.

### Navigation

Story · Career · Research · Service · Connect, plus a visually distinct **Publications** link. On the Publications route, section links return to home anchors (`#/` then scroll to section).

**Target:** home ≤ 12,000px desktop (revised from 11,000 during implementation — see Ruling 6: all approved content kept; measured 11,948px after density pass vs 16,700px baseline).

## 2. Visual & reading experience

- Body text 16 → 17px; `--soft` darkened to meet ≥ 4.5:1 on both paper backgrounds; mobile section padding reduced.
- 2px reading-progress bar under the nav (ink colour).
- "Back to top" button after the first viewport.
- Career: sticky chapter aside on desktop (existing); compact sticky chapter header on mobile.
- Hero portrait card max-width 340 → 280px.
- "Copy citation" on DOI citations (clipboard, with "Copied" confirmation).
- Output chart gets an accessible text summary (visually hidden).
- Motion: existing gentle fade-ins only; no autoplay motion beyond counters; `prefers-reduced-motion` disables all.
- Print stylesheet: hide nav/buttons/progress, black-on-white, avoid breaking inside entries, print link URLs for DOIs.

## 3. Quality & future media

**Accessibility:** sequential headings (no h2 → h4 jumps), `:focus-visible` outlines, "Skip to content" link, `aria-label`s on icon-only buttons and filters.

**SEO & sharing:** meta description, Open Graph + Twitter card (title, description, `/nemi.jpg`), JSON-LD `Person` (`name`, `jobTitle`, `alumniOf`, `sameAs` LinkedIn/ORCID/ACS), `public/robots.txt`. Canonical URL omitted until a domain exists.

**Performance:** self-host Instrument Serif + Inter via `@fontsource`; remove Google Fonts links. Publications page as a lazy `import()` chunk.

**Future media (no placeholders):**
- `gallery: []` (`{ src, alt, caption, year }`) and `videos: []` (`{ title, youtubeId, year, event }`) in `src/data/profile.js`.
- Non-empty `gallery` → "Moments" strip renders after Profile; non-empty `videos` → "Talks on video" renders in Research with click-to-load YouTube embeds (`youtube-nocookie.com`). Empty → nothing rendered.
- README "Content to send later": high-res portrait, career/event photos, video links, optional contact email.

## Out of scope

Contact form, CMS, analytics, multi-language, deployment/domain (local only for now), new copy beyond de-duplication.

## Verification

1. Lighthouse (production build): Accessibility 100, SEO 100, Best Practices 100, Performance ≥ 96.
2. Headless Chrome at 1440×900 and 390×844: zero elements stuck at opacity 0 after scrolling, no horizontal overflow, zero console errors.
3. Home height ≤ 12,000px desktop (Ruling 6).
4. `#/publications` deep link loads directly; `?theme=` pre-filters; "Back to the story" returns home; nav anchors work from Publications.
5. With a temporary non-empty `gallery`/`videos`, sections render; reverted to empty, they disappear.
6. Print output renders cleanly (PDF via headless Chrome).
