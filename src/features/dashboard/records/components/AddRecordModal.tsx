// src/features/dashboard/records/components/AddRecordModal.tsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import AuthInput from "../../../auth/common/AuthInput";
import { fetchProducts, createRecord } from "../services/recordService";
import { useAuth } from "../../../../context/AuthContext";
import debounce from "lodash/debounce";

interface AddRecordModalProps {
  onClose: () => void;
  onAdd: (record: {
    userPhoneNumber: string;
    notesEn: string;
    notesAr: string;
    productId: string;
    serialNumber: string;
  }) => void;
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({ onClose, onAdd }) => {
  const { t, i18n } = useTranslation("records");
  const { user } = useAuth();
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [notesEn, setNotesEn] = useState("");
  const [notesAr, setNotesAr] = useState("");
  const [productId, setProductId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!user?.company_id) {
        setError("modal.noCompanyId");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetchProducts(user.company_id, query || null);
        const currentLang = i18n.language === "ar" ? 2 : 1;
        const productList = response.data.map((product) => {
          const translation =
            product.translations.find((t) => t.language_id === currentLang) ||
            product.translations[0];
          return {
            id: product.product_id,
            name: translation.product_name,
          };
        });
        setProducts(productList);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    [user?.company_id, i18n.language]
  );

  // Initial load of products
  useEffect(() => {
    debouncedSearch("");
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleAddRecord = async () => {
    setError("");
    setIsLoading(true);

    if (!userPhoneNumber || !/^\+?[0-9]\d{1,14}$/.test(userPhoneNumber)) {
      setError("table.invalidPhoneFormat");
      setIsLoading(false);
      return;
    }
    if (!productId) {
      setError("modal.productRequired");
      setIsLoading(false);
      return;
    }
    if (!user?.company_id) {
      setError("modal.noCompanyId");
      setIsLoading(false);
      return;
    }
    if (!serialNumber.trim()) {
      setError("modal.serialNumberRequired");
      setIsLoading(false);
      return;
    }

    try {
      const recordData = {
        user_phone_number: userPhoneNumber,
        product_id: productId,
        notesEn,
        notesAr,
        serial_number: serialNumber.trim(),
      };
      await createRecord(user.company_id, recordData);
      onAdd({
        userPhoneNumber,
        notesEn,
        notesAr,
        productId,
        serialNumber,
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200"
        role="dialog"
        aria-labelledby="add-record-modal-title"
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2
            id="add-record-modal-title"
            className="text-xl font-semibold text-gray-800"
          >
            {t("modal.addRecordTitle")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={t("modal.close")}
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
        {error && (
          <div
            className="p-3 border border-red-500 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 font-medium mb-4"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{t(error)}</span>
          </div>
        )}
        <div className="grid gap-4">
          <AuthInput
            id="userPhoneNumber"
            label={t("modal.userPhoneNumber")}
            placeholder={t("modal.userPhoneNumberPlaceholder")}
            value={userPhoneNumber}
            onChange={(e) => setUserPhoneNumber(e.target.value)}
            disabled={isLoading}
          />
          <AuthInput
            id="serialNumber"
            label={t("modal.serialNumber")}
            placeholder={t("modal.serialNumberPlaceholder")}
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            disabled={isLoading}
          />
          <AuthInput
            id="notesEn"
            label={t("modal.notesEn")}
            placeholder={t("modal.notesEnPlaceholder")}
            value={notesEn}
            onChange={(e) => setNotesEn(e.target.value)}
            disabled={isLoading}
          />
          <AuthInput
            id="notesAr"
            label={t("modal.notesAr")}
            placeholder={t("modal.notesArPlaceholder")}
            value={notesAr}
            onChange={(e) => setNotesAr(e.target.value)}
            disabled={isLoading}
          />
          <div className="relative">
            <label
              htmlFor="product"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              {t("modal.product")}
            </label>
            <div className="relative" ref={dropdownRef}>
              <input
                id="product"
                type="text"
                className="w-full py-2 px-3 pr-10 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder={t("modal.productSearchPlaceholder")}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsDropdownOpen(true)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isLoading}
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-2 text-center text-gray-500">
                      {t("loading")}
                    </div>
                  ) : products.length > 0 ? (
                    products.map((product) => (
                      <div
                        key={product.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setProductId(product.id);
                          setSearchQuery(product.name);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {product.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-center text-gray-500">
                      {t("modal.noProductsFound")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            onClick={handleAddRecord}
            className="py-2 px-4 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
            disabled={isLoading}
            aria-label={t("modal.addRecord")}
          >
            {t("modal.addRecord")}
          </Button>
          <Button
            onClick={onClose}
            className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
            disabled={isLoading}
            aria-label={t("modal.close")}
          >
            {t("modal.close")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddRecordModal;
