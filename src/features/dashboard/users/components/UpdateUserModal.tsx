import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "Active" | "Inactive";
}

interface UpdateUserModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (user: Omit<User, "status">) => void;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  user,
  onClose,
  onUpdate,
}) => {
  const { t, i18n } = useTranslation("users");
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
  }, [user]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate Email
    if (!validateEmail(email)) {
      newErrors.email = t("modal.errors.invalidEmail");
    }

    // Validate Required Fields
    if (!firstName) newErrors.firstName = t("modal.errors.firstNameRequired");
    if (!lastName) newErrors.lastName = t("modal.errors.lastNameRequired");
    if (!email) newErrors.email = t("modal.errors.emailRequired");

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onUpdate({ id: user.id, firstName, lastName, email });
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
          {t("updateModal.title")}
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
            aria-label={t("updateModal.updateUser")}
          >
            {t("updateModal.updateUser")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserModal;
