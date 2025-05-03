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

export interface Notification {
  id: string;
  targetReceivers:
    | "all_users"
    | "product_users"
    | "expiring_warranty_users"
    | "old_records_users";
  productId: string | null;
  notificationType:
    | "WARRANTY_EXPIRY"
    | "PROMOTION"
    | "GENERAL_ANNOUNCEMENT"
    | "RETURN_DEADLINE"
    | "EXCHANGE_PERIOD"
    | "RECALL";
  messageTitle: { en: string; ar: string };
  messageContent: { en: string; ar: string };
  createdAt: string;
  sentBy: string;
  updatedAt: string | null;
  readStatus: string | null;
}
