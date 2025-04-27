import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import AuthInput from "../../../auth/common/AuthInput";
import { Notification, Product } from "../types/types";

interface AddNotificationModalProps {
  onClose: () => void;
  onAdd: (newNotification: Partial<Notification>) => Promise<void>;
  products?: Product[];
}

const AddNotificationModal: React.FC<AddNotificationModalProps> = ({
  onClose,
  onAdd,
  products = [],
}) => {
  const { t } = useTranslation("notifications");
  const { t: tCommon } = useTranslation("common");
  const [newNotification, setNewNotification] = useState({
    targetReceivers: "" as
      | "all_users"
      | "product_users"
      | "expiring_warranty_users"
      | "old_records_users",
    productId: null as string | null,
    notificationType: "" as
      | "WARRANTY_EXPIRY"
      | "PROMOTION"
      | "GENERAL_ANNOUNCEMENT"
      | "RETURN_DEADLINE"
      | "EXCHANGE_PERIOD"
      | "RECALL",
    messageTitle: { en: "", ar: "" },
    messageContent: { en: "", ar: "" },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setIsLoading(true);
    setError("");
    try {
      await onAdd(newNotification);
      onClose();
    } catch (err: any) {
      setError(err.message || "createError");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-10 right-10 z-50 w-full max-w-2xl">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto border border-gray-200"
        role="dialog"
        aria-labelledby="add-modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2
            id="add-modal-title"
            className="text-xl font-semibold text-gray-800"
          >
            {t("addModal.title")}
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
        {/* Form */}
        <div className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="newNotificationTarget"
                className="block text-sm mb-2 font-normal"
              >
                {t("addModal.targetReceivers")}
              </label>
              <select
                id="newNotificationTarget"
                value={newNotification.targetReceivers}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    targetReceivers: e.target.value as any,
                    productId:
                      e.target.value !== "product_users"
                        ? null
                        : newNotification.productId,
                  })
                }
                className="block w-full border-gray-300 rounded-lg sm:text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-normal"
                aria-label={t("addModal.targetReceivers")}
                required
              >
                <option value="">{t("addModal.placeholder_target")}</option>
                <option value="all_users">{t("table.target_all_users")}</option>
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
            {newNotification.targetReceivers === "product_users" && (
              <div>
                <label
                  htmlFor="newNotificationProduct"
                  className="block text-sm mb-2 font-normal"
                >
                  {t("addModal.product")}
                </label>
                <select
                  id="newNotificationProduct"
                  value={newNotification.productId || ""}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      productId: e.target.value || null,
                    })
                  }
                  className="block w-full border-gray-300 rounded-lg sm:text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-normal"
                  aria-label={t("addModal.product")}
                  required
                >
                  <option value="">{t("addModal.placeholder_product")}</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {t("language") === "ar"
                        ? product.product_name.ar
                        : product.product_name.en}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label
                htmlFor="newNotificationType"
                className="block text-sm mb-2 font-normal"
              >
                {t("addModal.notificationType")}
              </label>
              <select
                id="newNotificationType"
                value={newNotification.notificationType}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    notificationType: e.target.value as any,
                  })
                }
                className="block w-full border-gray-300 rounded-lg sm:text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-normal"
                aria-label={t("addModal.notificationType")}
                required
              >
                <option value="">{t("addModal.placeholder_type")}</option>
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
              id="newNotificationTitleEn"
              label={t("addModal.messageTitleEn")}
              placeholder={t("addModal.placeholder_title_en")}
              value={newNotification.messageTitle.en}
              onChange={(e) =>
                setNewNotification({
                  ...newNotification,
                  messageTitle: {
                    ...newNotification.messageTitle,
                    en: e.target.value,
                  },
                })
              }
              required
            />
            <AuthInput
              id="newNotificationTitleAr"
              label={t("addModal.messageTitleAr")}
              placeholder={t("addModal.placeholder_title_ar")}
              value={newNotification.messageTitle.ar}
              onChange={(e) =>
                setNewNotification({
                  ...newNotification,
                  messageTitle: {
                    ...newNotification.messageTitle,
                    ar: e.target.value,
                  },
                })
              }
              required
            />
            <AuthInput
              id="newNotificationContentEn"
              label={t("addModal.messageContentEn")}
              placeholder={t("addModal.placeholder_content_en")}
              value={newNotification.messageContent.en}
              onChange={(e) =>
                setNewNotification({
                  ...newNotification,
                  messageContent: {
                    ...newNotification.messageContent,
                    en: e.target.value,
                  },
                })
              }
              type="textarea"
              required
            />
            <AuthInput
              id="newNotificationContentAr"
              label={t("addModal.messageContentAr")}
              placeholder={t("addModal.placeholder_content_ar")}
              value={newNotification.messageContent.ar}
              onChange={(e) =>
                setNewNotification({
                  ...newNotification,
                  messageContent: {
                    ...newNotification.messageContent,
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
              onClick={handleAdd}
              className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
              disabled={isLoading}
              aria-label={t("addModal.submit")}
            >
              {t("addModal.submit")}
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
      </div>
    </div>
  );
};

export default AddNotificationModal;
