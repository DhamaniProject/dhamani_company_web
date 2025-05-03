// src/features/dashboard/records/components/RecordModal.tsx

import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";

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

interface RecordModalProps {
  record: Record;
  onClose: () => void;
}

const RecordModal: React.FC<RecordModalProps> = ({ record, onClose }) => {
  const { t, i18n } = useTranslation("records");
  const { t: tCommon } = useTranslation("common");

  const currentLang = i18n.language === "ar" ? 2 : 1;
  const productTranslation = record.product_translations.find(
    (t) => t.language_id === currentLang
  );
  const recordTranslation = record.record_translations.find(
    (t) => t.language_id === currentLang
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-200"
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
            {t("modal.title")}
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
        {/* Record Details */}
        <div className="grid gap-4">
          <h3 className="text-lg font-medium text-gray-700">
            {t("modal.title")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.product")}
              </strong>
              <p className="text-sm text-gray-800">{record.product}</p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.customerName")}
              </strong>
              <p className="text-sm text-gray-800">{record.customerName}</p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.customerPhone")}
              </strong>
              <p className="text-sm text-gray-800">{record.customerPhone}</p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.startDate")}
              </strong>
              <p className="text-sm text-gray-800">{record.date}</p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.type")}
              </strong>
              <p className="text-sm text-gray-800">
                {record.type && record.type.length > 0
                  ? record.type.map((type) => t(`table.${type}`)).join(", ")
                  : t("table.noTypes")}
              </p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.status")}
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
                {t("modal.productDescription")}
              </strong>
              <p className="text-sm text-gray-800">
                {productTranslation?.product_description ||
                  tCommon("notAvailable")}
              </p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.termsAndNotes")}
              </strong>
              <p className="text-sm text-gray-800">
                {productTranslation?.terms_and_notes || tCommon("notAvailable")}
              </p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.notes")}
              </strong>
              <p className="text-sm text-gray-800">
                {recordTranslation?.notes || tCommon("notAvailable")}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {t("modal.warrantyDetails")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.warrantyEndDate")}
                </strong>
                <p className="text-sm text-gray-800">
                  {record.warranty_end_date
                    ? new Date(record.warranty_end_date).toLocaleDateString()
                    : tCommon("notAvailable")}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.warrantyDaysRemaining")}
                </strong>
                <p className="text-sm text-gray-800">
                  {record.warrantyDaysRemaining}
                </p>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">
              {t("modal.exchangeDetails")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.exchangeEndDate")}
                </strong>
                <p className="text-sm text-gray-800">
                  {record.exchange_end_date
                    ? new Date(record.exchange_end_date).toLocaleDateString()
                    : tCommon("notAvailable")}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.exchangeDaysRemaining")}
                </strong>
                <p className="text-sm text-gray-800">
                  {record.exchangeDaysRemaining}
                </p>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">
              {t("modal.returnDetails")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.returnEndDate")}
                </strong>
                <p className="text-sm text-gray-800">
                  {record.return_end_date
                    ? new Date(record.return_end_date).toLocaleDateString()
                    : tCommon("notAvailable")}
                </p>
              </div>
              <div>
                <strong className="text-sm font-medium text-gray-600">
                  {t("modal.returnDaysRemaining")}
                </strong>
                <p className="text-sm text-gray-800">
                  {record.returnDaysRemaining}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Buttons */}
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
  );
};

export default RecordModal;
