import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../../services/api";
import { useAuth } from "../../../../context/AuthContext";
import { useDebounce } from "../../../../hooks/useDebounce";
import {
  Product,
  ProductTranslation,
  Category,
  WarrantyProvider,
} from "../types/types";

interface ApiProduct {
  product_id: string;
  company_id: string;
  product_image: string | null;
  sku: string;
  upc: string | null;
  category: Category;
  warranty: number;
  return_period: number;
  exchange_period: number;
  warranty_provider: WarrantyProvider | null;
  product_status: "active" | "inactive" | "discontinued";
  created_at: string;
  updated_at: string | null;
  translations: ProductTranslation[];
}

interface ApiResponse {
  success: boolean;
  data: ApiProduct[];
  total_items: number;
  total_pages: number;
}

interface ProductsTableHook {
  products: Product[];
  skuUpcFilter: string;
  categoryFilter: string;
  isLoading: boolean;
  successMessage: string;
  error: string;
  currentPage: number;
  totalPages: number;
  setSkuUpcFilter: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setCurrentPage: (page: number) => void;
  fetchProducts: () => void;
  updateProduct: (
    id: string,
    updatedProduct: Partial<Product>
  ) => Promise<void>;
  deactivateProduct: (id: string) => Promise<void>;
  reactivateProduct: (id: string) => Promise<void>;
}

export const useProductsTable = (): ProductsTableHook => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [skuUpcFilter, setSkuUpcFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSkuUpcFilter = useDebounce(skuUpcFilter, 500);

  const fetchProducts = useCallback(async () => {
    const defaultResponse: ApiResponse = {
      success: false,
      data: [],
      total_items: 0,
      total_pages: 1,
    };

    if (!user?.company_id) {
      setError("noCompanyId");
      setProducts([]);
      setTotalPages(1);
      return defaultResponse;
    }

    const queryParams: Record<string, string | number> = {
      page: currentPage + 1,
      limit: 10,
    };

    if (debouncedSkuUpcFilter) {
      queryParams.search = debouncedSkuUpcFilter;
    }

    if (categoryFilter !== "all") {
      queryParams.category_id = categoryFilter;
    }

    try {
      const response = await api.get<ApiResponse>(
        `/api/v1/companies/${user.company_id}/products/full`,
        { params: queryParams }
      );

      const mappedProducts: Product[] = response.data.data.map((item) => {
        const types: Array<"warranty" | "exchange" | "return"> = [];
        if (item.warranty > 0) types.push("warranty");
        if (item.exchange_period > 0) types.push("exchange");
        if (item.return_period > 0) types.push("return");

        const enTranslation = item.translations.find(
          (t) => t.language_id === 1
        );
        const arTranslation = item.translations.find(
          (t) => t.language_id === 2
        );

        return {
          id: item.product_id,
          sku: item.sku,
          upc: item.upc,
          product_image: item.product_image,
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
          types,
          category: item.category,
          warrantyPeriod: item.warranty,
          returnPeriod: item.return_period,
          exchangePeriod: item.exchange_period,
          warrantyProvider: item.warranty_provider,
          status: item.product_status,
          translations: item.translations,
        };
      });

      setProducts(mappedProducts);
      setTotalPages(response.data.total_pages || 1);
      setError("");
      return response.data;
    } catch (err: any) {
      setError(err.message || "fetchError");
      setProducts([]);
      setTotalPages(1);
      return defaultResponse;
    }
  }, [user?.company_id, debouncedSkuUpcFilter, categoryFilter, currentPage]);

  const { isLoading, refetch } = useQuery({
    queryKey: [
      "products",
      user?.company_id,
      debouncedSkuUpcFilter,
      categoryFilter,
      currentPage,
    ],
    queryFn: fetchProducts,
    enabled: !!user?.company_id,
    retry: 1,
  });

  const handleFetchProducts = useCallback(() => {
    refetch();
  }, [refetch]);

  const updateProduct = async (
    id: string,
    updatedProduct: Partial<Product>
  ) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
      );
      setSuccessMessage("productUpdated");
    } catch (err) {
      setError("updateError");
    }
  };

  const deactivateProduct = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "inactive" as const } : p
        )
      );
      setSuccessMessage("productDeactivated");
    } catch (err) {
      setError("deactivateError");
    }
  };

  const reactivateProduct = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "active" as const } : p))
      );
      setSuccessMessage("productReactivated");
    } catch (err) {
      setError("reactivateError");
    }
  };

  return {
    products,
    skuUpcFilter,
    categoryFilter,
    isLoading,
    successMessage,
    error,
    currentPage,
    totalPages,
    setSkuUpcFilter,
    setCategoryFilter,
    setCurrentPage,
    fetchProducts: handleFetchProducts,
    updateProduct,
    deactivateProduct,
    reactivateProduct,
  };
};
