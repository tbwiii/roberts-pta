import { useReducedMotion } from "framer-motion";
import FallLayer from "./fall-layer";
import ChristmasLayer from "./christmas-layer";
import { useSeason } from "./use-season";

/** Fixed, click-through decoration layer. Content and colors underneath are untouched. */
export function SeasonLayer() {
  const season = useSeason();
  const reduced = !!useReducedMotion();
  if (season === "fall") return <FallLayer reduced={reduced} />;
  if (season === "christmas") return <ChristmasLayer reduced={reduced} />;
  return null;
}
