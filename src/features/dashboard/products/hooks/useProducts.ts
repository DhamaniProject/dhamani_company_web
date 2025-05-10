// src/features/dashboard/products/hooks/useProducts.ts

import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../context/AuthContext";
import { fetchProducts } from "../services/productService";
import { Product, ProductType, ProductStatus } from "../types/types";

interface ProductsHook {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setSuccessMessage: (message: string | null) => void;
  fetchProducts: () => void;
}

export const useProducts = (
  skuUpcFilter: string,
  categoryFilter: string,
  statusFilter: ProductStatus | "all"
): ProductsHook => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchProductsData = useCallback(async () => {
    if (!user?.company_id) {
      setError("noCompanyId");
      setProducts([]);
      setTotalPages(1);
      return { success: false, data: [], total_items: 0, total_pages: 1 };
    }

    console.log("Fetching products with filters:", {
      skuUpcFilter,
      categoryFilter,
      statusFilter,
      currentPage,
    });

    try {
      const response = await fetchProducts(
        user.company_id,
        currentPage + 1,
        10,
        skuUpcFilter,
        categoryFilter,
        statusFilter !== "all" ? statusFilter : undefined
      );
      const mappedProducts: Product[] = response.data.map((item) => {
        const types: ProductType[] = [];
        if (item.warranty > 0) types.push(ProductType.Warranty);
        if (item.exchange_period > 0) types.push(ProductType.Exchange);
        if (item.return_period > 0) types.push(ProductType.Return);

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
      setTotalPages(response.total_pages || 1);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message || "fetchError");
      setProducts([]);
      setTotalPages(1);
      return { success: false, data: [], total_items: 0, total_pages: 1 };
    }
  }, [user?.company_id, skuUpcFilter, categoryFilter, statusFilter, currentPage]);

  const { isLoading, refetch } = useQuery({
    queryKey: [
      "products",
      user?.company_id,
      skuUpcFilter,
      categoryFilter,
      statusFilter,
      currentPage,
    ],
    queryFn: fetchProductsData,
    enabled: !!user?.company_id,
    retry: 1,
  });

  const handleFetchProducts = useCallback(() => {
    console.log("Manually fetching products with filters:", {
      skuUpcFilter,
      categoryFilter,
      statusFilter,
      currentPage,
    });
    refetch();
  }, [refetch, skuUpcFilter, categoryFilter, statusFilter, currentPage]);

  useEffect(() => {
    handleFetchProducts();
  }, [skuUpcFilter, categoryFilter, statusFilter, handleFetchProducts]);

  return {
    products,
    isLoading,
    error,
    successMessage,
    currentPage,
    totalPages,
    setCurrentPage,
    setSuccessMessage,
    fetchProducts: handleFetchProducts,
  };
};
