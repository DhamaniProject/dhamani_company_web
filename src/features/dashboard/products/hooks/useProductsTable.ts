import { useState, useCallback } from "react";
import { Product } from "../types/types";

interface ProductsTableHook {
  products: Product[];
  nameFilter: string;
  skuFilter: string;
  typeFilter: string;
  statusFilter: string;
  isLoading: boolean;
  successMessage: string;
  error: string;
  currentPage: number;
  totalPages: number;
  setNameFilter: (value: string) => void;
  setSkuFilter: (value: string) => void;
  setTypeFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [skuFilter, setSkuFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const mockProducts: Product[] = [
    {
      id: "1",
      product_name: { en: "Smartphone X", ar: "الهاتف الذكي X" },
      product_description: {
        en: "Latest model with 5G support",
        ar: "أحدث طراز يدعم 5G",
      },
      terms_and_notes: {
        en: "2-year warranty included",
        ar: "ضمان لمدة سنتين مشمول",
      },
      image: "https://via.placeholder.com/150",
      types: ["warranty", "exchange"],
      sku: "SMX123",
      upc: "123456789012",
      category: "electronics",
      warrantyPeriod: 730,
      returnPeriod: 0,
      exchangePeriod: 30,
      warrantyProvider: "TechCare",
      status: "active",
    },
    {
      id: "2",
      product_name: { en: "Leather Jacket", ar: "سترة جلدية" },
      product_description: {
        en: "Premium leather jacket",
        ar: "سترة جلدية فاخرة",
      },
      terms_and_notes: { en: null, ar: null },
      image: "https://via.placeholder.com/150",
      types: ["return", "exchange"],
      sku: "LJ456",
      upc: null,
      category: "clothing",
      warrantyPeriod: 0,
      returnPeriod: 14,
      exchangePeriod: 14,
      warrantyProvider: null,
      status: "active",
    },
    {
      id: "3",
      product_name: { en: "Wireless Earbuds", ar: "سماعات لاسلكية" },
      product_description: {
        en: "High-quality sound with noise cancellation",
        ar: "صوت عالي الجودة مع إلغاء الضوضاء",
      },
      terms_and_notes: { en: "1-year warranty", ar: "ضمان لمدة سنة" },
      image: "https://via.placeholder.com/150",
      types: ["warranty"],
      sku: "WE789",
      upc: "987654321098",
      category: "electronics",
      warrantyPeriod: 365,
      returnPeriod: 0,
      exchangePeriod: 0,
      warrantyProvider: "SoundTech",
      status: "inactive",
    },
    {
      id: "4",
      product_name: { en: "Sunglasses", ar: "نظارات شمسية" },
      product_description: { en: null, ar: null },
      terms_and_notes: { en: null, ar: null },
      image: "https://via.placeholder.com/150",
      types: ["return"],
      sku: "SG101",
      upc: null,
      category: "accessories",
      warrantyPeriod: 0,
      returnPeriod: 7,
      exchangePeriod: 0,
      warrantyProvider: null,
      status: "active",
    },
    {
      id: "5",
      product_name: { en: "Camping Tent", ar: "خيمة تخييم" },
      product_description: {
        en: "Durable tent for outdoor adventures",
        ar: "خيمة متينة للمغامرات الخارجية",
      },
      terms_and_notes: { en: null, ar: null },
      image: "https://via.placeholder.com/150",
      types: ["warranty", "return"],
      sku: "CT202",
      upc: "456789123456",
      category: "other",
      warrantyPeriod: 180,
      returnPeriod: 30,
      exchangePeriod: 0,
      warrantyProvider: "OutdoorGear",
      status: "active",
    },
  ];

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock API call with mock data
      const response = await new Promise<Product[]>((resolve) =>
        setTimeout(() => resolve(mockProducts), 1000)
      );
      setProducts(response);
      setTotalPages(1);
    } catch (err) {
      setError("fetchError");
    } finally {
      setIsLoading(false);
    }
  }, [nameFilter, skuFilter, typeFilter, statusFilter, currentPage]);

  const updateProduct = async (
    id: string,
    updatedProduct: Partial<Product>
  ) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
      );
      setSuccessMessage("productUpdated");
    } catch (err) {
      setError("updateError");
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateProduct = async (id: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "inactive" as const } : p
        )
      );
      setSuccessMessage("productDeactivated");
    } catch (err) {
      setError("deactivateError");
    } finally {
      setIsLoading(false);
    }
  };

  const reactivateProduct = async (id: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "active" as const } : p))
      );
      setSuccessMessage("productReactivated");
    } catch (err) {
      setError("reactivateError");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    nameFilter,
    skuFilter,
    typeFilter,
    statusFilter,
    isLoading,
    successMessage,
    error,
    currentPage,
    totalPages,
    setNameFilter,
    setSkuFilter,
    setTypeFilter,
    setStatusFilter,
    setCurrentPage,
    fetchProducts,
    updateProduct,
    deactivateProduct,
    reactivateProduct,
  };
};
