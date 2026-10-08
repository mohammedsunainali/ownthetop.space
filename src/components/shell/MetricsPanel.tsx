"use client";

import { useSyncExternalStore } from "react";
import { allListings, companies, people, products } from "@/mock";
import { getArchitecturalHeightFeet } from "@/world/tower/tower-layout";

export function MetricsPanel() {
  const stressMode = useSyncExternalStore(() => () => {}, () => process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).get("stressFloors") === "220", () => false);
  const companyCount = stressMode ? 220 : companies.length;
  const metrics = [
    { value: stressMode ? companyCount : allListings.length, unit: "", label: stressMode ? "synthetic floors" : "claimed floors" },
    { value: getArchitecturalHeightFeet(companyCount).toLocaleString("en-US"), unit: "ft", label: "total tower height" },
    { value: companyCount, unit: "", label: stressMode ? "synthetic companies" : "companies" },
    { value: stressMode ? 0 : products.length, unit: "", label: "products" },
    { value: stressMode ? 0 : people.length, unit: "", label: "people" },
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
