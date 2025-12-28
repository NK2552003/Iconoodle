# Contributing — Come for the doodles, stay for the vibes

Thanks for wanting to help! Contributions are what keep this little doodle garden growing — whether you're adding icons, fixing a bug, or suggesting a new color scheme (neon purple? yes pls).

## Quick Start (be lazy, be happy)
1. Fork the repo
2. Clone it locally

```bash
git clone git@github.com:your-username/My_Doodles_Website.git
cd My_Doodles_Website
pnpm install
pnpm dev
```

3. Make your changes on a branch named like: `feature/add-sun-doodle` or `fix/modal-download-bug`.
4. Run `pnpm lint` and make sure things look tidy.
5. Open a friendly PR explaining what you changed and why.

---

## Adding a doodle or icon
- Add a new item to `lib/doodles.json` with at least: `id`, `category`, `style`, `src`, `svg`, `viewBox`.
- Prefer short, friendly `id` values (e.g. `sun-smile` not `this-is-actually-the-110th-sun-i-drew-please-love-me`).
- Include the full SVG string in `svg` if possible — it makes the UI and export scripts friendly.

Example entry:

```json
{
  "id": "Sun Smile",
  "category": "nature",
  "style": "LINED",
  "src": "/svgs/LINED/nature/sun-smile.svg",
  "svg": "<svg ...>...</svg>",
  "viewBox": "0 0 24 24"
}
```

If you add multiple doodles, prefer a single PR with a short description.

---

## Style & Quality
- This is a TypeScript + Next.js project. Be kind to type-safety.
- Run `pnpm lint` (eslint) before submitting PRs.
- Keep things accessible (alt text where appropriate in UI changes).
- Add tests only if your change has logic worth testing — (this repo currently has no test harness, so add tests when relevant and add instructions in your PR).

---

## Pull Request Checklist
- [ ] Branch name follows `type/short-description` (e.g. `fix/download-button`)
- [ ] Linted (run `pnpm lint`)
- [ ] No obvious console errors
- [ ] Updated `lib/doodles.json` or docs if relevant
- [ ] Short description + screenshot (if UI change)

---

## Code of Conduct
Be excellent to each other. Follow the `CODE_OF_CONDUCT.md`.

---

## Questions / Ideas
Open an issue! Don’t be shy — this project is meant to be welcoming.

Thanks for making this better. Your contribution might just bring a smile to somebody’s UI.
