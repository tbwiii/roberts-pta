import type { CSSProperties } from "react";
import "./snow-cap.css";

const TILE = 150;
const H = 30; // svg height; the card's top edge sits at y=20
// Lumpy top contour; starts and ends at y=13 so tiles join without a seam.
const TOP =
  "M0 13 C6 13 8 6 16 6 C24 6 25 12 32 12 C38 12 40 7 47 7 C53 7 56 3 66 3 C76 3 78 10 86 10 C92 10 94 5 102 5 C110 5 111 11 118 11 C124 11 128 7 136 7 C142 7 144 13 150 13";
const DRIPS = [
  "M24 22 Q24 29 28 29 Q32 29 32 22 Z",
  "M70 22 Q70 26 73 26 Q76 26 76 22 Z",
  "M112 22 Q112 28 116 28 Q120 28 120 22 Z",
  "M140 22 Q140 25 142.5 25 Q145 25 145 22 Z",
];

/** Snow build-up on a card's top edge. Each card gets a different offset so they don't match. */
export function SnowCap({ index, reduced }: { index: number; reduced: boolean }) {
  const id = `snowcap-${index}`;
  return (
    <svg
      aria-hidden="true"
      className={`xmas-cap ${reduced ? "" : "xmas-cap-grow"}`}
      style={{ "--cap-delay": `${1.3 + index * 0.12}s` } as CSSProperties}
    >
      <defs>
        <pattern
          id={id}
          width={TILE}
          height={H}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${(index * 53) % TILE} 0)`}
        >
          {DRIPS.map((d) => (
            <path key={d} d={d} fill="#fff" stroke="#bcd0f2" strokeWidth="1" />
          ))}
          <path d={`${TOP} L150 23 L0 23 Z`} fill="#fff" />
          <path d={TOP} fill="none" stroke="#bcd0f2" strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width="100%" height={H} fill={`url(#${id})`} />
    </svg>
  );
}
