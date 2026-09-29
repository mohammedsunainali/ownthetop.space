import { rankListings } from "@/lib/ranking/rank-listings";
import { createListings } from "@/mock/create-listings";

export const companies = rankListings(
  createListings("companies", "company", [
    { name: "Northstar Foundry", totalPaidMinor: 248000, category: "Industrial AI", location: "Toronto", hiring: true, description: "Adaptive planning software for modern manufacturing teams." },
    { name: "Blue Orbit Labs", totalPaidMinor: 214500, category: "Climate Tech", location: "Reykjavik", hiring: true, description: "Grid intelligence for resilient renewable energy systems." },
    { name: "Cedar & Signal", totalPaidMinor: 198000, category: "Communications", location: "Portland", description: "Clear collaboration tools for distributed creative teams." },
    { name: "Meridian Works", totalPaidMinor: 176400, category: "Robotics", location: "Singapore", hiring: true, description: "Small, capable robots for warehouse operations." },
    { name: "Lantern Systems", totalPaidMinor: 154000, category: "Developer Tools", location: "Berlin", description: "Release observability for fast-moving engineering teams." },
    { name: "Common Thread", totalPaidMinor: 143200, category: "Commerce", location: "London", hiring: true, description: "A cooperative marketplace platform for independent brands." },
    { name: "Sable Finance", totalPaidMinor: 129900, category: "Fintech", location: "Dublin", description: "Cash-flow planning built for small global businesses." },
    { name: "Canopy Health", totalPaidMinor: 118500, category: "Health Tech", location: "Boston", hiring: true, description: "Care coordination software centered on patient context." },
    { name: "Quiet Current", totalPaidMinor: 107000, category: "Infrastructure", location: "Helsinki", description: "Efficient data movement for edge computing networks." },
    { name: "Fieldnote Studio", totalPaidMinor: 96000, category: "Design", location: "Melbourne", description: "Research and prototyping tools for product organizations." },
    { name: "Ember Freight", totalPaidMinor: 87500, category: "Logistics", location: "Rotterdam", hiring: true, description: "Routing intelligence for low-emission freight networks." },
    { name: "Atlas Grove", totalPaidMinor: 79400, category: "Food Systems", location: "Austin", description: "Planning software connecting regional farms and kitchens." },
    { name: "Signal Harbor", totalPaidMinor: 68100, category: "Cybersecurity", location: "Tallinn", hiring: true, description: "Practical security monitoring for growing companies." },
    { name: "Morrow Mobility", totalPaidMinor: 60200, category: "Mobility", location: "Seoul", description: "Shared electric transport for dense neighborhoods." },
    { name: "Juniper Learning", totalPaidMinor: 51900, category: "Education", location: "Bengaluru", hiring: true, description: "Project-based learning spaces for technical skills." },
    { name: "Copper Cloud", totalPaidMinor: 44700, category: "Cloud", location: "Seattle", description: "Simple compute management for compact engineering teams." },
    { name: "Mosaic Habitat", totalPaidMinor: 38100, category: "Proptech", location: "Lisbon", description: "Resident-first software for flexible urban housing." },
    { name: "Tidal Ledger", totalPaidMinor: 31200, category: "Accounting", location: "Auckland", description: "Friendly reporting tools for independent operators." },
    { name: "Kiteframe", totalPaidMinor: 23600, category: "Media", location: "Los Angeles", hiring: true, description: "Collaborative production planning for small film crews." },
    { name: "Oriel Research", totalPaidMinor: 15900, category: "Research", location: "Cambridge", description: "Open tools for reproducible scientific collaboration." },
  ]),
);
