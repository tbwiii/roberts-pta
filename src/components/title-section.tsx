import { useEffect, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { springs, timeline } from "../lib/motion";

const flames = [
  { src: "/flame-lg.png", top: -4, w: 40, delay: 0.2 },
  { src: "/flame-md.png", top: -2, w: 34, delay: 0.6 },
  { src: "/flame-sm.png", top: 2, w: 23, delay: 0.1 },
];

const PARTICLE_COLORS = ["#ffffff", "#ffc94a", "#dc5746"];

// Deterministic so every load looks the same (and render stays pure).
const particles = Array.from({ length: 16 }, (_, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  const spread = 10 + ((i * 37) % 28);
  return {
    id: i,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    size: 8 + ((i * 5) % 9),
    x: side * spread,
    startY: 70 - i * 4, // follows the rocket's tail as it rises
    drift: 34 + ((i * 11) % 30),
    delay: timeline.liftoff + i * 0.045,
  };
});

/** Flame stack. `ignite` plays the scale-up; `flare` is a scroll-velocity multiplier. */
function Flame({
  flare,
  flicker,
  animateIn,
}: {
  flare?: MotionValue<number>;
  flicker: boolean;
  animateIn: boolean;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 flex justify-center"
      style={{ scaleY: flare, originY: 0, top: "100%" }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 flex justify-center"
        style={{ originY: 0 }}
        initial={animateIn ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springs.pop, delay: timeline.ignite }}
      >
        {flames.map((f) => (
          <img
            key={f.src}
            className={`absolute origin-top ${flicker ? "animate-flame" : ""}`}
            style={{
              top: `${f.top}px`,
              width: `${f.w}%`,
              animationDelay: `${f.delay}s`,
            }}
            src={f.src}
            alt=""
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

function ExhaustTrail() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2600);
    return () => clearTimeout(t);
  }, []);
  if (done) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            top: 0,
            filter: "blur(1px)",
          }}
          initial={{ x: 0, y: p.startY, scale: 0.3, opacity: 0 }}
          animate={{
            x: p.x,
            y: p.startY + p.drift,
            scale: [0.3, 1.2, 1.9],
            opacity: [0, 0.75, 0],
          }}
          transition={{ duration: 0.9, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function Letters({ text, start }: { text: string; start: number }) {
  return (
    <span aria-hidden="true" className="block">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "0.7em", rotate: 8, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          transition={{ ...springs.pop, delay: start + i * 0.04 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export function TitleSection() {
  const reduce = !!useReducedMotion();
  const animateIn = !reduce;
  const [settled, setSettled] = useState(reduce);
  const [badgeOn, setBadgeOn] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setSettled(true), timeline.rocketSettled * 1000);
    return () => clearTimeout(t);
  }, [reduce]);

  const { scrollY } = useScroll();

  // Hero rocket shrinks and fades as the page scrolls; badge takes over.
  const heroScale = useTransform(scrollY, [0, 320], [1, 0.55]);
  const heroOpacity = useTransform(scrollY, [120, 320], [1, 0]);
  const heroY = useTransform(scrollY, [0, 320], [0, -24]);
  const badgeProgress = useSpring(
    useTransform(scrollY, [220, 320], [0, 1]),
    springs.soft,
  );
  const badgeY = useTransform(badgeProgress, [0, 1], [-16, 0]);
  useMotionValueEvent(scrollY, "change", (v) => setBadgeOn(v > 270));

  // Scroll velocity flares the flame (disabled for reduced motion).
  const velocity = useVelocity(scrollY);
  const rawFlare = useTransform(velocity, (v) =>
    reduce ? 1 : 1 + Math.min(Math.abs(v) / 1800, 1) * 0.9,
  );
  const flare = useSpring(rawFlare, springs.soft);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  return (
    <header className="relative mb-14 flex items-end gap-3 sm:mb-20 sm:gap-8">
      <div className="relative z-10 ml-7 w-[7rem] shrink-0 sm:ml-0 sm:w-40">
        {/* Reserved final footprint: the rocket's box never changes size. */}
        <motion.div
          style={
            reduce
              ? undefined
              : { scale: heroScale, opacity: heroOpacity, y: heroY, originY: 1 }
          }
        >
          {animateIn && <ExhaustTrail />}
          <motion.div
            className="relative z-10"
            initial={animateIn ? { y: 160, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...springs.pop, stiffness: 120, damping: 16, mass: 1, delay: timeline.liftoff }}
          >
            <motion.div
              animate={settled && animateIn ? { y: [0, -7] } : { y: 0 }}
              transition={
                settled && animateIn
                  ? { duration: 1.3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
                  : { duration: 0 }
              }
            >
              <div className="relative -rotate-[14deg] origin-bottom">
                <img
                  className="relative z-10 w-full"
                  alt="The Roberts Elementary rocket"
                  src="/rocket.png"
                  width={188}
                  height={312}
                />
                <Flame flare={flare} flicker={settled && animateIn} animateIn={animateIn} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 pb-3">
        <motion.p
          className="mb-1 text-base font-semibold text-roberts_blue-100 sm:text-lg"
          initial={animateIn ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.pop, delay: timeline.title + 0.45 }}
        >
          C.A. Roberts Elementary, Dallas, GA
        </motion.p>
        <h1
          aria-label="Roberts PTA"
          className="font-display text-[2.6rem] leading-[0.95] text-white sm:text-6xl"
        >
          {animateIn ? (
            <>
              <Letters text="Roberts" start={timeline.title} />
              <Letters text="PTA" start={timeline.title + 7 * 0.04} />
            </>
          ) : (
            <>
              Roberts
              <br />
              PTA
            </>
          )}
        </h1>
        <motion.p
          className="mt-3 inline-block rounded-lg bg-[#ffc94a] px-3 py-1 text-base font-bold text-roberts_blue-900 sm:text-lg"
          initial={animateIn ? { opacity: 0, scale: 1.7, rotate: 6 } : false}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ ...springs.pop, delay: timeline.title + 0.75 }}
          style={reduce ? { rotate: -2 } : undefined}
        >
          Shooting for the stars!
        </motion.p>
      </div>

      {/* Sticky badge: appears once the hero is mostly off-screen. */}
      <div className="pointer-events-none fixed inset-x-0 top-2 z-40 flex justify-center">
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Roberts PTA, back to top"
          tabIndex={badgeOn ? 0 : -1}
          aria-hidden={!badgeOn}
          className={`flex items-center gap-2 rounded-full border border-white/15 bg-roberts_blue-900/90 py-1 pl-2 pr-4 text-sm font-semibold text-white shadow-lg backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc94a] ${badgeOn ? "pointer-events-auto" : ""}`}
          style={{
            opacity: reduce ? (badgeOn ? 1 : 0) : badgeProgress,
            y: reduce ? 0 : badgeY,
            scale: reduce ? 1 : badgeProgress,
          }}
          whileTap={reduce ? undefined : { scale: 0.94 }}
        >
          <span className="relative block h-7 w-4 -rotate-[14deg]">
            <img src="/rocket.png" alt="" className="relative z-10 h-full w-full object-contain" />
            <Flame flare={flare} flicker={!reduce} animateIn={false} />
          </span>
          <span className="font-display">Roberts PTA</span>
        </motion.button>
      </div>
    </header>
  );
}
