import type { CSSProperties, ReactNode } from "react";
import "./fall.css";

type Shape = "maple" | "oak" | "round";

const SHAPES: Record<Shape, { d: string; vein: string }> = {
  maple: {
    d: "M12 1.5 L14.2 6.8 L18.6 4.6 L17.4 10 L22.5 9.6 L18.8 13.8 L21 17.6 L14.6 16.6 L12.6 22 L11.4 22 L9.4 16.6 L3 17.6 L5.2 13.8 L1.5 9.6 L6.6 10 L5.4 4.6 L9.8 6.8 Z",
    vein: "M12 22 L12 7 M12 14 L7 10 M12 14 L17 10",
  },
  oak: {
    d: "M12 2 C14.6 2.6 13.8 5.6 16.4 6.4 C19.4 7.2 17.6 10.2 19.8 11.4 C18 13.2 19 16 16.2 17 C15.2 19.4 13.4 19.2 12.6 22 L11.4 22 C10.6 19.2 8.8 19.4 7.8 17 C5 16 6 13.2 4.2 11.4 C6.4 10.2 4.6 7.2 7.6 6.4 C10.2 5.6 9.4 2.6 12 2 Z",
    vein: "M12 22 L12 5 M12 16 L8 12.5 M12 16 L16 12.5 M12 10.5 L9.5 8 M12 10.5 L14.5 8",
  },
  round: {
    d: "M12 2 C19.5 6.5 20.5 16 12.6 22 L11.4 22 C3.5 16 4.5 6.5 12 2 Z",
    vein: "M12 22 L12 6 M12 15 L8.5 11.5 M12 12 L15.5 8.5",
  },
};

const COLORS = ["#e8731a", "#f2b134", "#c8452d", "#a0522d"];

interface LeafSpec {
  shape: Shape;
  color: string;
  size: number;
  x: number; // percent of width
  dur: number;
  delay: number;
  sway: number;
  opacity: number;
  rot: number;
  hideSm?: boolean;
}

const SHAPE_LIST: Shape[] = ["maple", "oak", "round"];
const SIZES = [22, 30, 16, 26, 34, 18, 24, 28, 14, 32, 20, 26, 16, 30];
const DURS = [14, 11, 17, 9.5, 16, 12.5, 18, 10.5, 15, 13, 9, 17.5, 11.5, 14.5];
const OPS = [0.85, 0.7, 0.9, 0.6, 0.8, 0.95, 0.65, 0.75, 0.55, 0.88, 0.7, 0.82, 0.6, 0.9];

const LEAVES: LeafSpec[] = Array.from({ length: 14 }, (_, i) => ({
  shape: SHAPE_LIST[i % 3],
  color: COLORS[(i * 3 + 1) % 4],
  size: SIZES[i],
  x: 3 + ((i * 37) % 94),
  dur: DURS[i],
  delay: -((i * 2.7) % DURS[i]),
  sway: 28 + ((i * 13) % 40),
  opacity: OPS[i],
  rot: 180 + ((i * 57) % 180),
  hideSm: i % 3 === 2, // ~9 leaves on phones
}));

function Leaf({ shape, color }: { shape: Shape; color: string }) {
  const s = SHAPES[shape];
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" overflow="visible">
      <path d={s.d} fill={color} />
      <path d={s.vein} fill="none" stroke="rgba(60,20,0,.45)" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

function FallingLeaf({ l, i, reduced }: { l: LeafSpec; i: number; reduced: boolean }) {
  const style = {
    "--fall-x": `${l.x}%`,
    "--fall-size": `${l.size}px`,
    "--fall-dur": `${l.dur}s`,
    "--fall-delay": `${l.delay}s`,
    "--fall-sway": `${l.sway}px`,
    "--fall-rot": `${l.rot}deg`,
    "--fall-y": `${8 + ((i * 29) % 70)}%`,
    opacity: l.opacity,
  } as CSSProperties;
  return (
    <div
      className={`fall-leaf ${reduced ? "fall-leaf-static" : ""} ${l.hideSm ? "fall-hide-sm" : ""}`}
      style={style}
    >
      <div className="fall-leaf-sway">
        <Leaf shape={l.shape} color={l.color} />
      </div>
    </div>
  );
}

/* ---------- Pumpkins ---------- */

function Pumpkin({ jack }: { jack?: boolean }) {
  return (
    <svg viewBox="0 0 64 56" className="fall-art" aria-hidden="true">
      <ellipse cx="32" cy="54" rx="24" ry="2" fill="rgba(0,0,0,.35)" />
      <ellipse cx="17" cy="33" rx="14" ry="19" fill="url(#fall-pump)" />
      <ellipse cx="47" cy="33" rx="14" ry="19" fill="url(#fall-pump)" />
      <ellipse cx="25" cy="33" rx="14" ry="21" fill="url(#fall-pump)" />
      <ellipse cx="39" cy="33" rx="14" ry="21" fill="url(#fall-pump)" />
      <ellipse cx="32" cy="33" rx="10" ry="22" fill="url(#fall-pump2)" />
      <path d="M25 14 C21 28 21 40 25 52 M39 14 C43 28 43 40 39 52 M14 22 C9 32 11 42 17 49 M50 22 C55 32 53 42 47 49" fill="none" stroke="#a8480d" strokeWidth="1.2" opacity=".55" strokeLinecap="round" />
      <path d="M29.5 14 C29 9 30.5 6 33 3 L36.5 4.5 C35 7 35.5 10 36 14 Z" fill="#4f7a2a" />
      <path d="M36 6 C41 3 45 6 44 11" fill="none" stroke="#6aa13a" strokeWidth="1.6" strokeLinecap="round" />
      {jack && (
        <g className="fall-jack">
          <path d="M20 26 L27 26 L23.5 32 Z M37 26 L44 26 L40.5 32 Z" fill="#ffd66b" />
          <path d="M22 38 L26 41 L29 38 L32 41 L35 38 L38 41 L42 38 L40 45 Q32 49 24 45 Z" fill="#ffd66b" />
        </g>
      )}
    </svg>
  );
}

function Gourd({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 56" className="fall-art" aria-hidden="true">
      <ellipse cx="20" cy="54" rx="14" ry="1.8" fill="rgba(0,0,0,.35)" />
      <path d="M20 14 C28 14 27 24 29 30 C35 36 33 52 20 52 C7 52 5 36 11 30 C13 24 12 14 20 14 Z" fill={color} />
      <path d="M20 16 C17 28 17 40 20 52 M14 24 C10 34 11 44 15 50 M26 24 C30 34 29 44 25 50" fill="none" stroke="rgba(90,40,0,.4)" strokeWidth="1" strokeLinecap="round" />
      <path d="M18.5 14 C18 9 19 6 21 3 L24 4.5 C22.5 7 22.8 10 23 14 Z" fill="#5c7f2c" />
    </svg>
  );
}

function AcornArt() {
  return (
    <svg viewBox="0 0 24 30" className="fall-art" aria-hidden="true">
      <ellipse cx="12" cy="28.5" rx="7" ry="1.2" fill="rgba(0,0,0,.35)" />
      <path d="M5 14 C5 24 9 27 12 28 C15 27 19 24 19 14 Z" fill="#c98a3a" />
      <path d="M3.5 14.5 C3.5 8 8 6 12 6 C16 6 20.5 8 20.5 14.5 Z" fill="#7a4a24" />
      <path d="M6 11 L18 11 M5 13.5 L19 13.5 M8 8.5 L16 8.5" stroke="rgba(0,0,0,.25)" strokeWidth=".8" />
      <path d="M12 6 L12.5 2.5" stroke="#5a3418" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

interface Prop {
  node: ReactNode;
  h: "lg" | "md" | "sm";
  hideSm?: boolean;
  bobDelay: number;
}

const PROPS: Prop[] = [
  { node: <Pumpkin jack />, h: "lg", bobDelay: 0 },
  { node: <Gourd color="#d99a1e" />, h: "sm", hideSm: true, bobDelay: -1.2 },
  { node: <Pumpkin />, h: "md", bobDelay: -2 },
  { node: <AcornArt />, h: "sm", hideSm: true, bobDelay: -0.6 },
  { node: <Pumpkin jack />, h: "md", bobDelay: -1.5 },
  { node: <Gourd color="#b8541f" />, h: "sm", bobDelay: -2.6 },
  { node: <Pumpkin />, h: "lg", hideSm: true, bobDelay: -0.9 },
];

/* ---------- Corner garland ---------- */

function Garland() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <path d="M-2 14 C30 18 52 30 64 52 C72 66 78 76 84 84" fill="none" stroke="#6b4a2a" strokeWidth="2.2" strokeLinecap="round" />
      <g transform="translate(34 18) rotate(-20) scale(1.35) translate(-12 -12)">
        <Leaf shape="maple" color="#e8731a" />
      </g>
      <g transform="translate(14 34) rotate(25) translate(-12 -12)">
        <Leaf shape="round" color="#f2b134" />
      </g>
      <g transform="translate(58 40) rotate(40) scale(1.2) translate(-12 -12)">
        <Leaf shape="oak" color="#c8452d" />
      </g>
      <g transform="translate(72 70) rotate(-30) scale(.95) translate(-12 -12)">
        <Leaf shape="maple" color="#f2b134" />
      </g>
      <g transform="translate(84 92) rotate(10) scale(.9) translate(-12 -15)">
        <path d="M5 14 C5 24 9 27 12 28 C15 27 19 24 19 14 Z" fill="#c98a3a" />
        <path d="M3.5 14.5 C3.5 8 8 6 12 6 C16 6 20.5 8 20.5 14.5 Z" fill="#7a4a24" />
        <path d="M12 6 L12 -4" stroke="#5a3418" strokeWidth="1.4" />
      </g>
    </svg>
  );
}

export default function FallLayer({ reduced }: { reduced: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <radialGradient id="fall-pump" cx="40%" cy="35%" r="75%">
            <stop offset="0" stopColor="#ff9a3c" />
            <stop offset="0.6" stopColor="#e8731a" />
            <stop offset="1" stopColor="#b84a0c" />
          </radialGradient>
          <radialGradient id="fall-pump2" cx="45%" cy="35%" r="80%">
            <stop offset="0" stopColor="#ffab4d" />
            <stop offset="0.7" stopColor="#ee7d22" />
            <stop offset="1" stopColor="#c4540f" />
          </radialGradient>
        </defs>
      </svg>

      <div className={`fall-root ${reduced ? "fall-reduced" : ""}`}>
        {LEAVES.map((l, i) => (
          <FallingLeaf key={i} l={l} i={i} reduced={reduced} />
        ))}

        <div className="fall-corner fall-corner-l fall-sway">
          <Garland />
        </div>
        <div className="fall-corner fall-corner-r fall-sway">
          <Garland />
        </div>

        <div className="fall-row">
          {[PROPS.slice(0, 4), PROPS.slice(4)].map((group, g) => (
            <div key={g} className="fall-group">
              {group.map((p, i) => (
                <div
                  key={i}
                  className={`fall-prop fall-h-${p.h} ${p.hideSm ? "fall-hide-sm" : ""}`}
                  style={{ "--fall-bob-delay": `${p.bobDelay}s` } as CSSProperties}
                >
                  {p.node}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
