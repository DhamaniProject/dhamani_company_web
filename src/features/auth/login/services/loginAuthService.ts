import api from "../../../../services/api";
import {
  LoginPayload,
  AuthResponse,
  AuthErrorResponse,
  User,
} from "../types/auth";

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
    // Optional: Call backend logout endpoint
    await api.post("/api/v1/auth/logout");
  } catch (error: any) {
    console.error("authService.logout error:", error);
    // Continue with client-side cleanup even if backend fails
  } finally {
    // Clear tokens from storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem("refresh_token");
  }
};
