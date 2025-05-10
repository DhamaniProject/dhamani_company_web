import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../context/AuthContext";
import { fetchReviews } from "../services/reviewService";
import { Review } from "../types/types";

interface UseReviews {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  fetchReviews: () => void;
}

export const useReviews = (
  minRating?: number,
  maxRating?: number
): UseReviews => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { isLoading, refetch } = useQuery({
    queryKey: ["reviews", user?.company_id, minRating, maxRating, currentPage],
    queryFn: async () => {
      if (!user?.company_id) {
        throw new Error("noCompanyId");
      }
      const response = await fetchReviews(
        user.company_id,
        currentPage + 1,
        10,
        minRating,
        maxRating
      );
      const mappedReviews: Review[] = response.data.map((item) => ({
        id: item.review_id,
        reviewerName: item.reviewer_name,
        rating: item.rating,
        reviewText: item.review_text,
        createdAt: item.created_at,
      }));
      setReviews(mappedReviews);
      setTotalPages(response.total_pages || 1);
      setError(null);
      return response;
    },
    enabled: !!user?.company_id,
    retry: 1,
  });

  const handleFetchReviews = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    reviews,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchReviews: handleFetchReviews,
  };
};
