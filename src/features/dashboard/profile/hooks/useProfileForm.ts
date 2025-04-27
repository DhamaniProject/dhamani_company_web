import { useState, FormEvent } from "react";

interface Translation {
  language: string;
  name: string;
  description: string;
  terms: string;
}

interface ProfileFormState {
  companyName: string;
  phoneNumber: string;
  communicationEmail: string;
  companyWebsite: string;
  addressUrl: string;
  logo: File | null;
  translations: Translation[];
}

interface FormErrors {
  companyName?: string;
  phoneNumber?: string;
  communicationEmail?: string;
  companyWebsite?: string;
  addressUrl?: string;
  logo?: string;
  translations?: Array<{ [key: string]: string }>;
}

export const useProfileForm = () => {
  const [formData, setFormData] = useState<ProfileFormState>({
    companyName: "Sample Company",
    phoneNumber: "+966555555555",
    communicationEmail: "contact@sample.com",
    companyWebsite: "https://www.sample.com",
    addressUrl: "https://maps.google.com",
    logo: null,
    translations: [
      {
        language: "en",
        name: "Sample Company",
        description: "A sample company description",
        terms: "Sample terms and conditions",
      },
    ],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  const updateField = (
    field: keyof Omit<ProfileFormState, "translations">,
    value: string | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSuccess(false);
  };

  const updateTranslations = (translations: Translation[]) => {
    setFormData((prev) => ({
      ...prev,
      translations,
    }));
    setErrors((prev) => ({ ...prev, translations: undefined }));
    setSuccess(false);
  };

  const addTranslation = () => {
    if (formData.translations.length >= 2) {
      setErrors({
        translations: [{ maxTranslations: "errors.maxTranslations" }],
      });
      return;
    }

    const last = formData.translations[formData.translations.length - 1];
    if (
      last &&
      (!last.language ||
        !last.name.trim() ||
        !last.description.trim() ||
        !last.terms.trim())
    ) {
      setErrors({
        translations: [
          {
            language: !last.language ? "errors.emptyLanguage" : undefined,
            name: !last.name.trim() ? "errors.emptyTranslatedName" : undefined,
            description: !last.description.trim()
              ? "errors.emptyDescription"
              : undefined,
            terms: !last.terms.trim() ? "errors.emptyTerms" : undefined,
          },
        ],
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      translations: [
        ...prev.translations,
        { language: "", name: "", description: "", terms: "" },
      ],
    }));
    setErrors({});
    setSuccess(false);
  };

  const deleteTranslation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.filter((_, i) => i !== index),
    }));
    setErrors({});
    setSuccess(false);
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Company Name
    if (!formData.companyName.trim()) {
      newErrors.companyName = "errors.emptyCompanyName";
    }

    // Phone Number
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "errors.emptyPhoneNumber";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "errors.invalidPhoneNumber";
    }

    // Communication Email
    if (!formData.communicationEmail) {
      newErrors.communicationEmail = "errors.emptyCommunicationEmail";
    } else if (!emailRegex.test(formData.communicationEmail)) {
      newErrors.communicationEmail = "errors.invalidEmail";
    }

    // Company Website (optional)
    if (formData.companyWebsite && !urlRegex.test(formData.companyWebsite)) {
      newErrors.companyWebsite = "errors.invalidWebsite";
    }

    // Address URL (optional)
    if (formData.addressUrl && !urlRegex.test(formData.addressUrl)) {
      newErrors.addressUrl = "errors.invalidAddressUrl";
    }

    // Company Logo (optional)
    if (formData.logo) {
      const validFormats = ["image/png", "image/jpeg"];
      if (!validFormats.includes(formData.logo.type)) {
        newErrors.logo = "errors.invalidLogoFormat";
      } else if (formData.logo.size > 2 * 1024 * 1024) {
        newErrors.logo = "errors.logoTooLarge";
      }
    }

    // Translations
    const translationErrors: Array<{ [key: string]: string }> = [];
    formData.translations.forEach((t) => {
      const tErrors: { [key: string]: string } = {};
      if (!t.language) tErrors.language = "errors.emptyLanguage";
      if (!t.name.trim()) tErrors.name = "errors.emptyTranslatedName";
      if (!t.description.trim())
        tErrors.description = "errors.emptyDescription";
      if (!t.terms.trim()) tErrors.terms = "errors.emptyTerms";
      translationErrors.push(tErrors);
    });

    const languages = formData.translations
      .map((t) => t.language)
      .filter(Boolean);
    if (new Set(languages).size !== languages.length) {
      translationErrors[0] = {
        ...translationErrors[0],
        language: "errors.duplicateLanguage",
      };
    }

    if (translationErrors.some((e) => Object.keys(e).length > 0)) {
      newErrors.translations = translationErrors;
    }

    return newErrors;
  };

  const handleSubmit = async (onSuccess: () => void) => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      setSuccess(true);
      onSuccess();
    } catch (err) {
      setIsLoading(false);
      setErrors({ updateError: "errors.updateError" });
      setSuccess(false);
    }
  };

  return {
    formData,
    errors,
    success,
    isLoading,
    handleSubmit,
    updateField,
    updateTranslations,
    addTranslation,
    deleteTranslation,
  };
};
