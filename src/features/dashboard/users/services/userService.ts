import axios from "axios";
import api from "../../../../services/api";
import { User } from "../types/types";

interface ApiUser {
  first_name: string;
  last_name: string;
  email: string;
  company_id: string;
  user_id: string;
  created_at: string;
  updated_at: string | null;
  status: "active" | "inactive";
}

interface UserResponse {
  success: boolean;
  data: ApiUser[];
  total_items: number;
  total_pages: number;
  page: number;
  per_page: number;
}

interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  status?: "active" | "inactive";
}

interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  company_id: string;
  password: string;
}

interface UserOperationResponse {
  success: boolean;
  data: ApiUser;
}

export const fetchUsers = async (
  companyId: string,
  page: number,
  perPage: number
): Promise<UserResponse> => {
  try {
    const response = await api.get<UserResponse>(
      `/api/v1/company_user/${companyId}/all`,
      { page, per_page: perPage }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "fetchUsersError";
      if (status === 403) throw new Error("forbiddenError");
      if (status === 404) throw new Error("notFoundError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 405) throw new Error("methodNotAllowedError");
      throw new Error(message);
    }
    throw new Error("fetchUsersError");
  }
};

export const updateUser = async (
  companyId: string,
  userId: string,
  userData: UpdateUserRequest
): Promise<UserOperationResponse> => {
  try {
    const response = await api.put<UserOperationResponse>(
      `/api/v1/company_user/${companyId}/${userId}`,
      userData
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "updateUserError";
      if (status === 403) throw new Error("forbiddenError");
      if (status === 404) throw new Error("notFoundError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 405) throw new Error("methodNotAllowedError");
      throw new Error(message);
    }
    throw new Error("updateUserError");
  }
};

export const createUser = async (
  userData: CreateUserRequest
): Promise<UserOperationResponse> => {
  try {
    const response = await api.post<UserOperationResponse>(
      `/api/v1/auth/company/register`,
      userData
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "createUserError";
      if (status === 403) throw new Error("forbiddenError");
      if (status === 404) throw new Error("notFoundError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 405) throw new Error("methodNotAllowedError");
      if (status === 409) throw new Error("emailAlreadyExistsError");
      throw new Error(message);
    }
    throw new Error("createUserError");
  }
};
