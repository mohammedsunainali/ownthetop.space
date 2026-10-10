import {describe,it,expect} from "vitest";
import {placeSpeech} from "./speech-layout";
describe("character speech safe placement",()=>{
  const safe={left:12,top:75,right:900,bottom:825};
  it("clamps edges",()=>expect(placeSpeech({left:-20,top:10,right:180,bottom:70},safe,[])).toEqual({x:32,y:65,visible:true}));
  it("places speech above ads",()=>expect(placeSpeech({left:100,top:300,right:300,bottom:360},safe,[{left:0,top:320,right:800,bottom:800}])).toEqual({x:0,y:-52,visible:true}));
  it("hides without ad-free space",()=>expect(placeSpeech({left:100,top:80,right:300,bottom:140},safe,[{left:0,top:90,right:900,bottom:800}]).visible).toBe(false));
});
