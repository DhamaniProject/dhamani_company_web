import React from "react";
import { useTranslation } from "react-i18next";

interface Review {
  id: string;
  reviewerName: string;
  reviewText: string;
  rating: number; // Rating out of 5
  createdAt: string;
}

interface ReviewsTableProps {
  reviews: Review[];
  isLoading: boolean;
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews, isLoading }) => {
  const { t, i18n } = useTranslation("reviews");
  const { t: tCommon } = useTranslation("common");

  const renderStars = (rating: number) => {
    const maxStars = 5;
    const filledStars = Math.round(rating); // Round to nearest integer
    const stars = [];

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 inline-block ${
            i <= filledStars ? "text-yellow-400" : "text-gray-300"
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

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden font-arabic">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {t("table.title")}
              </h2>
            </div>
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
                    <span className="text-xs font-semibold uppercase text-gray-600">
                      {t("table.rating")}
                    </span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <span className="text-xs font-semibold uppercase text-gray-600">
                      {t("table.createdAt")}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <tr key={review.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-800 font-normal">
                          {review.reviewerName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-800 font-normal">
                          {review.reviewText}
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
                      {isLoading ? tCommon("loading") : t("table.noReviews")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsTable;
