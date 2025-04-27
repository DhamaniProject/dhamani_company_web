import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import AuthInput from "../../../auth/common/AuthInput";
import { Product } from "../types/types";

interface ProductModalProps {
  product: Product;
  mode: "view" | "update" | "deactivate" | "reactivate";
  onClose: () => void;
  onUpdate: (id: string, updatedProduct: Partial<Product>) => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
  onReactivate: (id: string) => Promise<void>;
  onChangeMode: (mode: "view" | "update" | "deactivate" | "reactivate") => void;
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
  const [updatedProduct, setUpdatedProduct] = useState({
    product_name: { en: product.product_name.en, ar: product.product_name.ar },
    product_description: {
      en: product.product_description?.en || null,
      ar: product.product_description?.ar || null,
    },
    terms_and_notes: {
      en: product.terms_and_notes?.en || null,
      ar: product.terms_and_notes?.ar || null,
    },
    image: product.image,
    types: product.types,
    sku: product.sku,
    upc: product.upc || "",
    category: product.category,
    warrantyPeriod: product.warrantyPeriod.toString(),
    returnPeriod: product.returnPeriod.toString(),
    exchangePeriod: product.exchangePeriod.toString(),
    warrantyProvider: product.warrantyProvider || "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    product.image
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUpdatedProduct({ ...updatedProduct, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTypeChange = (type: "warranty" | "exchange" | "return") => {
    setUpdatedProduct((prev) => {
      const types = prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type];
      return { ...prev, types };
    });
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setError("");
    try {
      const warrantyPeriod = parseInt(updatedProduct.warrantyPeriod);
      const returnPeriod = parseInt(updatedProduct.returnPeriod);
      const exchangePeriod = parseInt(updatedProduct.exchangePeriod);
      if (
        !updatedProduct.product_name.en ||
        !updatedProduct.product_name.ar ||
        !updatedProduct.sku ||
        updatedProduct.types.length === 0 ||
        !updatedProduct.category ||
        (updatedProduct.types.includes("warranty") &&
          (isNaN(warrantyPeriod) || warrantyPeriod < 0)) ||
        (updatedProduct.types.includes("return") &&
          (isNaN(returnPeriod) || returnPeriod < 0)) ||
        (updatedProduct.types.includes("exchange") &&
          (isNaN(exchangePeriod) || exchangePeriod < 0))
      ) {
        setError("error");
        return;
      }
      await onUpdate(product.id, {
        product_name: updatedProduct.product_name,
        product_description:
          updatedProduct.product_description.en ||
          updatedProduct.product_description.ar
            ? {
                en: updatedProduct.product_description.en || null,
                ar: updatedProduct.product_description.ar || null,
              }
            : undefined,
        terms_and_notes:
          updatedProduct.terms_and_notes.en || updatedProduct.terms_and_notes.ar
            ? {
                en: updatedProduct.terms_and_notes.en || null,
                ar: updatedProduct.terms_and_notes.ar || null,
              }
            : undefined,
        image: updatedProduct.image,
        types: updatedProduct.types,
        sku: updatedProduct.sku,
        upc: updatedProduct.upc || null,
        category: updatedProduct.category,
        warrantyPeriod: updatedProduct.types.includes("warranty")
          ? warrantyPeriod
          : 0,
        returnPeriod: updatedProduct.types.includes("return")
          ? returnPeriod
          : 0,
        exchangePeriod: updatedProduct.types.includes("exchange")
          ? exchangePeriod
          : 0,
        warrantyProvider: updatedProduct.warrantyProvider || null,
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
    setError("");
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
    setError("");
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
        {/* Error Message */}
        {error && (
          <div
            className="p-3 border border-red-500 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 font-medium mb-4"
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
        {/* View Mode */}
        {mode === "view" && (
          <div className="grid gap-6">
            <div className="flex justify-center">
              <img
                src={product.image}
                alt={product.product_name.en}
                className="w-48 h-48 rounded-lg object-contain shadow-md border border-gray-200"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.product_name_en")}
                </strong>
                <p className="text-sm text-gray-800">
                  {product.product_name.en}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.product_name_ar")}
                </strong>
                <p className="text-sm text-gray-800">
                  {product.product_name.ar}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.product_description_en")}
                </strong>
                <p className="text-sm text-gray-800">
                  {product.product_description?.en || tCommon("notAvailable")}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.product_description_ar")}
                </strong>
                <p className="text-sm text-gray-800">
                  {product.product_description?.ar || tCommon("notAvailable")}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.terms_and_notes_en")}
                </strong>
                <p className="text-sm text-gray-800">
                  {product.terms_and_notes?.en || tCommon("notAvailable")}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.terms_and_notes_ar")}
                </strong>
                <p className="text-sm text-gray-800">
                  {product.terms_and_notes?.ar || tCommon("notAvailable")}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.types")}
                </strong>
                <p className="text-sm text-gray-800">
                  {product.types
                    .map((type) => t(`table.type_${type}`))
                    .join(", ") || tCommon("none")}
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
                  {t(`table.category_${product.category}`)}
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
                <p className="text-sm text-gray-800">
                  {product.warrantyProvider || tCommon("notAvailable")}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.status")}
                </strong>
                <p
                  className={`text-sm ${
                    product.status === "active"
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
              {product.status === "active" && (
                <Button
                  onClick={() => onChangeMode("deactivate")}
                  className="py-2 px-4 text-sm font-medium rounded-lg border bg-gray-600 text-white hover:bg-gray-700"
                  aria-label={t("modal.submitDeactivation")}
                >
                  {t("modal.submitDeactivation")}
                </Button>
              )}
              {product.status === "inactive" && (
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
        )}
        {/* Update Mode */}
        {mode === "update" && (
          <div className="grid gap-6">
            <h3 className="text-lg font-medium text-gray-700">
              {t("modal.updateSection")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                id="updateProductNameEn"
                label={t("modal.product_name_en")}
                placeholder={t("modal.placeholder_name_en")}
                value={updatedProduct.product_name.en}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    product_name: {
                      ...updatedProduct.product_name,
                      en: e.target.value,
                    },
                  })
                }
                required
              />
              <AuthInput
                id="updateProductNameAr"
                label={t("modal.product_name_ar")}
                placeholder={t("modal.placeholder_name_ar")}
                value={updatedProduct.product_name.ar}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    product_name: {
                      ...updatedProduct.product_name,
                      ar: e.target.value,
                    },
                  })
                }
                required
              />
              <AuthInput
                id="updateProductDescriptionEn"
                label={t("modal.product_description_en")}
                placeholder={t("modal.placeholder_description_en")}
                value={updatedProduct.product_description.en || ""}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    product_description: {
                      ...updatedProduct.product_description,
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
                value={updatedProduct.product_description.ar || ""}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    product_description: {
                      ...updatedProduct.product_description,
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
                value={updatedProduct.terms_and_notes.en || ""}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    terms_and_notes: {
                      ...updatedProduct.terms_and_notes,
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
                value={updatedProduct.terms_and_notes.ar || ""}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    terms_and_notes: {
                      ...updatedProduct.terms_and_notes,
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
                  {["warranty", "exchange", "return"].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={updatedProduct.types.includes(type as any)}
                        onChange={() => handleTypeChange(type as any)}
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
                value={updatedProduct.sku}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, sku: e.target.value })
                }
                required
              />
              <AuthInput
                id="updateProductUpc"
                label={t("modal.upc")}
                placeholder={t("modal.placeholder_upc")}
                value={updatedProduct.upc}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, upc: e.target.value })
                }
              />
              <div>
                <label
                  htmlFor="updateProductCategory"
                  className="block text-sm mb-2 font-normal"
                >
                  {t("modal.category")}
                </label>
                <select
                  id="updateProductCategory"
                  value={updatedProduct.category}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      category: e.target.value as
                        | "electronics"
                        | "clothing"
                        | "accessories"
                        | "other",
                    })
                  }
                  className="block w-full border-gray-300 rounded-lg sm:text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-normal"
                  aria-label={t("modal.category")}
                >
                  <option value="">{t("modal.placeholder_category")}</option>
                  <option value="electronics">
                    {t("table.category_electronics")}
                  </option>
                  <option value="clothing">
                    {t("table.category_clothing")}
                  </option>
                  <option value="accessories">
                    {t("table.category_accessories")}
                  </option>
                  <option value="other">{t("table.category_other")}</option>
                </select>
              </div>
              <AuthInput
                id="updateProductWarrantyPeriod"
                label={t("modal.warrantyPeriod")}
                placeholder={t("modal.placeholder_warranty_period")}
                type="number"
                min="0"
                value={updatedProduct.warrantyPeriod}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    warrantyPeriod: e.target.value,
                  })
                }
                required={updatedProduct.types.includes("warranty")}
                disabled={!updatedProduct.types.includes("warranty")}
              />
              <AuthInput
                id="updateProductReturnPeriod"
                label={t("modal.returnPeriod")}
                placeholder={t("modal.placeholder_return_period")}
                type="number"
                min="0"
                value={updatedProduct.returnPeriod}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    returnPeriod: e.target.value,
                  })
                }
                required={updatedProduct.types.includes("return")}
                disabled={!updatedProduct.types.includes("return")}
              />
              <AuthInput
                id="updateProductExchangePeriod"
                label={t("modal.exchangePeriod")}
                placeholder={t("modal.placeholder_exchange_period")}
                type="number"
                min="0"
                value={updatedProduct.exchangePeriod}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    exchangePeriod: e.target.value,
                  })
                }
                required={updatedProduct.types.includes("exchange")}
                disabled={!updatedProduct.types.includes("exchange")}
              />
              <AuthInput
                id="updateProductWarrantyProvider"
                label={t("modal.warrantyProvider")}
                placeholder={t("modal.placeholder_warranty_provider")}
                value={updatedProduct.warrantyProvider}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    warrantyProvider: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={handleUpdate}
                className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                disabled={isLoading}
                aria-label={t("modal.submitUpdate")}
              >
                {t("modal.submitUpdate")}
              </Button>
              <Button
                onClick={() => onChangeMode("view")}
                className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
                disabled={isLoading}
                aria-label={t("modal.close")}
              >
                {t("modal.close")}
              </Button>
            </div>
          </div>
        )}
        {/* Deactivate Mode */}
        {mode === "deactivate" && (
          <div className="grid gap-6">
            <h3 className="text-lg font-medium text-gray-700">
              {t("modal.deactivationSection")}
            </h3>
            <p className="text-sm text-gray-600">
              {t("modal.deactivationConfirm")}
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={handleDeactivate}
                className="py-2 px-4 text-sm font-medium rounded-lg bg-gray-600 text-white hover:bg-gray-700"
                disabled={isLoading}
                aria-label={t("modal.submitDeactivation")}
              >
                {t("modal.submitDeactivation")}
              </Button>
              <Button
                onClick={() => onChangeMode("view")}
                className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
                disabled={isLoading}
                aria-label={t("modal.close")}
              >
                {t("modal.close")}
              </Button>
            </div>
          </div>
        )}
        {/* Reactivate Mode */}
        {mode === "reactivate" && (
          <div className="grid gap-6">
            <h3 className="text-lg font-medium text-gray-700">
              {t("modal.reactivationSection")}
            </h3>
            <p className="text-sm text-gray-600">
              {t("modal.reactivationConfirm")}
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={handleReactivate}
                className="py-2 px-4 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700"
                disabled={isLoading}
                aria-label={t("modal.submitReactivation")}
              >
                {t("modal.submitReactivation")}
              </Button>
              <Button
                onClick={() => onChangeMode("view")}
                className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
                disabled={isLoading}
                aria-label={t("modal.close")}
              >
                {t("modal.close")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
