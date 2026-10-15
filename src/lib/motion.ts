// Shared timeline so the hero, tickets and footer play as one launch sequence.
// All values in seconds from page load.
export const timeline = {
  ignite: 0, // flame lights below the hero
  liftoff: 0.25, // rocket starts rising into place
  rocketSettled: 1.0, // rocket at rest, idle bob begins
  title: 0.55, // title letters start springing in
  tickets: 1.0, // first ticket prints
  ticketStagger: 0.07, // gap between tickets
  footer: 1.6, // social links fade up
};

export const springs = {
  // Bouncy but settles fast; used for entrances.
  pop: { type: "spring", stiffness: 420, damping: 26, mass: 0.8 },
  // Softer; used for pointer-follow tilt and scroll-linked moves.
  soft: { type: "spring", stiffness: 180, damping: 22 },
} as const;
