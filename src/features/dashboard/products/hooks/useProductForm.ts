import { useState } from "react";
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

interface ProductFormHook {
  formState: FormState;
  imagePreview: string | null;
  error: string | null;
  setError: (error: string | null) => void;
  setFormState: (state: Partial<FormState>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTypeChange: (type: ProductType) => void;
  validateForm: () => boolean;
  resetForm: () => void;
}

export const useProductForm = (initialProduct?: Product): ProductFormHook => {
  const initialState: FormState = initialProduct
    ? {
        product_name: {
          en: initialProduct.product_name.en,
          ar: initialProduct.product_name.ar,
        },
        product_description: {
          en: initialProduct.product_description.en || null,
          ar: initialProduct.product_description.ar || null,
        },
        terms_and_notes: {
          en: initialProduct.terms_and_notes.en || null,
          ar: initialProduct.terms_and_notes.ar || null,
        },
        product_image: initialProduct.product_image || "",
        types: initialProduct.types,
        sku: initialProduct.sku,
        upc: initialProduct.upc || "",
        category_id: initialProduct.category.category_id.toString(),
        warrantyPeriod: initialProduct.warrantyPeriod.toString(),
        returnPeriod: initialProduct.returnPeriod.toString(),
        exchangePeriod: initialProduct.exchangePeriod.toString(),
        warrantyProvider: initialProduct.warrantyProvider?.provider_id || "",
      }
    : {
        product_name: { en: "", ar: "" },
        product_description: { en: null, ar: null },
        terms_and_notes: { en: null, ar: null },
        product_image: "",
        types: [],
        sku: "",
        upc: "",
        category_id: "",
        warrantyPeriod: "0",
        returnPeriod: "0",
        exchangePeriod: "0",
        warrantyProvider: "",
      };

  const [formState, setFormState] = useState<FormState>(initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialProduct?.product_image || null
  );
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormState({ ...formState, product_image: file.name });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTypeChange = (type: ProductType) => {
    setFormState((prev) => {
      const types = prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type];
      return {
        ...prev,
        types,
        warrantyPeriod: types.includes(ProductType.Warranty)
          ? prev.warrantyPeriod
          : "0",
        returnPeriod: types.includes(ProductType.Return) ? prev.returnPeriod : "0",
        exchangePeriod: types.includes(ProductType.Exchange)
          ? prev.exchangePeriod
          : "0",
      };
    });
  };

  const validateForm = (): boolean => {
    const warrantyPeriod = parseInt(formState.warrantyPeriod);
    const returnPeriod = parseInt(formState.returnPeriod);
    const exchangePeriod = parseInt(formState.exchangePeriod);

    if (
      !formState.product_name.en ||
      !formState.product_name.ar ||
      !formState.sku ||
      formState.types.length === 0 ||
      !formState.category_id ||
      (formState.types.includes(ProductType.Warranty) &&
        (isNaN(warrantyPeriod) || warrantyPeriod < 0)) ||
      (formState.types.includes(ProductType.Return) &&
        (isNaN(returnPeriod) || returnPeriod < 0)) ||
      (formState.types.includes(ProductType.Exchange) &&
        (isNaN(exchangePeriod) || exchangePeriod < 0))
    ) {
      setError("addProduct.error");
      return false;
    }
    setError(null);
    return true;
  };

  const resetForm = () => {
    setFormState(initialState);
    setImagePreview(initialProduct?.product_image || null);
    setError(null);
  };

  return {
    formState,
    imagePreview,
    error,
    setError,
    setFormState,
    handleImageChange,
    handleTypeChange,
    validateForm,
    resetForm,
  };
};