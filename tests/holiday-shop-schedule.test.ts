import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  holidayShopSchedule,
  holidayShopScheduleLink,
} from "../src/data/holiday-shop-schedule.ts";

describe("holidayShopScheduleLink", () => {
  it("is labelled as the Holiday Shop class schedule", () => {
    assert.match(holidayShopScheduleLink.name, /holiday shop/i);
    assert.match(holidayShopScheduleLink.name, /class schedule/i);
  });
  it("links to the schedule page, not a downloaded file", () => {
    assert.equal(holidayShopScheduleLink.url, "#/holiday-shop-schedule");
  });
});

describe("holidayShopSchedule", () => {
  it("covers Monday through Friday", () => {
    assert.deepEqual(
      holidayShopSchedule.days.map((d) => d.weekday),
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    );
  });
  it("every slot has a time and a teacher or note", () => {
    for (const day of holidayShopSchedule.days) {
      assert.ok(day.slots.length > 0, `${day.weekday} has slots`);
      for (const slot of day.slots) {
        assert.match(slot.time, /^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/);
        assert.ok(slot.teacher.length > 0);
      }
    }
  });
  it("Friday is make-up day for every grade", () => {
    const friday = holidayShopSchedule.days.find((d) => d.weekday === "Friday");
    assert.ok(friday);
    for (const slot of friday!.slots) {
      assert.equal(slot.teacher, "Make-up");
    }
  });
});
