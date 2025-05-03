// src/features/dashboard/records/components/VerifyRecordModal.tsx

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import AuthInput from "../../../auth/common/AuthInput";
import { verifyRecord } from "../services/recordService";
import { Record } from "../types/types";

interface VerifyRecordModalProps {
  onClose: () => void;
  onVerify: (record: Record) => void;
}

const VerifyRecordModal: React.FC<VerifyRecordModalProps> = ({
  onClose,
  onVerify,
}) => {
  const { t, i18n } = useTranslation("records");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleVerify = async () => {
    setError("");
    setIsLoading(true);
    try {
      const response = await verifyRecord(verificationCode);
      const item = response.data;

      const enProductTranslation = item.product_translations.find(
        (t: any) => t.language_id === 1
      );
      const arProductTranslation = item.product_translations.find(
        (t: any) => t.language_id === 2
      );
      const currentLang = i18n.language === "ar" ? 2 : 1;
      const productTranslation =
        item.product_translations.find(
          (t: any) => t.language_id === currentLang
        ) || enProductTranslation;

      const now = new Date();
      const eligibleTypes: string[] = [];

      if (!item.is_active) {
      } else {
        if (item.warranty_end_date) {
          const warrantyEndDate = new Date(item.warranty_end_date);
          if (now <= warrantyEndDate) {
            eligibleTypes.push("warranty");
          }
        }
        if (item.exchange_end_date) {
          const exchangeEndDate = new Date(item.exchange_end_date);
          if (now <= exchangeEndDate) {
            eligibleTypes.push("exchange");
          }
        }
        if (item.return_end_date) {
          const returnEndDate = new Date(item.return_end_date);
          if (now <= returnEndDate) {
            eligibleTypes.push("return");
          }
        }
      }

      const type = eligibleTypes.length > 0 ? eligibleTypes : null;

      const warrantyDaysRemaining = item.warranty_end_date
        ? Math.max(
            Math.ceil(
              (new Date(item.warranty_end_date).getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            0
          )
        : 0;
      const exchangeDaysRemaining = item.exchange_end_date
        ? Math.max(
            Math.ceil(
              (new Date(item.exchange_end_date).getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            0
          )
        : 0;
      const returnDaysRemaining = item.return_end_date
        ? Math.max(
            Math.ceil(
              (new Date(item.return_end_date).getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            0
          )
        : 0;

      const mappedRecord: Record = {
        ...item,
        product: productTranslation?.product_name || "Unknown",
        customerName: `${item.first_name} ${item.last_name}`,
        customerPhone: item.user_phone_number,
        date: new Date(item.start_date).toLocaleDateString(),
        type,
        status: item.is_active ? "active" : "inactive",
        verificationCode: verificationCode,
        warrantyDaysRemaining,
        returnDaysRemaining,
        exchangeDaysRemaining,
      };

      onVerify(mappedRecord);
    } catch (err: any) {
      setError(err.message || "verifyModal.error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("VerifyRecordModal - Current language:", i18n.language);
    console.log(
      "VerifyRecordModal - Translated verifyModal.title:",
      t("verifyModal.title")
    );
    console.log(
      "VerifyRecordModal - Translated error (if any):",
      error ? t(error) : "No error"
    );
  }, [i18n.language, error, t]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200"
        role="dialog"
        aria-labelledby="verify-modal-title"
      >
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
            <span>{t(`verifyModal.${error}`)}</span>
          </div>
        )}
        <AuthInput
          id="verificationCode"
          label={t("verifyModal.verificationCode")}
          placeholder={t("verifyModal.verificationCodePlaceholder")}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          disabled={isLoading}
        />
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
