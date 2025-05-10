export interface CompanyRegisterRequest {
  company_data: {
    company_name: string;
    communication_email: string;
    phone_number: string;
    website_url: string;
    address_url: string;
    company_logo?: string | null;
  };
  translations: Array<{
    language_id: number;
    company_name: string;
    company_description: string;
    terms_and_conditions: string;
  }>;
}

export interface CompanyRegisterResponse {
  success: boolean;
  data: {
    company_name: string;
    communication_email: string;
    phone_number: string;
    website_url: string;
    address_url: string;
    company_logo?: string | null;
    company_id: string;
    created_at: string;
    updated_at: string | null;
    account_status: string;
    avg_rating: number;
    review_count: number;
    files: any[];
    translations: Array<{
      company_id: string;
      language_id: number;
      company_name: string;
      company_description: string;
      terms_and_conditions: string;
      company_translation_id: number;
      created_at: string;
      updated_at: string | null;
    }>;
    reviews: any[];
  };
} 