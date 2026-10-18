import test from "node:test";
import assert from "node:assert/strict";
import {
  DISMISS_DAYS,
  dismiss,
  isDismissed,
  isIOS,
  recordVisit,
  safeStore,
  shouldShowBanner,
  type Store,
} from "../src/lib/install-logic.ts";

const memory = (): Store => {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v) };
};
const broken: Store = {
  getItem() {
    throw new Error("blocked");
  },
  setItem() {
    throw new Error("blocked");
  },
};
const base = { visits: 2, dismissed: false, installed: false, canPrompt: true, ios: false };

test("a session counts as one visit, even across reloads", () => {
  const local = memory();
  const session = memory();
  assert.equal(recordVisit(local, session), 1);
  assert.equal(recordVisit(local, session), 1);
  assert.equal(recordVisit(local, memory()), 2); // new session = second visit
});

test("storage that throws never breaks and never reaches visit two", () => {
  assert.equal(recordVisit(broken, broken), 1);
  assert.equal(isDismissed(broken, Date.now()), false);
  dismiss(broken, Date.now());
});

test("a storage getter that throws yields a harmless no-op store", () => {
  const store = safeStore(() => {
    throw new Error("SecurityError");
  });
  assert.equal(recordVisit(store, store), 1);
  assert.equal(isDismissed(store, Date.now()), false);
  assert.equal(safeStore(() => memory()).getItem("x"), null); // a working store passes through
});

test("dismissal lasts DISMISS_DAYS then expires", () => {
  const local = memory();
  const t = 1_700_000_000_000;
  dismiss(local, t);
  assert.equal(isDismissed(local, t + (DISMISS_DAYS - 1) * 86_400_000), true);
  assert.equal(isDismissed(local, t + (DISMISS_DAYS + 1) * 86_400_000), false);
});

test("banner waits for the second visit", () => {
  assert.equal(shouldShowBanner({ ...base, visits: 1 }), false);
  assert.equal(shouldShowBanner(base), true);
});

test("banner stays hidden when dismissed or already installed", () => {
  assert.equal(shouldShowBanner({ ...base, dismissed: true }), false);
  assert.equal(shouldShowBanner({ ...base, installed: true }), false);
});

test("needs either an install event or iOS", () => {
  assert.equal(shouldShowBanner({ ...base, canPrompt: false }), false);
  assert.equal(shouldShowBanner({ ...base, canPrompt: false, ios: true }), true);
});

test("detects iPhone and iPadOS but not a Mac or Android", () => {
  assert.equal(isIOS("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)", 5), true);
  assert.equal(isIOS("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 5), true); // iPad as Mac
  assert.equal(isIOS("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 0), false);
  assert.equal(isIOS("Mozilla/5.0 (Linux; Android 14; Pixel 8)", 5), false);
});
