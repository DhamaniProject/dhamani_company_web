import { useState } from "react";
import { Product, ProductType } from "../types/types";
import { uploadToSupabaseStorage } from '../../../../services/supabaseUploadService';

interface FormState {
  product_name: { en: string; ar: string };
  product_description: { en: string | null; ar: string | null };
  terms_and_notes: { en: string | null; ar: string | null };
  product_image: string | File;
  types: ProductType[];
  sku: string;
  upc: string;
  category_id: string;
  warrantyPeriod: string;
  returnPeriod: string;
  exchangePeriod: string;
  warrantyProvider: string;
}

interface EditedFields {
  product_name_en?: boolean;
  product_name_ar?: boolean;
  product_description_en?: boolean;
  product_description_ar?: boolean;
  terms_and_notes_en?: boolean;
  terms_and_notes_ar?: boolean;
  product_image?: boolean;
  types?: boolean;
  sku?: boolean;
  upc?: boolean;
  category_id?: boolean;
  warrantyPeriod?: boolean;
  returnPeriod?: boolean;
  exchangePeriod?: boolean;
  warrantyProvider?: boolean;
}

interface ProductFormHook {
  formState: FormState;
  editedFields: EditedFields;
  imagePreview: string | null;
  error: string | null;
  setError: (error: string | null) => void;
  setFormState: (
    state: Partial<FormState>,
    edited?: Partial<EditedFields>
  ) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTypeChange: (type: ProductType) => void;
  validateForm: (isUpdate?: boolean) => boolean;
  resetForm: () => void;
  uploadProductImage: (file: File, companyId: string) => Promise<string>;
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

  const [state, setState] = useState<{
    formState: FormState;
    editedFields: EditedFields;
    imagePreview: string | null;
    error: string | null;
  }>({
    formState: initialState,
    editedFields: {},
    imagePreview: initialProduct?.product_image || null,
    error: null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setState((prev) => ({
        ...prev,
        formState: { ...prev.formState, product_image: file },
        editedFields: { ...prev.editedFields, product_image: true },
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleTypeChange = (type: ProductType) => {
    setState((prev) => {
      const types = prev.formState.types.includes(type)
        ? prev.formState.types.filter((t) => t !== type)
        : [...prev.formState.types, type];
      const edited: Partial<EditedFields> = { types: true };
      if (type === ProductType.Warranty) edited.warrantyPeriod = true;
      if (type === ProductType.Return) edited.returnPeriod = true;
      if (type === ProductType.Exchange) edited.exchangePeriod = true;

      return {
        ...prev,
        formState: {
          ...prev.formState,
          types,
          warrantyPeriod: types.includes(ProductType.Warranty)
            ? prev.formState.warrantyPeriod
            : "0",
          returnPeriod: types.includes(ProductType.Return)
            ? prev.formState.returnPeriod
            : "0",
          exchangePeriod: types.includes(ProductType.Exchange)
            ? prev.formState.exchangePeriod
            : "0",
        },
        editedFields: { ...prev.editedFields, ...edited },
      };
    });
  };

  const setFormStateWithEdited = (
    state: Partial<FormState>,
    edited: Partial<EditedFields> = {}
  ) => {
    setState((prev) => ({
      ...prev,
      formState: { ...prev.formState, ...state },
      editedFields: { ...prev.editedFields, ...edited },
    }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const validateForm = (isUpdate: boolean = false): boolean => {
    const { formState } = state;
    if (isUpdate) {
      // For updates, only validate edited fields
      const warrantyPeriod = parseInt(formState.warrantyPeriod);
      const returnPeriod = parseInt(formState.returnPeriod);
      const exchangePeriod = parseInt(formState.exchangePeriod);

      if (
        (state.editedFields.warrantyPeriod &&
          formState.types.includes(ProductType.Warranty) &&
          (isNaN(warrantyPeriod) || warrantyPeriod < 0)) ||
        (state.editedFields.returnPeriod &&
          formState.types.includes(ProductType.Return) &&
          (isNaN(returnPeriod) || returnPeriod < 0)) ||
        (state.editedFields.exchangePeriod &&
          formState.types.includes(ProductType.Exchange) &&
          (isNaN(exchangePeriod) || exchangePeriod < 0))
      ) {
        setError("updateProduct.error");
        return false;
      }
      setError(null);
      return true;
    }

    // For adds, validate all required fields
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
    setState({
      formState: initialState,
      editedFields: {},
      imagePreview: initialProduct?.product_image || null,
      error: null,
    });
  };

  // Add a function to upload the image using the reusable service
  const uploadProductImage = async (file: File, companyId: string) => {
    return await uploadToSupabaseStorage(file, 'product-images', companyId);
  };

  return {
    formState: state.formState,
    editedFields: state.editedFields,
    imagePreview: state.imagePreview,
    error: state.error,
    setError,
    setFormState: setFormStateWithEdited,
    handleImageChange,
    handleTypeChange,
    validateForm,
    resetForm,
    uploadProductImage,
  };
};
