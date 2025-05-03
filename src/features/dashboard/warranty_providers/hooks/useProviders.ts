import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../context/AuthContext";
import { fetchWarrantyProviders } from "../services/warrantyProviderService";
import { WarrantyProvider } from "../types/types";
import { useTranslation } from "react-i18next";

interface UseWarrantyProviders {
  providers: WarrantyProvider[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  fetchProviders: () => void;
}

export const useProviders = (
  context: string = "page"
): UseWarrantyProviders => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const [providers, setProviders] = useState<WarrantyProvider[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;
  const offset = currentPage * limit;
  const languageId = i18n.language === "ar" ? 2 : 1; // language_id: 1 for English, 2 for Arabic

  const { isLoading, refetch } = useQuery({
    queryKey: ["warrantyProviders", context, user?.company_id, currentPage],
    queryFn: async () => {
      if (!user?.company_id) {
        throw new Error("noCompanyId");
      }
      // Remove languageId from the fetch call to get all translations
      const response = await fetchWarrantyProviders(
        user.company_id,
        limit,
        offset
      );
      const mappedProviders: WarrantyProvider[] = response.map((item) => {
        // Select the translation based on the current language
        const translation =
          item.translations.find((t) => t.language_id === languageId) ||
          item.translations[0];
        return {
          id: item.provider_id,
          name: translation?.provider_name || "Unknown",
          email: item.email,
          phone: item.phone_number,
          status: "Active", // Assumed since status isn't provided
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          addressUrl: item.address_url,
          websiteUrl: item.website_url,
          translations: item.translations.map((t) => ({
            language_id: t.language_id,
            provider_name: t.provider_name,
            notes: t.notes,
          })),
        };
      });
      setProviders(mappedProviders);
      setTotalPages(1); // Response lacks total_pages; assuming single page for now
      setError(null);
      return response;
    },
    enabled: !!user?.company_id,
    retry: 1,
  });

  const handleFetchProviders = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    providers,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchProviders: handleFetchProviders,
  };
};
