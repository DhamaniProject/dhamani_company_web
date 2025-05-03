import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface AddUserModalProps {
  onClose: () => void;
  onAdd: (user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onAdd }) => {
  const { t, i18n } = useTranslation("users");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*#?&]/.test(password);

    return {
      isValid:
        minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar,
      errors: {
        minLength: minLength ? "" : t("modal.errors.passwordMinLength"),
        hasUpperCase: hasUpperCase ? "" : t("modal.errors.passwordUpperCase"),
        hasLowerCase: hasLowerCase ? "" : t("modal.errors.passwordLowerCase"),
        hasDigit: hasDigit ? "" : t("modal.errors.passwordDigit"),
        hasSpecialChar: hasSpecialChar
          ? ""
          : t("modal.errors.passwordSpecialChar"),
      },
    };
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate Email
    if (!validateEmail(email)) {
      newErrors.email = t("modal.errors.invalidEmail");
    }

    // Validate Password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      Object.entries(passwordValidation.errors).forEach(([key, error]) => {
        if (error) newErrors[key] = error;
      });
    }

    // Validate Required Fields
    if (!firstName) newErrors.firstName = t("modal.errors.firstNameRequired");
    if (!lastName) newErrors.lastName = t("modal.errors.lastNameRequired");
    if (!email) newErrors.email = t("modal.errors.emailRequired");
    if (!password) newErrors.password = t("modal.errors.passwordRequired");

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onAdd({ firstName, lastName, email, password });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative pointer-events-auto"
        dir={i18n.language === "ar" ? "rtl" : undefined}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label={t("modal.close")}
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {t("modal.title")}
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-700">
              {t("modal.firstName")}
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t("modal.placeholders.firstName")}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base py-2"
              aria-label={t("modal.firstName")}
            />
            {errors.firstName && (
              <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700">
              {t("modal.lastName")}
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("modal.placeholders.lastName")}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base py-2"
              aria-label={t("modal.lastName")}
            />
            {errors.lastName && (
              <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700">
              {t("modal.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("modal.placeholders.email")}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base py-2"
              aria-label={t("modal.email")}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700">
              {t("modal.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("modal.placeholders.password")}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base py-2"
              aria-label={t("modal.password")}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
            {errors.minLength && (
              <p className="mt-2 text-sm text-red-600">{errors.minLength}</p>
            )}
            {errors.hasUpperCase && (
              <p className="mt-2 text-sm text-red-600">{errors.hasUpperCase}</p>
            )}
            {errors.hasLowerCase && (
              <p className="mt-2 text-sm text-red-600">{errors.hasLowerCase}</p>
            )}
            {errors.hasDigit && (
              <p className="mt-2 text-sm text-red-600">{errors.hasDigit}</p>
            )}
            {errors.hasSpecialChar && (
              <p className="mt-2 text-sm text-red-600">
                {errors.hasSpecialChar}
              </p>
            )}
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="py-2 px-6 text-base font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            aria-label={t("modal.cancel")}
          >
            {t("modal.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className="py-2 px-6 text-base font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
            aria-label={t("modal.addUser")}
          >
            {t("modal.addUser")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
