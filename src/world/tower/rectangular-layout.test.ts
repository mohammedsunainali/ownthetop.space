import { describe, expect, it } from "vitest";
import { Box3, Vector3 } from "three";
import { RECTANGULAR_AD as grid, RECTANGULAR_TOWER as building } from "@/world/tower/rectangular-layout";
import { rectangularTextLayout } from "@/world/tower/rectangular-signs";
import { companies } from "@/mock/companies";
import { phase3Listings } from "@/mock/phase-3-fixture";
import { fitRectangularBounds } from "@/world/camera/rectangular-framing";
import { getFloorY, getHelipadWorldPosition, getTowerHeight, HELIPAD_LOCAL_ANCHOR } from "@/world/tower/tower-layout";

describe("rectangular architecture contract",()=>{
  const context={font:"",measureText(value:string){return {width:value.length*Number(this.font.match(/(\d+)px/)?.[1]??0)*0.55} as TextMetrics;}};
  it("matches media aspect without stretching",()=>expect(building.clearWidth/building.clearHeight).toBeCloseTo(grid.width/grid.height,8));
  it("uses isolated 24/14/14 inventory without modifying full source data",()=>{expect(Object.values(phase3Listings).map(items=>items.length)).toEqual([24,14,14]);expect(companies).toHaveLength(50);});
  it.each(["X","Two Words","Long company name with international architecture partners","A".repeat(60)])("bounds name %s, subtitle and decimal currency inside fixed zones",name=>{
    for(const hiring of [true,false]){
      const result=rectangularTextLayout(context,{...companies[0],name,description:"A".repeat(100),totalPaidMinor:12345678999,hiring});
      expect(result.name.lines.length).toBeLessThanOrEqual(2);
      for(const line of result.name.lines){context.font=`800 ${line.size}px Montserrat`;expect(context.measureText(line.text).width).toBeLessThanOrEqual(result.identityRight-grid.identityX);}
      expect(result.subtitle.length).toBeLessThanOrEqual(2);
      for(const line of result.subtitle){context.font=`500 ${line.size}px Montserrat`;expect(context.measureText(line.text).width).toBeLessThanOrEqual(result.identityRight-grid.identityX);}
      context.font=`800 ${result.amount.size}px Montserrat`;expect(context.measureText(result.amount.text).width).toBeLessThanOrEqual(grid.statsRight-grid.statsLeft);
      expect(result.amount.text).toBe("$123,456,789.99");
    }
  });
  it.each([1,14,24,50,220])("has coherent floors, helipad and camera for %i floors",count=>{
    const positions=Array.from({length:count},(_,index)=>getFloorY(index+1,count));
    expect(new Set(positions).size).toBe(count);
    expect(getHelipadWorldPosition(count)[1]-getTowerHeight(count)).toBeCloseTo(HELIPAD_LOCAL_ANCHOR[1]);
    const fit=fitRectangularBounds(new Box3(new Vector3(-13,0,-4),new Vector3(13,getTowerHeight(count)+3.8,4)),new Vector3(0.1,0.3,1),1440,900,1000,550);
    expect(fit.distance).toBeGreaterThan(0);expect(Number.isFinite(fit.distance)).toBe(true);
  });
});
