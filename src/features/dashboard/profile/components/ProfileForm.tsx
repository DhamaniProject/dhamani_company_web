import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AuthInput from "../../../auth/common/AuthInput";
import Button from "../../../../components/ui/Button";
import CompanyLogoUploader from "../../../auth/Register/components/CompanyLogoUploader";
import CompanyTranslationAccordion from "../../../auth/Register/components/CompanyTranslationAccordion";
import { useProfileForm } from "../hooks/useProfileForm";

interface ProfileFormProps {
  onSuccess?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation("profile");
  const { t: tCommon } = useTranslation("common");
  const companyNameInputRef = useRef<HTMLInputElement>(null);
  const {
    formData,
    errors,
    success,
    isLoading,
    handleSubmit,
    updateField,
    updateTranslations,
    addTranslation,
    deleteTranslation,
  } = useProfileForm();

  useEffect(() => {
    companyNameInputRef.current?.focus();
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(() => {
      if (onSuccess) onSuccess();
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      noValidate
      aria-labelledby="profile-title"
      className="font-normal max-w-2xl"
    >
      <div className="grid gap-y-4">
        {/* Success Message */}
        {success && (
          <div
            className="p-3 border border-green-500 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 font-medium"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{t("updateSuccess")}</span>
          </div>
        )}
        {/* Company Details */}
        <AuthInput
          id="companyName"
          label={t("companyName")}
          placeholder={t("companyNamePlaceholder")}
          value={formData.companyName}
          onChange={(e) => updateField("companyName", e.target.value)}
          ref={companyNameInputRef}
          required
          error={errors.companyName ? t(errors.companyName) : undefined}
        />
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
            />
          </div>
        </div>
        <CompanyLogoUploader
          logo={formData.logo}
          onChange={(file) => updateField("logo", file)}
          error={errors.logo ? t(errors.logo) : undefined}
        />
        <CompanyTranslationAccordion
          translations={formData.translations}
          onUpdateTranslations={updateTranslations}
          onAddTranslation={addTranslation}
          onDeleteTranslation={deleteTranslation}
          errors={errors.translations}
        />
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {tCommon("save")}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
