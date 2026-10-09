import { Vector3 } from "three";
import { districtLayout, outsideTowerApproaches } from "./district-layout";
import { neighborhoodBuildings, neighborhoodRoads } from "./neighborhood-layout";

export const treePlaces = Array.from({length:56},(_,i)=>{
  const angle=Math.floor(i/7)*Math.PI/4+(i%7-3)*0.035;
  const radius=0.72+(i*7%5)*0.05;
  return {x:Math.cos(angle)*districtLayout.green.x*radius,z:Math.sin(angle)*districtLayout.green.z*radius};
}).filter(item => outsideTowerApproaches(item, 0.9)).concat(neighborhoodBuildings.filter((_, i) => i % 2 === 0).map(building => ({ x: building.x + building.width / 2 + 1.3, z: building.z + building.depth / 2 + 0.8 })).filter(item => outsideTowerApproaches(item, 0.9) && neighborhoodRoads.every(road => Math.abs(item.x - road.x) > road.width / 2 + 1.2 || Math.abs(item.z - road.z) > road.depth / 2 + 1.2)));
export const palmPlaces = Array.from({length:8},(_,i)=>({x:(i%4-1.5)*3.3,z:i<4?15:-15})).filter(item => outsideTowerApproaches(item, 0.5));

export function segmentIntersectsSphere(start:Vector3,end:Vector3,center:Vector3,radius:number):boolean {
  const delta=end.clone().sub(start);
  const length=delta.lengthSq();
  if(length===0)return start.distanceToSquared(center)<radius*radius;
  const t=Math.max(0,Math.min(1,center.clone().sub(start).dot(delta)/length));
  return start.clone().addScaledVector(delta,t).distanceToSquared(center)<radius*radius;
}

/** Conservative bounds derived from the same instanced canopy dimensions as rendering. */
export const vegetationBounds = [
  ...treePlaces.map((item,i)=>{
    const size=0.68+(i*3%7)*0.09;
    return {center:new Vector3(item.x,0.85+size*0.54,item.z),radius:0.65*size*Math.max(1,0.92+i%3*0.14)};
  }),
  ...palmPlaces.map(item=>({center:new Vector3(item.x,1.6,item.z),radius:0.45})),
];
export function facadeOccluded(eye:Vector3,center:Vector3):boolean {
  for(const x of [-3.1,-1.55,0,1.55,3.1])for(const y of [-0.5,0,0.5]){
    const target=center.clone().add(new Vector3(x,y,0));
    if(vegetationBounds.some(bound=>segmentIntersectsSphere(eye,target,bound.center,bound.radius)))return true;
  }
  return false;
}
