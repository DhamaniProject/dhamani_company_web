import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import { useAuth } from "../../../../context/AuthContext";
import { WarrantyProvider } from "../types/types";

interface FormState {
  provider_data: {
    phone_number: string;
    email: string;
    address_url: string;
    website_url: string;
  };
  translations: {
    en: {
      provider_name: string;
      notes: string;
    };
    ar: {
      provider_name: string;
      notes: string;
    };
  };
}

interface ConfirmDialogProps {
  t: (key: string, options?: Record<string, any>) => string;
  title: string;
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  confirmLabel: string;
  confirmClass: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  t,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
  confirmLabel,
  confirmClass,
}) => (
  <div className="grid gap-6">
    <h3 className="text-lg font-medium text-gray-700">{title}</h3>
    <p className="text-sm text-gray-600">{message}</p>
    <div className="mt-4 flex justify-end gap-3">
      <Button
        onClick={onConfirm}
        className={confirmClass}
        disabled={isLoading}
        aria-label={confirmLabel}
      >
        {confirmLabel}
      </Button>
      <Button
        onClick={onCancel}
        className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
        disabled={isLoading}
        aria-label={t("modal.close")}
      >
        {t("modal.close")}
      </Button>
    </div>
  </div>
);

interface WarrantyProviderAddFormProps {
  t: (key: string, options?: Record<string, any>) => string;
  tCommon: (key: string, options?: Record<string, any>) => string;
  formState: FormState;
  error: string | null;
  setFormState: (state: Partial<FormState>) => void;
}

const WarrantyProviderAddForm: React.FC<WarrantyProviderAddFormProps> = ({
  t,
  tCommon,
  formState,
  error,
  setFormState,
}) => {
  return (
    <div className="grid gap-6">
      {error && (
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
          <span>{t(error)}</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="newProviderNameEn"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.name_en")}
          </label>
          <input
            id="newProviderNameEn"
            type="text"
            placeholder={t("modal.placeholders.name_en")}
            value={formState.translations.en.provider_name}
            onChange={(e) =>
              setFormState({
                ...formState,
                translations: {
                  ...formState.translations,
                  en: {
                    ...formState.translations.en,
                    provider_name: e.target.value,
                  },
                },
              })
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            required
            aria-label={t("modal.name_en")}
          />
        </div>
        <div>
          <label
            htmlFor="newProviderNameAr"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.name_ar")}
          </label>
          <input
            id="newProviderNameAr"
            type="text"
            placeholder={t("modal.placeholders.name_ar")}
            value={formState.translations.ar.provider_name}
            onChange={(e) =>
              setFormState({
                ...formState,
                translations: {
                  ...formState.translations,
                  ar: {
                    ...formState.translations.ar,
                    provider_name: e.target.value,
                  },
                },
              })
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            required
            aria-label={t("modal.name_ar")}
          />
        </div>
        <div>
          <label
            htmlFor="newProviderNotesEn"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.notes_en")}
          </label>
          <textarea
            id="newProviderNotesEn"
            placeholder={tCommon("notAvailable")}
            value={formState.translations.en.notes}
            onChange={(e) =>
              setFormState({
                ...formState,
                translations: {
                  ...formState.translations,
                  en: { ...formState.translations.en, notes: e.target.value },
                },
              })
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            aria-label={t("modal.notes_en")}
          />
        </div>
        <div>
          <label
            htmlFor="newProviderNotesAr"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.notes_ar")}
          </label>
          <textarea
            id="newProviderNotesAr"
            placeholder={tCommon("notAvailable")}
            value={formState.translations.ar.notes}
            onChange={(e) =>
              setFormState({
                ...formState,
                translations: {
                  ...formState.translations,
                  ar: { ...formState.translations.ar, notes: e.target.value },
                },
              })
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            aria-label={t("modal.notes_ar")}
          />
        </div>
        <div>
          <label
            htmlFor="newProviderEmail"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.email")}
          </label>
          <input
            id="newProviderEmail"
            type="email"
            placeholder={t("modal.placeholders.email")}
            value={formState.provider_data.email}
            onChange={(e) =>
              setFormState({
                ...formState,
                provider_data: {
                  ...formState.provider_data,
                  email: e.target.value,
                },
              })
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            required
            aria-label={t("modal.email")}
          />
        </div>
        <div>
          <label
            htmlFor="newProviderPhone"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.phone")}
          </label>
          <input
            id="newProviderPhone"
            type="text"
            placeholder={t("modal.placeholders.phone")}
            value={formState.provider_data.phone_number}
            onChange={(e) =>
              setFormState({
                ...formState,
                provider_data: {
                  ...formState.provider_data,
                  phone_number: e.target.value,
                },
              })
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            required
            aria-label={t("modal.phone")}
          />
        </div>
        <div>
          <label
            htmlFor="newProviderAddressUrl"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.address_url")}
          </label>
          <input
            id="newProviderAddressUrl"
            type="text"
            placeholder={tCommon("notAvailable")}
            value={formState.provider_data.address_url}
            onChange={(e) =>
              setFormState({
                ...formState,
                provider_data: {
                  ...formState.provider_data,
                  address_url: e.target.value,
                },
              })
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            aria-label={t("modal.address_url")}
          />
        </div>
        <div>
          <label
            htmlFor="newProviderWebsiteUrl"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.website_url")}
          </label>
          <input
            id="newProviderWebsiteUrl"
            type="text"
            placeholder={tCommon("notAvailable")}
            value={formState.provider_data.website_url}
            onChange={(e) =>
              setFormState({
                ...formState,
                provider_data: {
                  ...formState.provider_data,
                  website_url: e.target.value,
                },
              })
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            aria-label={t("modal.website_url")}
          />
        </div>
      </div>
    </div>
  );
};

interface AddWarrantyProviderModalProps {
  onClose: () => void;
  onAdd: (newProvider: Omit<WarrantyProvider, "id" | "status" | "createdAt">) => Promise<WarrantyProvider | undefined>;
}

const AddWarrantyProviderModal: React.FC<AddWarrantyProviderModalProps> = ({
  onClose,
  onAdd,
}) => {
  const { t, i18n } = useTranslation("warrantyProviders");
  const { t: tCommon } = useTranslation("common");
  const { user } = useAuth();
  const [formState, setFormState] = useState<FormState>({
    provider_data: {
      phone_number: "",
      email: "",
      address_url: "",
      website_url: "",
    },
    translations: {
      en: {
        provider_name: "",
        notes: "",
      },
      ar: {
        provider_name: "",
        notes: "",
      },
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [persistentError, setPersistentError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (error) {
      setPersistentError(error);
    }
  }, [error]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formState.translations.en.provider_name)
      newErrors.name_en = t("modal.errors.nameRequired");
    if (!formState.translations.ar.provider_name)
      newErrors.name_ar = t("modal.errors.nameRequired");
    if (!formState.provider_data.email)
      newErrors.email = t("modal.errors.emailRequired");
    if (!formState.provider_data.phone_number)
      newErrors.phone = t("modal.errors.phoneRequired");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      formState.provider_data.email &&
      !emailRegex.test(formState.provider_data.email)
    ) {
      newErrors.email = t("modal.errors.invalidEmail");
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (
      formState.provider_data.phone_number &&
      !phoneRegex.test(formState.provider_data.phone_number)
    ) {
      newErrors.phone = t("modal.errors.invalidPhone");
    }

    if (Object.keys(newErrors).length > 0) {
      setError(Object.values(newErrors)[0]);
      return false;
    }
    setError(null);
    return true;
  };

  const resetForm = () => {
    setFormState({
      provider_data: {
        phone_number: "",
        email: "",
        address_url: "",
        website_url: "",
      },
      translations: {
        en: {
          provider_name: "",
          notes: "",
        },
        ar: {
          provider_name: "",
          notes: "",
        },
      },
    });
    setError(null);
    setPersistentError(null);
  };

  const handleAdd = () => {
    if (!validateForm()) return;
    setShowConfirm(true);
  };

  const handleConfirmAdd = async () => {
    setIsLoading(true);
    setPersistentError(null);
    try {
      if (!user?.company_id) {
        throw new Error("noCompanyId");
      }
      const newProvider: Omit<WarrantyProvider, "id" | "status" | "createdAt"> =
        {
          name: formState.translations.en.provider_name, // For display purposes
          email: formState.provider_data.email,
          phone: formState.provider_data.phone_number,
          addressUrl: formState.provider_data.address_url,
          websiteUrl: formState.provider_data.website_url,
          updatedAt: null,
          translations: [
            {
              language_id: 1,
              provider_name: formState.translations.en.provider_name,
              notes: formState.translations.en.notes,
            },
            {
              language_id: 2,
              provider_name: formState.translations.ar.provider_name,
              notes: formState.translations.ar.notes,
            },
          ],
        };
      const result = await onAdd(newProvider);
      if (result) {
        resetForm();
        onClose();
      } else {
        setError("createProviderError");
      }
    } catch (err: any) {
      setError(err.message || "createProviderError");
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="fixed top-10 right-10 z-50 w-full max-w-2xl">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto border border-gray-200"
        role="dialog"
        aria-labelledby="add-modal-title"
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2
            id="add-modal-title"
            className="text-xl font-semibold text-gray-800"
          >
            {t(showConfirm ? "modal.confirmAddSection" : "modal.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={t("modal.close")}
            disabled={isLoading}
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
        </div>
        {showConfirm ? (
          <ConfirmDialog
            t={t}
            title={t("modal.confirmAddSection")}
            message={t("modal.addConfirm")}
            onConfirm={handleConfirmAdd}
            onCancel={() => setShowConfirm(false)}
            isLoading={isLoading}
            confirmLabel={t("modal.submit")}
            confirmClass="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
          />
        ) : (
          <>
            <WarrantyProviderAddForm
              t={t}
              tCommon={tCommon}
              formState={formState}
              error={persistentError}
              setFormState={setFormState}
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={handleAdd}
                className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                disabled={isLoading}
                aria-label={t("modal.submit")}
              >
                {t("modal.submit")}
              </Button>
              <Button
                onClick={onClose}
                className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
                disabled={isLoading}
                aria-label={t("modal.close")}
              >
                {t("modal.close")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddWarrantyProviderModal;
