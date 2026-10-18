import test from "node:test";
import assert from "node:assert/strict";
import {
  DISMISS_DAYS,
  dismiss,
  isDismissed,
  isIOS,
  isInAppBrowser,
  pickHint,
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
const base = { visits: 2, dismissed: false, installed: false, hint: { kind: "install" } as const };
const IPHONE_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const IPHONE_CHROME =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0 Mobile/15E148 Safari/604.1";
const IPHONE_FB =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/450.0]";
const IPHONE_WEBVIEW =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
const ANDROID_CHROME =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36";
const ANDROID_FB =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UP1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/450.0]";
const DESKTOP =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

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

test("needs a hint to show anything", () => {
  assert.equal(shouldShowBanner({ ...base, hint: null }), false);
  assert.equal(shouldShowBanner({ ...base, hint: { kind: "share" } }), true);
});

test("an install event always wins", () => {
  assert.deepEqual(pickHint({ userAgent: ANDROID_CHROME, maxTouchPoints: 5, canPrompt: true }), { kind: "install" });
});

test("iOS Safari and iOS Chrome get the Share hint", () => {
  assert.deepEqual(pickHint({ userAgent: IPHONE_SAFARI, maxTouchPoints: 5, canPrompt: false }), { kind: "share" });
  assert.deepEqual(pickHint({ userAgent: IPHONE_CHROME, maxTouchPoints: 5, canPrompt: false }), { kind: "share" });
});

test("iOS in-app browsers are told to open Safari", () => {
  for (const userAgent of [IPHONE_FB, IPHONE_WEBVIEW]) {
    assert.deepEqual(pickHint({ userAgent, maxTouchPoints: 5, canPrompt: false }), {
      kind: "open-in",
      browser: "Safari",
    });
  }
});

test("Android in-app browsers are told to open Chrome", () => {
  assert.deepEqual(pickHint({ userAgent: ANDROID_FB, maxTouchPoints: 5, canPrompt: false }), {
    kind: "open-in",
    browser: "Chrome",
  });
});

test("Android Chrome before the event, and desktop, show nothing", () => {
  assert.equal(pickHint({ userAgent: ANDROID_CHROME, maxTouchPoints: 5, canPrompt: false }), null);
  assert.equal(pickHint({ userAgent: DESKTOP, maxTouchPoints: 0, canPrompt: false }), null);
});

test("in-app detection leaves real browsers alone", () => {
  assert.equal(isInAppBrowser(IPHONE_SAFARI, true), false);
  assert.equal(isInAppBrowser(IPHONE_CHROME, true), false);
  assert.equal(isInAppBrowser(ANDROID_CHROME, false), false);
  assert.equal(isInAppBrowser(ANDROID_FB, false), true);
});

test("detects iPhone and iPadOS but not a Mac or Android", () => {
  assert.equal(isIOS("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)", 5), true);
  assert.equal(isIOS("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 5), true); // iPad as Mac
  assert.equal(isIOS("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 0), false);
  assert.equal(isIOS("Mozilla/5.0 (Linux; Android 14; Pixel 8)", 5), false);
});
