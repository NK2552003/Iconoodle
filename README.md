
<div
   align="center"
  style="
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  "
>
  <img
    src="https://github.com/NK2552003/Iconoodle/blob/main/public/iconoodle.svg"
    alt="Iconoodle"
    width="160"
  />
  <h1 style="margin: 0;">ICONOODLE</h1>
   <div align="center">
    <p align="center">Doodles, Illustrations & icons</p>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
    <a href="https://github.com/NK2552003/Iconoodle"><img src="https://img.shields.io/github/stars/NK2552003/Iconoodle?style=social" alt="GitHub Stars"></a>
    <a href="https://github.com/NK2552003/Iconoodle/commits/main"><img src="https://img.shields.io/github/last-commit/NK2552003/Iconoodle.svg" alt="Last Commit"></a><br/><br/>
</div>
</div>

**Hey! I’m Nitish — I made this to make doodles easy to find, grab, and sprinkle into your projects.**

This project is a pretty little Next.js site full of hand-drawn-ish doodles and icons (SVGs). Use them, remix them, laugh at them, or screenshot them and pretend you drew them. All the usual modern web bells & whistles are included — and downloading single doodles or full packs is made human-friendly (and script-friendly).

---

## Quick TL;DR (for the short attention span)
- Clone the repo
- Run: `pnpm install && pnpm dev`
- Visit: `http://localhost:3000`
- To download SVGs instantly: use the built-in download buttons or run the tiny Node export script in `tools/export-svgs.js` (instructions below)

---

## What’s in this repo?
- `app/` — Next.js app (pages, components)
- `lib/doodles.json` — All doodles data. Each item has an `svg` string and a `src` path.
- `lib/*.json` — Icon packs (handdrawn, candy, etc.)
- `components/` — UI building blocks for the site
- `public/` — (Optional) static files — may be empty; SVGs are embedded in `lib` JSON for convenience

---

## Running locally (the chill guide)
1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start dev server:

   ```bash
   pnpm dev
   ```

3. Open your browser: http://localhost:3000

That’s it! You can edit components in `components/` and doodle data in `lib/doodles.json`.

---

## Downloading doodles & SVGs — fast and silly ways
There are a few ways to get SVGs:

### 1) Via the site (recommended for humans)
- Browse the site, click the doodle you like, and hit the **Download** button. Instant gratification.

### 2) Programmatically — Node script (recommended for batch downloading)
I added a tiny script to dump the SVGs to files. Create `tools/export-svgs.js` (or use the one provided) and run it.

Example script (save as `tools/export-svgs.js`):

```js
const fs = require('fs');
const path = require('path');
const doodles = require('../lib/doodles.json');

const outDir = path.resolve(__dirname, '..', 'exports', 'svgs');
fs.mkdirSync(outDir, { recursive: true });

doodles.forEach((d, i) => {
  const safeName = d.id.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
  const filename = path.join(outDir, `${safeName || 'doodle-' + i}.svg`);
  fs.writeFileSync(filename, d.svg || d.svgString || d.svgContent || d.src);
});

console.log('Exported', doodles.length, 'svgs to', outDir);
```

Run:

```bash
node tools/export-svgs.js
```

You’ll find the SVGs in `exports/svgs/`. Rename, zip, distribute to beloved coworkers.

> Tip: If the script writes the `src` path instead of raw SVG, check `d.svg` property in `lib/doodles.json` — some entries keep SVG text in `svg` while others only include a `src` URL. Adjust the script to fetch if you need to.

### 3) If you want a single file from the JSON (quick and dirty)

```js
// get one doodle SVG string and write to file
const doodles = require('./lib/doodles.json');
const d = doodles.find(x => x.id === 'Some id');
require('fs').writeFileSync('single.svg', d.svg);
```

---

## Project vibe & rules (a.k.a. legal but friendly)
- This project is MIT-licensed. Use it like you stole it legally — credit is appreciated but not required. See `LICENSE`.
- Want to contribute? Sweet. Read `CONTRIBUTING.md`.
- Be nice. Follow `CODE_OF_CONDUCT.md`.

---

## Want to add doodles? (super simple)
1. Add your SVG object to `lib/doodles.json` with properties: `id`, `category`, `style`, `src`, `svg`, `viewBox`.
2. Run the dev server and verify it shows up in the UI.
3. Make a PR with a little comment about your creation (or a dad joke if you must).

Pro tip: keep IDs short and spaces-friendly — the export script slugs them.

---

## FAQs (short and helpful)
- Q: Can I use these in commercial projects?
  - A: Yes. MIT license. See `LICENSE` for details.
- Q: Where are the source files?
  - A: Doodles are stored in `lib/doodles.json`; many items include full inline `svg` content for instant use.
- Q: How do I suggest a new icon pack?
  - A: Open an issue or PR. Use the `CONTRIBUTING.md` template.

---

## Contact / Kudos / Shoutouts
Made with caffeine and curiosity by Me. If you make something cool with the doodles, drop a link in Issues — I’ll probably freak out in the best way.

---

## Want more docs? There’s a `WIKI` with architecture notes, and full guidance on how to download / bulk-export / contribute. Happy doodling!

---

**License:** MIT — see `LICENSE` for details.

