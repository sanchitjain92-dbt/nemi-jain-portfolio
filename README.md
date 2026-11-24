# Dr. Nemi Jain — Personal Website

React + Vite + Framer Motion portfolio.

## Run locally

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # Node.js installed here
npm install
npm run dev        # http://localhost:5173
```

`npm run build` produces a static site in `dist/` that can be deployed to any static host (Netlify, Vercel, GitHub Pages).

## Editing content

All text, dates, stats and links live in [`src/data/profile.js`](src/data/profile.js). Publications, talks and research themes (sourced from ORCID [0000-0002-4617-4183](https://orcid.org/0000-0002-4617-4183)) live in [`src/data/research.js`](src/data/research.js). The profile photo is `public/nemi.jpg`.

To feature a work in "Landmark papers" on the home page, set `landmark: true` on it in [`src/data/research.js`](src/data/research.js).

## Testing

```bash
npm test           # Vitest unit tests
npm run qa         # Playwright acceptance checks (layout, routing, print)
```

`npm run qa` needs a production build being served: run `npm run build`, then `npx vite preview --port 4173` in another terminal. It drives Google Chrome at the default macOS path (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`); set `CHROME_PATH` to use another Chrome binary and `QA_URL` to test a different address (default `http://localhost:4173/`).

## Before deploying

Once a domain exists, change the `og:image` and `twitter:image` meta tags in `index.html` to absolute URLs (e.g. `https://example.com/nemi.jpg`) and add a `<link rel="canonical">` with the site's URL.

## Content to send later

These sections stay hidden until content is added to `src/data/profile.js`:

- [ ] High-resolution portrait (replace `public/nemi.jpg`, ideally ≥ 800×800)
- [ ] Career and event photos → `public/photos/` + `gallery` list (shows a "Moments" strip)
- [ ] YouTube links of talks → `videos` list (shows "Talks on video" in Research)
- [ ] Optional public contact email (add to the Connect section)
