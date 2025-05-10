export interface UserRegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  company_id: string;
  password: string;
}

export interface UserRegisterResponse {
  success: boolean;
  data?: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    company_id: string;
    created_at: string;
    updated_at: string | null;
  };
  message?: string;
} 