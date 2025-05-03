// src/features/dashboard/records/components/VerifiedRecordModal.tsx

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import AuthInput from "../../../auth/common/AuthInput";
import { deactivateRecord } from "../services/recordService";

interface Record {
  record_id: string;
  product_image: string;
  start_date: string;
  is_active: boolean;
  warranty_end_date: string | null;
  exchange_end_date: string | null;
  return_end_date: string | null;
  first_name: string;
  last_name: string;
  user_phone_number: string;
  product_translations: Array<{
    language_id: number;
    product_name: string;
    product_description: string | null;
    terms_and_notes: string | null;
    product_translation_id: number;
    product_id: string;
    created_at: string;
    updated_at: string | null;
  }>;
  record_translations: Array<{
    language_id: number;
    notes: string | null;
    record_id: string;
    record_translation_id: number;
    created_at: string;
    updated_at: string | null;
  }>;
  product: string;
  customerName: string;
  customerPhone: string;
  date: string;
  type: string[] | null;
  status: "active" | "inactive";
  verificationCode: string;
  warrantyDaysRemaining: number;
  returnDaysRemaining: number;
  exchangeDaysRemaining: number;
}

interface VerifiedRecordModalProps {
  record: Record;
  onClose: () => void;
  onDeactivateSuccess?: () => void;
}

const VerifiedRecordModal: React.FC<VerifiedRecordModalProps> = ({
  record,
  onClose,
  onDeactivateSuccess,
}) => {
  const { t, i18n } = useTranslation("records");
  const { t: tCommon } = useTranslation("common");
  const [deactivationCode, setDeactivationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const currentLang = i18n.language === "ar" ? 2 : 1;
  const productTranslation = record.product_translations.find(
    (t) => t.language_id === currentLang
  );
  const recordTranslation = record.record_translations.find(
    (t) => t.language_id === currentLang
  );

  const handleDeactivate = async () => {
    setShowConfirmDialog(true);
  };

  const confirmDeactivate = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);
    setError("");
    try {
      await deactivateRecord(deactivationCode);
      if (onDeactivateSuccess) {
        onDeactivateSuccess();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "verifiedModal.error");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDeactivate = () => {
    setShowConfirmDialog(false);
  };

  useEffect(() => {
    console.log("VerifiedRecordModal - Current language:", i18n.language);
    console.log(
      "VerifiedRecordModal - Translated verifiedModal.title:",
      t("verifiedModal.title")
    );
    console.log(
      "VerifiedRecordModal - Translated error (if any):",
      error ? t(error) : "No error"
    );
  }, [i18n.language, error, t]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-200"
        role="dialog"
        aria-labelledby="verified-modal-title"
      >
        {showConfirmDialog && (
          <div className="absolute inset-0 z-60 flex items-center justify-center">
            <div
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200"
              role="dialog"
              aria-labelledby="confirm-modal-title"
            >
              <h3
                id="confirm-modal-title"
                className="text-lg font-semibold text-gray-800 mb-4"
              >
                {t("verifiedModal.confirmDeactivationTitle")}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {t("verifiedModal.confirmDeactivationMessage")}
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  onClick={cancelDeactivate}
                  className="py-2 px-4 text-sm font-medium rounded-lg border bg-gray-200 hover:bg-gray-300"
                  aria-label={t("verifiedModal.cancel")}
                >
                  {t("verifiedModal.cancel")}
                </Button>
                <Button
                  onClick={confirmDeactivate}
                  className="py-2 px-4 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700"
                  aria-label={t("verifiedModal.deactivate")}
                >
                  {t("verifiedModal.deactivate")}
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2
            id="verified-modal-title"
            className="text-xl font-semibold text-gray-800"
          >
            {t("verifiedModal.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={t("verifiedModal.close")}
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
            <span>{t(`verifiedModal.${error}`)}</span>
          </div>
        )}
        <div className="grid gap-4">
          <h3 className="text-lg font-medium text-gray-700">
            {t("verifiedModal.title")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("verifiedModal.product")}
              </strong>
              <p className="text-sm text-gray-800">{record.product}</p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("verifiedModal.customerName")}
              </strong>
              <p className="text-sm text-gray-800">{record.customerName}</p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("verifiedModal.customerPhone")}
              </strong>
              <p className="text-sm text-gray-800">{record.customerPhone}</p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("verifiedModal.startDate")}
              </strong>
              <p className="text-sm text-gray-800">{record.date}</p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("verifiedModal.type")}
              </strong>
              <p className="text-sm text-gray-800">
                {record.type && record.type.length > 0
                  ? record.type.map((type) => t(`table.${type}`)).join(", ")
                  : t("table.noTypes")}
              </p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("verifiedModal.status")}
              </strong>
              <p
                className={`text-sm ${
                  record.status === "active"
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {t(`table.status_${record.status}`)}
              </p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("verifiedModal.productDescription")}
              </strong>
              <p className="text-sm text-gray-800">
                {productTranslation?.product_description ||
                  tCommon("notAvailable")}
              </p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("verifiedModal.termsAndNotes")}
              </strong>
              <p className="text-sm text-gray-800">
                {productTranslation?.terms_and_notes || tCommon("notAvailable")}
              </p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("verifiedModal.notes")}
              </strong>
              <p className="text-sm text-gray-800">
                {recordTranslation?.notes || tCommon("notAvailable")}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {t("verifiedModal.warrantyDetails")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("verifiedModal.warrantyEndDate")}
                </strong>
                <p className="text-sm text-gray-800">
                  {record.warranty_end_date
                    ? new Date(record.warranty_end_date).toLocaleDateString()
                    : tCommon("notAvailable")}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("verifiedModal.warrantyDaysRemaining")}
                </strong>
                <p className="text-sm text-gray-800">
                  {record.warrantyDaysRemaining}
                </p>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">
              {t("verifiedModal.exchangeDetails")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("verifiedModal.exchangeEndDate")}
                </strong>
                <p className="text-sm text-gray-800">
                  {record.exchange_end_date
                    ? new Date(record.exchange_end_date).toLocaleDateString()
                    : tCommon("notAvailable")}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("verifiedModal.exchangeDaysRemaining")}
                </strong>
                <p className="text-sm text-gray-800">
                  {record.exchangeDaysRemaining}
                </p>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">
              {t("verifiedModal.returnDetails")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("verifiedModal.returnEndDate")}
                </strong>
                <p className="text-sm text-gray-800">
                  {record.return_end_date
                    ? new Date(record.return_end_date).toLocaleDateString()
                    : tCommon("notAvailable")}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("verifiedModal.returnDaysRemaining")}
                </strong>
                <p className="text-sm text-gray-800">
                  {record.returnDaysRemaining}
                </p>
              </div>
            </div>
          </div>
        </div>
        {record.status === "active" && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              {t("verifiedModal.deactivationSection")}
            </h3>
            <AuthInput
              id="deactivationCode"
              label={t("verifiedModal.deactivationCode")}
              placeholder={t("verifiedModal.deactivationCodePlaceholder")}
              value={deactivationCode}
              onChange={(e) => setDeactivationCode(e.target.value)}
              disabled={isLoading}
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={handleDeactivate}
                className="py-2 px-4 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700"
                disabled={!deactivationCode || isLoading}
                aria-label={t("verifiedModal.deactivate")}
              >
                {t("verifiedModal.deactivate")}
              </Button>
              <Button
                onClick={onClose}
                className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
                disabled={isLoading}
                aria-label={t("verifiedModal.close")}
              >
                {t("verifiedModal.close")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifiedRecordModal;
