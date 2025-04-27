import React from "react";
import { useTranslation } from "react-i18next";
import AuthInput from "../../common/AuthInput";

interface Translation {
  language: string;
  name: string;
  description: string;
  terms: string;
}

interface Props {
  index: number;
  data: Translation;
  onChange: (updated: Translation) => void;
  onDelete: () => void;
  errors?: { [key: string]: string };
}

const TranslationGroup: React.FC<Props> = ({
  index,
  data,
  onChange,
  onDelete,
  errors,
}) => {
  const { t } = useTranslation("profile");
  const { t: tCommon } = useTranslation("common");

  const handleChange = (field: keyof Translation, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="mt-4 border rounded-lg p-4 bg-gray-50 space-y-4 relative">
      <h3 className="text-sm font-medium text-gray-700 ps-8">
        {t("translationTitle", { number: index + 1 })}
      </h3>
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-2 start-2 bg-white border border-gray-300 rounded-full p-1 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        aria-label={t("deleteTranslationAria", { number: index + 1 })}
      >
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div>
        <label
          htmlFor={`language-${index}`}
          className="block text-sm mb-2 font-normal"
        >
          {t("translationLanguage")}
        </label>
        <select
          id={`language-${index}`}
          value={data.language}
          onChange={(e) => handleChange("language", e.target.value)}
          className={`block w-full border-gray-300 rounded-lg sm:text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-normal ${
            errors?.language ? "border-red-500" : ""
          }`}
          aria-label={t("translationLanguage")}
        >
          <option value="">{t("selectLanguage")}</option>
          <option value="en">{tCommon("english")}</option>
          <option value="ar">{tCommon("arabic")}</option>
        </select>
        {errors?.language && (
          <p className="text-red-500 text-sm mt-1 font-medium">
            {t(errors.language)}
          </p>
        )}
      </div>
      <AuthInput
        id={`translatedName-${index}`}
        label={t("translatedName")}
        value={data.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors?.name ? t(errors.name) : undefined}
      />
      <AuthInput
        id={`companyDescription-${index}`}
        label={t("companyDescription")}
        value={data.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors?.description ? t(errors.description) : undefined}
      />
      <div>
        <label
          htmlFor={`terms-${index}`}
          className="block text-sm mb-2 font-normal"
        >
          {t("translatedTerms")}
        </label>
        <textarea
          id={`terms-${index}`}
          value={data.terms}
          onChange={(e) => handleChange("terms", e.target.value)}
          className={`w-full border-gray-300 rounded-lg p-3 sm:text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-normal ${
            errors?.terms ? "border-red-500" : ""
          }`}
          rows={4}
          aria-label={t("translatedTerms")}
        />
        {errors?.terms && (
          <p className="text-red-500 text-sm mt-1 font-medium">
            {t(errors.terms)}
          </p>
        )}
      </div>
    </div>
  );
};

export default TranslationGroup;
