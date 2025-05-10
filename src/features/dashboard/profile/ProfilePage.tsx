import React from "react";
import { useTranslation } from "react-i18next";
import ProfileForm from "./components/ProfileForm";
import { useProfileForm } from "./hooks/useProfileForm";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation("profile");
  const {
    logoUrl,
    setLogoUrl,
    // You can also get formData, isInitialLoading, apiError, etc. if needed
  } = useProfileForm();

  return (
    <div className="p-6 max-w-full overflow-x-hidden">
      <h1
        className="text-2xl font-bold text-gray-800 mb-6"
        aria-label={t("title")}
      >
        {t("title")}
      </h1>
      <ProfileForm
        currentLogoUrl={logoUrl}
        onLogoUrlChange={setLogoUrl}
      />
    </div>
  );
};

export default ProfilePage;
