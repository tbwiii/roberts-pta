import "./christmas.css";

const SWAGS = 8;
const WIRE_H = 40;
const BULB_COLORS = ["#d93a3a", "#ffc94a", "#2f8f4e", "#bfe3ff"];

/** Wire height in px (viewBox y) at horizontal position x (0..100). */
function wireY(x: number): number {
  const t = ((x / 100) * SWAGS) % 1;
  return 4 + 15 * Math.sin(Math.PI * t);
}

const WIRE_PATH = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 400; i++) {
    const x = i / 4;
    pts.push(`${i === 0 ? "M" : "L"}${x} ${wireY(x).toFixed(2)}`);
  }
  return pts.join(" ");
})();

// Bulbs: 3 per swag, at t = 0.2/0.5/0.8. Middle ones stay on phones.
const BULBS = Array.from({ length: SWAGS * 3 }, (_, i) => {
  const swag = Math.floor(i / 3);
  const slot = i % 3;
  const t = [0.18, 0.5, 0.82][slot];
  const x = ((swag + t) / SWAGS) * 100;
  return { x, y: wireY(x), color: BULB_COLORS[i % 4], i, slot };
});

const FLAKES = Array.from({ length: 48 }, (_, i) => {
  const layer = i % 3; // 0 far, 1 mid, 2 near
  const size = [3, 5, 8][layer] + (i % 2);
  return {
    i,
    layer,
    size,
    left: (i * 37 + 11) % 100,
    dur: [26, 18, 12][layer] + (i % 5),
    delay: -((i * 7) % 30),
    sway: 10 + (i % 4) * 6,
    swayDur: 4 + (i % 5),
    opacity: [0.45, 0.7, 0.95][layer],
    top: (i * 53) % 100,
    star: i % 8 === 0,
  };
});

const ORNAMENTS = [
  { x: 3.5, len: 46, c: "#d93a3a", c2: "#8f1f1f", d: 5.5, del: 0, phone: true },
  { x: 11.5, len: 28, c: "#ffc94a", c2: "#c98f14", d: 6.5, del: -2, phone: false },
  { x: 88.5, len: 34, c: "#9fb4d6", c2: "#4c628c", d: 5, del: -3, phone: false },
  { x: 96.5, len: 66, c: "#ffc94a", c2: "#c98f14", d: 7.5, del: -5, phone: true },
];

function Flake({ f, reduced }: { f: (typeof FLAKES)[number]; reduced: boolean }) {
  const style = {
    left: `${f.left}%`,
    width: f.size,
    height: f.size,
    opacity: f.opacity,
    "--xmas-sway": `${f.sway}px`,
    ...(reduced
      ? { top: `${f.top}%` }
      : {
          animationDuration: `${f.dur}s`,
          animationDelay: `${f.delay}s`,
        }),
  } as unknown as React.CSSProperties;
  const inner = {
    animationDuration: `${f.swayDur}s`,
    animationDelay: `${-f.i}s`,
  } as React.CSSProperties;
  return (
    <span
      className={`xmas-flake ${reduced ? "" : "xmas-fall"} ${f.layer === 0 ? "hidden sm:block" : ""}`}
      style={style}
    >
      {f.star ? (
        <svg viewBox="-10 -10 20 20" className={reduced ? "" : "xmas-sway"} style={inner}>
          <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round">
            <path d="M0-9V9M-7.8-4.5 7.8 4.5M-7.8 4.5 7.8-4.5" />
          </g>
        </svg>
      ) : (
        <span className={`xmas-dot ${reduced ? "" : "xmas-sway"}`} style={inner} />
      )}
    </span>
  );
}

function Tree({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 60" className={`xmas-tree ${className}`}>
      <rect x="18" y="50" width="4" height="8" fill="#6b4226" />
      <path d="M20 14 6 34h28z" fill="#2f8f4e" />
      <path d="M20 24 3 46h34z" fill="#27793f" />
      <path d="M20 34 0 54h40z" fill="#2f8f4e" />
      <path d="M20 44 0 54h40z" fill="#236b37" opacity=".35" />
      <circle cx="16" cy="30" r="1.8" fill="#d93a3a" />
      <circle cx="24" cy="39" r="1.8" fill="#ffc94a" />
      <circle cx="11" cy="47" r="1.8" fill="#bfe3ff" />
      <circle cx="28" cy="49" r="1.8" fill="#d93a3a" />
      <path
        className="xmas-star"
        d="m20 3 2 5.4 5.8.3-4.5 3.6 1.5 5.6L20 14.6l-4.8 3.3 1.5-5.6-4.5-3.6 5.8-.3z"
        fill="#ffc94a"
      />
    </svg>
  );
}

function Gift({ body, ribbon, className = "" }: { body: string; ribbon: string; className?: string }) {
  return (
    <svg viewBox="0 0 28 26" className={`xmas-gift ${className}`}>
      <rect x="2" y="9" width="24" height="16" rx="1.5" fill={body} />
      <rect x="1" y="6" width="26" height="6" rx="1.5" fill={body} />
      <rect x="1" y="10" width="26" height="2" fill="#000" opacity=".12" />
      <rect x="12" y="6" width="4" height="19" fill={ribbon} />
      <path d="M14 6C8 0 4 4 8 6zM14 6c6-6 10-2 6 0z" fill={ribbon} />
    </svg>
  );
}

export default function ChristmasLayer({ reduced }: { reduced: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {FLAKES.map((f) => (
        <Flake key={f.i} f={f} reduced={reduced} />
      ))}

      {/* Top light string */}
      <div className="xmas-top" style={{ height: WIRE_H }}>
        <svg viewBox={`0 0 100 ${WIRE_H}`} preserveAspectRatio="none" className="xmas-wire">
          <path d={WIRE_PATH} fill="none" stroke="#1d2b3f" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        </svg>
        {BULBS.map((b) => (
          <span
            key={b.i}
            className={`xmas-bulb ${reduced ? "" : "xmas-twinkle"} ${b.slot === 1 ? "" : "hidden sm:block"}`}
            style={
              {
                left: `${b.x}%`,
                top: b.y,
                "--xmas-c": b.color,
                animationDelay: `${-((b.i * 0.55) % 3)}s`,
                animationDuration: `${2.2 + (b.i % 4) * 0.5}s`,
              } as React.CSSProperties
            }
          />
        ))}
        {ORNAMENTS.map((o, k) => (
          <div
            key={k}
            className={`xmas-orn ${reduced ? "" : "xmas-swing"} ${o.phone ? "" : "hidden sm:block"}`}
            style={
              {
                left: `${o.x}%`,
                top: wireY(o.x),
                animationDuration: `${o.d}s`,
                animationDelay: `${o.del}s`,
              } as React.CSSProperties
            }
          >
            <i className="xmas-string" style={{ height: o.len }} />
            <svg viewBox="0 0 24 28" className="xmas-ball" style={{ top: o.len - 2 }}>
              <defs>
                <radialGradient id={`xo${k}`} cx=".35" cy=".35" r=".8">
                  <stop offset="0" stopColor={o.c} />
                  <stop offset="1" stopColor={o.c2} />
                </radialGradient>
              </defs>
              <rect x="9" y="0" width="6" height="5" rx="1" fill="#ffc94a" />
              <circle cx="12" cy="16" r="11" fill={`url(#xo${k})`} />
              <ellipse cx="8" cy="11" rx="3" ry="2" fill="#fff" opacity=".55" transform="rotate(-35 8 11)" />
            </svg>
          </div>
        ))}
      </div>

      {/* Bottom snowdrift */}
      <div className="xmas-bottom">
        <Tree className="xmas-t1" />
        <Tree className="xmas-t2 hidden sm:block" />
        <Tree className="xmas-t3 hidden sm:block" />
        <Gift body="#d93a3a" ribbon="#ffc94a" className="xmas-g1 hidden sm:block" />
        <Gift body="#2f8f4e" ribbon="#ffffff" className="xmas-g2" />
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="xmas-hill">
          <path
            d="M0 30C120 8 240 8 360 26S600 44 760 24 1040 4 1200 22 1360 34 1440 20V56H0z"
            fill="#cfe0f5"
            opacity=".6"
          />
          <path
            d="M0 40C140 22 280 24 420 38S700 52 880 36 1180 20 1320 34L1440 40V56H0z"
            fill="#f4f8ff"
          />
        </svg>
      </div>
    </div>
  );
}
