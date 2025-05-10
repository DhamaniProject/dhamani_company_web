import axios from "axios";
import api from "../../../../services/api";
import { Review } from "../types/types";

interface ApiReview {
  review_id: string;
  reviewer_name: string;
  company_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at: string | null;
}

interface ReviewResponse {
  success: boolean;
  data: ApiReview[];
  total_items: number;
  total_pages: number;
}

export const fetchReviews = async (
  companyId: string,
  page: number,
  limit: number,
  minRating?: number,
  maxRating?: number
): Promise<ReviewResponse> => {
  try {
    const params: Record<string, string | number> = { page, limit };
    if (minRating !== undefined) params.min_rating = minRating;
    if (maxRating !== undefined) params.max_rating = maxRating;

    const response = await api.get<ReviewResponse>(
      `/api/v1/reviews/companies/${companyId}`,
      { params }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "fetchReviewsError";
      if (status === 403) throw new Error("forbiddenError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 404) throw new Error("notFoundError");
      throw new Error(message);
    }
    throw new Error("fetchReviewsError");
  }
};
