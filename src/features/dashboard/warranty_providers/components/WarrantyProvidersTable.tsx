import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import { WarrantyProvider } from "../types/types";

interface WarrantyProvidersTableProps {
  providers: WarrantyProvider[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (provider: WarrantyProvider) => void;
  onAdd: () => void;
}

const WarrantyProvidersTable: React.FC<WarrantyProvidersTableProps> = ({
  providers,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onAdd,
}) => {
  const { t, i18n } = useTranslation("warrantyProviders");
  const { t: tCommon } = useTranslation("common");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden font-arabic">
            {/* Header */}
            <div className="px-6 py-4 flex flex-row items-center justify-between border-b border-gray-200 gap-4 flex-nowrap">
              <h2 className="text-xl font-semibold text-gray-800 truncate">
                {t("table.title")}
              </h2>
              <div>
                <Button
                  onClick={onAdd}
                  disabled={isLoading}
                  className="w-24 py-1 px-2 text-xs font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] whitespace-nowrap truncate min-w-fit"
                  aria-label={t("table.addProvider")}
                >
                  {t("table.addProvider")}
                </Button>
              </div>
            </div>
            {/* Table */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-start">
                    <span className="text-xs font-semibold uppercase text-gray-600">
                      {t("table.name")}
                    </span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <span className="text-xs font-semibold uppercase text-gray-600">
                      {t("table.email")}
                    </span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <span className="text-xs font-semibold uppercase text-gray-600">
                      {t("table.phone")}
                    </span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <span className="text-xs font-semibold uppercase text-gray-600">
                      {t("table.createdAt")}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {providers.length > 0 ? (
                  providers.map((provider) => (
                    <tr
                      key={provider.id}
                      onClick={() => onView(provider)}
                      className="cursor-pointer hover:bg-gray-50"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          onView(provider);
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-800 font-normal">
                          {provider.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-800 font-normal">
                          {provider.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-800 font-normal">
                          {provider.phone}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-800 font-normal">
                          {formatDate(provider.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {isLoading ? tCommon("loading") : t("table.noProviders")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyProvidersTable;
