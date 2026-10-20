import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  birthdayNote,
  daysUntilBirthday,
  hasWishList,
  matchesQuery,
  sortPeople,
  type StaffFavorites,
} from "../src/lib/favorites.ts";

const person = (over: Partial<StaffFavorites>): StaffFavorites => ({
  id: "x",
  firstName: "Ann",
  lastName: "Lee",
  role: "3rd grade",
  birthday: "",
  monogram: "",
  size: "",
  allergies: "",
  pets: "",
  enough: "",
  wishlist: "",
  wishlistUrl: "",
  favorites: [],
  ...over,
});

const today = new Date(2026, 9, 20); // Oct 20, 2026

describe("daysUntilBirthday", () => {
  it("counts days within the year", () => {
    assert.equal(daysUntilBirthday("October 20", today), 0);
    assert.equal(daysUntilBirthday("October 25", today), 5);
  });
  it("wraps to next year once the date has passed", () => {
    assert.equal(daysUntilBirthday("October 19", today), 364);
    assert.equal(daysUntilBirthday("January 1", today), 73);
  });
  it("returns null for blank or unparseable input", () => {
    assert.equal(daysUntilBirthday("", today), null);
    assert.equal(daysUntilBirthday("Smarch 3", today), null);
  });
});

describe("birthdayNote", () => {
  it("only speaks up inside 30 days", () => {
    assert.equal(birthdayNote(0), "Birthday today!");
    assert.equal(birthdayNote(1), "Birthday tomorrow");
    assert.equal(birthdayNote(12), "Birthday in 12 days");
    assert.equal(birthdayNote(31), "");
    assert.equal(birthdayNote(null), "");
  });
});

describe("matchesQuery", () => {
  const p = person({
    firstName: "Amy",
    role: "Art teacher",
    favorites: [{ label: "Candy", value: "Reese's outrageous" }],
  });
  it("matches name, role and favorites, case-insensitively", () => {
    assert.equal(matchesQuery(p, "amy"), true);
    assert.equal(matchesQuery(p, "ART"), true);
    assert.equal(matchesQuery(p, "reese"), true);
  });
  it("requires every word to match", () => {
    assert.equal(matchesQuery(p, "amy reese"), true);
    assert.equal(matchesQuery(p, "amy skittles"), false);
  });
  it("matches everyone on an empty query", () => {
    assert.equal(matchesQuery(p, "   "), true);
  });
});

describe("sortPeople", () => {
  const a = person({ id: "a", lastName: "Adams", birthday: "June 8" });
  const b = person({ id: "b", lastName: "Barber", birthday: "October 25" });
  const c = person({ id: "c", lastName: "Cox", birthday: "" });
  const d = person({ id: "d", lastName: "Byrd", birthday: "October 21" });
  it("sorts by last name", () => {
    const ids = sortPeople([c, b, a, d], "name", today).map((p) => p.id);
    assert.deepEqual(ids, ["a", "b", "d", "c"]);
  });
  it("sorts by next birthday with unknowns last, and does not mutate", () => {
    const input = [a, b, c, d];
    const ids = sortPeople(input, "birthday", today).map((p) => p.id);
    assert.deepEqual(ids, ["d", "b", "a", "c"]);
    assert.deepEqual(input.map((p) => p.id), ["a", "b", "c", "d"]);
  });
});

describe("hasWishList", () => {
  it("counts a link or typed-in text, not blanks or stray punctuation", () => {
    assert.equal(hasWishList(person({ wishlistUrl: "https://a.co/x", wishlist: "https://a.co/x" })), true);
    assert.equal(hasWishList(person({ wishlist: "Tissues, wipes" })), true);
    assert.equal(hasWishList(person({ wishlist: "" })), false);
    assert.equal(hasWishList(person({ wishlist: " ;) " })), false);
  });
});
