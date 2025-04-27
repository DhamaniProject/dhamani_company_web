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
  } = useNotificationsTable();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
                  <span>{t(successMessage)}</span>
                </div>
              )}
              {error && (
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
                  <span>{t(error)}</span>
                </div>
              )}
              {/* Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.targetReceivers")}
                      </span>
                    </th>
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
                        {t("table.createdAt")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <tr
                        key={notification.id}
                        onClick={() => setSelectedNotification(notification)}
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
                            {t(`table.target_${notification.targetReceivers}`)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {t(`table.type_${notification.notificationType}`)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {i18n.language === "ar"
                              ? notification.messageTitle.ar
                              : notification.messageTitle.en}
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
                    ))
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
