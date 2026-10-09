import { describe,expect,it } from "vitest";
import { Vector3 } from "three";
import { facadeOccluded, segmentIntersectsSphere,treePlaces, vegetationBounds } from "./vegetation-layout";
describe("advertisement sightlines",()=>{
  it("detects actual segment intersection without flagging objects behind the ad",()=>{
    expect(segmentIntersectsSphere(new Vector3(0,0,10),new Vector3(),new Vector3(0,0,5),1)).toBe(true);
    expect(segmentIntersectsSphere(new Vector3(0,0,10),new Vector3(),new Vector3(0,0,-5),1)).toBe(false);
  });
  it("detects low-floor canopy occlusion but not upper floors",()=>{
    expect(facadeOccluded(new Vector3(0,1.8,16),new Vector3(0,1.47,2.625))).toBe(true);
    expect(facadeOccluded(new Vector3(0,32,16),new Vector3(0,32,2.625))).toBe(false);
    expect(treePlaces.length).toBeGreaterThan(20);
  });
  it("checks the rear advertisement instead of bypassing its canopy sightline",()=>{
    const canopy=vegetationBounds.find(bound=>bound.center.z<0)!;
    const rear=canopy.center.clone().add(new Vector3(0,0,2));
    expect(facadeOccluded(canopy.center.clone().add(new Vector3(0,0,-2)),rear)).toBe(true);
    expect(facadeOccluded(new Vector3(rear.x,32,rear.z-12),new Vector3(rear.x,32,rear.z))).toBe(false);
  });
});
