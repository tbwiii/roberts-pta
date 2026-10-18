import { useEffect, useState } from "react";
import { IconShare2, IconX } from "@tabler/icons-react";
import {
  dismiss,
  isDismissed,
  pickHint,
  recordVisit,
  safeStore,
  shouldShowBanner,
} from "../lib/install-logic";

// Chrome's non-standard install event; not in lib.dom.
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const local = () => safeStore(() => window.localStorage);
const session = () => safeStore(() => window.sessionStorage);

const isInstalled = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

export default function InstallBanner() {
  const [visits] = useState(() => recordVisit(local(), session()));
  const [event, setEvent] = useState<InstallEvent | null>(
    () => (window.__ptaInstallEvent as InstallEvent | undefined) ?? null,
  );
  const [dismissed, setDismissed] = useState(() => isDismissed(local(), Date.now()));
  const [installed, setInstalled] = useState(isInstalled);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep the event so our banner can trigger it
      window.__ptaInstallEvent = e;
      setEvent(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const hint = pickHint({
    userAgent: navigator.userAgent,
    maxTouchPoints: navigator.maxTouchPoints,
    canPrompt: event !== null,
  });

  if (!shouldShowBanner({ visits, dismissed, installed, hint })) {
    return null;
  }

  const close = () => {
    dismiss(local(), Date.now());
    setDismissed(true);
  };

  const install = async () => {
    if (!event) return;
    await event.prompt();
    const { outcome } = await event.userChoice;
    window.__ptaInstallEvent = undefined;
    setEvent(null); // the event can only be used once
    if (outcome === "dismissed") close();
  };

  return (
    <>
      {/* Page-flow spacer so the last row can scroll clear of the fixed banner. */}
      <div aria-hidden="true" className="h-[calc(6rem+env(safe-area-inset-bottom))] md:hidden" />
      <section
        aria-label="Install the app"
        className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden"
      >
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border-2 border-roberts_blue-600 bg-roberts_blue-900 p-3 pl-4 shadow-xl">
          <img src="/icon-192.png" alt="" width={44} height={44} className="rounded-xl" />
          <p className="flex-1 text-sm text-roberts_blue-50">
            {hint?.kind === "install" && "Add Roberts PTA to your home screen."}
            {hint?.kind === "open-in" && `Open in ${hint.browser} to add this to your home screen.`}
            {hint?.kind === "share" && (
              <>
                To add this to your home screen, tap{" "}
                <IconShare2 aria-label="Share" className="inline h-4 w-4 align-text-bottom" /> then
                &ldquo;Add to Home Screen&rdquo;.
              </>
            )}
          </p>
          {hint?.kind === "install" && (
            <button
              type="button"
              onClick={install}
              className="rounded-full bg-[#ffc94a] px-4 py-2 text-sm font-bold text-roberts_blue-900 outline-none hover:opacity-90 focus-visible:ring-4 focus-visible:ring-roberts_blue-50"
            >
              Install
            </button>
          )}
          <button
            type="button"
            onClick={close}
            aria-label="Dismiss"
            className="rounded-full p-1.5 text-roberts_blue-200 outline-none hover:text-roberts_blue-50 focus-visible:ring-4 focus-visible:ring-[#ffc94a]"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
      </section>
    </>
  );
}
