# Wiki — Project internals & how-tos

Welcome to the nerdy corner. This file explains how the site works, where doodles live, and how you can extract/export them like a pro (or a very determined beginner).

---

## Project structure highlights
- `app/` — Next.js app entry points (layout, pages)
- `components/` — UI components. Key ones:
  - `doodle-card.tsx` — UI for each doodle tile
  - `doodle-directory.tsx` — index / listing component
  - `doodle-modal.tsx` — modal used for viewing/downloading a doodle
  - `theme-provider.tsx` — theme context and UI toggles
- `lib/` — data & utilities:
  - `doodles.json` — **the source of truth** for doodles. Items include `id`, `category`, `style`, `src`, `svg`, and `viewBox` fields.
  - `icons.json`, `handdrawn-*.json`, `candy-icons.json` — icon packs
  - `data.tsx` and `utils.ts` — helper functions and exports used by hooks and components
- `hooks/` — small React hooks like `use-doodles.ts` and `use-toast.ts` used across the UI
- `public/` — static assets (may be empty since many SVGs are embedded in the JSON)
- `scripts/` — (optional) scripts such as the `generate-handdrawn-type-2-json.js` referenced by `pnpm run generate:handdrawn2`

---

## Understanding `lib/doodles.json`
Each doodle entry typically has these fields:

- `id`: human-friendly identifier (e.g. `Sun Smile`)
- `category`: grouping (e.g. `arrows-assets`, `nature`, etc.)
- `style`: style label (`LINED`, `FILLED`, etc.)
- `src`: path like `/svgs/LINED/arrows-assets/Group 10.svg` — useful if SVGs exist in `public/` or another host
- `svg`: the full inline SVG string — great for immediate rendering and export
- `viewBox`: optional, handy for sizing

If `svg` is present, the site can render the doodle directly. If only `src` is present, the site expects the file to be served by the web server (e.g., `public/svgs/...`).

---

## How to add a new pack or icon set
- Add the SVG files in a subfolder (e.g. `public/svgs/LINED/your-pack/`) and/or add entries to `lib/doodles.json`.
- If you add many svgs, consider adding a script to generate the JSON automatically (there’s an example script in `scripts/` for other packs).
- Run `pnpm dev` and verify the new items show up.

---

## Exporting / Bulk download (more detail)
You can export SVGs in a few ways — here are robust options.

### A. Node exporter (best for many files)
```js
// tools/export-svgs.js
const fs = require('fs');
const path = require('path');
const doodles = require('../lib/doodles.json');

const outDir = path.resolve(__dirname, '..', 'exports', 'svgs');
fs.mkdirSync(outDir, { recursive: true });

doodles.forEach((d, i) => {
  const name = (d.id || `doodle-${i}`).replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
  const svgContent = d.svg || null;

  if (svgContent) {
    fs.writeFileSync(path.join(outDir, `${name}.svg`), svgContent);
  } else if (d.src) {
    // If only src is present, and if files are in public/, copy them into exports
    const possible = path.resolve(__dirname, '..', 'public', d.src.replace(/^\//, ''));
    if (fs.existsSync(possible)) {
      fs.copyFileSync(possible, path.join(outDir, `${name}.svg`));
    } else {
      console.warn('Missing svg content and source file for', d.id, d.src);
    }
  }
});

console.log('Done. Check exports/svgs');
```

Run:
```bash
node tools/export-svgs.js
```

The script writes files to `exports/svgs/` and will report missing files.

### B. Quick single SVG extraction (one-off)
Open a Node REPL or small script to pick one doodle and save:
```js
const doodles = require('./lib/doodles.json');
const d = doodles.find(x => x.id === 'Sun Smile');
require('fs').writeFileSync('sun-smile.svg', d.svg);
```

### C. Download from UI
Click the download button on a doodle modal — the site will either download an SVG or a PNG (if rasterization is implemented).

---

## Automation & build notes
- `pnpm run generate:handdrawn2` runs the script in `scripts` to generate `handdrawn-type-2` JSON files.
- `pnpm build` / `pnpm dev` are standard Next.js flows.
- `pnpm lint` runs ESLint.

---

## Troubleshooting
- Missing images on the site? Check `lib/doodles.json` — if `svg` is empty but `src` is present, ensure the referenced file exists in `public/` or your hosting path.
- Want to add a new export format (ZIP/PNG)? Add a script in `tools/` and a small server route (or a client-side ZIP generator) and add a button in `doodle-modal.tsx`.

---

If you want, I can add a `tools/export-svgs.js` file for you and wire a simple `pnpm` script — say the word and I’ll create it. Or add instructions on converting to PNGs automatically.

Happy hacking and happy doodling!