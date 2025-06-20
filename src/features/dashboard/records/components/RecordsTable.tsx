// src/features/dashboard/records/components/RecordsTable.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";
import RecordModal from "./RecordModal";
import VerifiedRecordModal from "./VerifiedRecordModal";
import VerifyRecordModal from "./VerifyRecordModal";
import AddRecordModal from "./AddRecordModal";
import { useRecordsTable } from "../hooks/useRecordsTable";
import { Record } from "../types/types";
import debounce from "lodash/debounce";

const RecordsTable: React.FC = () => {
  const { t, i18n } = useTranslation("records");
  const { t: tCommon } = useTranslation("common");
  const {
    records,
    allRecords,
    phoneFilter,
    isLoading,
    successMessage,
    error,
    currentPage,
    totalPages,
    setPhoneFilter,
    setCurrentPage,
    fetchRecords,
    selectedRecord,
    setSelectedRecord,
    statusFilter,
    setStatusFilter,
  } = useRecordsTable();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [verifiedRecord, setVerifiedRecord] = useState<Record | null>(null);
  const [phoneError, setPhoneError] = useState("");
  const [localSuccessMessage, setLocalSuccessMessage] = useState("");
  const [localPhoneFilter, setLocalPhoneFilter] = useState(phoneFilter);

  // Create debounced function for phone filter
  const debouncedSetPhoneFilter = useCallback(
    debounce((value: string) => {
      setPhoneError("");
      const trimmedValue = value.trim();
      if (trimmedValue && !/^\+?[0-9]\d{1,14}$/.test(trimmedValue)) {
        setPhoneError("invalidPhoneFormat");
      }
      setPhoneFilter(trimmedValue);
    }, 1000),
    []
  );

  // Update local phone filter when prop changes
  useEffect(() => {
    setLocalPhoneFilter(phoneFilter);
  }, [phoneFilter]);

  useEffect(() => {
    fetchRecords();
  }, [phoneFilter, statusFilter, currentPage, fetchRecords, i18n.language]);

  const handlePhoneFilterChange = (value: string) => {
    setLocalPhoneFilter(value);
    debouncedSetPhoneFilter(value);
  };

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedSetPhoneFilter.cancel();
    };
  }, [debouncedSetPhoneFilter]);

  const handleDeactivateSuccess = () => {
    setLocalSuccessMessage("deactivateSuccess");
    fetchRecords();
  };

  const handleAddRecord = (newRecord: {
    userPhoneNumber: string;
    notesEn: string;
    notesAr: string;
    productId: string;
  }) => {
    setLocalSuccessMessage("addRecordSuccess");
    fetchRecords();
  };

  // Construct the pagination string manually
  const currentPageNumber = currentPage + 1;
  const paginationText = `${t("pagination.pageStart")} ${currentPageNumber} ${t(
    "pagination.pageMiddle"
  )} ${totalPages}`;

  return (
    <div
      className="max-w-full"
      dir={i18n.language === "ar" ? "ltr" : undefined}
    >
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden font-arabic">
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("table.title")}
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    className="py-2 px-3 pr-8 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label={t("table.filterByStatus")}
                  >
                    <option value="all">{t("table.allStatuses")}</option>
                    <option value="active">{t("table.status_active")}</option>
                    <option value="inactive">{t("table.status_inactive")}</option>
                  </select>
                  <input
                    type="text"
                    className="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder={t("table.filterByPhone")}
                    value={localPhoneFilter}
                    onChange={(e) => handlePhoneFilterChange(e.target.value)}
                    aria-label={t("table.filterByPhone")}
                  />
                  <Button
                    onClick={fetchRecords}
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="min-w-fit py-2 px-4 text-sm font-medium rounded-lg bg-primary hover:bg-primary-hover"
                    aria-label={t("table.search")}
                  >
                    {isLoading ? tCommon("loading") : t("table.search")}
                  </Button>
                  <Button
                    onClick={() => setShowVerifyModal(true)}
                    className="min-w-fit py-2 px-4 text-sm font-medium rounded-lg bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg transition-all"
                    disabled={isLoading}
                    aria-label={t("modal.verifyRecord")}
                  >
                    {t("modal.verifyRecord")}
                  </Button>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="min-w-fit py-2 px-4 text-sm font-medium rounded-lg bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg transition-all"
                    disabled={isLoading}
                    aria-label={t("modal.addRecord")}
                  >
                    +
                  </Button>
                </div>
              </div>
              {(successMessage || localSuccessMessage) && (
                <div
                  className="p-3 border border-green-500 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 font-medium m-4"
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{t(localSuccessMessage || successMessage)}</span>
                </div>
              )}
              {(error || phoneError) && (
                <div
                  className="p-3 border border-red-500 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 font-medium m-4"
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
                  <span>{t(phoneError ? `table.${phoneError}` : error)}</span>
                </div>
              )}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.product")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.customerName")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.customerPhone")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.startDate")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.type")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("table.status")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {records.length > 0 ? (
                    records.map((record) => (
                      <tr
                        key={record.record_id}
                        onClick={() => setSelectedRecord(record)}
                        className="cursor-pointer hover:bg-gray-50"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelectedRecord(record);
                          }
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-x-2">
                            <img
                              src={
                                record.product_image ||
                                "https://via.placeholder.com/40"
                              }
                              alt={record.product}
                              className="w-10 h-10 object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/40";
                              }}
                            />
                            <span className="text-sm text-gray-800 font-normal">
                              {record.product}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {record.customerName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {record.customerPhone}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {record.date}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-x-2">
                            {record.type ? (
                              <>
                                <button
                                  className={`py-1 px-3 text-sm font-medium rounded-full border ${
                                    record.type.includes("warranty")
                                      ? "bg-primary text-white"
                                      : "border-primary text-primary hover:bg-green-50"
                                  }`}
                                  aria-label={t("table.warranty")}
                                >
                                  {t("table.warranty")}
                                </button>
                                <button
                                  className={`py-1 px-3 text-sm font-medium rounded-full border ${
                                    record.type.includes("exchange")
                                      ? "bg-primary text-white"
                                      : "border-primary text-primary hover:bg-green-50"
                                  }`}
                                  aria-label={t("table.exchange")}
                                >
                                  {t("table.exchange")}
                                </button>
                                <button
                                  className={`py-1 px-3 text-sm font-medium rounded-full border ${
                                    record.type.includes("return")
                                      ? "bg-primary text-white"
                                      : "border-primary text-primary hover:bg-green-50"
                                  }`}
                                  aria-label={t("table.return")}
                                >
                                  {t("table.return")}
                                </button>
                              </>
                            ) : (
                              <span className="text-sm text-gray-500">
                                {t("table.noTypes")}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${
                              record.status === "active"
                                ? "text-primary"
                                : "text-gray-600"
                            }`}
                          >
                            {t(`table.status_${record.status}`)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {isLoading ? tCommon("loading") : t("table.noResults")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
                  <p className="text-sm text-gray-600">{paginationText}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={currentPage === 0 || isLoading}
                      className="py-2 px-4 text-sm font-medium rounded-lg bg-primary hover:bg-primary-hover"
                      aria-label={t("pagination.previous")}
                    >
                      {t("pagination.previous")}
                    </Button>
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages - 1)
                        )
                      }
                      disabled={currentPage === totalPages - 1 || isLoading}
                      className="py-2 px-4 text-sm font-medium rounded-lg border bg-primary hover:bg-primary-hover"
                      aria-label={t("pagination.next")}
                    >
                      {t("pagination.next")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedRecord && (
        <RecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
      {showVerifyModal && (
        <VerifyRecordModal
          onClose={() => setShowVerifyModal(false)}
          onVerify={(record) => {
            setVerifiedRecord(record);
            setShowVerifyModal(false);
          }}
        />
      )}
      {showAddModal && (
        <AddRecordModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddRecord}
        />
      )}
      {verifiedRecord && (
        <VerifiedRecordModal
          record={verifiedRecord}
          onClose={() => setVerifiedRecord(null)}
          onDeactivateSuccess={handleDeactivateSuccess}
        />
      )}
    </div>
  );
};

export default RecordsTable;
