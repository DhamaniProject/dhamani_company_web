import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import BlobsBackground from "../common/BlobsBackground";
import { ROUTES } from "../../../constants/routes";

const Register: React.FC = () => {
  const { t } = useTranslation("register");
  const navigate = useNavigate();

  const handleSuccess = (token: string) => {
    console.log("Registration successful, token:", token);
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <>
      <BlobsBackground />
      <div className="relative z-10 bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
        <h1
          className="text-2xl font-bold text-gray-800 text-center mb-6"
          id="register-title"
        >
          {t("title")}
        </h1>
        <div className="mt-5">
          <RegisterForm onSuccess={handleSuccess} />
        </div>
        <p className="mt-4 text-sm text-gray-600 text-center font-normal">
          {t("signInPrompt")}
          <Link
            to={ROUTES.LOGIN}
            className="text-[var(--color-primary)] hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            aria-label={t("signInLinkAria")}
          >
            {t("signIn")}
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
