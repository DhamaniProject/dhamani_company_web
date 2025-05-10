// src/features/dashboard/records/types/types.ts

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

export interface RecordTranslation {
  language_id: number;
  notes: string | null;
  record_id: string;
  record_translation_id: number;
  created_at: string;
  updated_at: string | null;
}

export interface Record {
  record_id: string;
  product_image: string;
  start_date: string;
  is_active: boolean;
  warranty_end_date: string | null;
  exchange_end_date: string | null;
  return_end_date: string | null;
  first_name: string;
  last_name: string;
  user_phone_number: string;
  product_translations: ProductTranslation[];
  record_translations: RecordTranslation[];
  // Fields for display purposes, derived during mapping
  product: string;
  customerName: string;
  customerPhone: string;
  date: string;
  type: string[] | null; // Allow multiple types or null
  status: "active" | "inactive";
  verificationCode: string;
  warrantyDaysRemaining: number;
  returnDaysRemaining: number;
  exchangeDaysRemaining: number;
}
