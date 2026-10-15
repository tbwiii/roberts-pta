import { useEffect, useRef, useState, type FormEvent } from "react";
import { IconX } from "@tabler/icons-react";

const LEADS_URL = import.meta.env.VITE_LEADS_URL as string | undefined;

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border-2 border-roberts_blue-600 bg-roberts_blue-900 px-4 py-2.5 text-roberts_blue-50 placeholder:text-roberts_blue-300/60 outline-none transition-colors focus:border-[#ffc94a] focus-visible:ring-4 focus-visible:ring-[#ffc94a]/40";

export default function LeadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  // The native <dialog> gives us the focus trap, Esc-to-close and focus
  // restoration; we just keep it in sync with the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setStatus("idle");
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // Honeypot: real people never see this field. Pretend success for bots.
    if (data.get("hp_field")) {
      setStatus("sent");
      return;
    }
    if (!LEADS_URL) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      // text/plain keeps this a "simple" request, so no CORS preflight (Apps
      // Script web apps don't answer OPTIONS). The response is opaque, so a
      // resolved fetch is treated as success.
      await fetch(LEADS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
        }),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-labelledby="lead-modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border-2 border-roberts_blue-200 bg-roberts_blue-800 p-0 text-roberts_blue-50 shadow-2xl backdrop:bg-roberts_blue-900/80 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-roberts_blue-200 outline-none transition-colors hover:bg-roberts_blue-700 focus-visible:ring-4 focus-visible:ring-[#ffc94a]"
        >
          <IconX size={22} />
        </button>

        {status === "sent" ? (
          <div className="py-6 text-center">
            <h2 id="lead-modal-title" className="font-display text-3xl">
              Thanks!
            </h2>
            <p className="mt-3 text-roberts_blue-100">
              I'll be in touch soon.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full border-2 border-roberts_blue-200 px-5 py-2 font-semibold outline-none transition-colors hover:bg-roberts_blue-50 hover:text-roberts_blue-900 focus-visible:ring-4 focus-visible:ring-[#ffc94a]"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h2 id="lead-modal-title" className="font-display text-3xl">
                Need an app or website?
              </h2>
              <p className="mt-1 text-roberts_blue-100">
                Tell me a bit about what you're building and I'll get back to
                you within a day or two.
              </p>
            </div>

            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Name
              <input
                name="name"
                required
                autoComplete="name"
                className={field}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className={field}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Phone <span className="font-normal opacity-70">(optional)</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                className={field}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              What do you need?{" "}
              <span className="font-normal opacity-70">(optional)</span>
              <textarea name="message" rows={3} className={field} />
            </label>

            {/* Honeypot, hidden from people and assistive tech. */}
            <input
              name="hp_field"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            {status === "error" && (
              <p role="alert" className="text-sm text-roberts_red-200">
                Something went wrong sending that. Please try again in a
                moment.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-full bg-[#ffc94a] px-5 py-3 font-bold text-roberts_blue-900 outline-none transition-opacity hover:opacity-90 focus-visible:ring-4 focus-visible:ring-roberts_blue-50 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Let's talk"}
            </button>
            <p className="text-center text-xs text-roberts_blue-200">
              Only used to reply to you. No spam.
            </p>
            <p className="text-center text-sm text-roberts_blue-100">
              Check me out at{" "}
              <a
                href="https://ted.codes"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline outline-none focus-visible:ring-4 focus-visible:ring-[#ffc94a]"
              >
                ted.codes
              </a>
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
