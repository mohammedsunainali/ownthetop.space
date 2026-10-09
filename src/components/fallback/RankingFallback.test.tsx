import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";
import { RankingFallback } from "./RankingFallback";
import { ProfileDrawer } from "@/components/profile/ProfileDrawer";
import { regressionListingsByTower } from "@/mock";
import { useWorldStore } from "@/state/world-store";
beforeEach(() => { cleanup(); useWorldStore.setState({ selectedListingId: null, selectedTowerId: null, cameraMode: "overview" }); });
it("shows all 52 active synthetic listings and opens the matching profile", () => {
  render(<><RankingFallback /><ProfileDrawer /></>);
  expect(screen.getByLabelText("2D ranking fallback").querySelectorAll(".fallback-tower button")).toHaveLength(52);
  fireEvent.click(screen.getByLabelText("Products rankings").querySelector("button")!);
  expect(useWorldStore.getState().selectedTowerId).toBe("products");
  expect(screen.getByText("Rank #1")).toBeInTheDocument();
});
it("uses the actual legacy inventory and canonical selection in accessible list view", () => {
  render(<RankingFallback inventory={regressionListingsByTower} requested />);
  expect(screen.getAllByRole("button")).toHaveLength(91);
  const listing = regressionListingsByTower.companies[49];
  fireEvent.click(screen.getByRole("button", { name: new RegExp(`#${listing.rank} ${listing.name}`) }));
  expect(useWorldStore.getState().selectedListingId).toBe(listing.id);
  expect(useWorldStore.getState().selectedTowerId).toBe("companies");
  expect(screen.getByText(/Accessible list view/)).toBeTruthy();
});
