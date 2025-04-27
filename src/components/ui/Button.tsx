// src/components/Button.tsx
import React from "react";
import { useTranslation } from "react-i18next";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  isLoading,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const { t } = useTranslation("common");
  console.log("Button rendering, isLoading:", isLoading, "children:", children);

  const baseStyles =
    "w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent transition-all";
  const variantStyles = {
    primary:
      "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
    secondary:
      "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:bg-opacity-90",
    outline:
      "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${
        isLoading || disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      disabled={disabled || isLoading}
      aria-disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {t("loading")}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
