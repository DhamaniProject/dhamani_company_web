import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import { WarrantyProvider } from "../types/types";

interface FormState {
  name: { en: string; ar: string };
  notes: { en: string | null; ar: string | null };
  email: string;
  phone: string;
  addressUrl: string;
  websiteUrl: string;
}

interface WarrantyProviderViewProps {
  provider: WarrantyProvider;
  t: (key: string, options?: any) => string;
  tCommon: (key: string) => string;
  i18n: any;
  onChangeMode: (mode: "view" | "update") => void;
  onClose: () => void;
}

const WarrantyProviderView: React.FC<WarrantyProviderViewProps> = ({
  provider,
  t,
  tCommon,
  i18n,
  onChangeMode,
  onClose,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return tCommon("notAvailable");
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const translationEn = provider.translations?.find((t) => t.language_id === 1);
  const translationAr = provider.translations?.find((t) => t.language_id === 2);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.provider_name_en")}
          </strong>
          <p className="text-sm text-gray-800">
            {translationEn?.provider_name || tCommon("notAvailable")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.provider_name_ar")}
          </strong>
          <p className="text-sm text-gray-800">
            {translationAr?.provider_name || tCommon("notAvailable")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.notes_en")}
          </strong>
          <p className="text-sm text-gray-800">
            {translationEn?.notes || tCommon("notAvailable")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.notes_ar")}
          </strong>
          <p className="text-sm text-gray-800">
            {translationAr?.notes || tCommon("notAvailable")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.email")}
          </strong>
          <p className="text-sm text-gray-800">{provider.email}</p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.phone")}
          </strong>
          <p className="text-sm text-gray-800">{provider.phone}</p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.address_url")}
          </strong>
          <p className="text-sm text-gray-800">
            {provider.addressUrl || tCommon("notAvailable")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.website_url")}
          </strong>
          <p className="text-sm text-gray-800">
            {provider.websiteUrl || tCommon("notAvailable")}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.createdAt")}
          </strong>
          <p className="text-sm text-gray-800">
            {formatDate(provider.createdAt)}
          </p>
        </div>
        <div>
          <strong className="text-sm font-medium text-gray-600">
            {t("modal.updatedAt")}
          </strong>
          <p className="text-sm text-gray-800">
            {formatDate(provider.updatedAt)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <Button
          onClick={() => onChangeMode("update")}
          className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
          aria-label={t("modal.submitUpdate")}
        >
          {t("modal.submitUpdate")}
        </Button>
        <Button
          onClick={onClose}
          className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
          aria-label={t("modal.close")}
        >
          {t("modal.close")}
        </Button>
      </div>
    </div>
  );
};

interface WarrantyProviderUpdateFormProps {
  t: (key: string, options?: any) => string;
  tCommon: (key: string) => string;
  formState: FormState;
  editedFields: { [key: string]: boolean };
  error: string | null;
  setFormState: (
    state: Partial<FormState>,
    edited?: { [key: string]: boolean }
  ) => void;
  validateForm: (isUpdate?: boolean) => boolean;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const WarrantyProviderUpdateForm: React.FC<WarrantyProviderUpdateFormProps> = ({
  t,
  tCommon,
  formState,
  editedFields,
  error,
  setFormState,
  validateForm,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const isFormEdited = Object.values(editedFields).some(
    (value) => value === true
  );

  return (
    <div className="grid gap-6">
      <h3 className="text-lg font-medium text-gray-700">
        {t("updateModal.title")}
      </h3>
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
            htmlFor="updateProviderNameEn"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.name_en")}
          </label>
          <input
            id="updateProviderNameEn"
            type="text"
            placeholder={t("modal.placeholders.name_en")}
            value={formState.name.en}
            onChange={(e) =>
              setFormState(
                { name: { ...formState.name, en: e.target.value } },
                { name_en: true }
              )
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            required
            aria-label={t("modal.name_en")}
          />
        </div>
        <div>
          <label
            htmlFor="updateProviderNameAr"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.name_ar")}
          </label>
          <input
            id="updateProviderNameAr"
            type="text"
            placeholder={t("modal.placeholders.name_ar")}
            value={formState.name.ar}
            onChange={(e) =>
              setFormState(
                { name: { ...formState.name, ar: e.target.value } },
                { name_ar: true }
              )
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            required
            aria-label={t("modal.name_ar")}
          />
        </div>
        <div>
          <label
            htmlFor="updateProviderNotesEn"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.notes_en")}
          </label>
          <textarea
            id="updateProviderNotesEn"
            placeholder={tCommon("notAvailable")}
            value={formState.notes.en || ""}
            onChange={(e) =>
              setFormState(
                { notes: { ...formState.notes, en: e.target.value || null } },
                { notes_en: true }
              )
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            aria-label={t("modal.notes_en")}
          />
        </div>
        <div>
          <label
            htmlFor="updateProviderNotesAr"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.notes_ar")}
          </label>
          <textarea
            id="updateProviderNotesAr"
            placeholder={tCommon("notAvailable")}
            value={formState.notes.ar || ""}
            onChange={(e) =>
              setFormState(
                { notes: { ...formState.notes, ar: e.target.value || null } },
                { notes_ar: true }
              )
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            aria-label={t("modal.notes_ar")}
          />
        </div>
        <div>
          <label
            htmlFor="updateProviderEmail"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.email")}
          </label>
          <input
            id="updateProviderEmail"
            type="email"
            placeholder={t("modal.placeholders.email")}
            value={formState.email}
            onChange={(e) =>
              setFormState({ email: e.target.value }, { email: true })
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            required
            aria-label={t("modal.email")}
          />
        </div>
        <div>
          <label
            htmlFor="updateProviderPhone"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.phone")}
          </label>
          <input
            id="updateProviderPhone"
            type="text"
            placeholder={t("modal.placeholders.phone")}
            value={formState.phone}
            onChange={(e) =>
              setFormState({ phone: e.target.value }, { phone: true })
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            required
            aria-label={t("modal.phone")}
          />
        </div>
        <div>
          <label
            htmlFor="updateProviderAddressUrl"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.address_url")}
          </label>
          <input
            id="updateProviderAddressUrl"
            type="text"
            placeholder={tCommon("notAvailable")}
            value={formState.addressUrl}
            onChange={(e) =>
              setFormState({ addressUrl: e.target.value }, { addressUrl: true })
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            aria-label={t("modal.address_url")}
          />
        </div>
        <div>
          <label
            htmlFor="updateProviderWebsiteUrl"
            className="block text-sm mb-2 font-normal"
          >
            {t("modal.website_url")}
          </label>
          <input
            id="updateProviderWebsiteUrl"
            type="text"
            placeholder={tCommon("notAvailable")}
            value={formState.websiteUrl}
            onChange={(e) =>
              setFormState({ websiteUrl: e.target.value }, { websiteUrl: true })
            }
            className="py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring focus:ring-[var(--color-primary)] focus:ring-opacity-50 text-base"
            aria-label={t("modal.website_url")}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <Button
          onClick={onSubmit}
          className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
          disabled={isLoading || !isFormEdited}
          aria-label={t("updateModal.updateProvider")}
        >
          {t("updateModal.updateProvider")}
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
};

interface WarrantyProviderModalProps {
  provider: WarrantyProvider;
  onClose: () => void;
  onUpdate?: (
    id: string,
    updatedProvider: Partial<WarrantyProvider>
  ) => Promise<void>;
}

const WarrantyProviderModal: React.FC<WarrantyProviderModalProps> = ({
  provider,
  onClose,
  onUpdate,
}) => {
  const { t, i18n } = useTranslation("warrantyProviders");
  const { t: tCommon } = useTranslation("common");
  const [mode, setMode] = useState<"view" | "update">("view");
  const [formState, setFormState] = useState<FormState>({
    name: {
      en:
        provider.translations?.find((t) => t.language_id === 1)
          ?.provider_name || "",
      ar:
        provider.translations?.find((t) => t.language_id === 2)
          ?.provider_name || "",
    },
    notes: {
      en:
        provider.translations?.find((t) => t.language_id === 1)?.notes || null,
      ar:
        provider.translations?.find((t) => t.language_id === 2)?.notes || null,
    },
    email: provider.email,
    phone: provider.phone,
    addressUrl: provider.addressUrl,
    websiteUrl: provider.websiteUrl,
  });
  const [editedFields, setEditedFields] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formState.name.en) newErrors.name_en = t("modal.errors.nameRequired");
    if (!formState.name.ar) newErrors.name_ar = t("modal.errors.nameRequired");
    if (!formState.email) newErrors.email = t("modal.errors.emailRequired");
    if (!formState.phone) newErrors.phone = t("modal.errors.phoneRequired");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formState.email && !emailRegex.test(formState.email)) {
      newErrors.email = t("modal.errors.invalidEmail");
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (formState.phone && !phoneRegex.test(formState.phone)) {
      newErrors.phone = t("modal.errors.invalidPhone");
    }

    if (Object.keys(newErrors).length > 0) {
      setError(Object.values(newErrors)[0]);
      return false;
    }
    setError(null);
    return true;
  };

  const handleSetFormState = (
    state: Partial<FormState>,
    edited?: { [key: string]: boolean }
  ) => {
    setFormState((prev) => ({ ...prev, ...state }));
    if (edited) {
      setEditedFields((prev) => ({ ...prev, ...edited }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!onUpdate) {
      // Mock update since endpoint isn't provided
      const updatedProvider: Partial<WarrantyProvider> = {
        name: formState.name.en, // For display purposes
        email: formState.email,
        phone: formState.phone,
        addressUrl: formState.addressUrl,
        websiteUrl: formState.websiteUrl,
        translations: [
          {
            language_id: 1,
            provider_name: formState.name.en,
            notes: formState.notes.en || "",
          },
          {
            language_id: 2,
            provider_name: formState.name.ar,
            notes: formState.notes.ar || "",
          },
        ],
      };
      onClose();
      return;
    }
    setIsLoading(true);
    try {
      const updateData: Partial<WarrantyProvider> = {};
      if (editedFields.name_en || editedFields.name_ar) {
        updateData.translations = [
          ...(editedFields.name_en
            ? [
                {
                  language_id: 1,
                  provider_name: formState.name.en,
                  notes: formState.notes.en || "",
                },
              ]
            : []),
          ...(editedFields.name_ar
            ? [
                {
                  language_id: 2,
                  provider_name: formState.name.ar,
                  notes: formState.notes.ar || "",
                },
              ]
            : []),
        ];
      }
      if (editedFields.email) updateData.email = formState.email;
      if (editedFields.phone) updateData.phone = formState.phone;
      if (editedFields.addressUrl) updateData.addressUrl = formState.addressUrl;
      if (editedFields.websiteUrl) updateData.websiteUrl = formState.websiteUrl;
      await onUpdate(provider.id, updateData);
      onClose();
    } catch (err: any) {
      setError(err.message || "updateProviderError");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-10 right-10 z-50 w-full max-w-2xl">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto border border-gray-200"
        role="dialog"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
            {t(mode === "view" ? "modal.title_view" : "updateModal.title")}
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
        {mode === "view" && (
          <WarrantyProviderView
            provider={provider}
            t={t}
            tCommon={tCommon}
            i18n={i18n}
            onChangeMode={setMode}
            onClose={onClose}
          />
        )}
        {mode === "update" && (
          <WarrantyProviderUpdateForm
            t={t}
            tCommon={tCommon}
            formState={formState}
            editedFields={editedFields}
            error={error}
            setFormState={handleSetFormState}
            validateForm={validateForm}
            onSubmit={handleSubmit}
            onCancel={() => setMode("view")}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default WarrantyProviderModal;
