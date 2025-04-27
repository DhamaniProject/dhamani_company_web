import { useState, useCallback } from "react";

interface Record {
  id: string;
  product: string;
  customerName: string;
  customerPhone: string;
  date: string;
  type: "warranty" | "exchange" | "return";
  status: "active" | "inactive";
  verificationCode: string;
  warrantyDaysRemaining: number;
  returnDaysRemaining: number;
  exchangeDaysRemaining: number;
}

export const useRecordsTable = () => {
  const [allRecords] = useState<Record[]>([
    {
      id: "1",
      product: "Apple Watch",
      customerName: "Anas Alqunaid",
      customerPhone: "+96612345678",
      date: "01/01/2025",
      type: "warranty",
      status: "active",
      verificationCode: "VER12345",
      warrantyDaysRemaining: 365,
      returnDaysRemaining: 0,
      exchangeDaysRemaining: 30,
    },
    {
      id: "2",
      product: "Samsung Galaxy",
      customerName: "Ahmed Ali",
      customerPhone: "+96687654321",
      date: "05/01/2025",
      type: "exchange",
      status: "inactive",
      verificationCode: "VER67890",
      warrantyDaysRemaining: 0,
      returnDaysRemaining: 0,
      exchangeDaysRemaining: 0,
    },
    {
      id: "3",
      product: "Sony Headphones",
      customerName: "Sara Mohammed",
      customerPhone: "+96623456789",
      date: "10/02/2025",
      type: "return",
      status: "inactive",
      verificationCode: "VER54321",
      warrantyDaysRemaining: 0,
      returnDaysRemaining: 0,
      exchangeDaysRemaining: 0,
    },
    {
      id: "4",
      product: "iPhone 14",
      customerName: "Khalid Hassan",
      customerPhone: "+96634567890",
      date: "15/03/2025",
      type: "warranty",
      status: "active",
      verificationCode: "VER09876",
      warrantyDaysRemaining: 300,
      returnDaysRemaining: 14,
      exchangeDaysRemaining: 60,
    },
  ]);
  const [records, setRecords] = useState<Record[]>([]);
  const [phoneFilter, setPhoneFilter] = useState("");
  const [verificationCodeFilter, setVerificationCodeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const pageSize = 2;

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    setSuccessMessage("");
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const filtered = allRecords.filter((record) => {
        const phoneMatch = record.customerPhone
          .toLowerCase()
          .includes(phoneFilter.toLowerCase());
        const verificationCodeMatch = record.verificationCode
          .toLowerCase()
          .includes(verificationCodeFilter.toLowerCase());
        const typeMatch = typeFilter === "all" || record.type === typeFilter;
        const statusMatch =
          statusFilter === "all" || record.status === statusFilter;
        return phoneMatch && verificationCodeMatch && typeMatch && statusMatch;
      });
      const start = currentPage * pageSize;
      const end = start + pageSize;
      setRecords(filtered.slice(start, end));
      setTotalPages(Math.ceil(filtered.length / pageSize));
    } catch (err) {
      setError("error");
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    phoneFilter,
    verificationCodeFilter,
    typeFilter,
    statusFilter,
    currentPage,
    allRecords,
  ]);

  const verifyRecord = async (id: string) => {
    setIsLoading(true);
    setSuccessMessage("");
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage("verifySuccess");
    } catch (err) {
      setError("error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    records,
    phoneFilter,
    verificationCodeFilter,
    typeFilter,
    statusFilter,
    isLoading,
    successMessage,
    error,
    currentPage,
    totalPages,
    selectedRecord,
    setPhoneFilter,
    setVerificationCodeFilter,
    setTypeFilter,
    setStatusFilter,
    setCurrentPage,
    setSelectedRecord,
    fetchRecords,
    verifyRecord,
  };
};
