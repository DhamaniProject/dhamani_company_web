// src/features/auth/register/components/AddTranslationButton.tsx:
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  onClick: () => void;
}

const AddTranslationButton: React.FC<Props> = ({ onClick }) => {
  const { t } = useTranslation("register");

  return (
    <div className="mt-3 text-end">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-x-2 text-sm text-[var(--color-primary)] hover:underline font-medium"
        aria-label={t("addTranslationAria")}
      >
        <span className="text-xl font-bold">+</span> {t("addTranslation")}
      </button>
    </div>
  );
};

export default AddTranslationButton;
