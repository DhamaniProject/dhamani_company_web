import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import { Product, ProductStatus, ProductType } from "../types/types";
import { useProductModal } from "../hooks/useProductModal";
import { useProductFilters } from "../hooks/useProductFilters";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../../../../context/AuthContext";
import { useCategories } from "../hooks/useCategories";
import {
  updateProduct,
  activateProduct,
  deactivateProduct,
} from "../services/productService";
import ProductModal from "./ProductModal";
import AddProductModal from "./AddProductModal";

interface TableHeaderProps {
  t: (key: string, options?: Record<string, any>) => string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ t }) => (
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
          {t("table.warrantyProvider")}
        </span>
      </th>
      <th scope="col" className="px-6 py-3 text-start">
        <span className="text-xs font-semibold uppercase text-gray-600">
          {t("table.status")}
        </span>
      </th>
    </tr>
  </thead>
);

interface TableRowProps {
  product: Product;
  t: (key: string, options?: Record<string, any>) => string;
  tCommon: (key: string, options?: Record<string, any>) => string;
  i18n: any;
  onRowClick: (product: Product) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  product,
  t,
  tCommon,
  i18n,
  onRowClick,
}) => {
  const categoryTranslation = product.category.translations.find(
    (t) => t.language_id === (i18n.language === "ar" ? 2 : 1)
  );
  const warrantyProviderName = product.warrantyProvider
    ? product.warrantyProvider.translations.find(
        (t) => t.language_id === (i18n.language === "ar" ? 2 : 1)
      )?.provider_name || product.warrantyProvider.phone_number
    : tCommon("notAvailable");

  return (
    <tr
      onClick={() => onRowClick(product)}
      className="cursor-pointer hover:bg-gray-50"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onRowClick(product);
        }
      }}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-x-2">
          <img
            src={product.product_image || "https://via.placeholder.com/150"}
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
        <span className="text-sm text-gray-800 font-normal">{product.sku}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-x-2">
          <button
            className={`py-1 px-3 text-sm font-medium rounded-full border ${
              product.types.includes(ProductType.Warranty)
                ? "border-green-600 bg-green-600 text-white"
                : "border-green-500 text-green-500 hover:bg-green-50"
            }`}
            aria-label={t("table.type_warranty")}
          >
            {t("table.type_warranty")}
          </button>
          <button
            className={`py-1 px-3 text-sm font-medium rounded-full border ${
              product.types.includes(ProductType.Exchange)
                ? "border-pink-600 bg-pink-600 text-white"
                : "border-pink-500 text-pink-500 hover:bg-pink-50"
            }`}
            aria-label={t("table.type_exchange")}
          >
            {t("table.type_exchange")}
          </button>
          <button
            className={`py-1 px-3 text-sm font-medium rounded-full border ${
              product.types.includes(ProductType.Return)
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
          {categoryTranslation?.name || product.category.default_name}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-800 font-normal">
          {warrantyProviderName}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`text-sm font-medium ${
            product.status === ProductStatus.Active
              ? "text-green-600"
              : "text-gray-600"
          }`}
        >
          {t(`table.status_${product.status}`)}
        </span>
      </td>
    </tr>
  );
};

interface PaginationProps {
  t: (key: string, options?: Record<string, any>) => string;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  setCurrentPage: (page: number) => void;
}

interface ProductFiltersProps {
  t: (key: string, options?: Record<string, any>) => string;
  tCommon: (key: string, options?: Record<string, any>) => string;
  skuUpcFilter: string;
  categoryFilter: string;
  setSkuUpcFilter: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  categories: Array<{ id: number; name: string }>;
  isCategoriesLoading: boolean;
  categoriesError: string | null;
  fetchProducts: () => void;
  isLoading: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  t,
  tCommon,
  skuUpcFilter,
  categoryFilter,
  setSkuUpcFilter,
  setCategoryFilter,
  categories,
  isCategoriesLoading,
  categoriesError,
  fetchProducts,
  isLoading,
}) => (
  <div className="flex flex-col sm:flex-row gap-3">
    <input
      type="text"
      className="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      placeholder={t("table.placeholder_sku_upc_filter")}
      value={skuUpcFilter}
      onChange={(e) => setSkuUpcFilter(e.target.value)}
      aria-label={t("table.filterBySkuOrUpc")}
    />
    <select
      className="py-2 px-3 pr-8 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
      aria-label={t("table.category")}
      disabled={isCategoriesLoading || !!categoriesError}
    >
      <option value="all">{t("table.allCategories")}</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
    <Button
      onClick={fetchProducts}
      isLoading={isLoading}
      disabled={isLoading}
      aria-label={t("table.search")}
    >
      {isLoading ? tCommon("loading") : t("table.search")}
    </Button>
  </div>
);

const ProductsTable: React.FC = () => {
  const { t, i18n } = useTranslation("products");
  const { t: tCommon } = useTranslation("common");
  const { user } = useAuth();
  const {
    skuUpcFilter,
    categoryFilter,
    setSkuUpcFilter,
    setCategoryFilter,
    debouncedSkuUpcFilter,
  } = useProductFilters();
  const {
    products,
    isLoading,
    error,
    successMessage,
    currentPage,
    totalPages,
    setCurrentPage,
    setSuccessMessage,
    fetchProducts,
  } = useProducts(debouncedSkuUpcFilter, categoryFilter);
  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategories();
  const {
    showAddModal,
    selectedProduct,
    modalMode,
    setShowAddModal,
    setSelectedProduct,
    setModalMode,
  } = useProductModal();

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
    setModalMode("view");
  };

  const handleUpdateProduct = async (
    id: string,
    updatedProduct: Partial<Product>
  ) => {
    if (!user?.company_id) {
      throw new Error("noCompanyId");
    }
    await updateProduct(user.company_id, id, updatedProduct);
    setSuccessMessage("productUpdated");
    await fetchProducts();
  };

  const handleDeactivateProduct = async (id: string) => {
    if (!user?.company_id) {
      throw new Error("noCompanyId");
    }
    await deactivateProduct(user.company_id, id);
    setSuccessMessage("productDeactivated");
    await fetchProducts();
  };

  const handleActivateProduct = async (id: string) => {
    if (!user?.company_id) {
      throw new Error("noCompanyId");
    }
    await activateProduct(user.company_id, id);
    setSuccessMessage("productReactivated");
    await fetchProducts();
  };

  const handleAddProduct = async (newProduct: Partial<Product>) => {
    setSuccessMessage("productAdded");
    await fetchProducts();
  };

  const currentPageNumber = currentPage + 1;
  const paginationText = `${t("pagination.pageStart")} ${currentPageNumber} ${t(
    "pagination.pageMiddle"
  )} ${totalPages}`;

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
                  <ProductFilters
                    t={t}
                    tCommon={tCommon}
                    skuUpcFilter={skuUpcFilter}
                    categoryFilter={categoryFilter}
                    setSkuUpcFilter={setSkuUpcFilter}
                    setCategoryFilter={setCategoryFilter}
                    categories={categories}
                    isCategoriesLoading={isCategoriesLoading}
                    categoriesError={categoriesError}
                    fetchProducts={fetchProducts}
                    isLoading={isLoading}
                  />
                  <Button
                    onClick={() => setShowAddModal(true)}
                    disabled={isLoading}
                    className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                    aria-label={t("table.addProduct")}
                  >
                    +
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
              {(error || categoriesError) && (
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
                  <span>{t(error || categoriesError || "fetchError")}</span>
                </div>
              )}
              {/* Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <TableHeader t={t} />
                <tbody className="divide-y divide-gray-200">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow
                        key={product.id}
                        product={product}
                        t={t}
                        tCommon={tCommon}
                        i18n={i18n}
                        onRowClick={handleRowClick}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
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
      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          mode={modalMode}
          onClose={() => setSelectedProduct(null)}
          onUpdate={handleUpdateProduct}
          onDeactivate={handleDeactivateProduct}
          onReactivate={handleActivateProduct} // Updated to use handleActivateProduct
          onChangeMode={setModalMode}
        />
      )}
    </div>
  );
};

export default ProductsTable;
