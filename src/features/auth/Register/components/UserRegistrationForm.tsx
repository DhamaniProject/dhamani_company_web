import React from "react";
import { useTranslation } from "react-i18next";
import AuthInput from "../../common/AuthInput";
import Button from "../../../../components/ui/Button";

interface UserRegistrationFormProps {
  values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
  isLoading: boolean;
  errors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  };
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({
  values,
  onChange,
  onSubmit,
  isLoading,
  errors = {},
}) => {
  const { t } = useTranslation("register");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <AuthInput
            id="firstName"
            label={t("firstName")}
            placeholder={t("firstNamePlaceholder")}
            value={values.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            required
            error={errors.firstName ? t(errors.firstName) : undefined}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <AuthInput
            id="lastName"
            label={t("lastName")}
            placeholder={t("lastNamePlaceholder")}
            value={values.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            required
            error={errors.lastName ? t(errors.lastName) : undefined}
          />
        </div>
      </div>
      <AuthInput
        id="email"
        label={t("userEmail")}
        type="email"
        placeholder={t("userEmailPlaceholder")}
        value={values.email}
        onChange={(e) => onChange("email", e.target.value)}
        required
        error={errors.email ? t(errors.email) : undefined}
      />
      <AuthInput
        id="password"
        label={t("password")}
        type="password"
        placeholder={t("passwordPlaceholder")}
        value={values.password}
        onChange={(e) => onChange("password", e.target.value)}
        required
        error={errors.password ? t(errors.password) : undefined}
      />
      <Button type="submit" isLoading={isLoading} disabled={isLoading}>
        {t("createAccount")}
      </Button>
    </form>
  );
};

export default UserRegistrationForm; 