import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import WarrantyProvidersTable from "./components/WarrantyProvidersTable";
import AddWarrantyProviderModal from "./components/AddWarrantyProviderModal";
import WarrantyProviderModal from "./components/WarrantyProviderModal";
import { useProviders } from "./hooks/useProviders";
import { WarrantyProvider } from "./types/types";
import { useAuth } from "../../../context/AuthContext";
import { createWarrantyProvider } from "./services/warrantyProviderService";

const WarrantyProvidersPage: React.FC = () => {
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
  const [providers, setProviders] =
    useState<WarrantyProvider[]>(initialProviders);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<WarrantyProvider | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { user } = useAuth();

  // Sync providers state with fetched data
  React.useEffect(() => {
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
        translations: newProvider.translations.map((translation) => ({
          language_id: translation.language_id,
          provider_name: translation.provider_name,
          notes: translation.notes || "",
        })),
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
        status: "Active", // Assumed since status isn't provided
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
      fetchProviders(); // Refresh providers after adding
      return createdProvider;
    } catch (error: any) {
      setErrorMessage(error.message || "createProviderError");
      setTimeout(() => setErrorMessage(null), 3000);
      throw error;
    }
  };

  const handleUpdateProvider = async (
    id: string,
    updatedProvider: Partial<WarrantyProvider>
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setProviders((prev) =>
        prev.map((provider) =>
          provider.id === id ? { ...provider, ...updatedProvider } : provider
        )
      );
      setSuccessMessage("providerUpdatedSuccess");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchProviders(); // Refresh providers after updating
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

  return (
    <div
      className="p-6 max-w-full overflow-x-hidden"
      dir={i18n.language === "ar" ? "rtl" : undefined}
    >
      <h1
        className="text-2xl font-bold text-gray-800 mb-6"
        aria-label={t("page.title")}
      >
        {t("page.title")}
      </h1>
      {/* Success/Error Messages */}
      {successMessage && (
        <div
          className="p-3 border border-green-500 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 font-medium mb-4"
          role="alert"
          aria-live="polite"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{t(successMessage)}</span>
        </div>
      )}
      {(error || errorMessage) && (
        <div
          className="p-3 border border-red-500 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 font-medium mb-4"
          role="alert"
          aria-live="polite"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{t(`errors.${error || errorMessage}`)}</span>
        </div>
      )}
      <WarrantyProvidersTable
        providers={providers}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onView={handleViewProvider}
        onAdd={() => setShowAddModal(true)}
      />
      {showAddModal && (
        <AddWarrantyProviderModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProvider}
        />
      )}
      {showViewModal && selectedProvider && (
        <WarrantyProviderModal
          provider={selectedProvider}
          onClose={() => setShowViewModal(false)}
          onUpdate={handleUpdateProvider}
        />
      )}
    </div>
  );
};

export default WarrantyProvidersPage;
