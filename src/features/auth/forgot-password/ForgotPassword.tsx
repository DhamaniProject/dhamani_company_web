import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BlobsBackground from "../common/BlobsBackground";
import { ROUTES } from "../../../constants/routes";
import AuthInput from "../common/AuthInput";
import Button from "../../../components/ui/Button";

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation("forgotPassword");
  const { t: tCommon } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // TODO: Implement the actual password reset request
      // await requestPasswordReset(email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "serverError");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BlobsBackground />
      <div className="relative z-10 bg-white p-6 sm:p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1
          className="text-2xl font-bold text-gray-800 text-center mb-6"
          id="forgot-password-title"
        >
          {t("title")}
        </h1>
        {isSuccess ? (
          <div className="text-center">
            <div className="mb-4 text-green-600">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{t("successMessage")}</p>
            <Link
              to={ROUTES.LOGIN}
              className="text-[var(--color-primary)] hover:underline font-medium"
            >
              {t("backToLogin")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-gray-600 text-center mb-6">
              {t("description")}
            </p>
            {error && (
              <div
                className="p-3 border border-red-500 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"
                role="alert"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{t(`errors.${error}`)}</span>
              </div>
            )}
            <AuthInput
              id="email"
              label={t("email")}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={error === "invalidEmail" ? t("errors.invalidEmail") : undefined}
            />
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              {t("submit")}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              <Link
                to={ROUTES.LOGIN}
                className="text-[var(--color-primary)] hover:underline font-medium"
              >
                {t("backToLogin")}
              </Link>
            </p>
          </form>
        )}
      </div>
    </>
  );
};

export default ForgotPassword; 