import React from "react";
import { useTranslation } from "react-i18next";
import { useRegisterForm } from "./hooks/useRegisterForm";
import AuthInput from "../common/AuthInput";
import Button from "../../../components/ui/Button";
import CompanyLogoUpload from "./components/CompanyLogoUpload";
import UserRegistrationForm from "./components/UserRegistrationForm";
import RegistrationSteps from "./components/RegistrationSteps";

const RegisterForm: React.FC = () => {
  const { t } = useTranslation("register");
  const {
    formData,
    handleChange,
    handleLogoChange,
    handleLogoRemove,
    handleTranslationChange,
    isLoading,
    errors,
    currentStep,
    setCurrentStep,
    handleCompanyInfoSubmit,
    handleUserInfoSubmit,
    formMessage,
  } = useRegisterForm();

  const renderFormMessage = () => {
    if (!formMessage) return null;
    return (
      <div
        className={`p-3 border rounded-lg flex items-center gap-2 font-medium mb-2 text-center justify-center ${
          formMessage.type === "error"
            ? "border-red-500 bg-red-50 text-red-700"
            : "border-green-500 bg-green-50 text-green-700"
        }`}
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
            d={
              formMessage.type === "error"
                ? "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                : "M5 13l4 4L19 7"
            }
          />
        </svg>
        <span>{t(formMessage.text)}</span>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <form onSubmit={handleCompanyInfoSubmit} className="space-y-4">
            {renderFormMessage()}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <AuthInput
                  id="companyNameEn"
                  label={t("companyNameEn")}
                  placeholder={t("companyNameEnPlaceholder")}
                  value={formData.companyNameEn}
                  onChange={(e) => handleTranslationChange("companyNameEn", e.target.value)}
                  required
                  error={errors.companyNameEn ? t(errors.companyNameEn) : undefined}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <AuthInput
                  id="companyNameAr"
                  label={t("companyNameAr")}
                  placeholder={t("companyNameArPlaceholder")}
                  value={formData.companyNameAr}
                  onChange={(e) => handleTranslationChange("companyNameAr", e.target.value)}
                  required
                  error={errors.companyNameAr ? t(errors.companyNameAr) : undefined}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <AuthInput
                  id="companyDescriptionEn"
                  label={t("companyDescriptionEn")}
                  placeholder={t("companyDescriptionEnPlaceholder")}
                  value={formData.companyDescriptionEn}
                  onChange={(e) => handleTranslationChange("companyDescriptionEn", e.target.value)}
                  required
                  error={errors.companyDescriptionEn ? t(errors.companyDescriptionEn) : undefined}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <AuthInput
                  id="companyDescriptionAr"
                  label={t("companyDescriptionAr")}
                  placeholder={t("companyDescriptionArPlaceholder")}
                  value={formData.companyDescriptionAr}
                  onChange={(e) => handleTranslationChange("companyDescriptionAr", e.target.value)}
                  required
                  error={errors.companyDescriptionAr ? t(errors.companyDescriptionAr) : undefined}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <AuthInput
                  id="companyTermsEn"
                  label={t("companyTermsEn")}
                  placeholder={t("companyTermsEnPlaceholder")}
                  value={formData.companyTermsEn}
                  onChange={(e) => handleTranslationChange("companyTermsEn", e.target.value)}
                  required
                  error={errors.companyTermsEn ? t(errors.companyTermsEn) : undefined}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <AuthInput
                  id="companyTermsAr"
                  label={t("companyTermsAr")}
                  placeholder={t("companyTermsArPlaceholder")}
                  value={formData.companyTermsAr}
                  onChange={(e) => handleTranslationChange("companyTermsAr", e.target.value)}
                  required
                  error={errors.companyTermsAr ? t(errors.companyTermsAr) : undefined}
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
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
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
                  onChange={(e) => handleChange("communicationEmail", e.target.value)}
                  required
                  error={errors.communicationEmail ? t(errors.communicationEmail) : undefined}
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
                  onChange={(e) => handleChange("companyWebsite", e.target.value)}
                  required
                  error={errors.companyWebsite ? t(errors.companyWebsite) : undefined}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <AuthInput
                  id="addressUrl"
                  label={t("addressUrl")}
                  placeholder={t("addressUrlPlaceholder")}
                  value={formData.addressUrl}
                  onChange={(e) => handleChange("addressUrl", e.target.value)}
                  required
                  error={errors.addressUrl ? t(errors.addressUrl) : undefined}
                />
              </div>
            </div>
            <CompanyLogoUpload
              onLogoChange={handleLogoChange}
              onLogoRemove={handleLogoRemove}
              logo={formData.logo}
              error={errors.logo ? t(errors.logo) : undefined}
            />
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              {t("nextStep")}
            </Button>
          </form>
        );
      case 1:
        return (
          <>
            {renderFormMessage()}
            <UserRegistrationForm
              values={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
              }}
              onChange={handleChange}
              onSubmit={handleUserInfoSubmit}
              isLoading={isLoading}
              errors={errors}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-700 mb-1 text-center">{t("registerCompany")}</h2>
        <RegistrationSteps currentStep={currentStep} totalSteps={2} />
      </div>
      {renderStep()}
    </div>
  );
};

export default RegisterForm;
