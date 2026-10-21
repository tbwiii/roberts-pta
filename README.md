# Roberts Elementary PTA

[React App on Vercel](https://robertspta.com)

## Staff favorite things page

`/#/favorites` renders `src/data/staff-favorites.json`, a snapshot of the staff survey responses. To refresh it:

1. Download the response sheet as CSV (File > Download > Comma Separated Values). Keep the file outside this repo: it contains full birth dates.
2. `yarn build:favorites /path/to/responses.csv`
3. Check the diff, then commit `src/data/staff-favorites.json`.

The script keeps month and day only (never the birth year), drops "none"/"n/a" answers, uppercases monograms, unwraps Outlook safelinks, and keeps the newest response per person. `yarn test` covers it.

## Seasonal themes

Decorations live in `src/themes/` and sit on a click-through layer, so the layout and colors never change.

- **Automatic:** `WINDOWS` in `src/themes/config.ts` picks the season by date (fall Sep 15 to Nov 30, Christmas Dec 1 to Jan 6, otherwise none).
- **Force one:** set `SEASON_OVERRIDE` in `src/themes/config.ts` to `"fall"`, `"christmas"` or `"none"`. Leave it `null` for automatic.
- **Preview:** add `?season=fall` or `?season=christmas` before any `#`, e.g. `/?season=christmas` or `/?season=christmas#/favorites` (not `/#/favorites?season=...`).
- **Add a season:** write a component like `fall-layer.tsx` (fixed, `pointer-events-none`, static when `reduced` is true), add it to the switch in `season.tsx`, and add a window in `config.ts`.

Everything respects `prefers-reduced-motion` (decor stays, motion stops). `yarn test` covers the date logic.
