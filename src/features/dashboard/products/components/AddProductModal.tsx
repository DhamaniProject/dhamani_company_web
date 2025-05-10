import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import AuthInput from "../../../auth/common/AuthInput";
import { useCategories } from "../hooks/useCategories";
import { useWarrantyProviders } from "../hooks/useWarrantyProviders";
import { useAuth } from "../../../../context/AuthContext";
import { createProduct } from "../services/productService";
import { useProductForm } from "../hooks/useProductForm";
import { Product, ProductType } from "../types/types";

interface FormState {
  product_name: { en: string; ar: string };
  product_description: { en: string | null; ar: string | null };
  terms_and_notes: { en: string | null; ar: string | null };
  product_image: string;
  types: ProductType[];
  sku: string;
  upc: string;
  category_id: string;
  warrantyPeriod: string;
  returnPeriod: string;
  exchangePeriod: string;
  warrantyProvider: string;
}

interface ConfirmDialogProps {
  t: (key: string, options?: Record<string, any>) => string;
  title: string;
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  confirmLabel: string;
  confirmClass: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  t,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
  confirmLabel,
  confirmClass,
}) => (
  <div className="grid gap-6">
    <h3 className="text-lg font-medium text-gray-700">{title}</h3>
    <p className="text-sm text-gray-600">{message}</p>
    <div className="mt-4 flex justify-end gap-3">
      <Button
        onClick={onConfirm}
        className={confirmClass}
        disabled={isLoading}
        aria-label={confirmLabel}
      >
        {confirmLabel}
      </Button>
      <Button
        onClick={onCancel}
        className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
        disabled={isLoading}
        aria-label={t("addModal.close")}
      >
        {t("addModal.close")}
      </Button>
    </div>
  </div>
);

interface ProductAddFormProps {
  t: (key: string, options?: Record<string, any>) => string;
  tCommon: (key: string, options?: Record<string, any>) => string;
  formState: FormState;
  imagePreview: string | null;
  error: string | null;
  setFormState: (state: Partial<FormState>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTypeChange: (type: ProductType) => void;
  categories: Array<{ id: number; name: string }>;
  isCategoriesLoading: boolean;
  warrantyProviders: Array<{ id: string; name: string }>;
  isWarrantyProvidersLoading: boolean;
  warrantyProvidersError: string | null;
}

const ProductAddForm: React.FC<ProductAddFormProps> = ({
  t,
  tCommon,
  formState,
  imagePreview,
  error,
  setFormState,
  handleImageChange,
  handleTypeChange,
  categories,
  isCategoriesLoading,
  warrantyProviders,
  isWarrantyProvidersLoading,
  warrantyProvidersError,
}) => {
  console.log("ProductAddForm error:", error); // Debug log to confirm error state
  return (
    <div className="grid gap-6">
      {error && (
        <div
          className="p-3 border border-red-500 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 font-medium"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AuthInput
          id="newProductNameEn"
          label={t("addModal.product_name_en")}
          placeholder={t("addModal.placeholder_name_en")}
          value={formState.product_name.en}
          onChange={(e) =>
            setFormState({
              ...formState,
              product_name: { ...formState.product_name, en: e.target.value },
            })
          }
          required
        />
        <AuthInput
          id="newProductNameAr"
          label={t("addModal.product_name_ar")}
          placeholder={t("addModal.placeholder_name_ar")}
          value={formState.product_name.ar}
          onChange={(e) =>
            setFormState({
              ...formState,
              product_name: { ...formState.product_name, ar: e.target.value },
            })
          }
          required
        />
        <AuthInput
          id="newProductDescriptionEn"
          label={t("addModal.product_description_en")}
          placeholder={t("addModal.placeholder_description_en")}
          value={formState.product_description.en || ""}
          onChange={(e) =>
            setFormState({
              ...formState,
              product_description: {
                ...formState.product_description,
                en: e.target.value || null,
              },
            })
          }
          type="textarea"
        />
        <AuthInput
          id="newProductDescriptionAr"
          label={t("addModal.product_description_ar")}
          placeholder={t("addModal.placeholder_description_ar")}
          value={formState.product_description.ar || ""}
          onChange={(e) =>
            setFormState({
              ...formState,
              product_description: {
                ...formState.product_description,
                ar: e.target.value || null,
              },
            })
          }
          type="textarea"
        />
        <AuthInput
          id="newProductTermsEn"
          label={t("addModal.terms_and_notes_en")}
          placeholder={t("addModal.placeholder_terms_en")}
          value={formState.terms_and_notes.en || ""}
          onChange={(e) =>
            setFormState({
              ...formState,
              terms_and_notes: {
                ...formState.terms_and_notes,
                en: e.target.value || null,
              },
            })
          }
          type="textarea"
        />
        <AuthInput
          id="newProductTermsAr"
          label={t("addModal.terms_and_notes_ar")}
          placeholder={t("addModal.placeholder_terms_ar")}
          value={formState.terms_and_notes.ar || ""}
          onChange={(e) =>
            setFormState({
              ...formState,
              terms_and_notes: {
                ...formState.terms_and_notes,
                ar: e.target.value || null,
              },
            })
          }
          type="textarea"
        />
        <div>
          <label
            htmlFor="newProductImage"
            className="block text-sm mb-2 font-normal"
          >
            {t("addModal.imageUpload")}
          </label>
          <input
            id="newProductImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:bg-[var(--color-primary-hover)]"
            aria-label={t("addModal.imageUpload")}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Product preview"
              className="mt-4 w-32 h-32 rounded-lg object-cover"
            />
          )}
        </div>
        <div>
          <label className="block text-sm mb-2 font-normal">
            {t("addModal.types")}
          </label>
          <div className="flex flex-col gap-2">
            {Object.values(ProductType).map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formState.types.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                />
                <span className="text-sm">{t(`table.type_${type}`)}</span>
              </label>
            ))}
          </div>
        </div>
        <AuthInput
          id="newProductSku"
          label={t("addModal.sku")}
          placeholder={t("addModal.placeholder_sku")}
          value={formState.sku}
          onChange={(e) => setFormState({ ...formState, sku: e.target.value })}
          required
        />
        <AuthInput
          id="newProductUpc"
          label={t("addModal.upc")}
          placeholder={t("addModal.placeholder_upc")}
          value={formState.upc}
          onChange={(e) => setFormState({ ...formState, upc: e.target.value })}
        />
        <div>
          <label
            htmlFor="newProductCategoryId"
            className="block text-sm mb-2 font-normal"
          >
            {t("addModal.category")}
          </label>
          <select
            id="newProductCategoryId"
            className="py-2 px-3 pr-8 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full"
            value={formState.category_id}
            onChange={(e) =>
              setFormState({ ...formState, category_id: e.target.value })
            }
            disabled={isCategoriesLoading}
            aria-label={t("addModal.category")}
            required
          >
            <option value="" disabled>
              {t("addModal.selectCategory")}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <AuthInput
          id="newProductWarrantyPeriod"
          label={t("addModal.warrantyPeriod")}
          placeholder={t("addModal.placeholder_warranty_period")}
          type="number"
          min="0"
          value={formState.warrantyPeriod}
          onChange={(e) =>
            setFormState({ ...formState, warrantyPeriod: e.target.value })
          }
          required={formState.types.includes(ProductType.Warranty)}
          disabled={!formState.types.includes(ProductType.Warranty)}
        />
        <AuthInput
          id="newProductReturnPeriod"
          label={t("addModal.returnPeriod")}
          placeholder={t("addModal.placeholder_return_period")}
          type="number"
          min="0"
          value={formState.returnPeriod}
          onChange={(e) =>
            setFormState({ ...formState, returnPeriod: e.target.value })
          }
          required={formState.types.includes(ProductType.Return)}
          disabled={!formState.types.includes(ProductType.Return)}
        />
        <AuthInput
          id="newProductExchangePeriod"
          label={t("addModal.exchangePeriod")}
          placeholder={t("addModal.placeholder_exchange_period")}
          type="number"
          min="0"
          value={formState.exchangePeriod}
          onChange={(e) =>
            setFormState({ ...formState, exchangePeriod: e.target.value })
          }
          required={formState.types.includes(ProductType.Exchange)}
          disabled={!formState.types.includes(ProductType.Exchange)}
        />
        <div>
          <label
            htmlFor="newProductWarrantyProvider"
            className="block text-sm mb-2 font-normal"
          >
            {t("addModal.warrantyProvider")}
          </label>
          <select
            id="newProductWarrantyProvider"
            className="py-2 px-3 pr-8 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full"
            value={formState.warrantyProvider}
            onChange={(e) =>
              setFormState({ ...formState, warrantyProvider: e.target.value })
            }
            disabled={isWarrantyProvidersLoading || !!warrantyProvidersError}
            aria-label={t("addModal.warrantyProvider")}
          >
            <option value="">{t("addModal.noWarrantyProvider")}</option>
            {warrantyProviders.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (newProduct: Partial<Product>) => Promise<void>;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  onClose,
  onAdd,
}) => {
  const { t, i18n } = useTranslation("products");
  const { t: tCommon } = useTranslation("common");
  const { user } = useAuth();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const {
    warrantyProviders,
    isLoading: isWarrantyProvidersLoading,
    error: warrantyProvidersError,
  } = useWarrantyProviders();
  const {
    formState,
    imagePreview,
    error,
    setError,
    setFormState,
    handleImageChange,
    handleTypeChange,
    validateForm,
    resetForm,
  } = useProductForm();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [persistentError, setPersistentError] = useState<string | null>(null);

  // Ensure error persists after confirm dialog closes
  useEffect(() => {
    if (error) {
      setPersistentError(error);
    }
  }, [error]);

  const handleAdd = () => {
    if (!validateForm()) return;
    setShowConfirm(true);
  };

  const handleConfirmAdd = async () => {
    setIsLoading(true);
    setPersistentError(null); // Clear previous error
    try {
      if (!user?.company_id) {
        throw new Error("noCompanyId");
      }

      const createdProduct = await createProduct(user.company_id, formState);
      if (typeof onAdd === "function") {
        await onAdd(createdProduct);
      } else {
        console.warn("onAdd is not a function or is undefined");
      }
      resetForm();
      onClose();
    } catch (err: any) {
      console.log("AddProductModal error:", err.message);
      setError(err.message || "addProduct.error");
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="fixed top-10 right-10 z-50 w-full max-w-2xl">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto border border-gray-200"
        role="dialog"
        aria-labelledby="add-modal-title"
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2
            id="add-modal-title"
            className="text-xl font-semibold text-gray-800"
          >
            {t(showConfirm ? "addModal.confirmAddSection" : "addModal.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={t("addModal.close")}
            disabled={isLoading}
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
        {showConfirm ? (
          <ConfirmDialog
            t={t}
            title={t("addModal.confirmAddSection")}
            message={t("addModal.addConfirm")}
            onConfirm={handleConfirmAdd}
            onCancel={() => setShowConfirm(false)}
            isLoading={isLoading}
            confirmLabel={t("addModal.submit")}
            confirmClass="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
          />
        ) : (
          <>
            <ProductAddForm
              t={t}
              tCommon={tCommon}
              formState={formState}
              imagePreview={imagePreview}
              error={persistentError}
              setFormState={setFormState}
              handleImageChange={handleImageChange}
              handleTypeChange={handleTypeChange}
              categories={categories}
              isCategoriesLoading={isCategoriesLoading}
              warrantyProviders={warrantyProviders}
              isWarrantyProvidersLoading={isWarrantyProvidersLoading}
              warrantyProvidersError={warrantyProvidersError}
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={handleAdd}
                className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                disabled={isLoading}
                aria-label={t("addModal.submit")}
              >
                {t("addModal.submit")}
              </Button>
              <Button
                onClick={onClose}
                className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
                disabled={isLoading}
                aria-label={t("addModal.close")}
              >
                {t("addModal.close")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddProductModal;
