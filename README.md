# Roberts Elementary PTA

[React App on Vercel](https://robertspta.com)

## Staff favorite things page

`/#/favorites` renders `src/data/staff-favorites.json`, a snapshot of the staff survey responses. To refresh it:

1. Download the response sheet as CSV (File > Download > Comma Separated Values). Keep the file outside this repo: it contains full birth dates.
2. `yarn build:favorites /path/to/responses.csv`
3. Check the diff, then commit `src/data/staff-favorites.json`.

The script keeps month and day only (never the birth year), drops "none"/"n/a" answers, uppercases monograms, unwraps Outlook safelinks, and keeps the newest response per person. `yarn test` covers it.
