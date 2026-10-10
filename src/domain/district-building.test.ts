import {describe,it,expect} from "vitest";
import {buildingAvailabilityLabel} from "./district-building";
import {districtInventory,districtBuilding} from "@/world/environment/district-inventory";
import {useWorldStore} from "@/state/world-store";
describe("honest secondary inventory",()=>{
  it("has stable identities tied to actual geometry",()=>{expect(new Set(districtInventory.map(b=>b.id)).size).toBe(districtInventory.length);expect(districtBuilding(districtInventory[0].id)).toBe(districtInventory[0]);});
  it("never marks synthetic buildings paid or available",()=>expect(districtInventory.every(b=>b.inventory.kind==="preview"||b.inventory.kind==="decorative")).toBe(true));
  it("labels preview without ownership claims",()=>expect(buildingAvailabilityLabel({kind:"preview"})).toContain("not activated"));
  it("keeps secondary selection mutually exclusive with ranked floor selection",()=>{
    const building=districtInventory.find(b=>b.inventory.kind==="preview")!;
    useWorldStore.getState().selectListing("companies-01","companies");
    useWorldStore.getState().selectDistrictBuilding(building.id);
    expect(useWorldStore.getState()).toMatchObject({cameraMode:"districtBuilding",selectedDistrictBuildingId:building.id,selectedListingId:null,selectedTowerId:null});
    useWorldStore.getState().previewDistrictBuilding("My brand");
    expect(useWorldStore.getState().districtPreviewName).toBe("My brand");
    useWorldStore.getState().selectListing("companies-01","companies");
    expect(useWorldStore.getState().selectedDistrictBuildingId).toBeNull();
    useWorldStore.getState().resetWorld();expect(useWorldStore.getState().districtPreviewName).toBe("");
  });
  it("ignores invalid and decorative inventory selections",()=>{
    useWorldStore.getState().resetWorld();
    useWorldStore.getState().selectDistrictBuilding("unknown");
    useWorldStore.getState().selectDistrictBuilding(districtInventory.find(b=>b.inventory.kind==="decorative")!.id);
    expect(useWorldStore.getState().cameraMode).toBe("overview");
  });
});
