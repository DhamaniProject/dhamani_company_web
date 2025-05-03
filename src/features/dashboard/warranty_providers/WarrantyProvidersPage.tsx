import React from "react";
import { useTranslation } from "react-i18next";
import WarrantyProvidersTable from "./components/WarrantyProvidersTable";
import AddWarrantyProviderModal from "./components/AddWarrantyProviderModal";
import WarrantyProviderModal from "./components/WarrantyProviderModal";
import StatusMessage from "./components/StatusMessage";
import { useWarrantyProviderState } from "./hooks/useWarrantyProviderState";

const WarrantyProvidersPage: React.FC = () => {
  const { t, i18n } = useTranslation("warrantyProviders");
  const {
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
  } = useWarrantyProviderState();

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
      
      {successMessage && (
        <StatusMessage type="success" message={successMessage} />
      )}
      {(error || errorMessage) && (
        <StatusMessage type="error" message={`errors.${error || errorMessage}`} />
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
