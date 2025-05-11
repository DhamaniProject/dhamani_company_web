import { useState } from "react";
import { login } from "../services/loginAuthService";
import { useAuth } from "../../../../context/AuthContext";
import { supabase } from "../../../../lib/supabase";


export interface FormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const useLoginForm = () => {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { refetchUser, setIsSubmitting } = useAuth();

  console.log("useLoginForm rendered, globalError:", globalError); // Debug log

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (field === "email" || field === "password") {
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (globalError) {
        setGlobalError(null);
      }
    }
  };

  const validateFields = () => {
    const errors: { email?: string; password?: string } = {};
    const { email, password } = formState;

    if (!email) errors.email = "emptyEmail";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "invalidEmail";

    if (!password) errors.password = "emptyPassword";

    return errors;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    onSuccess: (token: string) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("handleSubmit: Form submitted");

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    setFieldErrors({});
    setGlobalError(null);
    setIsSubmitting(true);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    try {
      // Only authenticate with your backend
      const response = await login({
        email: formState.email,
        password: formState.password,
      });

      // Store your backend tokens
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);

      await supabase.auth.setSession({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      await refetchUser();
      onSuccess(response.access_token);
    } catch (error: any) {
      console.error("Login error:", error);
      const errorCode = error.code || error.response?.data?.code || "serverError";
      const newError = errorCode === "INVALID_CREDENTIALS" || error.response?.status === 401
        ? "invalidCredentials"
        : "serverError";
      setGlobalError(newError);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return {
    email: formState.email,
    password: formState.password,
    rememberMe: formState.rememberMe,
    fieldErrors,
    globalError,
    isLoading,
    handleSubmit,
    updateField,
  };
};
