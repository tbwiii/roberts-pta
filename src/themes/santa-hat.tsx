import "./santa-hat.css";

/** Santa hat that sits on the rocket's nose cone. Positioned inside the rocket's own box. */
export function SantaHat({ animate }: { animate: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 92"
      className="pointer-events-none absolute z-20 w-[76.7%] overflow-visible"
      style={{ left: "calc(21.5% - 5px)", top: "-10.7%" }}
    >
      {/* hat body */}
      <path d="M6 72 C10 40 34 16 62 16 L72 76 Z" fill="#d93a3a" />
      <path d="M6 72 C10 44 28 24 46 19 C34 36 30 56 34 76 Z" fill="#b82c2c" opacity="0.55" />
      {/* drooping tip + pom-pom */}
      <g className={animate ? "santa-tip" : undefined}>
        <path d="M42 26 L58 15 C80 11 92 24 92 44 C84 34 74 34 66 40 L66 62 Z" fill="#d93a3a" />
        <circle cx="90" cy="48" r="9.5" fill="#fff" />
        <circle cx="87" cy="45" r="4" fill="#eef3ff" />
      </g>
      {/* fur band */}
      <rect x="0" y="66" width="76" height="22" rx="11" fill="#fff" />
      <rect x="4" y="74" width="68" height="9" rx="4.5" fill="#e3ebff" opacity="0.8" />
    </svg>
  );
}
