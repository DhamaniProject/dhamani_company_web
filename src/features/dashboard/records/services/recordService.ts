// src/features/dashboard/records/services/recordService.ts

import axios, { AxiosError } from "axios";
import api from "../../../../services/api";
import { Record } from "../types/types";

interface RecordResponse {
  success: boolean;
  data: Record[];
  total_items: number;
  total_pages: number;
  page: number;
  per_page: number;
}

interface SingleRecordResponse {
  success: boolean;
  data: Record;
}

interface DeactivateRecordResponse {
  user_phone_number: string;
  product_id: string;
  user_id: string;
  record_id: string;
  start_date: string;
  warranty_end_date: string | null;
  exchange_end_date: string | null;
  return_end_date: string | null;
  company_id: string;
  company_user_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  files: any[];
  translations: Array<{
    language_id: number;
    notes: string;
    record_id: string;
    record_translation_id: number;
    created_at: string;
    updated_at: string | null;
  }>;
}

interface ProductResponse {
  success: boolean;
  data: Array<{
    product_id: string;
    translations: Array<{
      language_id: number;
      product_name: string;
      product_description: string | null;
      terms_and_notes: string | null;
      product_translation_id: number;
      product_id: string;
      created_at: string;
      updated_at: string | null;
    }>;
  }>;
}

interface RecordCreateResponse {
  success: boolean;
  data: {
    record_id: string;
    user_id: string;
    company_id: string;
    product_id: string;
    company_user_id: string;
    start_date: string;
    warranty_end_date: string | null;
    exchange_end_date: string | null;
    return_end_date: string | null;
    is_active: boolean;
  };
}

export const fetchRecords = async (
  companyId: string,
  phoneNumber: string | null,
  page: number,
  perPage: number
): Promise<RecordResponse> => {
  try {
    console.log("Fetching records with params:", {
      companyId,
      phoneNumber,
      page,
      perPage,
    });
    const response = await api.get<RecordResponse>(
      `/api/v1/records/company/${companyId}/full`,
      {
        params: {
          phone_number: phoneNumber || undefined,
          page,
          per_page: perPage,
        },
      }
    );
    console.log("Fetch records response:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "fetchRecordsError";
      console.log("Fetch records error:", {
        status,
        message,
        error: error.response?.data,
      });
      if (status === 403) throw new Error("forbiddenError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 404) throw new Error("notFoundError");
      if (status === 500) throw new Error("serverError");
      throw new Error(message);
    }
    console.log("Fetch records unknown error:", error);
    throw new Error("fetchRecordsError");
  }
};

export const verifyRecord = async (
  verificationCode: string
): Promise<SingleRecordResponse> => {
  try {
    console.log("Verifying record with code:", verificationCode);
    const response = await api.post<SingleRecordResponse>(
      "/api/v1/records/verify",
      {
        verification_code: verificationCode,
      }
    );
    console.log("Verify record response:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "verifyRecordError";
      console.log("Verify record error:", {
        status,
        message,
        error: error.response?.data,
      });
      if (status === 403) throw new Error("forbiddenVerifyError");
      if (status === 404) throw new Error("recordNotFoundError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 500) throw new Error("serverError");
      throw new Error(message);
    }
    console.log("Verify record unknown error:", error);
    throw new Error("verifyRecordError");
  }
};

export const deactivateRecord = async (
  deactivateCode: string
): Promise<DeactivateRecordResponse> => {
  try {
    console.log("Deactivating record with code:", deactivateCode);
    const response = await api.post<DeactivateRecordResponse>(
      "/api/v1/records/deactivate",
      {
        deactivate_code: deactivateCode,
      }
    );
    console.log("Deactivate record response:", response);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "deactivateRecordError";
      console.log("Deactivate record error:", {
        status,
        message,
        error: error.response?.data,
      });
      if (status === 403) throw new Error("forbiddenDeactivateError");
      if (status === 404) throw new Error("recordNotFoundDeactivateError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 500) throw new Error("serverError");
      throw new Error(message);
    }
    console.log("Deactivate record unknown error:", error);
    throw new Error("deactivateRecordError");
  }
};

// Fetch products for a company with optional search filter
export const fetchProducts = async (
  companyId: string,
  searchQuery: string | null
): Promise<ProductResponse> => {
  try {
    console.log("Fetching products with params:", { companyId, searchQuery });
    const response = await api.get<ProductResponse>(
      `/api/v1/companies/${companyId}/products/name`,
      {
        params: {
          search: searchQuery || undefined,
        },
      }
    );
    console.log("Fetch products response:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "fetchProductsError";
      console.log("Fetch products error:", {
        status,
        message,
        error: error.response?.data,
      });
      if (status === 403) throw new Error("forbiddenError");
      if (status === 404) throw new Error("notFoundError");
      if (status === 500) throw new Error("serverError");
      throw new Error(message);
    }
    console.log("Fetch products unknown error:", error);
    throw new Error("fetchProductsError");
  }
};

// Create a new record for a company
export const createRecord = async (
  companyId: string,
  recordData: {
    user_phone_number: string;
    product_id: string;
    notesEn: string;
    notesAr: string;
  }
): Promise<RecordCreateResponse> => {
  try {
    const payload = {
      record_data: {
        user_phone_number: recordData.user_phone_number,
        product_id: recordData.product_id,
      },
      translations: [
        {
          language_id: 1,
          notes: recordData.notesEn || null,
        },
        {
          language_id: 2,
          notes: recordData.notesAr || null,
        },
      ],
    };
    console.log("Creating record with payload:", payload);
    const response = await api.post<RecordCreateResponse>(
      `/api/v1/records/companies/${companyId}/records`,
      payload
    );
    console.log("Create record response:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "addRecordError";
      console.log("Create record error:", {
        status,
        message,
        error: error.response?.data,
      });
      if (status === 403) throw new Error("forbiddenError");
      if (status === 404) throw new Error("notFoundError");
      if (status === 500) throw new Error("serverError");
      throw new Error(message);
    }
    console.log("Create record unknown error:", error);
    throw new Error("addRecordError");
  }
};
