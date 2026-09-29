import { rankListings } from "@/lib/ranking/rank-listings";
import { createListings } from "@/mock/create-listings";

export const people = rankListings(
  createListings("people", "person", [
    { name: "Mina Solberg", totalPaidMinor: 164000, category: "Robotics", location: "Oslo", description: "Robotics engineer making capable machines easier to operate." },
    { name: "Theo March", totalPaidMinor: 146500, category: "Product Design", location: "Paris", description: "Designer focused on understandable, durable digital tools." },
    { name: "Imani Vale", totalPaidMinor: 128000, category: "Climate Science", location: "Nairobi", description: "Researcher translating climate models into local action." },
    { name: "Ravi Linden", totalPaidMinor: 109500, category: "Engineering", location: "Bengaluru", description: "Engineer building dependable systems for public services." },
    { name: "Aya Mercer", totalPaidMinor: 93000, category: "Architecture", location: "Tokyo", description: "Architect exploring compact and adaptable city spaces." },
    { name: "Jon Bellweather", totalPaidMinor: 75500, category: "Writing", location: "Edinburgh", description: "Writer covering technology, craft, and the built world." },
    { name: "Sofia Reyes", totalPaidMinor: 58200, category: "Education", location: "Mexico City", description: "Teacher creating open project-based science curricula." },
    { name: "Noah Kestrel", totalPaidMinor: 41300, category: "Film", location: "Vancouver", description: "Documentary editor telling precise human-scale stories." },
    { name: "Leila Brook", totalPaidMinor: 27900, category: "Community", location: "Cape Town", description: "Community organizer designing welcoming civic programs." },
    { name: "Eli Moss", totalPaidMinor: 14800, category: "Sound", location: "Nashville", description: "Sound artist building tactile instruments and installations." },
  ]),
);
