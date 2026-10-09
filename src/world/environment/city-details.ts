import { cityArchetypes } from "./city-archetypes";
import { neighborhoodBuildings } from "./neighborhood-layout";
export interface CityDetail { buildingIndex: number; position: [number, number, number]; size: [number, number, number]; color: string; role: string }
/** Architectural rhythms stay within the existing collision/sightline volumes. */
export const cityDetails: CityDetail[] = neighborhoodBuildings.flatMap((b, buildingIndex) => {
  const palette = cityArchetypes[b.archetype], details: CityDetail[] = [];
  const add = (role: string, x: number, y: number, z: number, width: number, height: number, depth: number, color: string = palette.accent) => details.push({ buildingIndex, role, position: [b.x + x, y, b.z + z], size: [width, height, depth], color });
  const front = b.depth / 2 + 0.025, ledge = b.style === 2 ? 0.055 : 0.32;
  switch (b.archetype) {
    case 0: // Startup glass: slim vertical fins and a low entrance lintel.
      for (const x of [-0.42, 0.42]) add("glass-fin", x * b.width, b.height / 2, front, 0.045, b.height * 0.94, 0.04);
      add("entry-lintel", 0, 0.76, front, b.width * 0.65, 0.07, 0.04);
      break;
    case 1: // Warm commercial: expressed stone cornices.
      for (const fraction of [0.33, 0.67]) add("stone-cornice", 0, b.height * fraction, front, b.width * 0.96, 0.09, 0.04, palette.roof);
      break;
    case 2: // Residential: two balcony ledges and shallow railings.
      for (const fraction of [0.38, 0.72]) {
        add("balcony", 0, b.height * fraction, b.depth / 2 + ledge / 2, b.width * 0.82, 0.07, ledge);
        add("balcony-rail", 0, b.height * fraction + 0.12, b.depth / 2 + ledge - 0.015, b.width * 0.82, 0.025, 0.025, palette.roof);
      }
      break;
    case 3: // Garden retail: green roof beds plus a sheltered entrance.
      for (const x of [-0.25, 0.25]) add("roof-bed", x * b.width, b.height + 0.09, 0, b.width * 0.25, 0.06, b.depth * 0.55, "#B6C88A");
      add("retail-canopy", 0, 0.85, b.depth / 2 + ledge / 2, b.width * 0.8, 0.08, ledge);
      break;
    case 4: // Color shops: alternating restrained awning panels.
      for (let column = 0; column < 4; column++) add("shop-awning", (column - 1.5) * b.width * 0.21, 0.8, b.depth / 2 + ledge / 2, b.width * 0.21, 0.09, ledge, column % 2 ? palette.roof : palette.accent);
      break;
    case 5: // Contemporary offices: a strong paired vertical rhythm.
      for (const x of [-0.18, 0.18]) add("office-fin", x * b.width, b.height / 2, front, 0.045, b.height * 0.96, 0.04);
      add("office-entry", 0, 0.75, front, b.width * 0.3, 0.08, 0.04, palette.roof);
      break;
    case 6: // Cafe: two entry canopies separated by a warm central pilaster.
      for (const x of [-0.24, 0.24]) add("cafe-canopy", x * b.width, 0.8, b.depth / 2 + ledge / 2, b.width * 0.4, 0.08, ledge);
      add("cafe-pilaster", 0, 0.42, front, 0.07, 0.75, 0.04, palette.roof);
      break;
    case 7: // Community: a compact colonnade and civic canopy.
      for (const x of [-0.3, 0, 0.3]) add("community-column", x * b.width, 0.53, front, 0.08, 1.03, 0.04, palette.roof);
      add("community-canopy", 0, 1.08, b.depth / 2 + ledge / 2, b.width * 0.9, 0.1, ledge);
  }
  return details;
});
