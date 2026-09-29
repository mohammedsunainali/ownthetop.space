import type { Tower } from "@/domain/tower";

export const towers: readonly Tower[] = [
  {
    id: "companies",
    slug: "companies",
    name: "Companies",
    description: "Teams building enduring businesses.",
    sortOrder: 1,
    active: true,
  },
  {
    id: "products",
    slug: "products",
    name: "Products",
    description: "Tools and experiences earning attention.",
    sortOrder: 2,
    active: true,
  },
  {
    id: "people",
    slug: "people",
    name: "People",
    description: "Independent builders and creative leaders.",
    sortOrder: 3,
    active: true,
  },
];
