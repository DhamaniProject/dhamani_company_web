import React from "react";
import { useTranslation } from "react-i18next";

interface RegistrationStepsProps {
  currentStep: number;
  totalSteps: number;
}

const RegistrationSteps: React.FC<RegistrationStepsProps> = ({
  currentStep,
  totalSteps,
}) => {
  const { t } = useTranslation("register");
  const steps = [
    t("companyInfoStep"),
    t("userInfoStep"),
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              index <= currentStep ? "text-[var(--color-primary)]" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                index <= currentStep
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm font-medium">{step}</span>
          </div>
        ))}
      </div>
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-[var(--color-primary)] -translate-y-1/2 transition-all duration-300"
          style={{
            width: `${(currentStep / (totalSteps - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default RegistrationSteps; 