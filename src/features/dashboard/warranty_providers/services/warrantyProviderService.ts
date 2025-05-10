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
  provider?: {
    phone_number?: string;
    email?: string;
    address_url?: string;
    website_url?: string;
  };
  translations?: {
    language_id: number;
    provider_name: string;
    notes: string;
  }[];
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

interface ApiResponse<T> {
  success: boolean;
  data: T;
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
  providerId: string,
  providerData: UpdateWarrantyProviderRequest
): Promise<ApiWarrantyProvider> => {
  try {
    const requestData = {
      provider: providerData,
      translations: providerData.translations?.length > 0 ? providerData.translations : undefined,
    };

    const response = await api.put<ApiResponse<ApiWarrantyProvider>>(
      `/api/v1/warranty-providers/${providerId}`,
      requestData
    );
    if (!response.data.success) {
      throw new Error("updateProviderError");
    }
    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "updateProviderError";
      if (status === 403) throw new Error("forbiddenError");
      if (status === 404) throw new Error("notFoundError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 405) throw new Error("methodNotAllowedError");
      if (status === 409) throw new Error("emailAlreadyExistsError");
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
