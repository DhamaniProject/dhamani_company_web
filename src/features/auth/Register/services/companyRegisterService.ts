import api from '../../../../services/api';
import axios from 'axios';
import { CompanyRegisterRequest, CompanyRegisterResponse } from '../types/companyRegister';

export async function registerCompany(data: CompanyRegisterRequest): Promise<CompanyRegisterResponse> {
  try {
    const response = await api.post<CompanyRegisterResponse>('/api/v1/companies/register', data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "companyRegister.genericError";
      if (status === 403) throw new Error("companyRegister.forbiddenError");
      if (status === 404) throw new Error("companyRegister.notFoundError");
      if (status === 500) throw new Error("companyRegister.serverError");
      if (status === 409) {
        // Try to extract the conflict field from the error message
        if (message.includes("company_name")) throw new Error("companyRegister.conflict.company_name");
        if (message.includes("phone_number")) throw new Error("companyRegister.conflict.phone_number");
        if (message.includes("communication_email")) throw new Error("companyRegister.conflict.communication_email");
        throw new Error("companyRegister.conflict.unknown_field");
      }
      throw new Error(message);
    }
    throw new Error("companyRegister.genericError");
  }
} 