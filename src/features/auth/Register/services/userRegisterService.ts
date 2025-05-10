import api from '../../../../services/api';
import axios from 'axios';
import { UserRegisterRequest, UserRegisterResponse } from '../types/userRegister';

export async function registerUser(data: UserRegisterRequest): Promise<UserRegisterResponse> {
  try {
    const response = await api.post<UserRegisterResponse>('/api/v1/auth/company/register', data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "userRegister.genericError";
      if (status === 403) throw new Error("userRegister.forbiddenError");
      if (status === 404) throw new Error("userRegister.notFoundError");
      if (status === 409) throw new Error("userRegister.conflict.email");
      if (status === 500) throw new Error("userRegister.serverError");
      throw new Error(message);
    }
    throw new Error("userRegister.genericError");
  }
} 