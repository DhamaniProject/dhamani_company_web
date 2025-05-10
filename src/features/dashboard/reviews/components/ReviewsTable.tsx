import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import AuthInput from "../../../auth/common/AuthInput";
import ReviewModal from "./ReviewModal";
import { useReviews } from "../hooks/useReviews";
import { Review } from "../types/types";

interface ReviewsTableProps {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const { t, i18n } = useTranslation("reviews");
  const { t: tCommon } = useTranslation("common");
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [maxRating, setMaxRating] = useState<number | undefined>(undefined);
  const {
    reviews,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchReviews,
  } = useReviews(minRating, maxRating);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [sortConfig, setSortConfig] = useState({
    key: sortBy,
    order: sortOrder,
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const renderStars = (rating: number) => {
    const maxStars = 5;
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 inline-block ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortConfig.key === "rating") {
      return sortConfig.order === "asc"
        ? a.rating - b.rating
        : b.rating - a.rating;
    }
    if (sortConfig.key === "createdAt") {
      return sortConfig.order === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const paginationText = `${t("pagination.pageStart")} ${currentPage + 1} ${t(
    "pagination.pageMiddle"
  )} ${totalPages}`;

  return (
    <div
      className="max-w-full"
      dir={i18n.language === "ar" ? "ltr" : undefined}
    >
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden font-arabic">
              {/* Header */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("table.title")}
                </h2>
              </div>
              {/* Error Message */}
              {error && (
                <div
                  className="p-3 border border-red-500 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 font-medium m-4"
                  role="alert"
                  aria-live="polite"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{t(`errors.${error}`)}</span>
                </div>
              )}
              {/* Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.reviewerName")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.reviewText")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <button
                        className="text-xs font-semibold uppercase text-gray-600 flex items-center gap-1"
                        onClick={() => handleSort("rating")}
                        aria-sort={
                          sortConfig.key === "rating"
                            ? sortConfig.order
                            : "none"
                        }
                      >
                        {t("table.rating")}
                        {sortConfig.key === "rating" && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d={
                                sortConfig.order === "asc"
                                  ? "M19 9l-7 7-7-7"
                                  : "M5 15l7-7 7 7"
                              }
                            />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <button
                        className="text-xs font-semibold uppercase text-gray-600 flex items-center gap-1"
                        onClick={() => handleSort("createdAt")}
                        aria-sort={
                          sortConfig.key === "createdAt"
                            ? sortConfig.order
                            : "none"
                        }
                      >
                        {t("table.createdAt")}
                        {sortConfig.key === "createdAt" && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d={
                                sortConfig.order === "asc"
                                  ? "M19 9l-7 7-7-7"
                                  : "M5 15l7-7 7 7"
                              }
                            />
                          </svg>
                        )}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {tCommon("loading")}
                      </td>
                    </tr>
                  ) : sortedReviews.length > 0 ? (
                    sortedReviews.map((review) => (
                      <tr
                        key={review.id}
                        onClick={() => setSelectedReview(review)}
                        className="cursor-pointer hover:bg-gray-50"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelectedReview(review);
                          }
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {review.reviewerName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-800 font-normal">
                            {review.reviewText.length > 50
                              ? `${review.reviewText.substring(0, 50)}...`
                              : review.reviewText}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {renderStars(review.rating)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {t("table.noReviews")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
                  <p className="text-sm text-gray-600">{paginationText}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={currentPage === 0 || isLoading}
                      className="py-2 px-4 text-sm font-medium rounded-lg bg-primary hover:bg-primary-hover"
                      aria-label={t("pagination.previous")}
                    >
                      {t("pagination.previous")}
                    </Button>
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages - 1)
                        )
                      }
                      disabled={currentPage === totalPages - 1 || isLoading}
                      className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
                      aria-label={t("pagination.next")}
                    >
                      {t("pagination.next")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
};

export default ReviewsTable;
