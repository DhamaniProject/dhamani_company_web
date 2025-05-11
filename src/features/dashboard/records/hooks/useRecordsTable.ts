// src/features/dashboard/records/hooks/useRecordsTable.ts

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { fetchRecords as fetchRecordsFromAPI} from "../services/recordService";
import { Record } from "../types/types";
import { useAuth } from "../../../../context/AuthContext";

export const useRecordsTable = () => {
  const { i18n } = useTranslation("records");
  const { user } = useAuth();
  const [records, setRecords] = useState<Record[]>([]);
  const [phoneFilter, setPhoneFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const pageSize = 10;

  const fetchRecords = useCallback(async () => {
    if (!user?.company_id) {
      setError("noCompanyId");
      setRecords([]);
      setTotalPages(1);
      setTotalItems(0);
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");
    setError("");
    try {
      const trimmedPhoneFilter = phoneFilter.trim();
      const phoneFilterToSend =
        trimmedPhoneFilter && /^\+?[0-9]\d{1,14}$/.test(trimmedPhoneFilter)
          ? trimmedPhoneFilter
          : null;

      // Convert status filter to boolean or undefined
      const statusToSend =
        statusFilter === "active"
          ? true
          : statusFilter === "inactive"
            ? false
            : undefined; // do not send param for "all"

      console.log("Status to send:", statusToSend);

      const response = await fetchRecordsFromAPI(
        user.company_id,
        phoneFilterToSend,
        currentPage + 1,
        pageSize,
        statusToSend
      );
      const mappedRecords: Record[] = response.data.map((item) => {
        const enProductTranslation = item.product_translations.find(
          (t) => t.language_id === 1
        );
        const arProductTranslation = item.product_translations.find(
          (t) => t.language_id === 2
        );
        const currentLang = i18n.language === "ar" ? 2 : 1;
        const productTranslation =
          item.product_translations.find(
            (t) => t.language_id === currentLang
          ) || enProductTranslation;

        const now = new Date();
        const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
        
        const eligibleTypes: string[] = [];

        if (!item.is_active) {
        } else {
          if (item.warranty_end_date) {
            const warrantyEndDate = new Date(item.warranty_end_date);
            if (now <= warrantyEndDate) {
              eligibleTypes.push("warranty");
            }
          }
          if (item.exchange_end_date) {
            const exchangeEndDate = new Date(item.exchange_end_date);
            if (now <= exchangeEndDate) {
              eligibleTypes.push("exchange");
            }
          }
          if (item.return_end_date) {
            const returnEndDate = new Date(item.return_end_date);
            if (now <= returnEndDate) {
              eligibleTypes.push("return");
            }
          }
        }

        const type = eligibleTypes.length > 0 ? eligibleTypes : null;

        const warrantyDaysRemaining = item.warranty_end_date
          ? Math.max(
              Math.ceil(
                (new Date(Date.UTC(
                  new Date(item.warranty_end_date).getFullYear(),
                  new Date(item.warranty_end_date).getMonth(),
                  new Date(item.warranty_end_date).getDate()
                )).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              ),
              0
            )
          : 0;
        const exchangeDaysRemaining = item.exchange_end_date
          ? Math.max(
              Math.ceil(
                (new Date(Date.UTC(
                  new Date(item.exchange_end_date).getFullYear(),
                  new Date(item.exchange_end_date).getMonth(),
                  new Date(item.exchange_end_date).getDate()
                )).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              ),
              0
            )
          : 0;
        const returnDaysRemaining = item.return_end_date
          ? Math.max(
              Math.ceil(
                (new Date(Date.UTC(
                  new Date(item.return_end_date).getFullYear(),
                  new Date(item.return_end_date).getMonth(),
                  new Date(item.return_end_date).getDate()
                )).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              ),
              0
            )
          : 0;

        const mappedRecord = {
          ...item,
          product: productTranslation?.product_name || "Unknown",
          customerName: `${item.first_name} ${item.last_name}`,
          customerPhone: item.user_phone_number,
          date: new Date(item.start_date).toLocaleDateString(),
          type,
          status: item.is_active ? "active" : "inactive",
          verificationCode: item.record_id,
          warrantyDaysRemaining,
          returnDaysRemaining,
          exchangeDaysRemaining,
        };
        console.log("Mapped record:", mappedRecord);
        return mappedRecord;
      });

      setRecords(mappedRecords);
      setTotalPages(response.total_pages || 1);
      setTotalItems(response.total_items || 0);
      setError("");
    } catch (err: any) {
      setError(err.message || "fetchRecordsError");
      setRecords([]);
      setTotalPages(1);
      setTotalItems(0);
      console.log("Fetch records error in hook:", err);
    } finally {
      setIsLoading(false);
    }
  }, [phoneFilter, statusFilter, currentPage, i18n.language, user?.company_id]);

  return {
    records,
    allRecords: records,
    phoneFilter,
    statusFilter,
    isLoading,
    successMessage,
    error,
    currentPage,
    totalPages,
    selectedRecord,
    setPhoneFilter,
    setStatusFilter,
    setCurrentPage,
    setSelectedRecord,
    fetchRecords,
  };
};
