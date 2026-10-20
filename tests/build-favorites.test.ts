import test from "node:test";
import assert from "node:assert/strict";
import { buildFavorites, cleanMonogram, parseBirthday, parseCsv, unwrapSafelink } from "../scripts/build-favorites.mjs";

const HEADER =
  'Timestamp,Last Name:,First Name:,Job TItle/Position & Grade Level (if applicable),Birthday (month & day):,Monogram:,Shirt/Sweatshirt Size,Dietary Allergies or Restrictions,Pets? ,Color,Holiday,Movies/TV Shows,Genre of Books,Candy,Gum,Sweet Snack,Salty Snack,Ice Cream,Fast Food ,Restaurant,Flower/Plant,Coffee Order,Other Beverage,Sports Team(s),Fruit,Place to Shop,Hobbies,Scents,"Thank you, but I have enough...",Classroom Wish List (link or anything else you\'d like people to know that you love):';

const row = (f: string[]) => f.join(",");
const CSV = [
  HEADER,
  // quoted comma, doubled quote, embedded newline, year birthday, none allergy, escaped URL
  row([
    "7/31/2026 14:43:25", "Adams", "Kelsey ", "2nd grade teacher ", "6/8/2003", "KAJ", "M", "None.", "No",
    '"Blue, green"', "Christmas", '"She said ""hi"""', '"Romance,\nmystery"', "Mint", "", "", "", "", "", "", "", "", "", "", "N/A", "", "", "",
    "Cups",
    "Wish https://www.amazon.com/hz/wishlist/ls/ABC?ref\\_=wl\\_share now",
  ]),
  // lowercase name, real allergy text, birthday without year
  row(["8/15/2026 13:41:00", "airman", "kathryn ", "counselor", "7/20", "KA", "M", "Shrimp\\!", "2 dogs", "Purple", ...Array(18).fill(""), ""]),
  // duplicate person, earlier submission
  row(["7/1/2026 09:00:00", "Zed", "Pat", "old role", "1/2/1990", "P", "L", "", "", "Red", ...Array(19).fill("")]),
  // duplicate person, later submission wins (case-insensitive match)
  row(["9/1/2026 09:00:00", "ZED", "pat", "new role", "1/2/1990", "P", "L", "n/a", "none", "Teal", ...Array(19).fill("")]),
  // no name at all
  row(["9/2/2026 09:00:00", "", "", "x", "1/1/2000", ...Array(25).fill("")]),
  // keep mixed-case hyphenated name; None. Do not like Peanut Butter stays
  row(["7/14/2026 14:16:01", "DeJohn-Mathis", "Heather", "Assistant Principal", "8/11/2026", "DJM", "M", "None. Do not like Peanut Butter", "", ...Array(20).fill("")]),
].join("\r\n");

const out = buildFavorites(CSV);
const by = (last: string) => out.find((p: { lastName: string }) => p.lastName === last)!;

test("parseCsv handles quotes, commas, newlines and doubled quotes", () => {
  const rows = parseCsv('a,"b,c","d ""e""","f\ng"\r\n1,2,3,4');
  assert.deepEqual(rows, [["a", "b,c", 'd "e"', "f\ng"], ["1", "2", "3", "4"]]);
});

test("rows are skipped, merged and sorted", () => {
  assert.deepEqual(
    out.map((p: { lastName: string }) => p.lastName),
    ["Adams", "airman", "DeJohn-Mathis", "ZED"].map((l) => (l === "airman" ? "Airman" : l)),
  );
  assert.equal(by("ZED").role, "new role");
  assert.equal(by("ZED").firstName, "Pat");
});

test("each object has exactly the expected keys", () => {
  const keys = ["allergies", "birthday", "enough", "favorites", "firstName", "id", "lastName", "monogram", "pets", "role", "size", "wishlist", "wishlistUrl"];
  for (const p of out) {
    assert.deepEqual(Object.keys(p).sort(), keys);
    for (const f of p.favorites) assert.deepEqual(Object.keys(f).sort(), ["label", "value"]);
  }
});

test("birthdays are month and day only, never a year", () => {
  for (const p of out) assert.doesNotMatch(p.birthday, /\d{4}/);
  assert.equal(by("Adams").birthday, "June 8");
  assert.equal(by("Airman").birthday, "July 20");
  assert.equal(parseBirthday("13/40/2000"), "");
  assert.equal(parseBirthday(""), "");
  assert.equal(parseBirthday("??????"), "");
  assert.doesNotMatch(JSON.stringify(out), /2003|7\/31\/2026|Timestamp/);
});

test("names: lowercase is capitalised, mixed case kept, whitespace trimmed", () => {
  assert.equal(by("Airman").firstName, "Kathryn");
  assert.equal(by("Adams").firstName, "Kelsey");
  assert.equal(by("DeJohn-Mathis").lastName, "DeJohn-Mathis");
  assert.equal(by("Adams").id, "kelsey-adams");
});

test("allergies and pets: none-ish becomes empty, real text kept, escapes removed", () => {
  assert.equal(by("Adams").allergies, "");
  assert.equal(by("Adams").pets, "");
  assert.equal(by("Airman").allergies, "Shrimp!");
  assert.equal(by("Airman").pets, "2 dogs");
  assert.equal(by("DeJohn-Mathis").allergies, "None. Do not like Peanut Butter");
});

test("favorites keep order, quotes and newlines (collapsed), skip blank and n/a", () => {
  const labels = by("Adams").favorites.map((f: { label: string }) => f.label);
  assert.deepEqual(labels, ["Color", "Holiday", "Movies/TV Shows", "Genre of Books", "Candy"]);
  assert.equal(by("Adams").favorites[2].value, 'She said "hi"');
  assert.equal(by("Adams").favorites[3].value, "Romance, mystery");
});

test("wishlist url has markdown escapes removed in both fields", () => {
  const a = by("Adams");
  assert.equal(a.wishlistUrl, "https://www.amazon.com/hz/wishlist/ls/ABC?ref_=wl_share");
  assert.ok(a.wishlist.includes(a.wishlistUrl));
  assert.ok(!a.wishlist.includes("\\"));
  assert.equal(by("Airman").wishlistUrl, "");
});

test("outlook safelinks are unwrapped to the real address", () => {
  const wrapped =
    "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.amazon.com%2Fhz%2Fwishlist%2Fls%2FXYZ%3Fref_%3Dwl_share&data=05%7C02&sdata=abc&reserved=0";
  assert.equal(unwrapSafelink(wrapped), "https://www.amazon.com/hz/wishlist/ls/XYZ?ref_=wl_share");
  assert.equal(unwrapSafelink("https://www.amazon.com/a"), "https://www.amazon.com/a");
  assert.equal(unwrapSafelink("not a url"), "not a url");
});

test("monograms: initials kept, typed-out names reduced, placeholders dropped", () => {
  assert.equal(cleanMonogram("KAJ"), "KAJ");
  assert.equal(cleanMonogram("Sydney Rae West (SWR)"), "SWR");
  assert.equal(cleanMonogram("mDn"), "MDN");
  assert.equal(cleanMonogram("Sydney Rae West"), "SRW");
  assert.equal(cleanMonogram("??????"), "");
  assert.equal(cleanMonogram(""), "");
});
