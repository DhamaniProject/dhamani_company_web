import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import { Review } from "../types/types";

interface ReviewModalProps {
  review: Review;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ review, onClose }) => {
  const { t } = useTranslation("reviews");
  const { t: tCommon } = useTranslation("common");

  const renderStars = (rating: number) => {
    const maxStars = 5;
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200"
        role="dialog"
        aria-labelledby="review-modal-title"
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2
            id="review-modal-title"
            className="text-xl font-semibold text-gray-800"
          >
            {t("modal.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={t("modal.close")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="grid gap-4">
          <div>
            <strong className="text-sm font-medium text-gray-600">
              {t("modal.reviewerName")}
            </strong>
            <p className="text-sm text-gray-800">{review.reviewerName}</p>
          </div>
          <div>
            <strong className="text-sm font-medium text-gray-600">
              {t("modal.rating")}
            </strong>
            <p className="text-sm text-gray-800 flex items-center gap-1">
              {renderStars(review.rating)} ({review.rating}/5)
            </p>
          </div>
          <div>
            <strong className="text-sm font-medium text-gray-600">
              {t("modal.reviewText")}
            </strong>
            <p className="text-sm text-gray-800">{review.reviewText}</p>
          </div>
          <div>
            <strong className="text-sm font-medium text-gray-600">
              {t("modal.createdAt")}
            </strong>
            <p className="text-sm text-gray-800">
              {new Date(review.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
            aria-label={t("modal.close")}
          >
            {t("modal.close")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
