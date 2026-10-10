import { describe, expect, it, vi } from "vitest";
import { Vector3 } from "three";
import { companies } from "@/mock/companies";
import { createSideTexture, SIDE_AD, SIDE_FACES, sideTextLayout } from "./side-signs";

const context={font:"",measureText(value:string){return {width:value.length*Number(this.font.match(/(\d+(?:\.\d+)?)px/)?.[1]??0)*0.55} as TextMetrics;}};
describe("side-specific advertisement contract",()=>{
  it("matches the measured side aspect, clears frames and faces outwards",()=>{
    expect(SIDE_AD.width/SIDE_AD.height).toBeCloseTo(SIDE_AD.worldWidth/SIDE_AD.worldHeight);
    for(const face of SIDE_FACES){const normal=new Vector3(0,0,1).applyAxisAngle(new Vector3(0,1,0),face.angle);expect(normal.x*Math.sign(face.x)).toBeCloseTo(1);expect(Math.abs(face.x)).toBeGreaterThan(3.46);}
    expect(SIDE_AD.worldWidth).toBeLessThan(4.4);
  });
  it.each([true,false])("fits long identity text and reserves the hiring slate: %s",hiring=>{
    const layout=sideTextLayout(context,{...companies[0],name:"International architecture and automation partners ".repeat(3),description:"Long compact tagline ".repeat(10),hiring},"identity");
    expect(layout.name!.lines.length).toBeLessThanOrEqual(2);
    for(const line of layout.name!.lines){context.font=`800 ${line.size}px Montserrat`;expect(context.measureText(line.text).width).toBeLessThanOrEqual(976);}
    context.font=`500 ${layout.tagline!.size}px Montserrat`;expect(context.measureText(layout.tagline!.text).width).toBeLessThanOrEqual(hiring?535:976);
    expect(sideTextLayout(context,companies[0],"ranking").name).toBeNull();
  });
  it("preserves exact numeric truth even for large payment/rank values",()=>{
    const layout=sideTextLayout(context,{...companies[0],rank:220,totalPaidMinor:12345678999},"ranking");
    expect(layout.rank.text).toBe("#220");expect(layout.amount.text).toBe("$123,456,789.99");
    context.font=`800 ${layout.amount.size}px Montserrat`;expect(context.measureText(layout.amount.text).width).toBeLessThanOrEqual(976);
  });
  it("allocates bounded per-floor LOD media and marks disposed media inactive",()=>{
    const drawing={...context,clearRect:vi.fn(),fillRect:vi.fn(),save:vi.fn(),restore:vi.fn(),scale:vi.fn(),beginPath:vi.fn(),roundRect:vi.fn(),fill:vi.fn(),fillText:vi.fn(),drawImage:vi.fn()};
    const spy=vi.spyOn(HTMLCanvasElement.prototype,"getContext").mockReturnValue(drawing as unknown as CanvasRenderingContext2D);
    const high=createSideTexture({...companies[0],logoUrl:null},"identity",true),low=createSideTexture({...companies[0],logoUrl:null},"ranking",false);
    expect(high.image.width).toBe(1280);expect(low.image.width).toBe(320);expect(low.image.height).toBe(96);
    high.dispose();low.dispose();expect(high.userData.active).toBe(false);expect(low.userData.active).toBe(false);spy.mockRestore();
  });
});
