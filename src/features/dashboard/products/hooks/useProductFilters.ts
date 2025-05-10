import { useState } from "react";
import { useDebounce } from "../../../../hooks/useDebounce";
import { ProductStatus } from "../types/types";

interface ProductFiltersHook {
  skuUpcFilter: string;
  categoryFilter: string;
  statusFilter: ProductStatus | "all";
  setSkuUpcFilter: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setStatusFilter: (value: ProductStatus | "all") => void;
  debouncedSkuUpcFilter: string;
}

export const useProductFilters = (): ProductFiltersHook => {
  const [skuUpcFilter, setSkuUpcFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const debouncedSkuUpcFilter = useDebounce(skuUpcFilter, 500);

  return {
    skuUpcFilter,
    categoryFilter,
    statusFilter,
    setSkuUpcFilter,
    setCategoryFilter,
    setStatusFilter,
    debouncedSkuUpcFilter,
  };
};
