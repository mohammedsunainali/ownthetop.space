import { describe,it,expect } from "vitest";
import { crownCopy,crownPreviewName,crownStatus } from "./crown";
import { useCrownStore } from "@/state/crown-store";
import { useWorldStore } from "@/state/world-store";
describe("separate Crown inventory",()=>{
  it("defaults honestly to a demo, not availability",()=>expect(crownCopy(crownStatus).label).toContain("Demo"));
  it("never replaces a legitimate sponsor with vacancy copy",()=>expect(crownCopy({kind:"claimed",verifiedRecordId:"actual-record",sponsorName:"Sponsor"},"Preview").title).toBe("Sponsor"));
  it("preview cannot displace the ranked floor",()=>{
    useWorldStore.getState().selectListing("companies-01","companies");
    useCrownStore.getState().preview("  My   brand  ");
    expect(useCrownStore.getState().previewName).toBe("My brand");
    expect(useWorldStore.getState().selectedListingId).toBe("companies-01");
    expect(crownPreviewName("x".repeat(100))).toHaveLength(48);
    useCrownStore.getState().clear();useWorldStore.getState().resetWorld();
  });
});
