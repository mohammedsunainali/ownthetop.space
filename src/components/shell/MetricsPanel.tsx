import { allListings, companies, people, products } from "@/mock";

export function MetricsPanel() {
  const metrics = [
    { value: allListings.length, label: "claimed floors" },
    { value: companies.length, label: "companies" },
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
