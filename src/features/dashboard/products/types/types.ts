export enum ProductStatus {
  Active = "active",
  Suspended = "suspended",
  Discontinued = "discontinued",
}

export enum ProductType {
  Warranty = "warranty",
  Exchange = "exchange",
  Return = "return",
}

export interface ProductTranslation {
  language_id: number;
  product_name: string;
  product_description: string | null;
  terms_and_notes: string | null;
  product_translation_id: number;
  product_id: string;
  created_at: string;
  updated_at: string | null;
}

export interface CategoryTranslation {
  category_id: number;
  language_id: number;
  name: string;
  description: string | null;
  category_translation_id: number;
  created_at: string;
  updated_at: string | null;
}

export interface WarrantyProviderTranslation {
  provider_translation_id: number;
  provider_id: string;
  language_id: number;
  provider_name: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Category {
  default_name: string;
  category_id: number;
  created_at: string;
  updated_at: string | null;
  translations: CategoryTranslation[];
}

export interface WarrantyProvider {
  provider_id: string;
  company_id: string;
  phone_number: string;
  email: string | null;
  address_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string | null;
  translations: WarrantyProviderTranslation[];
}

export interface Product {
  id: string;
  sku: string;
  upc: string | null;
  product_image: string | null;
  product_name: {
    en: string;
    ar: string;
  };
  product_description: {
    en: string | null;
    ar: string | null;
  };
  terms_and_notes: {
    en: string | null;
    ar: string | null;
  };
  types: ProductType[];
  category: Category;
  warrantyPeriod: number;
  returnPeriod: number;
  exchangePeriod: number;
  warrantyProvider: WarrantyProvider | null;
  status: ProductStatus; // Updated to use new enum values
  translations: ProductTranslation[];
}
