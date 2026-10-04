import { rankListings } from "@/lib/ranking/rank-listings";
import { createDemoSeeds, createListings } from "@/mock/create-listings";

export const products = rankListings(
  createListings("products", "product", [
    { name: "Arcboard", totalPaidMinor: 172000, category: "Planning", logoUrl: "/mock-logos/arcboard.svg", description: "A spatial roadmap for ambitious product work." },
    { name: "Relay Notes", totalPaidMinor: 149000, category: "Collaboration", description: "Meeting notes that turn decisions into visible action." },
    { name: "Pulseframe", totalPaidMinor: 132500, category: "Analytics", description: "A calm, legible view of product health." },
    { name: "Sketchline", totalPaidMinor: 116000, category: "Design", description: "Rapid interface sketching for cross-functional teams." },
    { name: "Luma Desk", totalPaidMinor: 97000, category: "Productivity", description: "A focused workspace for daily deep work." },
    { name: "Branchlight", totalPaidMinor: 81500, category: "Developer Tools", description: "Preview environments without operational clutter." },
    { name: "Gatherwell", totalPaidMinor: 64800, category: "Community", description: "Thoughtful spaces for member-led communities." },
    { name: "Pocket Atlas", totalPaidMinor: 48200, category: "Travel", description: "A personal map for places worth remembering." },
    { name: "Daymark", totalPaidMinor: 30100, category: "Wellbeing", description: "Small routines, lightly tracked and privately held." },
    { name: "Tinkerbox", totalPaidMinor: 17500, category: "Education", description: "Playful coding projects for curious young makers." },
    ...createDemoSeeds("Summit Tool", 10, 16800),
  ]),
);
