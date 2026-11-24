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

## Content to send later

These sections stay hidden until content is added to `src/data/profile.js`:

- [ ] High-resolution portrait (replace `public/nemi.jpg`, ideally ≥ 800×800)
- [ ] Career and event photos → `public/photos/` + `gallery` list (shows a "Moments" strip)
- [ ] YouTube links of talks → `videos` list (shows "Talks on video" in Research)
- [ ] Optional public contact email (add to the Connect section)
