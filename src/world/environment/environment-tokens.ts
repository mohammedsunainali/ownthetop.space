/** Landscape-only palette. Tower, facade and Design System colors remain untouched. */
export const environmentTokens = {
  lawn: "#75b96b",
  grove: "#5fa85d",
  canopy: ["#397d55", "#5fa85d", "#91c77a", "#438c61"],
  shrub: "#397d55",
  trunk: "#847f75",
  path: "#e6e8db",
  sidewalk: "#d7dfd9",
  road: "#4f626c",
  lane: "#e7e3c9",
  plaza: "#e8eae4",
  lampWarm: "#ffd69a",
  lampPost: "#587078",
  lawnNight: "#294e43",
  plazaNight: "#697b78",
  pathNight: "#899991",
  sidewalkNight: "#667b79",
  roadNight: "#344b55",
} as const;

/** Atmospheric palette belongs to the environment, never to advertising artwork. */
export const atmosphereTokens = {
  day: {skyDeep:"#4d9ed5",skyMid:"#a3cde4",horizon:"#d6e9e7"},
  sunset: {skyDeep:"#59658e",skyMid:"#e3ac94",horizon:"#f8dcb0"},
  night: {skyDeep:"#0b1531",skyMid:"#223955",horizon:"#314b5c"},
} as const;
