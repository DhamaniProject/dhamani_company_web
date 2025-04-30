import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import AuthInput from "../../../auth/common/AuthInput";
import { Product, ProductStatus, ProductType } from "../types/types";
import { useProductForm } from "../hooks/useProductForm";

interface ProductViewProps {
  product: Product;
  t: (key: string, options?: any) => string;
  tCommon: (key: string) => string;
  i18n: any;
  onChangeMode: (
    mode: "view" | "update" | "deactivate" | "reactivate" | "confirmUpdate"
  ) => void;
  onClose: () => void;
}

const ProductView: React.FC<ProductViewProps> = ({
  product,
  t,
  tCommon,
  i18n,
  onChangeMode,
  onClose,
}) => {
  const warrantyProviderName = product.warrantyProvider
    ? product.warrantyProvider.translations.find(
        (t) => t.language_id === (i18n.language === "ar" ? 2 : 1)
      )?.provider_name || product.warrantyProvider.phone_number
    : tCommon("notAvailable");

  return (
    <div className="grid gap-6">
      <div className="flex justify-center">
        <img
          src={product.product_image || "https://via.placeholder.com/150"}
          alt={product.product_name.en}
          className="w-48 h-48 rounded-lg object-contain shadow-md border border-gray-200"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.product_name_en")}
          </strong>
          <p className="text-sm text-gray-800">{product.product_name.en}</p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.product_name_ar")}
          </strong>
          <p className="text-sm text-gray-800">{product.product_name.ar}</p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.product_description_en")}
          </strong>
          <p className="text-sm text-gray-800">
            {product.product_description.en || tCommon("notAvailable")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.product_description_ar")}
          </strong>
          <p className="text-sm text-gray-800">
            {product.product_description.ar || tCommon("notAvailable")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.terms_and_notes_en")}
          </strong>
          <p className="text-sm text-gray-800">
            {product.terms_and_notes.en || tCommon("notAvailable")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.terms_and_notes_ar")}
          </strong>
          <p className="text-sm text-gray-800">
            {product.terms_and_notes.ar || tCommon("notAvailable")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.types")}
          </strong>
          <p className="text-sm text-gray-800">
            {product.types.map((type) => t(`table.type_${type}`)).join(", ") ||
              tCommon("none")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.sku")}
          </strong>
          <p className="text-sm text-gray-800">{product.sku}</p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.upc")}
          </strong>
          <p className="text-sm text-gray-800">
            {product.upc || tCommon("notAvailable")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.category")}
          </strong>
          <p className="text-sm text-gray-800">
            {product.category.translations.find(
              (t) => t.language_id === (i18n.language === "ar" ? 2 : 1)
            )?.name || product.category.default_name}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.warrantyPeriod")}
          </strong>
          <p className="text-sm text-gray-800">
            {product.warrantyPeriod} {tCommon("days")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.returnPeriod")}
          </strong>
          <p className="text-sm text-gray-800">
            {product.returnPeriod} {tCommon("days")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.exchangePeriod")}
          </strong>
          <p className="text-sm text-gray-800">
            {product.exchangePeriod} {tCommon("days")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.warrantyProvider")}
          </strong>
          <p className="text-sm text-gray-800">{warrantyProviderName}</p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.warrantyProviderDetails")}
          </strong>
          <p className="text-sm text-gray-800">
            {product.warrantyProvider
              ? `${product.warrantyProvider.phone_number}, ${
                  product.warrantyProvider.email || tCommon("notAvailable")
                }`
              : tCommon("notAvailable")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.status")}
          </strong>
          <p
            className={`text-sm ${
              product.status === ProductStatus.Active
                ? "text-green-600"
                : "text-gray-600"
            }`}
          >
            {t(`table.status_${product.status}`)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <Button
          onClick={() => onChangeMode("update")}
          className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
          aria-label={t("modal.submitUpdate")}
        >
          {t("modal.submitUpdate")}
        </Button>
        {product.status === ProductStatus.Active && (
          <Button
            onClick={() => onChangeMode("deactivate")}
            className="py-2 px-4 text-sm font-medium rounded-lg border bg-gray-600 text-white hover:bg-gray-700"
            aria-label={t("modal.submitDeactivation")}
          >
            {t("modal.submitDeactivation")}
          </Button>
        )}
        {product.status === ProductStatus.Inactive && (
          <Button
            onClick={() => onChangeMode("reactivate")}
            className="py-2 px-4 text-sm font-medium rounded-lg border bg-green-600 text-white hover:bg-green-700"
            aria-label={t("modal.submitReactivation")}
          >
            {t("modal.submitReactivation")}
          </Button>
        )}
        <Button
          onClick={onClose}
          className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
          aria-label={t("modal.close")}
        >
          {t("modal.close")}
        </Button>
      </div>
    </div>
  );
};

interface ProductUpdateFormProps {
  t: (key: string, options?: any) => string;
  formState: any;
  imagePreview: string | null;
  error: string | null;
  setFormState: (state: any) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTypeChange: (type: ProductType) => void;
  validateForm: () => boolean;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ProductUpdateForm: React.FC<ProductUpdateFormProps> = ({
  t,
  formState,
  imagePreview,
  error,
  setFormState,
  handleImageChange,
  handleTypeChange,
  validateForm,
  onSubmit,
  onCancel,
  isLoading,
}) => (
  <div className="grid gap-6">
    <h3 className="text-lg font-medium text-gray-700">
      {t("modal.updateSection")}
    </h3>
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
        id="updateProductNameEn"
        label={t("modal.product_name_en")}
        placeholder={t("modal.placeholder_name_en")}
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
        id="updateProductNameAr"
        label={t("modal.product_name_ar")}
        placeholder={t("modal.placeholder_name_ar")}
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
        id="updateProductDescriptionEn"
        label={t("modal.product_description_en")}
        placeholder={t("modal.placeholder_description_en")}
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
        id="updateProductDescriptionAr"
        label={t("modal.product_description_ar")}
        placeholder={t("modal.placeholder_description_ar")}
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
        id="updateProductTermsEn"
        label={t("modal.terms_and_notes_en")}
        placeholder={t("modal.placeholder_terms_en")}
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
        id="updateProductTermsAr"
        label={t("modal.terms_and_notes_ar")}
        placeholder={t("modal.placeholder_terms_ar")}
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
          htmlFor="updateProductImage"
          className="block text-sm mb-2 font-normal"
        >
          {t("modal.imageUpload")}
        </label>
        <input
          id="updateProductImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:bg-[var(--color-primary-hover)]"
          aria-label={t("modal.imageUpload")}
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
          {t("modal.types")}
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
        id="updateProductSku"
        label={t("modal.sku")}
        placeholder={t("modal.placeholder_sku")}
        value={formState.sku}
        onChange={(e) => setFormState({ ...formState, sku: e.target.value })}
        required
      />
      <AuthInput
        id="updateProductUpc"
        label={t("modal.upc")}
        placeholder={t("modal.placeholder_upc")}
        value={formState.upc}
        onChange={(e) => setFormState({ ...formState, upc: e.target.value })}
      />
      <AuthInput
        id="updateProductWarrantyPeriod"
        label={t("modal.warrantyPeriod")}
        placeholder={t("modal.placeholder_warranty_period")}
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
        id="updateProductReturnPeriod"
        label={t("modal.returnPeriod")}
        placeholder={t("modal.placeholder_return_period")}
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
        id="updateProductExchangePeriod"
        label={t("modal.exchangePeriod")}
        placeholder={t("modal.placeholder_exchange_period")}
        type="number"
        min="0"
        value={formState.exchangePeriod}
        onChange={(e) =>
          setFormState({ ...formState, exchangePeriod: e.target.value })
        }
        required={formState.types.includes(ProductType.Exchange)}
        disabled={!formState.types.includes(ProductType.Exchange)}
      />
      <AuthInput
        id="updateProductWarrantyProvider"
        label={t("modal.warrantyProvider")}
        placeholder={t("modal.placeholder_warranty_provider")}
        value={formState.warrantyProvider}
        onChange={(e) =>
          setFormState({ ...formState, warrantyProvider: e.target.value })
        }
      />
    </div>
    <div className="mt-4 flex justify-end gap-3">
      <Button
        onClick={onSubmit}
        className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
        disabled={isLoading}
        aria-label={t("modal.submitUpdate")}
      >
        {t("modal.submitUpdate")}
      </Button>
      <Button
        onClick={onCancel}
        className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
        disabled={isLoading}
        aria-label={t("modal.close")}
      >
        {t("modal.close")}
      </Button>
    </div>
  </div>
);

interface ConfirmDialogProps {
  t: (key: string, options?: any) => string;
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
        aria-label={t("modal.close")}
      >
        {t("modal.close")}
      </Button>
    </div>
  </div>
);

interface ProductModalProps {
  product: Product;
  mode: "view" | "update" | "deactivate" | "reactivate" | "confirmUpdate";
  onClose: () => void;
  onUpdate: (id: string, updatedProduct: Partial<Product>) => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
  onReactivate: (id: string) => Promise<void>;
  onChangeMode: (
    mode: "view" | "update" | "deactivate" | "reactivate" | "confirmUpdate"
  ) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  mode,
  onClose,
  onUpdate,
  onDeactivate,
  onReactivate,
  onChangeMode,
}) => {
  const { t, i18n } = useTranslation("products");
  const { t: tCommon } = useTranslation("common");
  const {
    formState,
    imagePreview,
    error,
    setFormState,
    handleImageChange,
    handleTypeChange,
    validateForm,
  } = useProductForm(product);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!validateForm()) return;
    onChangeMode("confirmUpdate");
  };

  const handleConfirmUpdate = async () => {
    setIsLoading(true);
    try {
      await onUpdate(product.id, {
        product_name: formState.product_name,
        product_description:
          formState.product_description.en || formState.product_description.ar
            ? {
                en: formState.product_description.en || null,
                ar: formState.product_description.ar || null,
              }
            : undefined,
        terms_and_notes:
          formState.terms_and_notes.en || formState.terms_and_notes.ar
            ? {
                en: formState.terms_and_notes.en || null,
                ar: formState.terms_and_notes.ar || null,
              }
            : undefined,
        product_image: formState.product_image,
        types: formState.types,
        sku: formState.sku,
        upc: formState.upc || null,
        category: {
          ...product.category,
          category_id: parseInt(formState.category_id),
        },
        warrantyPeriod: formState.types.includes(ProductType.Warranty)
          ? parseInt(formState.warrantyPeriod)
          : 0,
        returnPeriod: formState.types.includes(ProductType.Return)
          ? parseInt(formState.returnPeriod)
          : 0,
        exchangePeriod: formState.types.includes(ProductType.Exchange)
          ? parseInt(formState.exchangePeriod)
          : 0,
        warrantyProvider: formState.warrantyProvider
          ? {
              ...product.warrantyProvider,
              provider_id: formState.warrantyProvider,
            }
          : null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setIsLoading(true);
    try {
      await onDeactivate(product.id);
      onClose();
    } catch (err: any) {
      setError(err.message || "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivate = async () => {
    setIsLoading(true);
    try {
      await onReactivate(product.id);
      onClose();
    } catch (err: any) {
      setError(err.message || "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-10 right-10 z-50 w-full max-w-2xl">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto border border-gray-200"
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
            {t(`modal.title_${mode}`)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={t("modal.close")}
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
        {mode === "view" && (
          <ProductView
            product={product}
            t={t}
            tCommon={tCommon}
            i18n={i18n}
            onChangeMode={onChangeMode}
            onClose={onClose}
          />
        )}
        {mode === "update" && (
          <ProductUpdateForm
            t={t}
            formState={formState}
            imagePreview={imagePreview}
            error={error}
            setFormState={setFormState}
            handleImageChange={handleImageChange}
            handleTypeChange={handleTypeChange}
            validateForm={validateForm}
            onSubmit={handleSubmit}
            onCancel={() => onChangeMode("view")}
            isLoading={isLoading}
          />
        )}
        {mode === "confirmUpdate" && (
          <ConfirmDialog
            t={t}
            title={t("modal.confirmUpdateSection")}
            message={t("modal.updateConfirm")}
            onConfirm={handleConfirmUpdate}
            onCancel={() => onChangeMode("update")}
            isLoading={isLoading}
            confirmLabel={t("modal.submitUpdate")}
            confirmClass="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
          />
        )}
        {mode === "deactivate" && (
          <ConfirmDialog
            t={t}
            title={t("modal.deactivationSection")}
            message={t("modal.deactivationConfirm")}
            onConfirm={handleDeactivate}
            onCancel={() => onChangeMode("view")}
            isLoading={isLoading}
            confirmLabel={t("modal.submitDeactivation")}
            confirmClass="py-2 px-4 text-sm font-medium rounded-lg bg-gray-600 text-white hover:bg-gray-700"
          />
        )}
        {mode === "reactivate" && (
          <ConfirmDialog
            t={t}
            title={t("modal.reactivationSection")}
            message={t("modal.reactivationConfirm")}
            onConfirm={handleReactivate}
            onCancel={() => onChangeMode("view")}
            isLoading={isLoading}
            confirmLabel={t("modal.submitReactivation")}
            confirmClass="py-2 px-4 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700"
          />
        )}
      </div>
    </div>
  );
};

export default ProductModal;
