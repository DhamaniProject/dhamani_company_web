import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import AuthInput from "../../../auth/common/AuthInput";
import { Product } from "../types/types";

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (newProduct: Partial<Product>) => Promise<void>;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  onClose,
  onAdd,
}) => {
  const { t } = useTranslation("products");
  const { t: tCommon } = useTranslation("common");
  const [newProduct, setNewProduct] = useState({
    product_name: { en: "", ar: "" },
    product_description: {
      en: null as string | null,
      ar: null as string | null,
    },
    terms_and_notes: { en: null as string | null, ar: null as string | null },
    product_image: "",
    types: [] as Array<"warranty" | "exchange" | "return">,
    sku: "",
    upc: "",
    category_id: "",
    warrantyPeriod: "0",
    returnPeriod: "0",
    exchangePeriod: "0",
    warrantyProvider: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewProduct({ ...newProduct, product_image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTypeChange = (type: "warranty" | "exchange" | "return") => {
    setNewProduct((prev) => {
      const types = prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type];
      return { ...prev, types };
    });
  };

  const handleAdd = async () => {
    setIsLoading(true);
    setError("");
    try {
      const warrantyPeriod = parseInt(newProduct.warrantyPeriod);
      const returnPeriod = parseInt(newProduct.returnPeriod);
      const exchangePeriod = parseInt(newProduct.exchangePeriod);
      if (
        !newProduct.product_name.en ||
        !newProduct.product_name.ar ||
        !newProduct.sku ||
        newProduct.types.length === 0 ||
        !newProduct.category_id ||
        (newProduct.types.includes("warranty") &&
          (isNaN(warrantyPeriod) || warrantyPeriod < 0)) ||
        (newProduct.types.includes("return") &&
          (isNaN(returnPeriod) || returnPeriod < 0)) ||
        (newProduct.types.includes("exchange") &&
          (isNaN(exchangePeriod) || exchangePeriod < 0))
      ) {
        setError("addProduct.error");
        return;
      }
      await onAdd({
        product_name: newProduct.product_name,
        product_description:
          newProduct.product_description.en || newProduct.product_description.ar
            ? {
                en: newProduct.product_description.en || null,
                ar: newProduct.product_description.ar || null,
              }
            : undefined,
        terms_and_notes:
          newProduct.terms_and_notes.en || newProduct.terms_and_notes.ar
            ? {
                en: newProduct.terms_and_notes.en || null,
                ar: newProduct.terms_and_notes.ar || null,
              }
            : undefined,
        product_image: newProduct.product_image || null,
        types: newProduct.types,
        sku: newProduct.sku,
        upc: newProduct.upc || null,
        category: { category_id: parseInt(newProduct.category_id), default_name: "", translations: [] },
        warrantyPeriod: newProduct.types.includes("warranty")
          ? warrantyPeriod
          : 0,
        returnPeriod: newProduct.types.includes("return") ? returnPeriod : 0,
        exchangePeriod: newProduct.types.includes("exchange")
          ? exchangePeriod
          : 0,
        warrantyProvider: newProduct.warrantyProvider
          ? { provider_id: newProduct.warrantyProvider, company_id: "", phone_number: "", translations: [] }
          : null,
        status: "active",
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "addProduct.error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-10 right-10 z-50 w-full max-w-2xl">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto border border-gray-200"
        role="dialog"
        aria-labelledby="add-modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2
            id="add-modal-title"
            className="text-xl font-semibold text-gray-800"
          >
            {t("addModal.title")}
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
        {/* Form */}
        <div className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AuthInput
              id="newProductNameEn"
              label={t("addModal.product_name_en")}
              placeholder={t("addModal.placeholder_name_en")}
              value={newProduct.product_name.en}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  product_name: {
                    ...newProduct.product_name,
                    en: e.target.value,
                  },
                })
              }
              required
            />
            <AuthInput
              id="newProductNameAr"
              label={t("addModal.product_name_ar")}
              placeholder={t("addModal.placeholder_name_ar")}
              value={newProduct.product_name.ar}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  product_name: {
                    ...newProduct.product_name,
                    ar: e.target.value,
                  },
                })
              }
              required
            />
            <AuthInput
              id="newProductDescriptionEn"
              label={t("addModal.product_description_en")}
              placeholder={t("addModal.placeholder_description_en")}
              value={newProduct.product_description.en || ""}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  product_description: {
                    ...newProduct.product_description,
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
              value={newProduct.product_description.ar || ""}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  product_description: {
                    ...newProduct.product_description,
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
              value={newProduct.terms_and_notes.en || ""}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  terms_and_notes: {
                    ...newProduct.terms_and_notes,
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
              value={newProduct.terms_and_notes.ar || ""}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  terms_and_notes: {
                    ...newProduct.terms_and_notes,
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
                {["warranty", "exchange", "return"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newProduct.types.includes(type as any)}
                      onChange={() => handleTypeChange(type as any)}
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
              value={newProduct.sku}
              onChange={(e) =>
                setNewProduct({ ...newProduct, sku: e.target.value })
              }
              required
            />
            <AuthInput
              id="newProductUpc"
              label={t("addModal.upc")}
              placeholder={t("addModal.placeholder_upc")}
              value={newProduct.upc}
              onChange={(e) =>
                setNewProduct({ ...newProduct, upc: e.target.value })
              }
            />
            <AuthInput
              id="newProductCategoryId"
              label={t("addModal.category_id")}
              placeholder={t("addModal.placeholder_category_id")}
              value={newProduct.category_id}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category_id: e.target.value })
              }
              required
            />
            <AuthInput
              id="newProductWarrantyPeriod"
              label={t("addModal.warrantyPeriod")}
              placeholder={t("addModal.placeholder_warranty_period")}
              type="number"
              min="0"
              value={newProduct.warrantyPeriod}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  warrantyPeriod: e.target.value,
                })
              }
              required={newProduct.types.includes("warranty")}
              disabled={!newProduct.types.includes("warranty")}
            />
            <AuthInput
              id="newProductReturnPeriod"
              label={t("addModal.returnPeriod")}
              placeholder={t("addModal.placeholder_return_period")}
              type="number"
              min="0"
              value={newProduct.returnPeriod}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  returnPeriod: e.target.value,
                })
              }
              required={newProduct.types.includes("return")}
              disabled={!newProduct.types.includes("return")}
            />
            <AuthInput
              id="newProductExchangePeriod"
              label={t("addModal.exchangePeriod")}
              placeholder={t("addModal.placeholder_exchange_period")}
              type="number"
              min="0"
              value={newProduct.exchangePeriod}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  exchangePeriod: e.target.value,
                })
              }
              required={newProduct.types.includes("exchange")}
              disabled={!newProduct.types.includes("exchange")}
            />
            <AuthInput
              id="newProductWarrantyProvider"
              label={t("addModal.warrantyProvider")}
              placeholder={t("addModal.placeholder_warranty_provider")}
              value={newProduct.warrantyProvider}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  warrantyProvider: e.target.value,
                })
              }
            />
          </div>
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
              aria-label={t("modal.close")}
            >
              {t("modal.close")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;