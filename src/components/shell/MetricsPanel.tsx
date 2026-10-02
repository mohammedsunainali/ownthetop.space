"use client";

import { useSyncExternalStore } from "react";
import { allListings, companies, people, products } from "@/mock";
import { getArchitecturalHeightFeet } from "@/world/tower/tower-layout";

export function MetricsPanel() {
  const stressMode = useSyncExternalStore(() => () => {}, () => process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).get("stressFloors") === "220", () => false);
  const companyCount = stressMode ? 220 : companies.length;
  const metrics = [
    { value: stressMode ? companyCount + products.length + people.length : allListings.length, label: stressMode ? "synthetic floors" : "claimed floors" },
    { value: `${getArchitecturalHeightFeet(companyCount)} ft`, label: "total tower height" },
    { value: companyCount, label: stressMode ? "synthetic companies" : "companies" },
    { value: products.length, label: "products" },
    { value: people.length, label: "people" },
  ];

  return (
    <aside className="metrics-panel" aria-label="World metrics">
      {metrics.map((metric) => (
        <div className="metric-chip" key={metric.label}>
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
        </div>
      ))}
    </aside>
  );
}
