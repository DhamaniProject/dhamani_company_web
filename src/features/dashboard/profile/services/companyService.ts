import axios from "axios";
import { CompanyResponse } from "../types/company";
import api from "../../../../services/api";

export const fetchCompanyById = async (companyId: string) => {
  const response = await api.get<CompanyResponse>(`/api/v1/companies/${companyId}`);
  return response.data;
};

export const updateCompanyById = async (companyId: string, payload: any) => {
  const response = await api.put<CompanyResponse>(`/api/v1/companies/${companyId}`, payload);
  return response.data;
};

export const fetchCompanyApiKey = async () => {
  const response = await api.get<string>("/api/v1/companies/me/api-key");
  return response.data;
};

export const regenerateCompanyApiKey = async (companyId: string) => {
  const response = await api.post<{ success: boolean; data: { api_key: string } }>(`/api/v1/companies/${companyId}/regenerate-api-key`);
  return response.data.data.api_key;
}; 