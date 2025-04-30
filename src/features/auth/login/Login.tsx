import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import AuthForm from "./AuthForm";
import BlobsBackground from "../common/BlobsBackground";
import { ROUTES } from "../../../constants/routes";

const Login: React.FC = () => {
  const { t } = useTranslation("login");
  const navigate = useNavigate();

  console.log("Login component rendered");

  const handleSuccess = (token: string) => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <>
      <BlobsBackground />
      <div className="relative z-10 bg-white p-6 sm:p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1
          className="text-2xl font-bold text-gray-800 text-center mb-6"
          id="login-title"
        >
          {t("title")}
        </h1>
        <div className="mt-5">
          <AuthForm onSuccess={handleSuccess} ariaLabelledBy="login-title" />
        </div>
        <p className="mt-4 text-sm text-gray-600 text-center font-normal">
          {t("signUpPrompt")}
          <Link
            to={ROUTES.REGISTER}
            className="text-[var(--color-primary)] hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            aria-label={t("signUpLinkAria")}
          >
            {t("signUpHere")}
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
