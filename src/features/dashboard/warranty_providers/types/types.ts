export interface WarrantyProviderTranslation {
  language_id: number;
  provider_name: string;
  notes: string;
}

export interface WarrantyProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string | null;
  addressUrl: string;
  websiteUrl: string;
  translations: WarrantyProviderTranslation[];
}
