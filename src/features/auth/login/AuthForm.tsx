import React, { useRef, Component, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import AuthInput from "../common/AuthInput";
import Button from "../../../components/ui/Button";
import { useLoginForm } from "./hooks/useLoginForm";

interface AuthFormProps {
  onSuccess?: (token: string) => void;
  ariaLabelledBy?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, ariaLabelledBy }) => {
  const { t } = useTranslation("login");
  const { t: tCommon } = useTranslation("common");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const {
    email,
    password,
    rememberMe,
    fieldErrors,
    globalError,
    isLoading,
    handleSubmit,
    updateField,
  } = useLoginForm();

  // console.log("AuthForm rendering, error:", error);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Form submission prevented");
    handleSubmit(e, (token) => {
      if (onSuccess) onSuccess(token);
    });
  };

  return (
    <ErrorBoundary>
      <form
        onSubmit={handleFormSubmit}
        noValidate
        aria-labelledby={ariaLabelledBy}
        className="font-normal"
      >
        <div className="grid gap-y-4 sm:gap-y-6">
          {globalError &&
            (console.log("Rendering error message:", globalError),
            (
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
                <span>{t(`errors.${globalError}`)}</span>
              </div>
            ))}
          <AuthInput
            id="email"
            label={t("email")}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => updateField("email", e.target.value)}
            ref={emailInputRef}
            required
            error={
              fieldErrors.email ? t(`errors.${fieldErrors.email}`) : undefined
            }
          />
          <div>
            <AuthInput
              id="password"
              label={t("password")}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => updateField("password", e.target.value)}
              required
              error={
                fieldErrors.password
                  ? t(`errors.${fieldErrors.password}`)
                  : undefined
              }
            />
          </div>
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="shrink-0 mt-0.5 border-gray-200 rounded-sm text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-2"
              checked={rememberMe}
              onChange={(e) => updateField("rememberMe", e.target.checked)}
              aria-checked={rememberMe}
            />
            <label htmlFor="remember-me" className="ms-3 text-sm font-normal">
              {t("rememberMe")}
            </label>
          </div>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            {tCommon("submit")}
          </Button>
        </div>
      </form>
    </ErrorBoundary>
  );
};

export default AuthForm;
