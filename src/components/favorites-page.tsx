import { useEffect, useMemo, useState } from "react";
import {
  IconArrowLeft,
  IconCake,
  IconExternalLink,
  IconGift,
  IconHandStop,
  IconSearch,
  IconShirt,
  IconAlertTriangle,
} from "@tabler/icons-react";
import data from "../data/staff-favorites.json";
import {
  QUICK_LABELS,
  birthdayNote,
  daysUntilBirthday,
  fullName,
  hasWishList,
  matchesQuery,
  sortPeople,
  type SortMode,
  type StaffFavorites,
} from "../lib/favorites";

const people = data as StaffFavorites[];

const sorts: { mode: SortMode; label: string }[] = [
  { mode: "name", label: "A to Z" },
  { mode: "birthday", label: "Next birthday" },
];

function wishlistLabel(url: string) {
  try {
    return new URL(url).hostname.includes("amazon")
      ? "Amazon wish list"
      : "Wish list";
  } catch {
    return "Wish list";
  }
}

function Card({ p, today }: { p: StaffFavorites; today: Date }) {
  const quick = p.favorites.filter((f) => QUICK_LABELS.includes(f.label));
  const more = p.favorites.filter((f) => !QUICK_LABELS.includes(f.label));
  const note = birthdayNote(daysUntilBirthday(p.birthday, today));
  // Text typed alongside (or instead of) a wish list link, e.g. "tissues, wipes".
  const wishText = p.wishlist.replace(p.wishlistUrl, "").trim();
  const hasWishText = /[a-z0-9]/i.test(wishText);

  return (
    <li className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-y-[5px] rounded-2xl bg-[#357ef7]"
      />
      <article
        aria-labelledby={`${p.id}-name`}
        className="relative flex h-full flex-col gap-3 rounded-2xl bg-[#f6f8ff] p-4 text-roberts_blue-900 sm:p-5"
      >
        <header>
          <h3
            id={`${p.id}-name`}
            className="font-display text-2xl leading-tight"
          >
            {fullName(p)}
          </h3>
          {p.role && (
            <p className="text-sm font-medium opacity-80">{p.role}</p>
          )}
          <ul className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold">
            {p.birthday && (
              <li className="flex items-center gap-1 rounded-full bg-roberts_blue-900 px-2.5 py-1 text-white">
                <IconCake size={14} aria-hidden="true" />
                {p.birthday}
              </li>
            )}
            {note && (
              <li className="rounded-full bg-[#ffc94a] px-2.5 py-1">{note}</li>
            )}
            {p.size && (
              <li className="flex items-center gap-1 rounded-full bg-roberts_blue-100 px-2.5 py-1">
                <IconShirt size={14} aria-hidden="true" />
                Shirt size {p.size}
              </li>
            )}
            {p.monogram && (
              <li className="rounded-full bg-roberts_blue-100 px-2.5 py-1">
                Monogram {p.monogram}
              </li>
            )}
          </ul>
        </header>

        {(p.wishlistUrl || hasWishText) && (
          <div className="rounded-xl bg-roberts_blue-900 p-3 text-white">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#ffc94a]">
              <IconGift size={14} aria-hidden="true" />
              Wish list
            </p>
            {hasWishText && (
              <p className="mt-0.5 text-sm font-medium">{wishText}</p>
            )}
            {p.wishlistUrl && (
              <a
                href={p.wishlistUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#ffc94a] px-3 py-1.5 text-sm font-bold text-roberts_blue-900 outline-none hover:opacity-90 focus-visible:ring-4 focus-visible:ring-white"
              >
                {wishlistLabel(p.wishlistUrl)}
                <IconExternalLink size={16} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        )}

        {p.enough && (
          <p className="flex items-start gap-2 rounded-xl bg-roberts_red-100 p-3 text-sm font-semibold">
            <IconHandStop size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              <span className="font-bold">Already have plenty of: </span>
              {p.enough}
            </span>
          </p>
        )}

        {p.allergies && (
          <p className="flex items-start gap-2 rounded-xl bg-[#ffc94a]/70 p-3 text-sm font-semibold">
            <IconAlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              <span className="font-bold">Allergies or restrictions: </span>
              {p.allergies}
            </span>
          </p>
        )}

        {quick.length > 0 && (
          <dl className="grid gap-x-3 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr]">
            {quick.map((f) => (
              <div key={f.label} className="contents">
                <dt className="font-bold opacity-70">{f.label}</dt>
                <dd className="font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {(more.length > 0 || p.pets) && (
          <details className="mt-auto text-sm">
            <summary className="cursor-pointer select-none rounded-lg py-1 font-bold text-roberts_blue-600 outline-none marker:text-roberts_blue-600 focus-visible:ring-4 focus-visible:ring-roberts_blue-300">
              More favorites
            </summary>
            <dl className="mt-2 grid gap-x-3 gap-y-1.5 sm:grid-cols-[auto_1fr]">
              {p.pets && (
                <div className="contents">
                  <dt className="font-bold opacity-70">Pets</dt>
                  <dd className="font-medium">{p.pets}</dd>
                </div>
              )}
              {more.map((f) => (
                <div key={f.label} className="contents">
                  <dt className="font-bold opacity-70">{f.label}</dt>
                  <dd className="font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </details>
        )}
      </article>
    </li>
  );
}

export default function FavoritesPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("name");
  const [onlyWishlist, setOnlyWishlist] = useState(false);
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const previous = document.title;
    document.title = "Staff favorite things | Roberts Elementary PTA";
    return () => {
      document.title = previous;
    };
  }, []);

  const shown = useMemo(
    () =>
      sortPeople(people, sort, today).filter(
        (p) =>
          matchesQuery(p, query) && (!onlyWishlist || hasWishList(p)),
      ),
    [query, sort, onlyWishlist, today],
  );

  return (
    <main className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      <a
        href="#/"
        className="inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-roberts_blue-200 px-3.5 py-2 text-sm font-semibold text-roberts_blue-50 outline-none transition-colors hover:bg-roberts_blue-50 hover:text-roberts_blue-900 focus-visible:ring-4 focus-visible:ring-[#ffc94a]"
      >
        <IconArrowLeft size={18} aria-hidden="true" />
        Back to PTA links
      </a>

      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
          Staff favorite things
        </h1>
        <p className="max-w-xl text-lg font-medium text-roberts_blue-100">
          Gift ideas straight from our teachers and staff. Check the wish list
          first, and skip anything they said they already have plenty of.
        </p>
      </header>

      <section
        aria-label="Find a teacher or staff member"
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <label className="relative flex-1">
          <span className="sr-only">Search by name, grade or favorite</span>
          <IconSearch
            size={20}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-roberts_blue-200"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a name, grade or favorite"
            className="w-full rounded-full border-2 border-roberts_blue-300 bg-roberts_blue-800 py-3 pl-11 pr-4 font-medium text-white outline-none placeholder:text-roberts_blue-200 focus-visible:border-[#ffc94a] focus-visible:ring-4 focus-visible:ring-[#ffc94a]/40"
          />
        </label>
        <div
          role="group"
          aria-label="Sort"
          className="flex rounded-full border-2 border-roberts_blue-300 p-1"
        >
          {sorts.map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              aria-pressed={sort === mode}
              onClick={() => setSort(mode)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-bold outline-none focus-visible:ring-4 focus-visible:ring-[#ffc94a] ${
                sort === mode
                  ? "bg-[#ffc94a] text-roberts_blue-900"
                  : "text-roberts_blue-50 hover:bg-roberts_blue-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={onlyWishlist}
          onClick={() => setOnlyWishlist((v) => !v)}
          className={`rounded-full border-2 px-3.5 py-2 text-sm font-bold outline-none focus-visible:ring-4 focus-visible:ring-[#ffc94a] ${
            onlyWishlist
              ? "border-[#ffc94a] bg-[#ffc94a] text-roberts_blue-900"
              : "border-roberts_blue-300 text-roberts_blue-50 hover:bg-roberts_blue-700"
          }`}
        >
          Has a wish list
        </button>
      </section>

      <p role="status" className="text-sm font-semibold text-roberts_blue-100">
        {shown.length === people.length
          ? `${people.length} teachers and staff`
          : `${shown.length} of ${people.length} teachers and staff`}
      </p>

      {shown.length > 0 ? (
        <ul className="grid items-start gap-x-5 gap-y-7 md:grid-cols-2">
          {shown.map((p) => (
            <Card key={p.id} p={p} today={today} />
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border-2 border-dashed border-roberts_blue-300 p-6 text-center font-semibold text-roberts_blue-50">
          No one matches that search. Try a shorter word.
        </p>
      )}

      <p className="border-t-2 border-dashed border-roberts_blue-600 pt-5 text-sm font-medium text-roberts_blue-100">
        Shared by staff on the PTA favorite things survey.
      </p>
    </main>
  );
}
