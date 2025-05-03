import React from 'react';
import { useTranslation } from 'react-i18next';

interface StatusMessageProps {
  type: 'success' | 'error';
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message }) => {
  const { t } = useTranslation("warrantyProviders");
  
  const styles = {
    success: {
      border: 'border-green-500',
      bg: 'bg-green-50',
      text: 'text-green-700',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      ),
    },
    error: {
      border: 'border-red-500',
      bg: 'bg-red-50',
      text: 'text-red-700',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
  };

  const style = styles[type];

  return (
    <div
      className={`p-3 border ${style.border} ${style.bg} ${style.text} rounded-lg flex items-center gap-2 font-medium mb-4`}
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
        {style.icon}
      </svg>
      <span>{t(message)}</span>
    </div>
  );
};

export default StatusMessage; 