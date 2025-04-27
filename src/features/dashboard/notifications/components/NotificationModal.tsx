import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import { Notification, Product } from "../types/types";

interface NotificationModalProps {
  notification: Notification;
  onClose: () => void;
  products?: Product[]; // Optional, for displaying product name
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  onClose,
  products = [],
}) => {
  const { t, i18n } = useTranslation("notifications");
  const { t: tCommon } = useTranslation("common");

  const product = products.find((p) => p.id === notification.productId);

  return (
    <div className="fixed top-10 right-10 z-50 w-full max-w-2xl">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto border border-gray-200"
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
            {t("modal.title_view")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={t("modal.close")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* Details */}
        <div className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.targetReceivers")}
              </strong>
              <p className="text-sm text-gray-800">
                {t(`table.target_${notification.targetReceivers}`)}
              </p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.notificationType")}
              </strong>
              <p className="text-sm text-gray-800">
                {t(`table.type_${notification.notificationType}`)}
              </p>
            </div>
            {notification.productId && product && (
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.product")}
                </strong>
                <p className="text-sm text-gray-800">
                  {i18n.language === "ar"
                    ? product.product_name.ar
                    : product.product_name.en}
                </p>
              </div>
            )}
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.messageTitleEn")}
              </strong>
              <p className="text-sm text-gray-800">
                {notification.messageTitle.en}
              </p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.messageTitleAr")}
              </strong>
              <p className="text-sm text-gray-800">
                {notification.messageTitle.ar}
              </p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.messageContentEn")}
              </strong>
              <p className="text-sm text-gray-800">
                {notification.messageContent.en}
              </p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.messageContentAr")}
              </strong>
              <p className="text-sm text-gray-800">
                {notification.messageContent.ar}
              </p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.createdAt")}
              </strong>
              <p className="text-sm text-gray-800">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button
              onClick={onClose}
              className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
              aria-label={t("modal.close")}
            >
              {t("modal.close")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
