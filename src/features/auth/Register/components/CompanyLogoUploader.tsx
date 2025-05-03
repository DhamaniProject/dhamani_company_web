import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  logo: File | null;
  currentLogoUrl?: string | null;
  onChange: (file: File | null) => void;
  error?: string;
}

const CompanyLogoUploader: React.FC<Props> = ({ logo, currentLogoUrl, onChange, error }) => {
  const { t } = useTranslation("profile");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (logo) {
      setPreviewUrl(URL.createObjectURL(logo));
    } else if (currentLogoUrl) {
      setPreviewUrl(currentLogoUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [logo, currentLogoUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file || null);
  };

  const handleRemove = () => {
    onChange(null);
    const input = document.getElementById("logo") as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div>
      <label
        htmlFor="logo"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {t("companyLogo")}
      </label>
      <div className="relative w-full">
        <label
          htmlFor="logo"
          className={`flex items-center justify-center w-full h-32 px-4 transition bg-gray-50 border-2 border-dashed rounded-lg cursor-pointer ${
            error ? "border-red-500" : "border-gray-300"
          } text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]`}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={t("logoPreviewAlt")}
              className="h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center text-center">
              <svg
                className="w-10 h-10 mb-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5V8.25A2.25 2.25 0 015.25 6h1.982a2.25 2.25 0 001.933-1.07l.616-.987A2.25 2.25 0 0111.5 3h1a2.25 2.25 0 011.719.823l.616.987A2.25 2.25 0 0016.767 6H18.75A2.25 2.25 0 0121 8.25v8.25m-3 0H6"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 13l2.25 2.25L15 11.25"
                />
              </svg>
              <p className="text-sm font-medium">{t("uploadPrompt")}</p>
              <p className="text-xs text-gray-400 font-normal">
                {t("uploadFormats")}
              </p>
            </div>
          )}
        </label>
        <input
          id="logo"
          name="logo"
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          onChange={handleFileChange}
        />
        {logo && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-1 shadow-sm hover:bg-gray-100"
            aria-label={t("removeLogoAria")}
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      {logo && (
        <p className="mt-2 text-sm text-gray-600 font-normal">
          <strong className="font-semibold">{t("selected")}</strong> {logo.name}
        </p>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};

export default CompanyLogoUploader;
