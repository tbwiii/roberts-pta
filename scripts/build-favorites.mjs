// Build src/data/staff-favorites.json from the staff survey CSV export.
// Usage: node scripts/build-favorites.mjs <input.csv> [output.json]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DEFAULT_OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../src/data/staff-favorites.json");

/** RFC 4180 parser: quoted fields, commas, newlines and doubled quotes. */
export function parseCsv(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim() !== ""));
}

const clean = (s) =>
  (s ?? "")
    .replace(/\\([!-/:-@[-`{-~])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

const NONE = new Set(["none", "n/a", "na", "no", "nope"]);
const isNone = (s) => NONE.has(s.replace(/[\s.!,;:]+$/, "").toLowerCase());

const fixName = (s) => {
  const v = clean(s);
  if (v && v === v.toLowerCase()) return v.replace(/(^|[\s-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
  return v;
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_IN = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Month and day only. Never returns a year. */
export function parseBirthday(raw) {
  const v = clean(raw);
  const m = v.match(/^(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?$/);
  if (!m) return "";
  const mo = Number(m[1]);
  const d = Number(m[2]);
  if (mo < 1 || mo > 12 || d < 1 || d > DAYS_IN[mo - 1]) return "";
  return `${MONTHS[mo - 1]} ${d}`;
}

const slug = (s) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const tsValue = (s) => {
  const m = clean(s).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!m) return 0;
  return Date.UTC(+m[3], +m[1] - 1, +m[2], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
};

const FAVORITES = [
  ["Color", "Color"],
  ["Holiday", "Holiday"],
  ["Movies/TV Shows", "Movies/TV Shows"],
  ["Genre of Books", "Genre of Books"],
  ["Candy", "Candy"],
  ["Gum", "Gum"],
  ["Sweet Snack", "Sweet Snack"],
  ["Salty Snack", "Salty Snack"],
  ["Ice Cream", "Ice Cream"],
  ["Fast Food", "Fast Food"],
  ["Restaurant", "Restaurant"],
  ["Flower/Plant", "Flower/Plant"],
  ["Coffee Order", "Coffee Order"],
  ["Other Beverage", "Other Beverage"],
  ["Sports Team(s)", "Sports Team(s)"],
  ["Fruit", "Fruit"],
  ["Place to Shop", "Place to Shop"],
  ["Hobbies", "Hobbies"],
  ["Scents", "Scents"],
];

/** Outlook "safelinks" rewrites wrap the real address in a ?url= parameter. */
export function unwrapSafelink(href) {
  try {
    const u = new URL(href);
    if (u.hostname.endsWith("safelinks.protection.outlook.com")) {
      const target = u.searchParams.get("url");
      if (target && /^https?:\/\//.test(target)) return target;
    }
  } catch {
    // not a parseable URL: leave it as typed
  }
  return href;
}

/** Monograms are initials: uppercase them, pull "(SWR)" out of a typed-out name, drop "??????". */
export function cleanMonogram(raw) {
  const inParens = raw.match(/\(([A-Za-z]{2,4})\)/);
  if (inParens) return inParens[1].toUpperCase();
  if (/^[A-Za-z]{1,4}$/.test(raw)) return raw.toUpperCase();
  // A full name with no initials given: first letter of each word.
  const words = raw.match(/[A-Za-z]+/g) ?? [];
  return words.length > 1 ? words.map((w) => w[0].toUpperCase()).join("") : "";
}

export function buildFavorites(csvText) {
  const rows = parseCsv(csvText);
  if (!rows.length) return [];
  const header = rows[0].map((h) => clean(h).toLowerCase().replace(/:$/, "").trim());
  const col = (prefix) => {
    const i = header.findIndex((h) => h.startsWith(prefix.toLowerCase()));
    if (i < 0) throw new Error(`Missing column: ${prefix}`);
    return i;
  };
  const idx = {
    ts: col("timestamp"),
    last: col("last name"),
    first: col("first name"),
    role: col("job title"),
    birthday: col("birthday"),
    monogram: col("monogram"),
    size: col("shirt"),
    allergies: col("dietary"),
    pets: col("pets"),
    enough: col("thank you"),
    wishlist: col("classroom wish list"),
  };
  const favCols = FAVORITES.map(([label, h]) => [label, col(h)]);

  const byPerson = new Map();
  for (const r of rows.slice(1)) {
    const cell = (i) => r[i] ?? "";
    const firstName = fixName(cell(idx.first));
    const lastName = fixName(cell(idx.last));
    if (!firstName && !lastName) continue;
    const key = `${firstName.toLowerCase()}|${lastName.toLowerCase()}`;
    const ts = tsValue(cell(idx.ts));
    const prev = byPerson.get(key);
    if (prev && prev.ts > ts) continue;
    byPerson.set(key, { ts, r, firstName, lastName });
  }

  const people = [...byPerson.values()].map(({ r, firstName, lastName }) => {
    const cell = (i) => clean(r[i]);
    let wishlist = cell(idx.wishlist);
    const url = wishlist.match(/https?:\/\/\S+/);
    const wishlistUrl = url ? unwrapSafelink(url[0].replace(/[.,;)]+$/, "")) : "";
    if (url) wishlist = wishlist.replace(url[0], wishlistUrl).trim();
    const allergies = cell(idx.allergies);
    const pets = cell(idx.pets);
    return {
      id: "",
      firstName,
      lastName,
      role: cell(idx.role),
      birthday: parseBirthday(r[idx.birthday]),
      monogram: cleanMonogram(cell(idx.monogram)),
      size: cell(idx.size),
      allergies: isNone(allergies) ? "" : allergies,
      pets: isNone(pets) ? "" : pets,
      enough: isNone(cell(idx.enough)) ? "" : cell(idx.enough),
      wishlist,
      wishlistUrl,
      favorites: favCols
        .map(([label, i]) => ({ label, value: cell(i) }))
        .filter((f) => f.value && !isNone(f.value)),
    };
  });

  const cmp = (a, b) => a.localeCompare(b, "en", { sensitivity: "base" });
  people.sort((a, b) => cmp(a.lastName, b.lastName) || cmp(a.firstName, b.firstName));

  const seen = new Map();
  for (const p of people) {
    const base = slug(`${p.firstName} ${p.lastName}`) || "staff";
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    p.id = n === 1 ? base : `${base}-${n}`;
  }
  return people;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [input, output = DEFAULT_OUT] = process.argv.slice(2);
  if (!input) {
    console.error("Usage: node scripts/build-favorites.mjs <input.csv> [output.json]");
    process.exit(1);
  }
  const data = buildFavorites(readFileSync(input, "utf8"));
  mkdirSync(dirname(resolve(output)), { recursive: true });
  writeFileSync(output, JSON.stringify(data, null, 2) + "\n");
  console.log(`Wrote ${data.length} rows to ${output}`);
}
