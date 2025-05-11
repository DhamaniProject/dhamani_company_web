import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { registerCompany } from "../services/companyRegisterService";
import { CompanyRegisterRequest } from "../types/companyRegister";
import { registerUser } from "../services/userRegisterService";
import { UserRegisterRequest } from "../types/userRegister";
import { uploadToSupabaseStorage } from '../../../../services/supabaseUploadService';

interface FormData {
  companyNameEn: string;
  companyNameAr: string;
  companyDescriptionEn: string;
  companyDescriptionAr: string;
  companyTermsEn: string;
  companyTermsAr: string;
  phoneNumber: string;
  communicationEmail: string;
  companyWebsite: string;
  addressUrl: string;
  logo: File | null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface FormErrors {
  companyNameEn?: string;
  companyNameAr?: string;
  companyDescriptionEn?: string;
  companyDescriptionAr?: string;
  companyTermsEn?: string;
  companyTermsAr?: string;
  phoneNumber?: string;
  communicationEmail?: string;
  companyWebsite?: string;
  addressUrl?: string;
  logo?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

interface FormMessage {
  type: "success" | "error";
  text: string;
}

export const useRegisterForm = () => {
  const { t } = useTranslation("register");
  const navigate = useNavigate();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    companyNameEn: "",
    companyNameAr: "",
    companyDescriptionEn: "",
    companyDescriptionAr: "",
    companyTermsEn: "",
    companyTermsAr: "",
    phoneNumber: "",
    communicationEmail: "",
    companyWebsite: "",
    addressUrl: "",
    logo: null,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const validateCompanyInfo = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyNameEn) {
      newErrors.companyNameEn = "companyNameEnRequired";
    }
    if (!formData.companyNameAr) {
      newErrors.companyNameAr = "companyNameArRequired";
    }
    if (!formData.companyDescriptionEn) {
      newErrors.companyDescriptionEn = "companyDescriptionEnRequired";
    }
    if (!formData.companyDescriptionAr) {
      newErrors.companyDescriptionAr = "companyDescriptionArRequired";
    }
    if (!formData.companyTermsEn) {
      newErrors.companyTermsEn = "companyTermsEnRequired";
    }
    if (!formData.companyTermsAr) {
      newErrors.companyTermsAr = "companyTermsArRequired";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "phoneNumberRequired";
    }
    if (!formData.communicationEmail) {
      newErrors.communicationEmail = "communicationEmailRequired";
    }
    if (!formData.companyWebsite) {
      newErrors.companyWebsite = "companyWebsiteRequired";
    }
    if (!formData.addressUrl) {
      newErrors.addressUrl = "addressUrlRequired";
    }
    // logo is optional, so no validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUserInfo = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "firstNameRequired";
    }
    if (!formData.lastName) {
      newErrors.lastName = "lastNameRequired";
    }
    if (!formData.email) {
      newErrors.email = "emailRequired";
    }
    if (!formData.password) {
      newErrors.password = "passwordRequired";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTranslationChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (file: File) => {
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleLogoRemove = () => {
    setFormData((prev) => ({ ...prev, logo: null }));
  };

  const handleCompanyInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMessage(null);
    if (!validateCompanyInfo()) return;
    setIsLoading(true);
    try {
      let logoUrl: string | null = null;
      if (formData.logo instanceof File) {
        // Upload the logo and get the public URL
        logoUrl = await uploadToSupabaseStorage(
          formData.logo,
          'company-logos',
          formData.companyNameEn.replace(/\s+/g, '_')
        );
      }

      // Prepare request body
      const reqBody: CompanyRegisterRequest = {
        company_data: {
          company_name: formData.companyNameEn,
          communication_email: formData.communicationEmail,
          phone_number: formData.phoneNumber,
          website_url: formData.companyWebsite,
          address_url: formData.addressUrl,
          company_logo: logoUrl,
        },
        translations: [
          {
            language_id: 1,
            company_name: formData.companyNameEn,
            company_description: formData.companyDescriptionEn,
            terms_and_conditions: formData.companyTermsEn,
          },
          {
            language_id: 2,
            company_name: formData.companyNameAr,
            company_description: formData.companyDescriptionAr,
            terms_and_conditions: formData.companyTermsAr,
          },
        ],
      };
      if (!logoUrl) {
        delete reqBody.company_data.company_logo;
      }
      const response = await registerCompany(reqBody);
      if (response.success) {
        setCompanyId(response.data.company_id);
        setCurrentStep(1);
      } else {
        setFormMessage({ type: "error", text: "companyRegister.genericError" });
      }
    } catch (error: any) {
      setFormMessage({ type: "error", text: error.message || "companyRegister.genericError" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserInfoSubmit = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    setFormMessage(null);
    if (!validateUserInfo()) return;
    if (!companyId) {
      setFormMessage({ type: "error", text: "userRegister.noCompanyId" });
      return;
    }
    setIsLoading(true);
    try {
      const reqBody: UserRegisterRequest = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        company_id: companyId,
        password: data.password,
      };
      const response = await registerUser(reqBody);
      if (response.success) {
        setFormMessage({ type: "success", text: "userRegister.success" });
        navigate("/auth/login");
      } else {
        setFormMessage({ type: "error", text: response.message || "userRegister.genericError" });
      }
    } catch (error: any) {
      setFormMessage({ type: "error", text: error.message || "userRegister.genericError" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleTranslationChange,
    handleLogoChange,
    handleLogoRemove,
    handleCompanyInfoSubmit,
    handleUserInfoSubmit,
    isLoading,
    errors,
    currentStep,
    setCurrentStep,
    formMessage,
  };
}; 