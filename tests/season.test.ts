import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveSeason, seasonForDate } from "../src/themes/config.ts";

const d = (m: number, day: number) => new Date(2026, m - 1, day);

describe("seasonForDate", () => {
  it("is fall from Sep 15 through Nov 30", () => {
    assert.equal(seasonForDate(d(9, 14)), "none");
    assert.equal(seasonForDate(d(9, 15)), "fall");
    assert.equal(seasonForDate(d(10, 21)), "fall");
    assert.equal(seasonForDate(d(11, 30)), "fall");
  });
  it("is christmas from Dec 1 through Jan 6, across the new year", () => {
    assert.equal(seasonForDate(d(12, 1)), "christmas");
    assert.equal(seasonForDate(d(12, 25)), "christmas");
    assert.equal(seasonForDate(d(1, 6)), "christmas");
    assert.equal(seasonForDate(d(1, 7)), "none");
  });
  it("is none the rest of the year", () => {
    assert.equal(seasonForDate(d(4, 10)), "none");
    assert.equal(seasonForDate(d(8, 1)), "none");
  });
});

describe("resolveSeason", () => {
  const date = d(10, 21);
  it("uses the date when nothing overrides it", () => {
    assert.equal(resolveSeason({ date, search: "", override: null }), "fall");
  });
  it("lets the code override beat the date", () => {
    assert.equal(resolveSeason({ date, search: "", override: "christmas" }), "christmas");
    assert.equal(resolveSeason({ date, search: "", override: "none" }), "none");
  });
  it("lets ?season= beat the code override", () => {
    assert.equal(resolveSeason({ date, search: "?season=christmas", override: "none" }), "christmas");
    assert.equal(resolveSeason({ date: d(4, 1), search: "?season=fall", override: null }), "fall");
  });
  it("ignores unknown ?season= values", () => {
    assert.equal(resolveSeason({ date, search: "?season=spring", override: null }), "fall");
    assert.equal(resolveSeason({ date, search: "?x=1&season=", override: null }), "fall");
  });
});
