import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { springs, timeline } from "../lib/motion";
import ClipboardJS from "clipboard";
import { IconCheck, IconCopy } from "@tabler/icons-react";

export type Tone = "yellow" | "red" | "white";

const tones: Record<Tone, { tile: string; chip: string; shadow: string }> = {
  yellow: {
    tile: "bg-[#ffc94a] text-roberts_blue-900",
    chip: "bg-roberts_blue-900 text-[#ffc94a]",
    shadow: "bg-[#dc5746]",
  },
  red: {
    tile: "bg-roberts_red-400 text-roberts_blue-900",
    chip: "bg-roberts_blue-900 text-white",
    shadow: "bg-[#1a3e7b]",
  },
  white: {
    tile: "bg-[#f6f8ff] text-roberts_blue-900",
    chip: "bg-roberts_blue-700 text-white",
    shadow: "bg-[#357ef7]",
  },
};

const SHADOW = 5; // px depth of the hard offset shadow
const PARTICLES = 8;

type Particle = { id: number; x: number; y: number; r: number; s: number };

function Star({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path
        fill={color}
        d="M12 1.5l3 7.2 7.5.6-5.7 5 1.8 7.4L12 17.6 5.4 21.7l1.8-7.4-5.7-5 7.5-.6z"
      />
    </svg>
  );
}

export default function Item({
  name,
  note,
  url,
  icon,
  tone = "white",
  featured = false,
  wide = false,
  index = 0,
}: {
  name: string;
  note: string;
  url: string;
  icon: ReactNode;
  tone?: Tone;
  featured?: boolean;
  wide?: boolean;
  index?: number;
}) {
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const liRef = useRef<HTMLLIElement>(null);
  const [copied, setCopied] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const t = tones[tone];
  const reduce = useReducedMotion();
  const stub = useAnimationControls();

  // Pointer tilt (fine pointers only)
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, springs.soft);
  const rotateY = useSpring(ry, springs.soft);
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const tilt = finePointer && !reduce;

  const onMove = (e: React.PointerEvent) => {
    if (!tilt || e.pointerType !== "mouse" || !liRef.current) return;
    const r = liRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    ry.set(nx * 8);
    rx.set(-ny * 8);
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

  const tear = useCallback(async () => {
    if (reduce) return;
    setParticles(
      Array.from({ length: PARTICLES }, (_, i) => {
        const a = (-70 + (140 * i) / (PARTICLES - 1)) * (Math.PI / 180);
        const d = 44 + Math.random() * 34;
        return {
          id: Date.now() + i,
          x: Math.cos(a) * d * 0.8 + 6,
          y: Math.sin(a) * d - 8,
          r: (Math.random() - 0.5) * 240,
          s: 0.55 + Math.random() * 0.6,
        };
      }),
    );
    await stub.start({
      rotate: -11,
      x: 3,
      y: 5,
      transition: { duration: 0.07, ease: "easeOut" },
    });
    await stub.start({ rotate: 0, x: 0, y: 0, transition: springs.pop });
  }, [reduce, stub]);
  const tearRef = useRef(tear);
  tearRef.current = tear;

  useEffect(() => {
    const clipboard = new ClipboardJS(copyButtonRef.current!, {
      text: () => url,
    });
    let timer: number | undefined;
    clipboard.on("success", (e: ClipboardJS.Event) => {
      e.clearSelection();
      void tearRef.current();
      setCopied(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setCopied(false), 2000);
    });
    clipboard.on("error", (e: ClipboardJS.Event) => {
      console.error("Failed to copy text:", e);
    });
    return () => {
      window.clearTimeout(timer);
      clipboard.destroy();
    };
  }, [url]);

  const delay = timeline.tickets + index * timeline.ticketStagger;
  const dir = index % 2 === 0 ? -1 : 1;

  return (
    <motion.li
      ref={liRef}
      className={`relative ${featured || wide ? "sm:col-span-2" : ""}`}
      style={
        tilt
          ? { transformPerspective: 900, rotateX, rotateY }
          : { transformPerspective: 900 }
      }
      initial={
        reduce ? false : { opacity: 0, y: 36, rotate: 3 * dir, scale: 0.94 }
      }
      animate={{
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: { ...springs.pop, delay },
      }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      // whileTap makes the li focusable; keep tab order on the link and copy button.
      tabIndex={-1}
      transition={springs.pop}
      onPointerMove={onMove}
      onPointerLeave={resetTilt}
      onTapStart={() => setPressed(true)}
      onTap={() => setPressed(false)}
      onTapCancel={() => setPressed(false)}
    >
      {/* hard offset shadow layer */}
      <motion.div
        aria-hidden="true"
        className={`absolute inset-0 rounded-2xl ${t.shadow}`}
        initial={false}
        animate={{ y: pressed && !reduce ? 1 : SHADOW }}
        transition={springs.pop}
      />
      <motion.div
        className="relative flex h-full"
        initial={false}
        animate={{ y: pressed && !reduce ? SHADOW - 1 : 0 }}
        transition={springs.pop}
      >
        <a
          href={url}
          className={`group flex min-w-0 flex-1 items-center gap-3 rounded-l-2xl px-4 outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-roberts_blue-900 ${t.tile} ${
            featured ? "py-5 sm:py-6" : "py-4"
          }`}
        >
          <span
            className={`grid shrink-0 place-items-center rounded-xl transition-transform group-hover:-rotate-6 group-hover:scale-110 ${t.chip} ${
              featured ? "h-14 w-14" : "h-11 w-11"
            }`}
          >
            {icon}
          </span>
          <span className="min-w-0">
            <span
              className={`block font-display leading-tight ${
                featured ? "text-2xl sm:text-3xl" : "text-xl"
              }`}
            >
              {name}
            </span>
            <span className="block text-sm font-medium leading-snug opacity-80">
              {note}
            </span>
          </span>
        </a>
        <motion.button
          ref={copyButtonRef}
          type="button"
          aria-label={`Copy link to ${name}`}
          data-clipboard-text={url}
          animate={stub}
          style={{ transformOrigin: "0% 0%" }}
          className={`flex w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-r-2xl border-l-2 border-dashed border-roberts_blue-900/40 text-xs font-bold outline-none transition-colors focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-roberts_blue-900 ${
            copied
              ? "bg-roberts_blue-900 text-white"
              : `${t.tile} hover:brightness-95`
          }`}
        >
          <span key={String(copied)} className={copied ? "copied-pop" : ""}>
            {copied ? <IconCheck size={22} stroke={3} /> : <IconCopy size={22} />}
          </span>
          <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
          <span role="status" className="sr-only">
            {copied ? `Link to ${name} copied` : ""}
          </span>
        </motion.button>
      </motion.div>
      {/* star burst, centered on the stub */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-10 grid h-full w-14 place-items-center"
      >
        {particles.map((p, i) => (
          <motion.span
            key={p.id}
            className="col-start-1 row-start-1 block h-3.5 w-3.5"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.3, rotate: 0 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: p.s, rotate: p.r }}
            transition={{ duration: 0.7, ease: [0.15, 0.7, 0.3, 1] }}
            onAnimationComplete={
              i === 0 ? () => setParticles([]) : undefined
            }
          >
            <Star color={i % 3 === 0 ? "#ffffff" : "#ffc94a"} />
          </motion.span>
        ))}
      </span>
    </motion.li>
  );
}
