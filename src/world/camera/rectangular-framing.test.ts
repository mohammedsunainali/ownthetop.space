import { describe, expect, it } from "vitest";
import { fitRectangularBounds, isBottomOverlay } from "./rectangular-framing";
import { Box3, PerspectiveCamera,Vector3 } from "three";
import { towerWorldBounds } from "./district-sightlines";

describe("overlay framing independent of graphics quality", () => {
  it("fits the real triangular tower envelopes without reserving empty district corners",()=>{
    const occupied=[towerWorldBounds("companies",24,false),towerWorldBounds("products",14,false),towerWorldBounds("people",14,false)];
    const bounds=occupied.reduce((combined,box)=>combined.union(box),new Box3());
    const direction=new Vector3(.13,.30,1);
    const fit=fitRectangularBounds(bounds,direction,1440,900,1070,527,42,occupied);
    const broad=new Box3(new Vector3(-20,0,-15),new Vector3(20,bounds.max.y,15));
    const old=fitRectangularBounds(broad,direction,1440,900,1070,527,42,[new Box3(new Vector3(-20,0,-15),new Vector3(20,0,15)),...occupied]);
    expect(fit.distance).toBeLessThan(old.distance);
    const camera=new PerspectiveCamera(42,1440/900,.1,300);camera.position.copy(fit.center).addScaledVector(fit.forward,fit.distance);camera.lookAt(fit.center);camera.updateMatrixWorld();
    for(const box of occupied)for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
      const point=new Vector3(x,y,z).project(camera);
      expect(Math.abs(point.x)).toBeLessThanOrEqual(1070/1440);expect(Math.abs(point.y)).toBeLessThanOrEqual(527/900);
    }
  });
  it("reserves drawer space in projection while orbiting the true floor center",()=>{
    for(const [width,height,left,right,top,bottom] of [[1440,900,16,898,75,825],[768,1024,16,752,75,582]]){
      const camera=new PerspectiveCamera(42,width/height,0.1,300);
      const center=new Vector3(0,17.67,0.4);
      camera.position.copy(center).add(new Vector3(0,0.3,15));camera.lookAt(center);camera.updateMatrixWorld();
      camera.setViewOffset(width,height,(width-left-right)/2,(height-top-bottom)/2,width,height);
      const projected=center.clone().project(camera);
      expect((projected.x+1)*width/2).toBeCloseTo((left+right)/2);
      expect((1-projected.y)*height/2).toBeCloseTo((top+bottom)/2);
    }
  });
  it("recognizes bottom drawers and controls at mobile and tablet widths", () => {
    for (const width of [375, 390, 430, 768, 900]) {
      expect(isBottomOverlay({ left: 7, right: width - 7 }, width)).toBe(true);
    }
  });
  it("keeps desktop drawers and tablet overview controls as right overlays", () => {
    expect(isBottomOverlay({ left: 922, right: 1282 }, 1440)).toBe(false);
    expect(isBottomOverlay({ left: 666, right: 758 }, 768)).toBe(false);
  });
});
