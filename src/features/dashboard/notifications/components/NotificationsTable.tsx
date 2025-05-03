import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import NotificationModal from "./NotificationModal";
import AddNotificationModal from "./AddNotificationModal";
import { useNotificationsTable } from "../hooks/useNotificationsTable";
import { Notification } from "../types/types";

const NotificationsTable: React.FC = () => {
  const { t, i18n } = useTranslation("notifications");
  const { t: tCommon } = useTranslation("common");
  const {
    notifications,
    products,
    isLoading,
    successMessage,
    error,
    fetchNotifications,
    createNotification,
    totalNotifications,
    currentPage,
    setCurrentPage,
    fetchProducts,
  } = useNotificationsTable();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const limit = 10;

  useEffect(() => {
    console.log(
      "NotificationsTable useEffect triggered with page:",
      currentPage
    );
    fetchNotifications(limit, (currentPage - 1) * limit);
  }, [fetchNotifications, currentPage]);

  const totalPages = Math.ceil(totalNotifications / limit);

  const handlePageChange = (page: number) => {
    console.log("Changing page to:", page);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Log notifications for debugging
  console.log("Rendering notifications:", notifications);

  // Fallback UI for missing company_id
  if (error === "noCompanyId") {
    return (
      <div className="p-6 text-center text-gray-500">
        {t("errors.noCompanyId")}
      </div>
    );
  }

  const currentPageNumber = currentPage + 1;
  const paginationText = `${t("pagination.pageStart")} ${currentPageNumber} ${t(
    "pagination.pageMiddle"
  )} ${totalPages}`;

  return (
    <div
      className="max-w-full"
      dir={i18n.language === "ar" ? "rtl" : undefined}
    >
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
                    onClick={() => setShowAddModal(true)}
                    disabled={isLoading}
                    className="w-24 py-1 px-2 text-م font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] whitespace-nowrap truncate min-w-fit"
                    aria-label={t("table.addNotification")}
                  >
                    {t("table.addNotification")}
                  </Button>
                </div>
              </div>
              {/* Messages */}
              {successMessage && (
                <div
                  className="p-3 border border-green-500 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 font-medium m-4"
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
                  <span>{t(`success.${successMessage}`)}</span>
                </div>
              )}
              {error && error !== "noCompanyId" && (
                <div
                  className="p-3 border border-red-500 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 font-medium m-4"
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
                  <span>{t(`errors.${error}`)}</span>
                </div>
              )}
              {/* Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.notificationType")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.messageTitle")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.messageContent")}
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
                  {notifications.length > 0 ? (
                    notifications
                      .map((notification) => {
                        if (!notification || !notification.notificationType) {
                          console.warn(
                            "Skipping invalid notification:",
                            notification
                          );
                          return null;
                        }
                        return (
                          <tr
                            key={notification.id}
                            onClick={() =>
                              setSelectedNotification(notification)
                            }
                            className="cursor-pointer hover:bg-gray-50"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setSelectedNotification(notification);
                              }
                            }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-800 font-normal">
                                {t(
                                  `table.type_${notification.notificationType}`
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-800 font-normal">
                                {i18n.language === "ar"
                                  ? notification.messageTitle.ar
                                  : notification.messageTitle.en}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-800 font-normal">
                                {i18n.language === "ar"
                                  ? notification.messageContent.ar
                                  : notification.messageContent.en}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-800 font-normal">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                      .filter((row): row is JSX.Element => row !== null)
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {isLoading
                          ? tCommon("loading")
                          : t("table.noNotifications")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
                  <p className="text-sm text-gray-600">{paginationText}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={currentPage === 0 || isLoading}
                      className="py-2 px-4 text-sm font-medium rounded-lg bg-primary hover:bg-primary-hover"
                      aria-label={t("pagination.previous")}
                    >
                      {t("pagination.previous")}
                    </Button>
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages - 1)
                        )
                      }
                      disabled={currentPage === totalPages - 1 || isLoading}
                      className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
                      aria-label={t("pagination.next")}
                    >
                      {t("pagination.next")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      {showAddModal && (
        <AddNotificationModal
          onClose={() => setShowAddModal(false)}
          onAdd={createNotification}
          products={products}
          fetchProducts={fetchProducts}
        />
      )}
      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          products={products}
        />
      )}
    </div>
  );
};

export default NotificationsTable;
