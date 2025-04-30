import { useQuery } from "@tanstack/react-query";
import api from "../../../../services/api";
import { useTranslation } from "react-i18next";

interface CategoryTranslation {
  category_id: number;
  language_id: number;
  name: string;
  description: string | null;
  category_translation_id: number;
  created_at: string;
  updated_at: string | null;
}

interface ApiCategory {
  default_name: string;
  category_id: number;
  created_at: string;
  updated_at: string | null;
  translations: CategoryTranslation[];
}

interface ApiResponse {
  success: boolean;
  data: ApiCategory[];
  total_items: number;
  total_pages: number;
}

interface Category {
  id: number;
  name: string;
}

export const useCategories = () => {
  const { i18n } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<ApiResponse>("/api/v1/categories/", {
        params: { limit: 100 },
      });
      return response.data;
    },
    retry: 1,
  });

  // Map API categories to a format suitable for the select menu
  const categories: Category[] =
    data?.data?.map((apiCategory) => {
      // Find translation for current language (en: 1, ar: 2)
      const translation = apiCategory.translations.find(
        (t) => t.language_id === (i18n.language === "ar" ? 2 : 1)
      );
      return {
        id: apiCategory.category_id,
        name: translation?.name || apiCategory.default_name,
      };
    }) || [];

  return {
    categories,
    isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : "fetchCategoriesError"
      : null,
  };
};
