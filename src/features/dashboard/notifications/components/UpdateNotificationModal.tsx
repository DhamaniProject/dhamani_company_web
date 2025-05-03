import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import AuthInput from "../../../auth/common/AuthInput";
import { Notification, Product } from "../types/types";

interface UpdateNotificationModalProps {
  notification: Notification;
  onClose: () => void;
  onUpdate: (updatedNotification: Partial<Notification>) => Promise<void>;
  products?: Product[];
}

const UpdateNotificationModal: React.FC<UpdateNotificationModalProps> = ({
  notification,
  onClose,
  onUpdate,
  products = [],
}) => {
  const { t } = useTranslation("notifications");
  const { t: tCommon } = useTranslation("common");
  const [updatedNotification, setUpdatedNotification] = useState({
    targetReceivers: notification.targetReceivers,
    productId: notification.productId,
    notificationType: notification.notificationType,
    messageTitle: { ...notification.messageTitle },
    messageContent: { ...notification.messageContent },
  });
  const [skuOrUpcFilter, setSkuOrUpcFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const validateForm = () => {
    if (
      !updatedNotification.targetReceivers ||
      !updatedNotification.notificationType ||
      !updatedNotification.messageTitle.en ||
      !updatedNotification.messageTitle.ar ||
      !updatedNotification.messageContent.en ||
      !updatedNotification.messageContent.ar ||
      (updatedNotification.targetReceivers === "product_users" &&
        !updatedNotification.productId)
    ) {
      setError("validationError");
      return false;
    }
    setError("");
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setShowConfirm(true);
  };

  const handleConfirmUpdate = async () => {
    setIsLoading(true);
    setError("");
    try {
      await onUpdate({
        id: notification.id,
        ...updatedNotification,
      });
      setShowConfirm(false);
      onClose();
    } catch (err: any) {
      setError(err.message || "updateError");
      setShowConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-10 right-10 z-50 w-full max-w-2xl">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto border border-gray-200"
        role="dialog"
        aria-labelledby="update-modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2
            id="update-modal-title"
            className="text-xl font-semibold text-gray-800"
          >
            {showConfirm ? t("modal.confirmUpdate") : t("modal.title_update")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={t("modal.close")}
            disabled={isLoading}
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
        {/* Error Message */}
        {error && (
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
            <span>{t(error)}</span>
          </div>
        )}
        {/* Form or Confirmation */}
        {showConfirm ? (
          <div className="grid gap-6">
            <h3 className="text-lg font-medium text-gray-700">
              {t("modal.confirmUpdate")}
            </h3>
            <p className="text-sm text-gray-600">{t("modal.updateConfirm")}</p>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={handleConfirmUpdate}
                className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                disabled={isLoading}
                aria-label={t("modal.submitUpdate")}
              >
                {t("modal.submitUpdate")}
              </Button>
              <Button
                onClick={() => setShowConfirm(false)}
                className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
                disabled={isLoading}
                aria-label={t("modal.cancel")}
              >
                {t("modal.cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="updateNotificationTarget"
                  className="block text-sm mb-2 font-normal"
                >
                  {t("modal.targetReceivers")}
                </label>
                <select
                  id="updateNotificationTarget"
                  value={updatedNotification.targetReceivers}
                  onChange={(e) =>
                    setUpdatedNotification({
                      ...updatedNotification,
                      targetReceivers: e.target.value as any,
                      productId:
                        e.target.value !== "product_users"
                          ? null
                          : updatedNotification.productId,
                    })
                  }
                  className="block w-full border-gray-300 rounded-lg sm:text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-normal"
                  aria-label={t("modal.targetReceivers")}
                  required
                >
                  <option value="">{t("modal.placeholder_target")}</option>
                  <option value="all_users">
                    {t("table.target_all_users")}
                  </option>
                  <option value="product_users">
                    {t("table.target_product_users")}
                  </option>
                  <option value="expiring_warranty_users">
                    {t("table.target_expiring_warranty_users")}
                  </option>
                  <option value="old_records_users">
                    {t("table.target_old_records_users")}
                  </option>
                </select>
              </div>
              {updatedNotification.targetReceivers === "product_users" && (
                <>
                  <div>
                    <label
                      htmlFor="updateNotificationProduct"
                      className="block text-sm mb-2 font-normal"
                    >
                      {t("modal.product")}
                    </label>
                    <select
                      id="updateNotificationProduct"
                      value={updatedNotification.productId || ""}
                      onChange={(e) =>
                        setUpdatedNotification({
                          ...updatedNotification,
                          productId: e.target.value || null,
                        })
                      }
                      className="block w-full border-gray-300 rounded-lg sm:text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-normal"
                      aria-label={t("modal.product")}
                      required
                    >
                      <option value="">{t("modal.placeholder_product")}</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {t("language") === "ar"
                            ? product.product_name.ar
                            : product.product_name.en}
                        </option>
                      ))}
                    </select>
                  </div>
                  <AuthInput
                    id="updateNotificationSkuOrUpc"
                    label={t("modal.skuOrUpc")}
                    placeholder={t("modal.placeholder_skuOrUpc")}
                    value={skuOrUpcFilter}
                    onChange={(e) => setSkuOrUpcFilter(e.target.value)}
                  />
                </>
              )}
              <div>
                <label
                  htmlFor="updateNotificationType"
                  className="block text-sm mb-2 font-normal"
                >
                  {t("modal.notificationType")}
                </label>
                <select
                  id="updateNotificationType"
                  value={updatedNotification.notificationType}
                  onChange={(e) =>
                    setUpdatedNotification({
                      ...updatedNotification,
                      notificationType: e.target.value as any,
                    })
                  }
                  className="block w-full border-gray-300 rounded-lg sm:text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-normal"
                  aria-label={t("modal.notificationType")}
                  required
                >
                  <option value="">{t("modal.placeholder_type")}</option>
                  <option value="WARRANTY_EXPIRY">
                    {t("table.type_WARRANTY_EXPIRY")}
                  </option>
                  <option value="PROMOTION">{t("table.type_PROMOTION")}</option>
                  <option value="GENERAL_ANNOUNCEMENT">
                    {t("table.type_GENERAL_ANNOUNCEMENT")}
                  </option>
                  <option value="RETURN_DEADLINE">
                    {t("table.type_RETURN_DEADLINE")}
                  </option>
                  <option value="EXCHANGE_PERIOD">
                    {t("table.type_EXCHANGE_PERIOD")}
                  </option>
                  <option value="RECALL">{t("table.type_RECALL")}</option>
                </select>
              </div>
              <AuthInput
                id="updateNotificationTitleEn"
                label={t("modal.messageTitleEn")}
                placeholder={t("modal.placeholder_title_en")}
                value={updatedNotification.messageTitle.en}
                onChange={(e) =>
                  setUpdatedNotification({
                    ...updatedNotification,
                    messageTitle: {
                      ...updatedNotification.messageTitle,
                      en: e.target.value,
                    },
                  })
                }
                required
              />
              <AuthInput
                id="updateNotificationTitleAr"
                label={t("modal.messageTitleAr")}
                placeholder={t("modal.placeholder_title_ar")}
                value={updatedNotification.messageTitle.ar}
                onChange={(e) =>
                  setUpdatedNotification({
                    ...updatedNotification,
                    messageTitle: {
                      ...updatedNotification.messageTitle,
                      ar: e.target.value,
                    },
                  })
                }
                required
              />
              <AuthInput
                id="updateNotificationContentEn"
                label={t("modal.messageContentEn")}
                placeholder={t("modal.placeholder_content_en")}
                value={updatedNotification.messageContent.en}
                onChange={(e) =>
                  setUpdatedNotification({
                    ...updatedNotification,
                    messageContent: {
                      ...updatedNotification.messageContent,
                      en: e.target.value,
                    },
                  })
                }
                type="textarea"
                required
              />
              <AuthInput
                id="updateNotificationContentAr"
                label={t("modal.messageContentAr")}
                placeholder={t("modal.placeholder_content_ar")}
                value={updatedNotification.messageContent.ar}
                onChange={(e) =>
                  setUpdatedNotification({
                    ...updatedNotification,
                    messageContent: {
                      ...updatedNotification.messageContent,
                      ar: e.target.value,
                    },
                  })
                }
                type="textarea"
                required
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={handleUpdate}
                className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                disabled={isLoading}
                aria-label={t("modal.submitUpdate")}
              >
                {t("modal.submitUpdate")}
              </Button>
              <Button
                onClick={onClose}
                className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
                disabled={isLoading}
                aria-label={t("modal.close")}
              >
                {t("modal.close")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateNotificationModal;
