import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReviewsTable from "./components/ReviewsTable";

// Mock review data (replace with actual API call in the future)
interface Review {
  id: string;
  reviewerName: string;
  reviewText: string;
  rating: number; // Rating out of 5
  createdAt: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    reviewerName: "Ahmed Khalid",
    reviewText: "Great product, very satisfied with the quality!",
    rating: 5,
    createdAt: "2025-03-15T10:30:00Z",
  },
  {
    id: "2",
    reviewerName: "Sara Mohamed",
    reviewText: "Good service, but delivery was delayed.",
    rating: 3,
    createdAt: "2025-03-10T14:20:00Z",
  },
  {
    id: "3",
    reviewerName: "Omar Ali",
    reviewText: "Not worth the price, expected better.",
    rating: 2,
    createdAt: "2025-03-05T09:15:00Z",
  },
];

const ReviewsPage: React.FC = () => {
  const { t } = useTranslation("reviews");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching reviews (replace with actual API call)
    setIsLoading(true);
    setTimeout(() => {
      setReviews(mockReviews);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-6 max-w-full overflow-x-hidden">
      <h1
        className="text-2xl font-bold text-gray-800 mb-6"
        aria-label={t("page.title")}
      >
        {t("page.title")}
      </h1>
      <ReviewsTable reviews={reviews} isLoading={isLoading} />
    </div>
  );
};

export default ReviewsPage;
