import React from "react";
import { useTranslation } from "react-i18next";

interface ApiKeyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
  rightAdornment?: React.ReactNode;
}

const ApiKeyInput = React.forwardRef<HTMLInputElement, ApiKeyInputProps>(
  ({ id, label, error, className, rightAdornment, ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label htmlFor={id} className="block text-sm mb-2 font-normal">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
            error ? "border-red-500" : "border-gray-300"
          } font-mono text-xl text-center bg-gray-100 ${className} ${rightAdornment ? 'pr-12' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {rightAdornment && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightAdornment}
          </div>
        )}
        {error && (
          <p
            id={`${id}-error`}
            className="text-red-500 text-sm mt-1 font-medium"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default ApiKeyInput; 