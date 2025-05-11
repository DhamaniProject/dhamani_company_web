import api from "../../../../services/api";
import {
  LoginPayload,
  AuthResponse,
  AuthErrorResponse,
  User,
} from "../types/auth";
import { supabase } from '../../../../lib/supabase';

/**
 * Logs in a company user
 * @param payload - Email and password
 * @returns Auth response with tokens and user details
 * @throws AuthErrorResponse on failure
 */
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      "/api/v1/auth/company/login",
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("authService.login error:", error);
    throw error;
  }
};

/**
 * Fetches the current authenticated user's profile
 * @returns User profile details
 * @throws AuthErrorResponse on failure
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>("/api/v1/company_user/profile");
    return response.data;
  } catch (error: any) {
    console.error("authService.getCurrentUser error:", error);
    throw error;
  }
};

/**
 * Logs out the current user by clearing tokens and calling the backend logout endpoint
 */
export const logout = async (): Promise<void> => {
  try {
    // Logout from your backend
    await api.post("/api/v1/auth/logout");
    
    // Logout from Supabase
    await supabase.auth.signOut();
  } catch (error: any) {
    console.error("authService.logout error:", error);
  } finally {
    // Clear all tokens and credentials
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_password");
    sessionStorage.removeItem("refresh_token");
  }
};
