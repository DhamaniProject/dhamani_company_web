// src/features/auth/common/AuthInput.tsx
import React from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ id, label, error, className, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm mb-2 font-normal">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
            error ? "border-red-500" : "border-gray-300"
          } font-normal ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
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

export default AuthInput;
