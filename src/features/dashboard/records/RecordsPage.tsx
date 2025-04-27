import React from "react";
import { useTranslation } from "react-i18next";
import RecordsTable from "./components/RecordsTable";

const RecordsPage: React.FC = () => {
  const { t } = useTranslation("records");

  return (
    <div className="p-6 max-w-full overflow-x-hidden">
      <h1
        className="text-2xl font-bold text-gray-800 mb-6"
        aria-label={t("title")}
      >
        {t("title")}
      </h1>
      <RecordsTable />
    </div>
  );
};

export default RecordsPage;
