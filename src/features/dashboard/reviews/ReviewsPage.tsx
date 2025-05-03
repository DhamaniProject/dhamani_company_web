import React from "react";
import { useTranslation } from "react-i18next";
import ReviewsTable from "./components/ReviewsTable";

const ReviewsPage: React.FC = () => {
  const { t } = useTranslation("reviews");

  return (
    <div className="p-6 max-w-full overflow-x-hidden">
      <h1
        className="text-2xl font-bold text-gray-800 mb-6"
        aria-label={t("page.title")}
      >
        {t("page.title")}
      </h1>
      <ReviewsTable />
    </div>
  );
};

export default ReviewsPage;
