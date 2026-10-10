import {describe,it,expect} from "vitest";
import {stressFixtureEnabled} from "./fixture-mode";
describe("explicit production stress QA",()=>{
  it("requires diagnostics in production",()=>{expect(stressFixtureEnabled("?stressFloors=220")).toBe(false);expect(stressFixtureEnabled("?stressFloors=220&diagnostics=1")).toBe(true);});
  it("preserves developer fixture and normal demo",()=>{expect(stressFixtureEnabled("?stressFloors=220",true)).toBe(true);expect(stressFixtureEnabled("?diagnostics=1")).toBe(false);});
});
