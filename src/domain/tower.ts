export type TowerId = "companies" | "products" | "people";

export interface Tower {
  id: TowerId;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  active: boolean;
}
