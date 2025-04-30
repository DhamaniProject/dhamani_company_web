import { useState } from "react";
import { useDebounce } from "../../../../hooks/useDebounce";

interface ProductFiltersHook {
  skuUpcFilter: string;
  categoryFilter: string;
  setSkuUpcFilter: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  debouncedSkuUpcFilter: string;
}

export const useProductFilters = (): ProductFiltersHook => {
  const [skuUpcFilter, setSkuUpcFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const debouncedSkuUpcFilter = useDebounce(skuUpcFilter, 500);

  return {
    skuUpcFilter,
    categoryFilter,
    setSkuUpcFilter,
    setCategoryFilter,
    debouncedSkuUpcFilter,
  };
};
