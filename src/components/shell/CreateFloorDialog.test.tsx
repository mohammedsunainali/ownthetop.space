import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ClaimPanel } from "@/components/shell/ClaimPanel";
import { CreateFloorDialog, validateFloorContent } from "@/components/shell/CreateFloorDialog";
import { allListings } from "@/mock";
import { useWorldStore } from "@/state/world-store";
import { readCheckoutDraft } from "@/components/checkout/draft-transfer";
import { FloorPreviewBanner } from "./FloorPreviewBanner";

const push = vi.fn();
vi.mock("next/navigation",()=>({useRouter:()=>({push})}));

function startClaim() {
  render(<><ClaimPanel /><CreateFloorDialog /></>);
  fireEvent.change(screen.getByRole("textbox", { name: "Website URL placeholder" }), { target: { value: "example.com" } });
  fireEvent.change(screen.getByRole("combobox", { name: "Category" }), { target: { value: "technology" } });
  fireEvent.click(screen.getByRole("button", { name: "OWN THE TOP" }));
}

describe("local Create Your Floor preview", () => {
  afterEach(cleanup);
  beforeEach(() => { sessionStorage.clear(); push.mockClear(); useWorldStore.setState({ claimDraft: null, floorPreview: null, cameraMode: "overview", selectedListingId: null, selectedTowerId: null }); });
  it("requires a category before opening and carries the website, tower and amount", () => {
    render(<><ClaimPanel /><CreateFloorDialog /></>);
    fireEvent.change(screen.getByRole("textbox", { name: "Website URL placeholder" }), { target: { value: "example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "OWN THE TOP" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Choose a category");
    fireEvent.change(screen.getByRole("combobox", { name: "Category" }), { target: { value: "technology" } });
    fireEvent.click(screen.getByRole("button", { name: "OWN THE TOP" }));
    expect(screen.getByRole("dialog", { name: "CREATE YOUR FLOOR" })).toBeInTheDocument();
    expect(useWorldStore.getState().claimDraft).toMatchObject({ url: "example.com", towerId: "companies", category: "technology", amountMinor: 10000 });
  });
  it("validates name and subtitle, then previews without mutating rankings or payment", () => {
    const before = allListings.map((item) => [item.id, item.rank, item.totalPaidMinor]);
    startClaim();
    fireEvent.click(screen.getByRole("button", { name: "Preview my floor" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Display name");
    fireEvent.change(screen.getByRole("textbox", { name: "Display name" }), { target: { value: "Northstar Foundry" } });
    fireEvent.click(screen.getByRole("button", { name: "Preview my floor" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Subtitle");
    fireEvent.change(screen.getByRole("textbox", { name: "Subtitle" }), { target: { value: "AI infrastructure" } });
    fireEvent.click(screen.getByRole("checkbox", { name: "We’re hiring" }));
    fireEvent.click(screen.getByRole("button", { name: "Preview my floor" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(useWorldStore.getState().floorPreview?.media).toMatchObject({ name: "Northstar Foundry", description: "AI infrastructure", logoUrl: null, hiring: true, totalPaidMinor: 10000 });
    expect(useWorldStore.getState().selectedListingId).toBeNull();
    expect(allListings.map((item) => [item.id, item.rank, item.totalPaidMinor])).toEqual(before);
  });
  it("returns to the first step with claim data intact", () => {
    startClaim();
    fireEvent.click(screen.getByRole("button", { name: "Close Create Your Floor" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Website URL placeholder" })).toHaveValue("example.com");
    expect(screen.getByRole("combobox", { name: "Category" })).toHaveValue("technology");
  });
  it("accepts a local PNG for preview and rejects oversized files", async () => {
    startClaim();
    const file = new File(["pixel"], "mark.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Upload logo"), { target: { files: [file] } });
    await waitFor(() => expect(screen.getByAltText("Selected logo preview")).toBeInTheDocument());
    fireEvent.change(screen.getByRole("textbox", { name: "Display name" }), { target: { value: "Nova" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Subtitle" }), { target: { value: "AI infrastructure" } });
    fireEvent.click(screen.getByRole("button", { name: "Preview my floor" }));
    expect(useWorldStore.getState().floorPreview?.media.logoUrl).toMatch(/^data:image\/png;base64,/);
    useWorldStore.getState().clearFloorPreview();
    expect(useWorldStore.getState()).toMatchObject({ floorPreview: null, cameraMode: "overview", selectedTowerId: null });
    fireEvent.click(screen.getByRole("button", { name: "OWN THE TOP" }));
    const huge = new File([new Uint8Array(3 * 1024 * 1024 + 1)], "huge.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Upload logo"), { target: { files: [huge] } });
    expect(screen.getByRole("alert")).toHaveTextContent("3 MB");
  });
  it("enforces the intended text lengths", () => {
    expect(validateFloorContent("N", "AI infrastructure")).toMatch(/Display name/);
    expect(validateFloorContent("Nova", "AI")).toMatch(/Subtitle/);
    expect(validateFloorContent("Nova", "AI infrastructure")).toBeNull();
  });
  it("validates direct checkout and transfers the complete draft without changing inventory", () => {
    const before = allListings.map(item=>[item.id,item.rank,item.totalPaidMinor]);
    startClaim();
    expect(screen.queryByRole("button",{name:"Back"})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Continue to checkout"}));
    expect(push).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole("textbox",{name:"Display name"}),{target:{value:" Nova Labs "}});
    fireEvent.change(screen.getByRole("textbox",{name:"Subtitle"}),{target:{value:" Trusted infrastructure "}});
    fireEvent.click(screen.getByRole("checkbox",{name:"We’re hiring"}));
    fireEvent.click(screen.getByRole("button",{name:"Continue to checkout"}));
    expect(push).toHaveBeenCalledWith("/checkout");
    expect(readCheckoutDraft()).toMatchObject({name:"Nova Labs",subtitle:"Trusted infrastructure",url:"example.com",towerId:"companies",category:"technology",hiring:true,amountMinor:10000,currency:"USD",logoUrl:null});
    expect(allListings.map(item=>[item.id,item.rank,item.totalPaidMinor])).toEqual(before);
  });
  it("passes exactly the validated preview draft to checkout", () => {
    startClaim();
    fireEvent.change(screen.getByRole("textbox",{name:"Display name"}),{target:{value:"Nova Labs"}});
    fireEvent.change(screen.getByRole("textbox",{name:"Subtitle"}),{target:{value:"Trusted infrastructure"}});
    fireEvent.click(screen.getByRole("button",{name:"Preview my floor"}));
    const preview=useWorldStore.getState().floorPreview;
    render(<FloorPreviewBanner/>);
    expect(screen.getByText(/your floor is not reserved/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Continue to checkout →"}));
    expect(push).toHaveBeenCalledWith("/checkout");
    expect(readCheckoutDraft()).toEqual(preview?.checkoutDraft);
    expect(useWorldStore.getState().floorPreview).toBe(preview);
  });
});
