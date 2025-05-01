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
