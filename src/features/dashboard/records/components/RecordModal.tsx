import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import AuthInput from "../../../auth/common/AuthInput";

interface Record {
  id: string;
  product: string;
  customerName: string;
  customerPhone: string;
  date: string;
  type: "warranty" | "exchange" | "return";
  status: "active" | "inactive";
  verificationCode: string;
  warrantyDaysRemaining: number;
  returnDaysRemaining: number;
  exchangeDaysRemaining: number;
}

interface RecordModalProps {
  record: Record;
  onClose: () => void;
  onVerify: (id: string) => Promise<void>;
  onDeactivate: (id: string, code: string) => Promise<void>;
}

const RecordModal: React.FC<RecordModalProps> = ({
  record,
  onClose,
  onVerify,
  onDeactivate,
}) => {
  const { t } = useTranslation("records");
  const { t: tCommon } = useTranslation("common");
  const [deactivationCode, setDeactivationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeactivate = async () => {
    setIsLoading(true);
    setError("");
    try {
      await onDeactivate(record.id, deactivationCode);
      setDeactivationCode("");
      onClose();
    } catch (err: any) {
      setError(err.message || "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setError("");
    try {
      await onVerify(record.id);
      onClose();
    } catch (err: any) {
      setError("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto border border-gray-200"
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
                {t("modal.date")}
              </strong>
              <p className="text-sm text-gray-800">{record.date}</p>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-600">
                {t("modal.type")}
              </strong>
              <p className="text-sm text-gray-800">
                {t(`table.${record.type}`)}
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
                {t("modal.verificationCode")}
              </strong>
              <p className="text-sm text-gray-800">{record.verificationCode}</p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {t("modal.warrantyDaysRemaining")}
            </h3>
            <p className="text-sm text-gray-800">
              {record.warrantyDaysRemaining}
            </p>
            <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">
              {t("modal.returnDaysRemaining")}
            </h3>
            <p className="text-sm text-gray-800">
              {record.returnDaysRemaining}
            </p>
            <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">
              {t("modal.exchangeDaysRemaining")}
            </h3>
            <p className="text-sm text-gray-800">
              {record.exchangeDaysRemaining}
            </p>
          </div>
        </div>
        {/* Deactivation Section */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            {t("modal.deactivationSection")}
          </h3>
          <AuthInput
            id="deactivationCode"
            label={t("modal.deactivationCode")}
            placeholder={t("modal.deactivationCodePlaceholder")}
            value={deactivationCode}
            onChange={(e) => setDeactivationCode(e.target.value)}
            disabled={record.status === "inactive" || isLoading}
          />
          <div className="mt-4 flex justify-end gap-3">
            <Button
              onClick={handleDeactivate}
              className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
              disabled={
                record.status === "inactive" || !deactivationCode || isLoading
              }
              aria-label={t("modal.submitDeactivation")}
            >
              {t("modal.submitDeactivation")}
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

export default RecordModal;
