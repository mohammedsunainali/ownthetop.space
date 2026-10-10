import { describe, expect, it } from "vitest";
import { Box3, Vector3 } from "three";
import type { TowerId } from "@/domain/tower";
import { districtLayout, districtTowers, outsideTowerApproaches, routePoint } from "@/world/environment/district-layout";
import { getFloorY, getHelipadWorldPosition, getTowerHeight, towerLocalToWorld } from "@/world/tower/tower-layout";
import { advertisementSamples, facingAdvertisement, inspectionBlocked, safeInspectionOffset, segmentIntersectsBox, towerWorldBounds } from "./district-sightlines";

const counts = { companies: 24, products: 14, people: 14 };
describe("triangular district geometry and sightlines", () => {
  it("lowers steep top-floor approaches when the selected tower's own roof hides content", () => {
    const id = "companies", y = getFloorY(1, counts[id]), target = new Vector3(...towerLocalToWorld(id, [0, y, 0]));
    const offset = new Vector3(0, 13, 13);
    expect(inspectionBlocked(target.clone().add(offset), id, y, counts)).toBe(true);
    const safe = safeInspectionOffset(target, offset, id, y, counts);
    expect(safe.y).toBeLessThan(offset.y);
    expect(inspectionBlocked(target.clone().add(safe), id, y, counts)).toBe(false);
  });
  it("spaces unchanged buildings around an open central plaza", () => {
    const entries=Object.values(districtTowers);
    for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++)expect(new Vector3(...entries[i].position).distanceTo(new Vector3(...entries[j].position))).toBeGreaterThan(21);
    expect(districtTowers.companies.position[2]).toBeLessThan(districtTowers.products.position[2]);
    expect(outsideTowerApproaches({x:13,z:9})).toBe(false);
    expect(outsideTowerApproaches({x:0,z:4})).toBe(true);
  });
  it("keeps road and pedestrian routes outside podium footprints", () => {
    for(let step=0;step<720;step++)for(const route of [districtLayout.road,districtLayout.walkway]){
      const [x,z]=routePoint(route.x,route.z,step/720);
      for(const {position} of Object.values(districtTowers))expect(Math.abs(x-position[0])>3.8 || Math.abs(z-position[2])>2.6).toBe(true);
    }
  });
  it.each([14,24,50,220])("preserves exact floor Y and roof anchor for %i floors",count=>{
    expect(getHelipadWorldPosition(count)).toEqual(towerLocalToWorld("companies",[2.15,getTowerHeight(count)+0.668,-1.75]));
    for(const id of Object.keys(counts) as TowerId[])expect(towerLocalToWorld(id,[0,getFloorY(count,count),0])[1]).toBeCloseTo(1.47);
  });
  it("detects real finite building intersections, not buildings behind the listing",()=>{
    const bounds=new Box3(new Vector3(-1,0,-1),new Vector3(1,3,1));
    expect(segmentIntersectsBox(new Vector3(0,1,10),new Vector3(0,1,-10),bounds)).toBe(true);
    expect(segmentIntersectsBox(new Vector3(0,1,10),new Vector3(0,1,5),bounds)).toBe(false);
  });
  it("uses outward-facing front/rear and both side samples",()=>{
    const center=new Vector3(...districtTowers.companies.position);
    for(const [delta,face] of [[new Vector3(0,0,10),"front"],[new Vector3(0,0,-10),"rear"],[new Vector3(-10,0,0),"identity"],[new Vector3(10,0,0),"ranking"]] as const){
      expect(facingAdvertisement("companies",center.clone().add(delta))).toBe(face);
      const samples=advertisementSamples("companies",1.47,face);
      expect(samples).toHaveLength(15); expect(Math.max(...samples.map(p=>p.y))).toBeCloseTo(2.06);
    }
  });
  it("resolves top/middle/bottom approaches at eight orbit headings for every tower",()=>{
    for(const id of Object.keys(counts) as TowerId[])for(const rank of [1,Math.ceil(counts[id]/2),counts[id]])for(let heading=0;heading<8;heading++){
      const y=getFloorY(rank,counts[id]),target=new Vector3(...towerLocalToWorld(id,[0,y,0]));
      const angle=heading*Math.PI/4,offset=new Vector3(Math.sin(angle)*13,0.4,Math.cos(angle)*13);
      const safe=safeInspectionOffset(target,offset,id,y,counts);
      expect(inspectionBlocked(target.clone().add(safe),id,y,counts)).toBe(false);
      for(const other of Object.keys(counts) as TowerId[])if(other!==id)expect(towerWorldBounds(other,counts[other]).containsPoint(target.clone().add(safe))).toBe(false);
    }
  });
});
