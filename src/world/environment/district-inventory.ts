import type { DistrictBuilding } from "@/domain/district-building";
import { neighborhoodBuildings } from "./neighborhood-layout";
import { cityArchetypes } from "./city-archetypes";
/** Existing deterministic structures only. Never fabricate commercial occupancy. */
export const districtInventory:readonly DistrictBuilding[]=neighborhoodBuildings.map(building=>({
  id:building.id,name:`Demo ${cityArchetypes[building.archetype].name} · ${building.id.replace("district-","")}`,
  archetype:cityArchetypes[building.archetype].id,zone:building.style===1?"residential":building.archetype===7?"community":"commercial",
  position:[building.x,0,building.z],rotation:0,geometry:{width:building.width,height:building.height,depth:building.depth},
  surfaces:building.style===0?["storefront","rooftop"]:[],inventory:{kind:building.style===0?"preview":"decorative"},
}));
export function districtBuilding(id:string|null){return districtInventory.find(building=>building.id===id)??null;}
