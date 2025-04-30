import { useQuery } from "@tanstack/react-query";
import api from "../../../../services/api";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../context/AuthContext";

interface WarrantyProviderTranslation {
  provider_translation_id: number;
  provider_id: string;
  language_id: number;
  provider_name: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

interface ApiWarrantyProvider {
  provider_id: string;
  translations: WarrantyProviderTranslation[];
}

interface ApiResponse {
  success: boolean;
  data: ApiWarrantyProvider[];
}

interface WarrantyProviderOption {
  id: string;
  name: string;
}

export const useWarrantyProviders = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ["warrantyProviders", user?.company_id],
    queryFn: async () => {
      if (!user?.company_id) {
        throw new Error("No company ID available");
      }
      const response = await api.get<ApiResponse>(
        `/api/v1/warranty-providers/companies/${user.company_id}/providers/names`
      );
      return response.data;
    },
    enabled: !!user?.company_id,
    retry: 1,
  });

  const warrantyProviders: WarrantyProviderOption[] =
    data?.data?.map((provider) => {
      const translation = provider.translations.find(
        (t) => t.language_id === (i18n.language === "ar" ? 2 : 1)
      );
      return {
        id: provider.provider_id,
        name: translation?.provider_name || provider.provider_id,
      };
    }) || [];

  return {
    warrantyProviders,
    isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : "fetchWarrantyProvidersError"
      : null,
  };
};
