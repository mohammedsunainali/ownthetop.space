import {describe,it,expect} from "vitest";
import {cityArchetypes} from "./city-archetypes";
import {neighborhoodBuildings} from "./neighborhood-layout";
describe("deterministic district identity",()=>{
  it("uses eight distinct environmental palettes",()=>expect(new Set(cityArchetypes.map(item=>item.id)).size).toBe(8));
  it("keeps stable unique building IDs and valid palette references",()=>{
    expect(new Set(neighborhoodBuildings.map(item=>item.id)).size).toBe(neighborhoodBuildings.length);
    expect(neighborhoodBuildings.every(item=>!!cityArchetypes[item.archetype])).toBe(true);
  });
});
