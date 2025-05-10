export interface CompanyReview {
  company_review_id: number;
  company_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string | null;
}

export interface CompanyTranslation {
  language_id: number;
  company_name: string;
  company_description: string;
  terms_and_conditions: string;
}

export interface Company {
  company_name: string;
  communication_email: string;
  phone_number: string;
  website_url: string;
  address_url: string;
  company_logo: string;
  company_id: string;
  translations: CompanyTranslation[];
  reviews: CompanyReview[];
}

export interface CompanyResponse {
  success: boolean;
  data?: Company;
  message?: string;
} 