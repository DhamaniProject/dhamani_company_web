import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AuthInput from "../../../auth/common/AuthInput";
import CompanyLogoUploader from "../../../auth/Register/components/CompanyLogoUploader";
import { useProfileForm } from "../hooks/useProfileForm";
import Button from "../../../../components/ui/Button";

interface ProfileFormProps {
  currentLogoUrl: string | null;
  onLogoUrlChange: (url: string | null) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  currentLogoUrl,
  onLogoUrlChange
}) => {
  const { t } = useTranslation("profile");
  const { t: tCommon } = useTranslation("common");
  const companyNameInputRef = useRef<HTMLInputElement>(null);
  const {
    formData,
    errors,
    isLoading,
    isInitialLoading,
    apiError,
    updateField,
    updateTranslations,
    addTranslation,
    deleteTranslation,
    updateTranslationField,
    updateCompany,
  } = useProfileForm();

  useEffect(() => {
    if (!isInitialLoading) {
      companyNameInputRef.current?.focus();
    }
  }, [isInitialLoading]);

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="font-normal max-w-2xl">
      <div className="grid gap-y-4">
        {/* API Error Message */}
        {apiError && (
          <div
            className="p-3 border border-red-500 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 font-medium"
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
            <span>{apiError}</span>
          </div>
        )}

        {/* Company Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <AuthInput
              id="companyNameEn"
              label="Company Name (English)"
              value={formData.translations.find(t => t.language === "en")?.name || ""}
              onChange={e => updateTranslationField("en", "name", e.target.value)}
              ref={companyNameInputRef}
              required
            />
          </div>
          <div className="w-full sm:w-1/2">
            <AuthInput
              id="companyNameAr"
              label="Company Name (Arabic)"
              value={formData.translations.find(t => t.language === "ar")?.name || ""}
              onChange={e => updateTranslationField("ar", "name", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <AuthInput
              id="phoneNumber"
              label={t("phoneNumber")}
              placeholder={t("phoneNumberPlaceholder")}
              value={formData.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              required
              error={errors.phoneNumber ? t(errors.phoneNumber) : undefined}
              disabled={isLoading}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <AuthInput
              id="communicationEmail"
              label={t("communicationEmail")}
              type="email"
              placeholder={t("communicationEmailPlaceholder")}
              value={formData.communicationEmail}
              onChange={(e) =>
                updateField("communicationEmail", e.target.value)
              }
              required
              error={
                errors.communicationEmail
                  ? t(errors.communicationEmail)
                  : undefined
              }
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <AuthInput
              id="companyWebsite"
              label={t("companyWebsite")}
              placeholder={t("companyWebsitePlaceholder")}
              value={formData.companyWebsite}
              onChange={(e) => updateField("companyWebsite", e.target.value)}
              error={
                errors.companyWebsite ? t(errors.companyWebsite) : undefined
              }
              disabled={isLoading}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <AuthInput
              id="addressUrl"
              label={t("addressUrl")}
              placeholder={t("addressUrlPlaceholder")}
              value={formData.addressUrl}
              onChange={(e) => updateField("addressUrl", e.target.value)}
              error={errors.addressUrl ? t(errors.addressUrl) : undefined}
              disabled={isLoading}
            />
          </div>
        </div>
        <CompanyLogoUploader
          logo={formData.logo}
          currentLogoUrl={currentLogoUrl}
          onChange={(file) => {
            updateField("logo", file);
            if (!file) {
              onLogoUrlChange(null);
            }
          }}
          error={errors.logo ? t(errors.logo) : undefined}
          disabled={isLoading}
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
          <AuthInput
            id="companyDescriptionEn"
            label="Company Description (English)"
            value={formData.translations.find(t => t.language === "en")?.description || ""}
            onChange={e => updateTranslationField("en", "description", e.target.value)}
            required
          />
          </div>
          <div className="w-full sm:w-1/2">
            <AuthInput
              id="companyDescriptionAr"
              label="Company Description (Arabic)"
              value={formData.translations.find(t => t.language === "ar")?.description || ""}
              onChange={e => updateTranslationField("ar", "description", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <AuthInput
              id="companyTermsEn"
              label="Company Terms & Conditions (English)"
              value={formData.translations.find(t => t.language === "en")?.terms || ""}
              onChange={e => updateTranslationField("en", "terms", e.target.value)}
              required
            />
          </div>
          <div className="w-full sm:w-1/2">
            <AuthInput
              id="companyTermsAr"
              label="Company Terms & Conditions (Arabic)"
              value={formData.translations.find(t => t.language === "ar")?.terms || ""}
              onChange={e => updateTranslationField("ar", "terms", e.target.value)}
              required
            />
          </div>
        </div>
        <Button
          type="button"
          onClick={updateCompany}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {tCommon("save")}
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
