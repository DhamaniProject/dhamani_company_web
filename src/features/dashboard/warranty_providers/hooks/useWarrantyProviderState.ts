import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WarrantyProvider } from '../types/types';
import { useAuth } from '../../../../context/AuthContext';
import { createWarrantyProvider, updateWarrantyProvider } from '../services/warrantyProviderService';
import { useProviders } from './useProviders';

export const useWarrantyProviderState = () => {
  const { t, i18n } = useTranslation("warrantyProviders");
  const {
    providers: initialProviders,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchProviders,
  } = useProviders("page");

  const [providers, setProviders] = useState<WarrantyProvider[]>(initialProviders);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<WarrantyProvider | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    setProviders(initialProviders);
  }, [initialProviders]);

  const handleAddProvider = async (
    newProvider: Omit<WarrantyProvider, "id" | "status" | "createdAt">
  ) => {
    if (!user?.company_id) {
      setErrorMessage("noCompanyId");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      const requestBody = {
        provider_data: {
          phone_number: newProvider.phone,
          email: newProvider.email,
          address_url: newProvider.addressUrl || "",
          website_url: newProvider.websiteUrl || "",
        },
        translations: [
          {
            language_id: 1, // English
            provider_name: newProvider.translations.find(t => t.language_id === 1)?.provider_name || "",
            notes: newProvider.translations.find(t => t.language_id === 1)?.notes || "",
          },
          {
            language_id: 2, // Arabic
            provider_name: newProvider.translations.find(t => t.language_id === 2)?.provider_name || "",
            notes: newProvider.translations.find(t => t.language_id === 2)?.notes || "",
          }
        ],
      };
      const response = await createWarrantyProvider(
        user.company_id,
        requestBody
      );
      const createdProvider: WarrantyProvider = {
        id: response.provider_id,
        name:
          newProvider.translations.find(
            (t) => t.language_id === (i18n.language === "ar" ? 2 : 1)
          )?.provider_name || "Unknown",
        email: response.email,
        phone: response.phone_number,
        status: "Active",
        createdAt: response.created_at,
        updatedAt: response.updated_at,
        addressUrl: response.address_url,
        websiteUrl: response.website_url,
        translations: response.translations.map((t) => ({
          language_id: t.language_id,
          provider_name: t.provider_name,
          notes: t.notes,
        })),
      };
      setProviders((prev) => [...prev, createdProvider]);
      setSuccessMessage("providerAddedSuccess");
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchProviders();
      return createdProvider;
    } catch (error: any) {
      setErrorMessage(error.message || "createProviderError");
      setTimeout(() => setErrorMessage(null), 3000);
      throw error;
    }
  };

  const handleUpdateProvider = async (
    id: string,
    updateData: {
      provider?: {
        phone_number?: string;
        email?: string;
        address_url?: string;
        website_url?: string;
      };
      translations?: {
        language_id: number;
        provider_name: string;
        notes: string;
      }[];
    }
  ) => {
    try {
      const response = await updateWarrantyProvider(id, updateData);
      if (!response) {
        throw new Error("updateProviderError");
      }

      const updatedProviderData: WarrantyProvider = {
        id: response.provider_id,
        name: response.translations.find(
          (t) => t.language_id === (i18n.language === "ar" ? 2 : 1)
        )?.provider_name || "Unknown",
        email: response.email,
        phone: response.phone_number,
        status: "Active",
        createdAt: response.created_at,
        updatedAt: response.updated_at,
        addressUrl: response.address_url,
        websiteUrl: response.website_url,
        translations: response.translations.map((t) => ({
          language_id: t.language_id,
          provider_name: t.provider_name,
          notes: t.notes,
        })),
      };

      setProviders((prev) =>
        prev.map((provider) =>
          provider.id === id ? updatedProviderData : provider
        )
      );
      setSuccessMessage("providerUpdatedSuccess");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchProviders();
    } catch (error: any) {
      setErrorMessage(error.message || "updateProviderError");
      setTimeout(() => setErrorMessage(null), 3000);
      throw error;
    }
  };

  const handleViewProvider = (provider: WarrantyProvider) => {
    setSelectedProvider(provider);
    setShowViewModal(true);
  };

  return {
    providers,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    showAddModal,
    setShowAddModal,
    showViewModal,
    setShowViewModal,
    selectedProvider,
    successMessage,
    errorMessage,
    handleAddProvider,
    handleUpdateProvider,
    handleViewProvider,
  };
}; 