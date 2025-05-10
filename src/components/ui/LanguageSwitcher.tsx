// src/components/LanguageSwitcher.tsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from '../../i18n';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation("common");
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);


  useEffect(() => {
    console.log("Current language:", i18n.language);
    setCurrentLanguage(i18n.language);
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div
      className="flex gap-2 bg-white rounded-lg p-1 shadow-sm"
      role="group"
      aria-label={t("languageSwitcher")}
    >
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          currentLanguage === "en"
            ? "bg-[var(--color-primary)] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        aria-label={t("switchToEnglish")}
        aria-current={currentLanguage === "en" ? "true" : "false"}
      >
        {t("english")}
      </button>
      <button
        type="button"
        onClick={() => changeLanguage("ar")}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          currentLanguage === "ar"
            ? "bg-[var(--color-primary)] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        aria-label={t("switchToArabic")}
        aria-current={currentLanguage === "ar" ? "true" : "false"}
      >
        {t("arabic")}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
