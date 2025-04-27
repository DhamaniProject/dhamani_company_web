export interface Product {
  id: string;
  product_name: { en: string; ar: string };
  product_description: { en: string | null; ar: string | null } | undefined;
  terms_and_notes: { en: string | null; ar: string | null } | undefined;
  image: string;
  types: Array<"warranty" | "exchange" | "return">;
  sku: string;
  upc: string | null;
  category: "electronics" | "clothing" | "accessories" | "other";
  warrantyPeriod: number;
  returnPeriod: number;
  exchangePeriod: number;
  warrantyProvider: string | null;
  status: "active" | "inactive";
}
