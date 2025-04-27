// src/features/auth/hooks/useLoginForm.ts
import { useState, FormEvent } from "react";

interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
  error: string;
  isLoading: boolean;
}

export const useLoginForm = () => {
  const [state, setState] = useState<LoginFormState>({
    email: "",
    password: "",
    rememberMe: false,
    error: "",
    isLoading: false,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const updateField = (
    field: keyof Omit<LoginFormState, "error" | "isLoading">,
    value: string | boolean
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
      error: "", // Clear error on input change
    }));
  };

  const validateForm = (): string => {
    if (!state.email && !state.password) {
      return "errors.emptyFields";
    }
    if (!state.email) {
      return "errors.emptyFields";
    }
    if (!state.password) {
      return "errors.emptyFields";
    }
    if (!emailRegex.test(state.email)) {
      return "errors.invalidEmail";
    }
    return "";
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    onSuccess: (token: string) => void
  ) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setState((prev) => ({ ...prev, error: validationError }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: "" }));

    try {
      // Mock API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate invalid credentials for specific email/password
          if (
            state.email === "test@example.com" &&
            state.password === "wrong"
          ) {
            reject(new Error("errors.invalidCredentials"));
          } else {
            resolve({ token: "mock-token" });
          }
        }, 1000);
      }).then((response: any) => {
        setState((prev) => ({ ...prev, isLoading: false }));
        onSuccess(response.token);
      });
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "errors.invalidCredentials",
      }));
    }
  };

  return {
    ...state,
    handleSubmit,
    updateField,
  };
};
