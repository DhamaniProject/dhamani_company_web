import axios, { AxiosError } from "axios";
import { Product, ProductStatus, ProductType } from "../types/types";
import api from "../../../../services/api";

interface ProductData {
  company_id: string;
  product_image: string | null;
  sku: string;
  upc: string | null;
  category_id: number;
  warranty: number;
  return_period: number;
  exchange_period: number;
  warranty_provider_id: string | null;
}

interface UpdateProductData {
  product_image?: string | null;
  sku?: string;
  upc?: string | null;
  category_id?: number;
  warranty?: number;
  return_period?: number;
  exchange_period?: number;
  warranty_provider_id?: string | null;
}

interface Translation {
  language_id: number;
  product_name?: string;
  product_description?: string | null;
  terms_and_notes?: string | null;
}

interface CreateProductPayload {
  product_data: ProductData;
  translations: Translation[];
}

interface UpdateProductPayload {
  product_data: UpdateProductData;
  translations: Translation[];
}

interface ApiProduct {
  product_id: string;
  company_id: string;
  product_image: string | null;
  sku: string;
  upc: string | null;
  category: {
    default_name: string;
    category_id: number;
    created_at: string;
    updated_at: string | null;
    translations: Array<{
      category_id: number;
      language_id: number;
      name: string;
      description: string | null;
      category_translation_id: number;
      created_at: string;
      updated_at: string | null;
    }>;
  };
  warranty: number;
  return_period: number;
  exchange_period: number;
  warranty_provider: {
    provider_id: string;
    company_id: string;
    phone_number: string;
    email: string | null;
    address_url: string | null;
    website_url: string | null;
    created_at: string;
    updated_at: string | null;
    translations: Array<{
      provider_translation_id: number;
      provider_id: string;
      language_id: number;
      provider_name: string;
      notes: string | null;
      created_at: string;
      updated_at: string | null;
    }>;
  } | null;
  product_status: ProductStatus;
  created_at: string;
  updated_at: string | null;
  translations: Array<{
    language_id: number;
    product_name: string;
    product_description: string | null;
    terms_and_notes: string | null;
    product_translation_id: number;
    product_id: string;
    created_at: string;
    updated_at: string | null;
  }>;
}

interface ApiResponse {
  success: boolean;
  data: ApiProduct[];
  total_items: number;
  total_pages: number;
}

interface CreateProductResponse {
  success: boolean;
  data: {
    company_id: string;
    product_image: string | null;
    sku: string;
    upc: string | null;
    category_id: number;
    warranty: number;
    return_period: number;
    exchange_period: number;
    warranty_provider_id: string | null;
    product_status: ProductStatus;
    product_id: string;
    created_at: string;
    updated_at: string | null;
    translations: Array<{
      language_id: number;
      product_name: string;
      product_description: string | null;
      terms_and_notes: string | null;
      product_translation_id: number;
      product_id: string;
      created_at: string;
      updated_at: string | null;
    }>;
  };
}

interface UpdateProductResponse {
  success: boolean;
  data: {
    company_id: string;
    product_image: string | null;
    sku: string;
    upc: string | null;
    category_id: number;
    warranty: number;
    return_period: number;
    exchange_period: number;
    warranty_provider_id: string | null;
    product_status: ProductStatus;
    product_id: string;
    created_at: string;
    updated_at: string | null;
    translations: Array<{
      language_id: number;
      product_name: string;
      product_description: string | null;
      terms_and_notes: string | null;
      product_translation_id: number;
      product_id: string;
      created_at: string;
      updated_at: string | null;
    }>;
  };
}

interface SingleProductResponse {
  success: boolean;
  data: {
    company_id: string;
    product_image: string | null;
    sku: string;
    upc: string | null;
    category_id: number;
    warranty: number;
    return_period: number;
    exchange_period: number;
    warranty_provider_id: string | null;
    product_status: "active" | "suspended"; // Updated to match new statuses
    product_id: string;
    created_at: string;
    updated_at: string | null;
    translations: Array<{
      language_id: number;
      product_name: string;
      product_description: string | null;
      terms_and_notes: string | null;
      product_translation_id: number;
      product_id: string;
      created_at: string;
      updated_at: string | null;
    }>;
  };
}

export const fetchProducts = async (
  companyId: string,
  page: number,
  limit: number,
  search?: string,
  categoryId?: string,
  status?: ProductStatus
): Promise<ApiResponse> => {
  const queryParams: Record<string, string | number> = { page, limit };
  if (search) queryParams.search = search;
  if (categoryId && categoryId !== "all") queryParams.category_id = categoryId;
  if (status) queryParams.status = status;

  try {
    const response = await api.get<ApiResponse>(
      `/api/v1/companies/${companyId}/products/full`,
      { params: queryParams }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "fetchError";
      console.log("Fetch products error:", { status, message });
      if (status === 403) throw new Error("forbiddenError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 409) throw new Error("conflictError");
      if (status === 500) throw new Error("serverError");
      throw new Error(message);
    }
    throw new Error("fetchError");
  }
};

export const createProduct = async (
  companyId: string,
  productData: {
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
): Promise<Partial<Product>> => {
  const warrantyPeriod = parseInt(productData.warrantyPeriod);
  const returnPeriod = parseInt(productData.returnPeriod);
  const exchangePeriod = parseInt(productData.exchangePeriod);

  if (
    !productData.product_name.en ||
    !productData.product_name.ar ||
    !productData.sku ||
    productData.types.length === 0 ||
    !productData.category_id ||
    (productData.types.includes(ProductType.Warranty) &&
      (isNaN(warrantyPeriod) || warrantyPeriod < 0)) ||
    (productData.types.includes(ProductType.Return) &&
      (isNaN(returnPeriod) || returnPeriod < 0)) ||
    (productData.types.includes(ProductType.Exchange) &&
      (isNaN(exchangePeriod) || exchangePeriod < 0))
  ) {
    throw new Error("addProduct.error");
  }

  const payload: CreateProductPayload = {
    product_data: {
      company_id: companyId,
      product_image: productData.product_image || null,
      sku: productData.sku,
      upc: productData.upc || null,
      category_id: parseInt(productData.category_id),
      warranty: productData.types.includes(ProductType.Warranty)
        ? warrantyPeriod
        : 0,
      return_period: productData.types.includes(ProductType.Return)
        ? returnPeriod
        : 0,
      exchange_period: productData.types.includes(ProductType.Exchange)
        ? exchangePeriod
        : 0,
      warranty_provider_id: productData.warrantyProvider || null,
    },
    translations: [
      {
        language_id: 1,
        product_name: productData.product_name.en,
        product_description: productData.product_description.en || null,
        terms_and_notes: productData.terms_and_notes.en || null,
      },
      {
        language_id: 2,
        product_name: productData.product_name.ar,
        product_description: productData.product_description.ar || null,
        terms_and_notes: productData.terms_and_notes.ar || null,
      },
    ],
  };

  try {
    const response = await api.post<CreateProductResponse>(
      `/api/v1/companies/${companyId}/products/`,
      payload
    );
    const responseData = response.data.data;
    const enTranslation = responseData.translations.find(
      (t) => t.language_id === 1
    );
    const arTranslation = responseData.translations.find(
      (t) => t.language_id === 2
    );

    return {
      id: responseData.product_id,
      sku: responseData.sku,
      upc: responseData.upc || null,
      product_image: responseData.product_image || null,
      product_name: {
        en: enTranslation?.product_name || "",
        ar: arTranslation?.product_name || "",
      },
      product_description: {
        en: enTranslation?.product_description || null,
        ar: arTranslation?.product_description || null,
      },
      terms_and_notes: {
        en: enTranslation?.terms_and_notes || null,
        ar: arTranslation?.terms_and_notes || null,
      },
      types: productData.types,
      category: {
        category_id: responseData.category_id,
        default_name: "",
        translations: [],
      },
      warrantyPeriod: responseData.warranty,
      returnPeriod: responseData.return_period,
      exchangePeriod: responseData.exchange_period,
      warrantyProvider: responseData.warranty_provider_id
        ? {
            provider_id: responseData.warranty_provider_id,
            company_id: companyId,
            phone_number: "",
            email: null,
            address_url: null,
            website_url: null,
            created_at: "",
            updated_at: null,
            translations: [],
          }
        : null,
      status: responseData.product_status,
      translations: responseData.translations,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "createProductError";
      console.log("Create product error:", { status, message });
      if (status === 403) throw new Error("addProduct.forbiddenError");
      if (status === 400) throw new Error("addProduct.badRequestError");
      if (status === 409) throw new Error("addProduct.duplicateUPCError");
      if (status === 500) throw new Error("addProduct.serverError");
      throw new Error(message);
    }
    throw new Error("addProduct.createProductError");
  }
};

export const updateProduct = async (
  companyId: string,
  productId: string,
  productData: {
    product_name?: { en?: string; ar?: string };
    product_description?: { en?: string | null; ar?: string | null };
    terms_and_notes?: { en?: string | null; ar?: string | null };
    product_image?: string;
    types?: ProductType[];
    sku?: string;
    upc?: string;
    category_id?: string;
    warrantyPeriod?: string;
    returnPeriod?: string;
    exchangePeriod?: string;
    warrantyProvider?: string;
  }
): Promise<Partial<Product>> => {
  const product_data: UpdateProductData = {};
  if (productData.product_image !== undefined)
    product_data.product_image = productData.product_image || null;
  if (productData.sku !== undefined) product_data.sku = productData.sku;
  if (productData.upc !== undefined) product_data.upc = productData.upc || null;
  if (productData.category_id !== undefined)
    product_data.category_id = parseInt(productData.category_id);
  if (productData.warrantyPeriod !== undefined) {
    product_data.warranty = productData.types?.includes(ProductType.Warranty)
      ? parseInt(productData.warrantyPeriod)
      : 0;
  }
  if (productData.returnPeriod !== undefined) {
    product_data.return_period = productData.types?.includes(ProductType.Return)
      ? parseInt(productData.returnPeriod)
      : 0;
  }
  if (productData.exchangePeriod !== undefined) {
    product_data.exchange_period = productData.types?.includes(
      ProductType.Exchange
    )
      ? parseInt(productData.exchangePeriod)
      : 0;
  }
  if (productData.warrantyProvider !== undefined)
    product_data.warranty_provider_id = productData.warrantyProvider || null;

  const translations: Translation[] = [
    {
      language_id: 1,
      ...(productData.product_name?.en !== undefined && {
        product_name: productData.product_name.en,
      }),
      ...(productData.product_description?.en !== undefined && {
        product_description: productData.product_description.en || null,
      }),
      ...(productData.terms_and_notes?.en !== undefined && {
        terms_and_notes: productData.terms_and_notes.en || null,
      }),
    },
    {
      language_id: 2,
      ...(productData.product_name?.ar !== undefined && {
        product_name: productData.product_name.ar,
      }),
      ...(productData.product_description?.ar !== undefined && {
        product_description: productData.product_description.ar || null,
      }),
      ...(productData.terms_and_notes?.ar !== undefined && {
        terms_and_notes: productData.terms_and_notes.ar || null,
      }),
    },
  ].filter((t) => Object.keys(t).length > 1); // Include only translations with edited fields

  const payload: UpdateProductPayload = {
    product_data,
    translations:
      translations.length > 0
        ? translations
        : [{ language_id: 1 }, { language_id: 2 }], // Always include language_id
  };

  try {
    const response = await api.put<UpdateProductResponse>(
      `/api/v1/companies/${companyId}/products/${productId}`,
      payload
    );
    const responseData = response.data.data;
    const enTranslation = responseData.translations.find(
      (t) => t.language_id === 1
    );
    const arTranslation = responseData.translations.find(
      (t) => t.language_id === 2
    );

    return {
      id: responseData.product_id,
      sku: responseData.sku,
      upc: responseData.upc || null,
      product_image: responseData.product_image || null,
      product_name: {
        en: enTranslation?.product_name || "",
        ar: arTranslation?.product_name || "",
      },
      product_description: {
        en: enTranslation?.product_description || null,
        ar: arTranslation?.product_description || null,
      },
      terms_and_notes: {
        en: enTranslation?.terms_and_notes || null,
        ar: arTranslation?.terms_and_notes || null,
      },
      types: productData.types || [],
      category: {
        category_id: responseData.category_id,
        default_name: "",
        translations: [],
      },
      warrantyPeriod: responseData.warranty,
      returnPeriod: responseData.return_period,
      exchangePeriod: responseData.exchange_period,
      warrantyProvider: responseData.warranty_provider_id
        ? {
            provider_id: responseData.warranty_provider_id,
            company_id: companyId,
            phone_number: "",
            email: null,
            address_url: null,
            website_url: null,
            created_at: "",
            updated_at: null,
            translations: [],
          }
        : null,
      status: responseData.product_status,
      translations: responseData.translations,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "updateProductError";
      console.log("Update product error:", { status, message });
      if (status === 403) throw new Error("forbiddenError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 409) throw new Error("conflictError");
      if (status === 500) throw new Error("serverError");
      throw new Error(message);
    }
    throw new Error("updateProductError");
  }
};

export const activateProduct = async (
  companyId: string,
  productId: string
): Promise<void> => {
  try {
    console.log(`Activating product ${productId} for company ${companyId}`);
    const response = await api.post<SingleProductResponse>(
      `/api/v1/companies/${companyId}/products/${productId}/activate`
    );
    console.log("Activation response:", response.data);
  } catch (error: unknown) {
    console.error("Activate product error:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "activateProductError";
      console.log("Activation error details:", { status, message });
      if (status === 403) throw new Error("forbiddenError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 404) throw new Error("notFoundError");
      if (status === 409) throw new Error("conflictError");
      if (status === 500) throw new Error("serverError");
      throw new Error(message);
    }
    throw new Error("activateProductError");
  }
};

export const deactivateProduct = async (
  companyId: string,
  productId: string
): Promise<void> => {
  try {
    await api.post<SingleProductResponse>(
      `/api/v1/companies/${companyId}/products/${productId}/deactivate`
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "deactivateProductError";
      console.log("Deactivate product error:", { status, message });
      if (status === 403) throw new Error("forbiddenError");
      if (status === 400) throw new Error("badRequestError");
      if (status === 404) throw new Error("notFoundError");
      if (status === 409) throw new Error("conflictError");
      if (status === 500) throw new Error("serverError");
      throw new Error(message);
    }
    throw new Error("deactivateProductError");
  }
};
