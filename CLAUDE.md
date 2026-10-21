# Roberts PTA: notes for Claude

## Refreshing the staff favorites page (new survey responses)

Trigger: "there are more updates to the favorite things spreadsheet". The page at `/#/favorites` renders `src/data/staff-favorites.json`, built from the survey sheet by `scripts/build-favorites.mjs`. Details of what the script does are in README.md. This section is the fast path.

Task size: small (one data file, no behavior change). Solo, no subagents. Tests: `yarn test`.

1. **Get a fresh CSV, outside the repo** (it has full birth dates).
   - Sheet: "Staff Favorite Things (Responses)", owner carobertselempta@gmail.com, file id `1QbghpsXZo1v23zv--OXsCPAjjrozRePAUR-ukyD2fXY`.
   - Do NOT use the Google Drive connector's `download_file_content`. It returns the CSV as ~40 KB of base64 inline. Hand-copying it into a file corrupts it silently. Don't try.
   - Do: ask the user for permission to download (file name, source, ~31 KB), then in the Chrome tool navigate a tab to
     `https://docs.google.com/spreadsheets/d/<id>/export?format=csv`.
     The browser is Brave and the file lands in `~/Downloads` as `Staff Favorite Things (Responses) - Form Responses 1.csv`. It first shows up as a hidden `.com.brave.Browser.*` temp file; wait a few seconds and look again. Close the tab afterwards.
   - Or the user can download it themselves (File > Download > CSV) and give the path.
2. **See what is new.** Compare against the previous export if one is in `~/Downloads` (`diff`), or just look at the newest timestamps. Report which rows were added and whether any existing rows changed.
3. **Build:** `yarn build:favorites "<path to csv>"`. It keeps month/day only, drops none/n/a, keeps the newest response per person.
4. **Check:**
   - `git diff --stat` should touch only `src/data/staff-favorites.json`.
   - `grep -c -E '19[0-9]{2}|20[0-2][0-9]' src/data/staff-favorites.json` must print `0` (no birth years).
   - `yarn test && yarn lint && yarn build`.
5. **Ship:** `git fetch`, branch off `origin/main` (never `main`), commit the JSON, push, open a PR. Ask before the first push if the permission classifier blocks it. Do not merge.

## Gotchas learned

- **Branch from `origin/main`, not the old feature branch.** PRs here are squash-merged, so a branch carrying earlier commits conflicts on the JSON after the squash (this happened with #5, replaced by #6). Local `main` can also be stale; always `git fetch` first.
- **Netlify checks always fail** (`effervescent-chimera-2d3351`: Header rules, Pages changed, Redirect rules, deploy-preview). It is a stray Netlify site linked to the repo, failing on every PR since at least #2. Vercel is the real host (robertspta.com) and its check is the one that matters. Don't chase the Netlify failures from the repo; the fix is deleting or unlinking the site in Netlify.
- **Routing is hash-based** (`/#/favorites`), so no host redirect rules are needed.
- Never commit the CSV or paste birth dates into commits, PRs or chat.
