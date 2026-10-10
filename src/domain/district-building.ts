export type BuildingInventoryState = {kind:"decorative"|"preview"} | {kind:"available"|"reserved"|"unavailable";verifiedRecordId:string} | {kind:"occupied";verifiedRecordId:string;advertiserName:string};
export interface DistrictBuilding {
  id:string; name:string; archetype:string; zone:"commercial"|"residential"|"community";
  position:readonly [number,number,number]; rotation:number;
  geometry:{width:number;height:number;depth:number};
  surfaces:readonly ("storefront"|"rooftop"|"building")[];
  inventory:BuildingInventoryState;
}
export function buildingAvailabilityLabel(state:BuildingInventoryState){
  if(state.kind==="preview")return "Demo preview · availability not activated";
  if(state.kind==="decorative")return "Decorative · not advertising inventory";
  if(state.kind==="occupied")return `Verified advertiser: ${state.advertiserName}`;
  return `Verified ${state.kind}`;
}
