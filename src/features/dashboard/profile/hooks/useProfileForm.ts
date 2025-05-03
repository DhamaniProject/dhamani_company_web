import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { fetchCompanyById, updateCompanyById } from "../services/companyService";
import { Company, CompanyTranslation } from "../types/company";

interface TranslationForm {
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
  translations: TranslationForm[];
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
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileFormState>({
    companyName: "",
    phoneNumber: "",
    communicationEmail: "",
    companyWebsite: "",
    addressUrl: "",
    logo: null,
    translations: [],
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [errors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.company_id) {
        try {
          setIsInitialLoading(true);
          const response = await fetchCompanyById(user.company_id);
          if (!response.success || !response.data) {
            setApiError(response.message || "Failed to load company data");
            setIsInitialLoading(false);
            return;
          }
          const data: Company = response.data;
          // Map by language_id
          const en = data.translations.find(t => t.language_id === 1);
          const ar = data.translations.find(t => t.language_id === 2);
          setFormData({
            companyName: data.company_name || "",
            phoneNumber: data.phone_number || "",
            communicationEmail: data.communication_email || "",
            companyWebsite: data.website_url || "",
            addressUrl: data.address_url || "",
            logo: null,
            translations: [
              {
                language: "en",
                name: en?.company_name || "",
                description: en?.company_description || "",
                terms: en?.terms_and_conditions || "",
              },
              {
                language: "ar",
                name: ar?.company_name || "",
                description: ar?.company_description || "",
                terms: ar?.terms_and_conditions || "",
              },
            ],
          });
          setLogoUrl(data.company_logo || null);
          setApiError(null);
        } catch (error: any) {
          setApiError(error?.message || "Failed to load company data");
        } finally {
          setIsInitialLoading(false);
        }
      } else {
        setApiError("Company ID not found in user data");
        setIsInitialLoading(false);
      }
    };
    fetchData();
    // Only run on mount or when user.company_id changes
    // eslint-disable-next-line
  }, [user?.company_id]);

  const updateField = (
    field: keyof Omit<ProfileFormState, "translations">,
    value: string | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateTranslations = (translations: TranslationForm[]) => {
    setFormData((prev) => ({
      ...prev,
      translations,
    }));
  };

  const addTranslation = () => {
    if (formData.translations.length >= 2) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      translations: [
        ...prev.translations,
        { language: "", name: "", description: "", terms: "" },
      ],
    }));
  };

  const deleteTranslation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.filter((_, i) => i !== index),
    }));
  };

  const updateTranslationField = (lang: "en" | "ar", field: "name" | "description" | "terms", value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.map(t =>
        t.language === lang ? { ...t, [field]: value } : t
      ),
    }));
  };

  const updateCompany = async () => {
    if (!user?.company_id) return;

    // Prepare company object (only include fields with values)
    const company: any = {};
    if (formData.companyName) company.company_name = formData.companyName;
    if (formData.communicationEmail) company.communication_email = formData.communicationEmail;
    if (formData.phoneNumber) company.phone_number = formData.phoneNumber;
    if (formData.companyWebsite) company.website_url = formData.companyWebsite;
    if (formData.addressUrl) company.address_url = formData.addressUrl;
    // If you handle logo as a URL or file, add logic here

    // Prepare translations
    const translations = formData.translations.map(t => ({
      language_id: t.language === "en" ? 1 : 2,
      company_name: t.name,
      company_description: t.description,
      terms_and_conditions: t.terms,
    }));

    const payload = {
      company,
      translations,
    };

    // Call the API
    try {
      setIsLoading(true);
      const response = await updateCompanyById(user.company_id, payload);
      // Optionally update state with response.data
      setApiError(null);
      // Show success message, etc.
    } catch (error: any) {
      setApiError(error?.message || "Failed to update company data");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    isInitialLoading,
    apiError,
    logoUrl,
    setLogoUrl,
    updateField,
    updateTranslations,
    addTranslation,
    deleteTranslation,
    updateTranslationField,
    updateCompany,
  };
};
