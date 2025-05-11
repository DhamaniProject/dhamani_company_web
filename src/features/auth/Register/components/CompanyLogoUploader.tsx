import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from "react-i18next";

interface CompanyLogoUploaderProps {
  logo: File | string | null;
  currentLogoUrl: string | null;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

const CompanyLogoUploader: React.FC<CompanyLogoUploaderProps> = ({
  logo,
  currentLogoUrl,
  onChange,
  error,
  disabled
}) => {
  const { t } = useTranslation("profile");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onChange(acceptedFiles[0]);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    disabled
  });

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t("companyLogo")}
      </label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        {logo instanceof File ? (
          <div className="space-y-2">
            <img
              src={URL.createObjectURL(logo)}
              alt={t("logoPreviewAlt")}
              className="mx-auto h-32 w-32 object-contain"
            />
            <p className="text-sm text-gray-500">{logo.name}</p>
          </div>
        ) : currentLogoUrl ? (
          <div className="space-y-2">
            <img
              src={currentLogoUrl}
              alt={t("currentLogoAlt")}
              className="mx-auto h-32 w-32 object-contain"
            />
            <p className="text-sm text-gray-500">{t("currentLogo")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-gray-500">
              {t("uploadPrompt")}
            </p>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CompanyLogoUploader;
