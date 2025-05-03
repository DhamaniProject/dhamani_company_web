import axios from "axios";
import api from "../../../../services/api";

interface ApiWarrantyProviderTranslation {
  language_id: number;
  provider_name: string;
  provider_translation_id: number;
  provider_id: string;
  notes: string;
  created_at: string;
  updated_at: string | null;
}

interface ApiWarrantyProvider {
  phone_number: string;
  email: string;
  address_url: string;
  website_url: string;
  provider_id: string;
  company_id: string;
  created_at: string;
  updated_at: string | null;
  translations: ApiWarrantyProviderTranslation[];
}

interface UpdateWarrantyProviderRequest {
  name?: string;
  email?: string;
  phone?: string;
  status?: "active" | "inactive";
}

interface CreateWarrantyProviderRequest {
  provider_data: {
    phone_number: string;
    email: string;
    address_url: string;
    website_url: string;
  };
  translations: {
    language_id: number;
    provider_name: string;
    notes: string;
  }[];
}

export const fetchWarrantyProviders = async (
  companyId: string,
  limit: number,
  offset: number
): Promise<ApiWarrantyProvider[]> => {
  try {
    const response = await api.get<ApiWarrantyProvider[]>(
      `/api/v1/warranty-providers/companies/${companyId}/providers`,
      {
        params: { limit, offset },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "fetchProvidersError";
      if (status === 403) throw new Error("forbiddenError");
      if (status === 404) throw new Error("notFoundError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 405) throw new Error("methodNotAllowedError");
      throw new Error(message);
    }
    throw new Error("fetchProvidersError");
  }
};

export const updateWarrantyProvider = async (
  companyId: string,
  providerId: string,
  providerData: UpdateWarrantyProviderRequest
): Promise<ApiWarrantyProvider> => {
  try {
    // Placeholder: Replace with actual API call
    // const response = await api.put<ApiWarrantyProvider>(
    //   `/api/v1/warranty_providers/${companyId}/${providerId}`,
    //   providerData
    // );
    // return response.data;

    // Mock response for testing
    const mockProviders: ApiWarrantyProvider[] = [];
    const updatedProvider = mockProviders.find(
      (p) => p.provider_id === providerId
    );
    if (!updatedProvider) throw new Error("notFoundError");
    Object.assign(updatedProvider, providerData);
    return updatedProvider;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "updateProviderError";
      if (status === 403) throw new Error("forbiddenError");
      if (status === 404) throw new Error("notFoundError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 405) throw new Error("methodNotAllowedError");
      throw new Error(message);
    }
    throw new Error("updateProviderError");
  }
};

export const createWarrantyProvider = async (
  companyId: string,
  providerData: CreateWarrantyProviderRequest
): Promise<ApiWarrantyProvider> => {
  try {
    const response = await api.post<ApiWarrantyProvider>(
      `/api/v1/warranty-providers/companies/${companyId}/providers`,
      providerData
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "createProviderError";
      if (status === 403) throw new Error("forbiddenError");
      if (status === 404) throw new Error("notFoundError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 405) throw new Error("methodNotAllowedError");
      if (status === 409) throw new Error("emailAlreadyExistsError");
      throw new Error(message);
    }
    throw new Error("createProviderError");
  }
};
