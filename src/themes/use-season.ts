import { useMemo } from "react";
import { resolveSeason, SEASON_OVERRIDE, type Season } from "./config";

export function useSeason(): Season {
  return useMemo(
    () =>
      resolveSeason({
        date: new Date(),
        search: window.location.search,
        override: SEASON_OVERRIDE,
      }),
    [],
  );
}
