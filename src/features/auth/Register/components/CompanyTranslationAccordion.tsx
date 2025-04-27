import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import TranslationGroup from "./TranslationGroup";
import AddTranslationButton from "./AddTranslationButton";

interface Translation {
  language: string;
  name: string;
  description: string;
  terms: string;
}

interface Props {
  translations: Translation[];
  onUpdateTranslations: (translations: Translation[]) => void;
  onAddTranslation: () => void;
  onDeleteTranslation: (index: number) => void;
  errors?: Array<{ [key: string]: string }>;
}

const CompanyTranslationAccordion: React.FC<Props> = ({
  translations,
  onUpdateTranslations,
  onAddTranslation,
  onDeleteTranslation,
  errors,
}) => {
  const { t } = useTranslation("profile");
  const [show, setShow] = useState(false);

  const handleUpdate = (index: number, data: Translation) => {
    const updated = [...translations];
    updated[index] = data;
    onUpdateTranslations(updated);
  };

  return (
    <div className="border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="w-full flex justify-between items-center px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 transition-all"
        aria-expanded={show}
        aria-controls="translation-content"
      >
        {show ? t("hideTranslations") : t("addTranslations")}
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${
            show ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {show && (
        <div id="translation-content" className="p-4 bg-white">
          {translations.map((t, index) => (
            <TranslationGroup
              key={index}
              index={index}
              data={t}
              onChange={(data) => handleUpdate(index, data)}
              onDelete={() => onDeleteTranslation(index)}
              errors={errors?.[index]}
            />
          ))}
          {translations.length < 2 && (
            <AddTranslationButton onClick={onAddTranslation} />
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyTranslationAccordion;
