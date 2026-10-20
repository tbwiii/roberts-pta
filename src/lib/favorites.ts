export type StaffFavorites = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  /** Month and day only, e.g. "June 8". Empty when unknown. */
  birthday: string;
  monogram: string;
  size: string;
  allergies: string;
  pets: string;
  /** "Thank you, but I have enough..." answer. */
  enough: string;
  wishlist: string;
  wishlistUrl: string;
  favorites: { label: string; value: string }[];
};

export type SortMode = "name" | "birthday";

/** Favorites shown on the card face; everything else sits under "More favorites". */
export const QUICK_LABELS = [
  "Color",
  "Coffee Order",
  "Candy",
  "Sweet Snack",
  "Place to Shop",
  "Scents",
];

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

/** A wish list link, or typed-in wish list text such as "tissues, wipes". */
export function hasWishList(p: StaffFavorites) {
  return p.wishlistUrl !== "" || /[a-z0-9]/i.test(p.wishlist);
}

export function fullName(p: StaffFavorites) {
  return `${p.firstName} ${p.lastName}`.trim();
}

/** Every word typed must appear somewhere on the person's card. */
export function matchesQuery(p: StaffFavorites, query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = [
    fullName(p),
    p.role,
    p.birthday,
    p.allergies,
    p.pets,
    p.enough,
    p.wishlist,
    ...p.favorites.map((f) => f.value),
  ]
    .join("\n")
    .toLowerCase();
  return terms.every((t) => haystack.includes(t));
}

/** Days from `today` until the next occurrence of a "June 8" style birthday. */
export function daysUntilBirthday(birthday: string, today: Date) {
  const m = /^([A-Za-z]+)\s+(\d{1,2})$/.exec(birthday.trim());
  if (!m) return null;
  const month = MONTHS.indexOf(m[1].toLowerCase());
  const day = Number(m[2]);
  if (month < 0 || day < 1 || day > 31) return null;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let next = new Date(start.getFullYear(), month, day);
  if (next < start) next = new Date(start.getFullYear() + 1, month, day);
  return Math.round((next.getTime() - start.getTime()) / 86_400_000);
}

export function sortPeople(
  people: StaffFavorites[],
  mode: SortMode,
  today: Date,
) {
  const byName = (a: StaffFavorites, b: StaffFavorites) =>
    a.lastName.localeCompare(b.lastName, undefined, { sensitivity: "base" }) ||
    a.firstName.localeCompare(b.firstName, undefined, { sensitivity: "base" });
  if (mode === "name") return [...people].sort(byName);
  return [...people].sort((a, b) => {
    const da = daysUntilBirthday(a.birthday, today);
    const db = daysUntilBirthday(b.birthday, today);
    // Unknown birthdays sink to the bottom, in name order.
    if (da === null && db === null) return byName(a, b);
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db || byName(a, b);
  });
}

export function birthdayNote(days: number | null) {
  if (days === null || days > 30) return "";
  if (days === 0) return "Birthday today!";
  if (days === 1) return "Birthday tomorrow";
  return `Birthday in ${days} days`;
}
