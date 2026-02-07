
<div align="center">
  <img src="https://github.com/NK2552003/Iconoodle/blob/main/public/iconoodle.svg" alt="Iconoodle" width="160" />
  <h1 style="margin: 0;">ICONOODLE</h1>
  <p>Doodles, Illustrations & icons</p>
  <p>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
    <a href="https://github.com/NK2552003/Iconoodle"><img src="https://img.shields.io/github/stars/NK2552003/Iconoodle?style=social" alt="GitHub Stars" /></a>
    <a href="https://github.com/NK2552003/Iconoodle/commits/main"><img src="https://img.shields.io/github/last-commit/NK2552003/Iconoodle.svg" alt="Last Commit" /></a>
    <a href="https://nk2552003.github.io/Iconoodle/"><img src="https://img.shields.io/badge/demo-live-brightgreen.svg" alt="Live Demo" /></a>
  </p>
</div> 

**Hey! I’m Nitish — I made this to make doodles easy to find, grab, and sprinkle into your projects.**

This project is a pretty little Next.js site full of hand-drawn-ish doodles and icons (SVGs). Use them, remix them, laugh at them, or screenshot them and pretend you drew them. All the usual modern web bells & whistles are included — and downloading single doodles or full packs is made human-friendly (and script-friendly).

---

## Quick start ✅

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open locally: `http://localhost:3000`

5. View the live demo: https://nk2552003.github.io/Iconoodle/

---

## What’s included 🔧

- `app/` — Next.js application and pages
- `components/` — Reusable UI components
- `lib/` — Doodle and icon pack data (`*.json`)
- `public/` — Static assets

---

## Exporting SVGs (programmatic) ⚡

A small Node script can export all SVGs to disk. Create or use `tools/export-svgs.js` and run `node tools/export-svgs.js`.

Minimal example:

```js
const fs = require('fs');
const path = require('path');
const doodles = require('../lib/doodles.json');

const outDir = path.resolve(__dirname, '..', 'exports', 'svgs');
fs.mkdirSync(outDir, { recursive: true });

doodles.forEach((d, i) => {
  const name = (d.id || `doodle-${i}`).replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
  fs.writeFileSync(path.join(outDir, `${name}.svg`), d.svg || d.src || '');
});

console.log(`Exported ${doodles.length} SVGs to ${outDir}`);
```

> Note: some entries store full SVG content in `svg`, others reference `src` paths or URLs.

---

## Contributing & License 📝

- Contributions welcome — see `CONTRIBUTING.md` and follow `CODE_OF_CONDUCT.md`.
- Licensed under MIT. See `LICENSE`.

---

## Questions / Contact ✉️

If you build something with these doodles or want to contribute, open an issue or PR — I’d love to see it.

---

**License:** MIT — see `LICENSE` for details.

