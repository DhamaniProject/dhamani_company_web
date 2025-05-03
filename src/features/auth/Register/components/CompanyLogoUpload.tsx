import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";

interface CompanyLogoUploadProps {
  onLogoChange: (file: File) => void;
  onLogoRemove: () => void;
  logo: File | null;
  error?: string;
}

const CompanyLogoUpload: React.FC<CompanyLogoUploadProps> = ({
  onLogoChange,
  onLogoRemove,
  logo,
  error,
}) => {
  const { t } = useTranslation("register");
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onLogoChange(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onLogoChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
  });

  const handleRemove = () => {
    setPreview(null);
    onLogoRemove();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t("companyLogo")}
      </label>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
            : error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-[var(--color-primary)]"
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt={t("logoPreview")}
              className="max-h-48 mx-auto rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              aria-label={t("removeLogo")}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div className="text-sm text-gray-600">
              {isDragActive ? (
                <p>{t("dropLogoHere")}</p>
              ) : (
                <p>
                  {t("dragAndDropLogo")} <br />
                  <span className="text-xs text-gray-500">
                    {t("logoRequirements")}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CompanyLogoUpload; 