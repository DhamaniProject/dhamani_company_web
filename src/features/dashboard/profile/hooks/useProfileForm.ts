import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { fetchCompanyById, updateCompanyById, fetchCompanyApiKey, regenerateCompanyApiKey } from "../services/companyService";
import { Company, CompanyTranslation } from "../types/company";
import { supabase } from '../../../../lib/supabase';
import { uploadToSupabaseStorage } from '../../../../../src/services/supabaseUploadService';

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
  apiKey: string;
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
    apiKey: "",
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
          const [companyResponse, apiKey] = await Promise.all([
            fetchCompanyById(user.company_id),
            fetchCompanyApiKey()
          ]);
          if (!companyResponse.success || !companyResponse.data) {
            setApiError(companyResponse.message || "Failed to load company data");
            setIsInitialLoading(false);
            return;
          }
          const data: Company = companyResponse.data;
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
            apiKey: apiKey || "",
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

  const uploadLogo = async (file: File) => {
    if (!user?.company_id) {
      console.error('No user company_id found');
      return null;
    }
    try {
      return await uploadToSupabaseStorage(file, 'company-logos', user.company_id);
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  };

  const updateCompany = async () => {
    if (!user?.company_id) return;

    try {
      setIsLoading(true);
      
      // Check Supabase session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error');
      }
      if (!session) {
        console.error('No active session');
        throw new Error('Please sign in to continue');
      }

      // If there's a new logo file, upload it first
      let newLogoUrl: string | null = logoUrl;
      if (formData.logo instanceof File) {
        console.log('Attempting to upload new logo file');
        newLogoUrl = await uploadLogo(formData.logo);
        console.log('Logo upload result:', newLogoUrl);
      }

      // Prepare company object
      const company: any = {
        company_name: formData.companyName,
        communication_email: formData.communicationEmail,
        phone_number: formData.phoneNumber,
        website_url: formData.companyWebsite,
        address_url: formData.addressUrl,
        company_logo: newLogoUrl
      };

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

      const response = await updateCompanyById(user.company_id, payload);
      setApiError(null);
      // Show success message
    } catch (error: any) {
      console.error('Update error:', error);
      setApiError(error?.message || "Failed to update company data");
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateApiKey = async () => {
    if (!user?.company_id) return;

    try {
      setIsLoading(true);
      const apiKey = await regenerateCompanyApiKey(user.company_id);
      setFormData(prev => ({
        ...prev,
        apiKey
      }));
      setApiError(null);
    } catch (error: any) {
      setApiError(error?.message || "Failed to regenerate API key");
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
    regenerateApiKey,
  };
};
