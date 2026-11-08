import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { holidayShop } from "../src/data/holiday-shop.ts";

describe("holidayShop", () => {
  it("links to the online payment site over https", () => {
    const url = new URL(holidayShop.url);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "www.funhgs.com");
  });
  it("shows the sale dates, Nov 30 to Dec 4", () => {
    assert.match(holidayShop.note, /Nov 30/);
    assert.match(holidayShop.note, /Dec 4/);
  });
  it("is labelled as the Holiday Shop online payment", () => {
    assert.match(holidayShop.name, /holiday shop/i);
    assert.match(holidayShop.name, /online payment/i);
  });
});
