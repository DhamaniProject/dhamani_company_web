import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import ProductModal from "./ProductModal";
import AddProductModal from "./AddProductModal";
import { useProductsTable } from "../hooks/useProductsTable";
import { Product } from "../types/types";

const ProductsTable: React.FC = () => {
  const { t, i18n } = useTranslation("products");
  const { t: tCommon } = useTranslation("common");
  const {
    products,
    nameFilter,
    skuFilter,
    typeFilter,
    statusFilter,
    isLoading,
    successMessage,
    error,
    currentPage,
    totalPages,
    setNameFilter,
    setSkuFilter,
    setTypeFilter,
    setStatusFilter,
    setCurrentPage,
    fetchProducts,
    updateProduct,
    deactivateProduct,
    reactivateProduct,
  } = useProductsTable();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<
    "view" | "update" | "deactivate" | "reactivate"
  >("view");

  useEffect(() => {
    fetchProducts();
  }, [
    nameFilter,
    skuFilter,
    typeFilter,
    statusFilter,
    currentPage,
    fetchProducts,
  ]);

  return (
    <div
      className="max-w-full"
      dir={i18n.language === "ar" ? "rtl" : undefined}
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
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Name Filter */}
                  <input
                    type="text"
                    className="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder={t("table.placeholder_name_filter")}
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    aria-label={t("table.filterByName")}
                  />
                  {/* SKU Filter */}
                  <input
                    type="text"
                    className="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder={t("table.placeholder_sku_filter")}
                    value={skuFilter}
                    onChange={(e) => setSkuFilter(e.target.value)}
                    aria-label={t("table.filterBySku")}
                  />
                  {/* Type Filter */}
                  <select
                    className="py-2 px-3 pr-8 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    aria-label={t("table.types")}
                  >
                    <option value="all">{t("table.allTypes")}</option>
                    <option value="warranty">{t("table.type_warranty")}</option>
                    <option value="exchange">{t("table.type_exchange")}</option>
                    <option value="return">{t("table.type_return")}</option>
                  </select>
                  {/* Status Filter */}
                  <select
                    className="py-2 px-3 pr-8 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label={t("table.status")}
                  >
                    <option value="all">{t("table.allStatuses")}</option>
                    <option value="active">{t("table.status_active")}</option>
                    <option value="inactive">
                      {t("table.status_inactive")}
                    </option>
                  </select>
                  {/* Search Button */}
                  <Button
                    onClick={fetchProducts}
                    isLoading={isLoading}
                    disabled={isLoading}
                    aria-label={t("table.search")}
                  >
                    {isLoading ? tCommon("loading") : t("table.search")}
                  </Button>
                  {/* Add Product Button */}
                  <Button
                    onClick={() => setShowAddModal(true)}
                    disabled={isLoading}
                    className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                    aria-label={t("table.addProduct")}
                  >
                    {t("table.addProduct")}
                  </Button>
                </div>
              </div>
              {/* Messages */}
              {successMessage && (
                <div
                  className="p-3 border border-green-500 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 font-medium m-4"
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{t(successMessage)}</span>
                </div>
              )}
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
                  <span>{t(error)}</span>
                </div>
              )}
              {/* Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.product")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.sku")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.types")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.category")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.status")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product);
                          setModalMode("view");
                        }}
                        className="cursor-pointer hover:bg-gray-50"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelectedProduct(product);
                            setModalMode("view");
                          }
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-x-2">
                            <img
                              src={product.image}
                              alt={product.product_name.en}
                              className="w-10 h-10 rounded-full"
                            />
                            <span className="text-sm text-gray-800 font-normal">
                              {i18n.language === "ar"
                                ? product.product_name.ar
                                : product.product_name.en}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {product.sku}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-x-2">
                            <button
                              className={`py-1 px-3 text-sm font-medium rounded-full border ${
                                product.types.includes("warranty")
                                  ? "border-green-600 bg-green-600 text-white"
                                  : "border-green-500 text-green-500 hover:bg-green-50"
                              }`}
                              aria-label={t("table.type_warranty")}
                            >
                              {t("table.type_warranty")}
                            </button>
                            <button
                              className={`py-1 px-3 text-sm font-medium rounded-full border ${
                                product.types.includes("exchange")
                                  ? "border-pink-600 bg-pink-600 text-white"
                                  : "border-pink-500 text-pink-500 hover:bg-pink-50"
                              }`}
                              aria-label={t("table.type_exchange")}
                            >
                              {t("table.type_exchange")}
                            </button>
                            <button
                              className={`py-1 px-3 text-sm font-medium rounded-full border ${
                                product.types.includes("return")
                                  ? "border-gray-600 bg-gray-600 text-white"
                                  : "border-gray-500 text-gray-500 hover:bg-gray-50"
                              }`}
                              aria-label={t("table.type_return")}
                            >
                              {t("table.type_return")}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {t(`table.category_${product.category}`)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${
                              product.status === "active"
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {t(`table.status_${product.status}`)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {isLoading ? tCommon("loading") : t("table.noResults")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    {t("pagination.page", {
                      current: currentPage + 1,
                      total: totalPages,
                    })}
                  </p>
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
      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={async (newProduct) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setShowAddModal(false);
          }}
        />
      )}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          mode={modalMode}
          onClose={() => setSelectedProduct(null)}
          onUpdate={updateProduct}
          onDeactivate={deactivateProduct}
          onReactivate={reactivateProduct}
          onChangeMode={setModalMode}
        />
      )}
    </div>
  );
};

export default ProductsTable;
