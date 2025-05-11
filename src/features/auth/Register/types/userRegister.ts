export interface UserRegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  company_id: string;
  password: string;
}

export interface UserRegisterResponse {
  message: string;
  user_id: string;
  warning?: string;
} 