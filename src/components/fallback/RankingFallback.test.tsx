import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { RankingFallback } from "@/components/fallback/RankingFallback";
import { ProfileDrawer } from "@/components/profile/ProfileDrawer";
import { useWorldStore } from "@/state/world-store";

describe("2D ranking fallback", () => {
  beforeEach(() => useWorldStore.setState({ selectedListingId: null, selectedTowerId: null, cameraMode: "overview" }));
  it("shows all 90 ranked listings in three towers and opens the matching profile", () => {
    render(<><RankingFallback /><ProfileDrawer /></>);
    const fallback = screen.getByLabelText("2D ranking fallback");
    expect(fallback.querySelectorAll(".fallback-tower button")).toHaveLength(90);
    const products = screen.getByLabelText("Products rankings");
    fireEvent.click(products.querySelector("button")!);
    expect(useWorldStore.getState().selectedTowerId).toBe("products");
    expect(screen.getByText("Rank #1")).toBeInTheDocument();
  });
});
