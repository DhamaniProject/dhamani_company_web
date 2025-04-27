import React from "react";
import { useTranslation } from "react-i18next";
import ProductsTable from "./components/ProductsTable";

const ProductsPage: React.FC = () => {
  const { t } = useTranslation("products");

  return (
    <div className="p-6 max-w-full overflow-x-hidden">
      <h1
        className="text-2xl font-bold text-gray-800 mb-6"
        aria-label={t("table.title")}
      >
        {t("table.title")}
      </h1>
      <ProductsTable />
    </div>
  );
};

export default ProductsPage;
