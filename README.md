# Dr. Nemi Jain — Personal Website

React + Vite + Framer Motion portfolio.

## Run locally

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # Node.js installed here
npm install
npm run dev        # http://localhost:5173
```

`npm run build` produces a static site in `dist/` (see "Deploying" below).

## Editing content

All text, dates, stats and links live in [`src/data/profile.js`](src/data/profile.js). Publications, talks and research themes (sourced from ORCID [0000-0002-4617-4183](https://orcid.org/0000-0002-4617-4183)) live in [`src/data/research.js`](src/data/research.js). The profile photo is `public/nemi.jpg`.

To feature a work in "Landmark papers" on the home page, set `landmark: true` on it in [`src/data/research.js`](src/data/research.js).

The Career section is an interactive journey (map, five-decade ruler and seven chapters). Its stops, chapter text and entries live in [`src/data/journey.js`](src/data/journey.js). The map outlines in `src/data/geo.js` are generated from US Census (us-atlas) and Natural Earth (world-atlas) data — India is drawn from coastlines only, with no political borders. Regenerate with `npm run build:geo` only if you change the map framing in `scripts/build-geo.mjs`.

## Testing

```bash
npm test           # Vitest unit tests
npm run qa         # Playwright acceptance checks (layout, routing, print)
```

`npm run qa` needs a production build being served: run `npm run build`, then `npx vite preview --port 4173` in another terminal. It drives Google Chrome at the default macOS path (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`); set `CHROME_PATH` to use another Chrome binary and `QA_URL` to test a different address (default `http://localhost:4173/`).

## Deploying (GitHub Pages)

The site is published at **https://sanchitjain92-dbt.github.io/nemi-jain-portfolio/** from the repo `sanchitjain92-dbt/nemi-jain-portfolio`. Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which tests, builds and publishes `dist/`. One-time setup: in the repo go to **Settings → Pages → Source: GitHub Actions**.

Production builds use the base path `/nemi-jain-portfolio/` (see `vite.config.js`); `npm run dev` still serves at `/`. To check a production build locally, run `npm run build && npx vite preview --port 4173` and open `http://localhost:4173/nemi-jain-portfolio/` (for QA: `QA_URL=http://localhost:4173/nemi-jain-portfolio/ npm run qa`).

If the repo is renamed or a custom domain is added, update `base` in `vite.config.js` and the absolute URLs (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD) in `index.html`.

## Content to send later

These sections stay hidden until content is added to `src/data/profile.js`:

- [ ] High-resolution portrait (replace `public/nemi.jpg`, ideally ≥ 800×800)
- [ ] Career and event photos → `public/photos/` + `gallery` list (shows a "Moments" strip)
- [ ] YouTube links of talks → `videos` list (shows "Talks on video" in Research)
- [ ] Optional public contact email (add to the Connect section)
