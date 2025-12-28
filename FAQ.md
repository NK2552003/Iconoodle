# FAQ — Frequently Asked Questions (and the answers)

Q: Can I use these doodles in commercial projects?

A: Yes! They’re MIT licensed. Use 'em, remix 'em, sell stickers with 'em — just know there's no warranty (so maybe don’t sell warranties with them). See `LICENSE` for details.

Q: How do I download a doodle quickly?

A: Click the doodle in the UI and hit **Download**. For a bunch of doodles, use the Node export script in the `WIKI.md` (or run the provided `tools/export-svgs.js` if you add it).

Q: Where are the actual SVG files?

A: The site uses `lib/doodles.json`. Each entry often contains a full `svg` string. If only `src` is present, it expects the file at that path under `public/`.

Q: How do I add my own doodles?

A: Add them to `lib/doodles.json` (see `WIKI.md` for format), or add SVG files to `public/svgs/` and add a JSON entry.

Q: How do I contribute?

A: Fork, branch, make the change, run `pnpm lint`, and submit a PR. Check `CONTRIBUTING.md` for full details and the PR checklist.

Q: The artist is me now. Do I need to credit you?

A: No strict requirement — MIT allows free usage — but credit is lovely and makes maintainers happy :) If you want attribution, adding `— made with My Doodles Website` is enough.

Q: I found a security bug — who do I tell?

A: Please follow `SECURITY.md`. Short version: email the maintainers privately (see `SUPPORT.md`), don't post public PoC until fixed.

Q: How do I get help?

A: Open an issue or join a discussion in the repo. If it's urgent, email the maintainer (see `SUPPORT.md`).

---

If your question isn’t here — add it with a PR or open an issue. I’ll probably add it and give you credit for being curious.
