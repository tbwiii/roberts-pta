// Seasonal decoration settings. This is the one file to touch when seasons change.
export type Season = "fall" | "christmas" | "none";

/**
 * Force a season regardless of the date: "fall", "christmas" or "none" (no decor).
 * Leave null to switch automatically by the windows below.
 * A visitor-facing preview is also available with ?season=fall or ?season=christmas.
 */
export const SEASON_OVERRIDE: Season | null = null;

type Window = { season: Exclude<Season, "none">; start: [number, number]; end: [number, number] };

/** [month, day] inclusive. A window may wrap the new year. Add a season here and in season.tsx. */
export const WINDOWS: Window[] = [
  { season: "fall", start: [9, 15], end: [11, 30] },
  { season: "christmas", start: [12, 1], end: [1, 6] },
];

const SEASONS: Season[] = ["fall", "christmas", "none"];
const md = ([m, d]: [number, number]) => m * 100 + d;

export function seasonForDate(date: Date): Season {
  const today = (date.getMonth() + 1) * 100 + date.getDate();
  for (const w of WINDOWS) {
    const [s, e] = [md(w.start), md(w.end)];
    const inside = s <= e ? today >= s && today <= e : today >= s || today <= e;
    if (inside) return w.season;
  }
  return "none";
}

/** Precedence: ?season= in the URL, then SEASON_OVERRIDE, then the date. */
export function resolveSeason(opts: {
  date: Date;
  search: string;
  override: Season | null;
}): Season {
  const q = new URLSearchParams(opts.search).get("season");
  if (q && (SEASONS as string[]).includes(q)) return q as Season;
  return opts.override ?? seasonForDate(opts.date);
}
