export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  warning: string | null;
  permissions_updated: boolean;
}

export interface AuthErrorResponse {
  status_code: number;
  code: string;
  message: string;
  details: string | null;
}

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_id: string;
  company_logo: string;
}
