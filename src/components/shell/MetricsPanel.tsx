"use client";

import { useSyncExternalStore } from "react";
import { allListings, listingsByTower, regressionListingsByTower } from "@/mock";
import { getArchitecturalHeightFeet } from "@/world/tower/tower-layout";

export function MetricsPanel() {
  const stressMode = useSyncExternalStore(() => () => {}, () => process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).get("stressFloors") === "220", () => false);
  const legacy = useSyncExternalStore(() => () => {}, () => new URLSearchParams(window.location.search).get("regression") === "legacy", () => false);
  const inventory=legacy?regressionListingsByTower:listingsByTower;
  const companyCount = stressMode ? 220 : inventory.companies.length;
  const metrics = [
    { value: stressMode ? companyCount : legacy?90:allListings.length, unit: "", label: "synthetic floors" },
    { value: getArchitecturalHeightFeet(companyCount).toLocaleString("en-US"), unit: "ft", label: "total tower height" },
    { value: companyCount, unit: "", label: stressMode ? "synthetic companies" : "companies" },
    { value: stressMode ? 0 : inventory.products.length, unit: "", label: "products" },
    { value: stressMode ? 0 : inventory.people.length, unit: "", label: "people" },
  ];

  return (
    <aside className="metrics-panel" aria-label="World metrics">
      {metrics.map((metric) => (
        <div className="metric-chip" key={metric.label}>
          <strong className="metric-chip__value">{metric.value}{metric.unit && <small>{metric.unit}</small>}</strong>
          <span>{metric.label}</span>
        </div>
      ))}
    </aside>
  );
}
