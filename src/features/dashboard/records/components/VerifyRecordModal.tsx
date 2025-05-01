// src/features/dashboard/records/components/VerifyRecordModal.tsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import AuthInput from "../../../auth/common/AuthInput";
import { Record } from "../types/types"; // Import the correct Record type

interface VerifyRecordModalProps {
  onClose: () => void;
  onVerify: (record: Record) => void;
  records: Record[];
}

const VerifyRecordModal: React.FC<VerifyRecordModalProps> = ({
  onClose,
  onVerify,
  records,
}) => {
  const { t } = useTranslation("records");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setError("");
    setIsLoading(true);
    try {
      const record = records.find(
        (r) => r.verificationCode === verificationCode // Use record_id as verificationCode
      );
      if (!record) {
        setError("invalidVerificationCode");
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate verification
      onVerify(record);
    } catch (err: any) {
      setError("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200"
        role="dialog"
        aria-labelledby="verify-modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2
            id="verify-modal-title"
            className="text-xl font-semibold text-gray-800"
          >
            {t("verifyModal.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={t("verifyModal.close")}
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
        {/* Verification Code Input */}
        <AuthInput
          id="verificationCode"
          label={t("verifyModal.verificationCode")}
          placeholder={t("verifyModal.verificationCodePlaceholder")}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          disabled={isLoading}
        />
        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            onClick={handleVerify}
            className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
            disabled={!verificationCode || isLoading}
            aria-label={t("verifyModal.submitVerification")}
          >
            {t("verifyModal.submitVerification")}
          </Button>
          <Button
            onClick={onClose}
            className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
            disabled={isLoading}
            aria-label={t("verifyModal.close")}
          >
            {t("verifyModal.close")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyRecordModal;
