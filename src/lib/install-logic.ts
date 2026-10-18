// Pure rules for the add-to-home-screen banner, kept free of DOM and React so node:test can cover them.

export const VISITS_KEY = "pta-visits";
export const COUNTED_KEY = "pta-visit-counted";
export const DISMISSED_KEY = "pta-install-dismissed";
export const MIN_VISITS = 2;
export const DISMISS_DAYS = 30;

export type Store = Pick<Storage, "getItem" | "setItem">;

// Merely reading window.localStorage throws a SecurityError when site data is blocked, so callers get
// the store through this getter instead of touching it directly.
export function safeStore(get: () => Store): Store {
  try {
    return get();
  } catch {
    return { getItem: () => null, setItem: () => {} };
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Storage can throw (private mode, blocked site data), so every access falls back quietly.
function read(store: Store, key: string): string | null {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function write(store: Store, key: string, value: string) {
  try {
    store.setItem(key, value);
  } catch {
    // Without storage the banner just never reaches the second visit.
  }
}

// A visit is one browser session, so reloads and in-app navigation do not count twice.
export function recordVisit(local: Store, session: Store): number {
  const visits = Number(read(local, VISITS_KEY)) || 0;
  if (read(session, COUNTED_KEY)) return visits;
  write(session, COUNTED_KEY, "1");
  write(local, VISITS_KEY, String(visits + 1));
  return visits + 1;
}

export function dismiss(local: Store, now: number) {
  write(local, DISMISSED_KEY, String(now));
}

export function isDismissed(local: Store, now: number): boolean {
  const at = Number(read(local, DISMISSED_KEY));
  return Boolean(at) && now - at < DISMISS_DAYS * DAY_MS;
}

export function isIOS(userAgent: string, maxTouchPoints: number): boolean {
  // iPadOS reports itself as a Mac, so tell it apart by touch support.
  return /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && maxTouchPoints > 1);
}

export function shouldShowBanner(s: {
  visits: number;
  dismissed: boolean;
  installed: boolean; // already running as an installed app
  canPrompt: boolean; // Chrome/Android handed us a beforeinstallprompt event
  ios: boolean; // iOS has no event, so we show the manual hint
}): boolean {
  if (s.installed || s.dismissed || s.visits < MIN_VISITS) return false;
  return s.canPrompt || s.ios;
}
