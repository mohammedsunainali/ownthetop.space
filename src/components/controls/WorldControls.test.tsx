import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { WorldControls } from "./WorldControls";
import { useWorldStore } from "@/state/world-store";

describe("floating scene controls", () => {
  afterEach(cleanup);
  beforeEach(() => useWorldStore.setState({ cameraMode:"overview", worldTime:"auto", selectedTowerId:null, selectedListingId:null }));
  it("exposes one discoverable group and restores keyboard focus on Escape", () => {
    render(<WorldControls/>);
    const trigger=screen.getByRole("button",{name:"Environment"});
    fireEvent.click(trigger);
    expect(screen.getByRole("region",{name:"Environment settings"})).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Night"}));
    expect(useWorldStore.getState().worldTime).toBe("night");
    fireEvent.keyDown(document,{key:"Escape"});
    expect(screen.queryByRole("region",{name:"Environment settings"})).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it("replaces the open group and closes it on an outside pointer", () => {
    render(<WorldControls/>);
    fireEvent.click(screen.getByRole("button",{name:"Environment"}));
    fireEvent.click(screen.getByRole("button",{name:"View & display"}));
    expect(screen.queryByRole("region",{name:"Environment settings"})).not.toBeInTheDocument();
    expect(screen.getByRole("region",{name:"View settings"})).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("region",{name:"View settings"})).not.toBeInTheDocument();
  });
  it("retains the existing top-floor and Crown camera contracts", () => {
    render(<WorldControls/>);
    fireEvent.click(screen.getByRole("button",{name:"Top floor"}));
    expect(useWorldStore.getState().cameraMode).toBe("topFloor");
    fireEvent.click(screen.getByRole("button",{name:"Crown"}));
    expect(useWorldStore.getState().cameraMode).toBe("rooftop");
    expect(useWorldStore.getState().selectedListingId).toBeNull();
  });
});
