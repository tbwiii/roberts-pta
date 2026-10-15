import { useEffect, useRef } from "react";

const MAX_STARS = 250;
const AREA_PER_STAR = 6000;
const MAX_SHIFT = 12;
const LERP = 0.06;

// Depth layers: far stars move least and look smallest and dimmest.
const LAYERS = [
  { depth: 0.25, radius: [0.4, 0.8], alpha: [0.3, 0.5] },
  { depth: 0.6, radius: [0.8, 1.3], alpha: [0.5, 0.75] },
  { depth: 1, radius: [1.3, 2], alpha: [0.75, 1] },
] as const;

interface Star {
  x: number; // normalized 0..1 so positions survive resizes
  y: number;
  layer: number;
  r: number;
  alpha: number;
  color: string;
  speed: number;
  phase: number;
}

interface Shooting {
  x: number;
  y: number;
  angle: number;
  length: number;
  start: number;
  duration: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, v));

const makeStars = (): Star[] =>
  Array.from({ length: MAX_STARS }, () => {
    const roll = Math.random();
    const layer = roll < 0.6 ? 0 : roll < 0.9 ? 1 : 2;
    const cfg = LAYERS[layer];
    const colorRoll = Math.random();
    const color =
      colorRoll < 0.04 ? "#94b0fd" : colorRoll < 0.14 ? "#ffc94a" : "#e6ecff";
    return {
      x: Math.random(),
      y: Math.random(),
      layer,
      r: rand(cfg.radius[0], cfg.radius[1]),
      alpha: rand(cfg.alpha[0], cfg.alpha[1]),
      color,
      speed: rand(0.6, 1.6),
      phase: rand(0, Math.PI * 2),
    };
  });

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const stars = makeStars();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    // Normalized -1..1 inputs and the eased offset actually applied.
    const pointer = { x: 0, y: 0 };
    const tilt = { x: 0, y: 0 };
    const offset = { x: 0, y: 0 };

    let raf: number | null = null;
    let shooting: Shooting | null = null;
    let nextShootingAt = performance.now() + rand(3000, 6000);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawShooting = (now: number, s: Shooting) => {
      const p = (now - s.start) / s.duration;
      const dist = s.length * p;
      const dx = Math.cos(s.angle);
      const dy = Math.sin(s.angle);
      const headX = s.x + dx * dist;
      const headY = s.y + dy * dist;
      const tailX = headX - dx * 90;
      const tailY = headY - dy * 90;

      const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
      gradient.addColorStop(0, "rgba(230, 236, 255, 0)");
      gradient.addColorStop(1, "rgba(230, 236, 255, 1)");
      ctx.globalAlpha = Math.sin(Math.PI * p);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();
    };

    const draw = (now: number, animate: boolean) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const count = Math.min(MAX_STARS, Math.round((w * h) / AREA_PER_STAR));
      for (let i = 0; i < count; i++) {
        const s = stars[i];
        const depth = LAYERS[s.layer].depth;
        // Wrap so parallax never exposes an empty edge.
        const x = (((s.x * w + offset.x * MAX_SHIFT * depth) % w) + w) % w;
        const y = (((s.y * h + offset.y * MAX_SHIFT * depth) % h) + h) % h;

        ctx.globalAlpha = animate
          ? s.alpha * (0.8 + 0.2 * Math.sin((now / 1000) * s.speed + s.phase))
          : s.alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (animate && shooting) drawShooting(now, shooting);
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      const targetX = clamp(pointer.x + tilt.x);
      const targetY = clamp(pointer.y + tilt.y);
      offset.x += (targetX - offset.x) * LERP;
      offset.y += (targetY - offset.y) * LERP;

      if (!shooting && now >= nextShootingAt) {
        shooting = {
          x: rand(-0.1, 0.7) * window.innerWidth,
          y: rand(0, 0.45) * window.innerHeight,
          angle: rand(0.3, 0.6),
          length: rand(140, 220),
          start: now,
          duration: rand(900, 1300),
        };
        nextShootingAt = now + rand(6000, 10000);
      }
      if (shooting && now - shooting.start >= shooting.duration) shooting = null;

      draw(now, true);
    };

    const start = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };

    // Decides between animated, paused, and static (reduced motion) rendering.
    const sync = () => {
      if (reduced.matches) {
        stop();
        shooting = null;
        offset.x = 0;
        offset.y = 0;
        draw(performance.now(), false);
      } else if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    const onResize = () => {
      resize();
      if (raf === null) draw(performance.now(), false);
    };

    const onVisibility = () => sync();

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    // Tilt is only read on touch phones and never triggers a permission prompt.
    const needsPermission =
      "DeviceOrientationEvent" in window &&
      "requestPermission" in DeviceOrientationEvent;
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      tilt.x = clamp(e.gamma / 30);
      // Offset beta so a comfortable upright holding angle reads as neutral.
      tilt.y = clamp((e.beta - 50) / 30);
    };

    const useTilt =
      coarsePointer.matches &&
      "DeviceOrientationEvent" in window &&
      !needsPermission;
    const useMouse = finePointer.matches;

    resize();
    sync();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", sync);
    if (useMouse) window.addEventListener("pointermove", onPointerMove);
    if (useTilt) window.addEventListener("deviceorientation", onOrientation);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
    />
  );
}
