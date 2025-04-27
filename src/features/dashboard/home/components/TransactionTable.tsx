import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const TransactionTable: React.FC = () => {
  const { t, i18n } = useTranslation("dashboard");
  const [selectedMonth, setSelectedMonth] = useState("january");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data with type and status fields
  const transactions = [
    {
      product: "Apple Watch",
      customerName: "Anas Alqunaid",
      customerPhone: "+966 12345678",
      date: "01/01/2025 12:40PM",
      type: "warranty",
      status: "active",
    },
    {
      product: "Apple Watch",
      customerName: "Ahmed Ali",
      customerPhone: "+966 12345678",
      date: "05/01/2025 12:40PM",
      type: "exchange",
      status: "inactive",
    },
  ];

  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  // Fetch filtered transactions (mock API call)
  const fetchFilteredTransactions = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const filtered = transactions.filter((transaction) => {
        // Month filter
        const transactionMonth = transaction.date.split("/")[1];
        const monthIndex = months.indexOf(selectedMonth) + 1;
        const monthMatch =
          transactionMonth ===
          (monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`);

        // Type filter
        const typeMatch =
          selectedType === "all" || transaction.type === selectedType;

        // Status filter
        const statusMatch =
          selectedStatus === "all" || transaction.status === selectedStatus;

        // Phone number filter
        const phoneMatch = transaction.customerPhone
          .toLowerCase()
          .includes(phoneFilter.toLowerCase());

        return monthMatch && typeMatch && statusMatch && phoneMatch;
      });

      setFilteredTransactions(filtered);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setFilteredTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load all transactions initially
  useEffect(() => {
    fetchFilteredTransactions();
  }, []);

  return (
    <div
      className="max-w-full"
      dir={i18n.language === "ar" ? "ltr" : undefined}
    >
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden font-arabic">
              {/* Header */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("dashboard.table.title")}
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Month Filter */}
                  <select
                    className="py-2 px-3 pr-8 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    aria-label={t("dashboard.table.title")}
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {t(`dashboard.months.${month}`)}
                      </option>
                    ))}
                  </select>
                  {/* Type Filter */}
                  <select
                    className="py-2 px-3 pr-8 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    aria-label={t("dashboard.table.type")}
                  >
                    <option value="all">{t("dashboard.table.allTypes")}</option>
                    <option value="warranty">
                      {t("dashboard.table.warranty")}
                    </option>
                    <option value="exchange">
                      {t("dashboard.table.exchange")}
                    </option>
                    <option value="return">
                      {t("dashboard.table.return")}
                    </option>
                  </select>
                  {/* Status Filter */}
                  <select
                    className="py-2 px-3 pr-8 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={selectedStatus}
                    onChange={(e) => setSelectedType(e.target.value)}
                    aria-label={t("dashboard.table.status")}
                  >
                    <option value="all">
                      {t("dashboard.table.allStatuses")}
                    </option>
                    <option value="active">
                      {t("dashboard.table.status_active")}
                    </option>
                    <option value="inactive">
                      {t("dashboard.table.status_inactive")}
                    </option>
                  </select>
                  {/* Phone Number Filter */}
                  <input
                    type="text"
                    className="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder={t("dashboard.table.filterByPhone")}
                    value={phoneFilter}
                    onChange={(e) => setPhoneFilter(e.target.value)}
                    aria-label={t("dashboard.table.filterByPhone")}
                  />
                  {/* Search Button */}
                  <button
                    className="py-2 px-4 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50 transition-colors duration-200"
                    onClick={fetchFilteredTransactions}
                    disabled={isLoading}
                    aria-label={t("dashboard.table.search")}
                  >
                    {isLoading
                      ? t("dashboard.table.loading")
                      : t("dashboard.table.search")}
                  </button>
                </div>
              </div>
              {/* End Header */}

              {/* Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("dashboard.table.product")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("dashboard.table.customerName")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("dashboard.table.customerPhone")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("dashboard.table.date")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("dashboard.table.type")}
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {t("dashboard.table.status")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-x-2">
                            <img
                              src="https://via.placeholder.com/40"
                              alt={transaction.product}
                              className="w-10 h-10 rounded-full"
                            />
                            <span className="text-sm text-gray-800 font-normal">
                              {transaction.product}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {transaction.customerName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {transaction.customerPhone}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {transaction.date}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-x-2">
                            <button
                              className={`py-1 px-3 text-sm font-medium rounded-full border ${
                                transaction.type === "warranty"
                                  ? "border-green-600 bg-green-600 text-white"
                                  : "border-green-500 text-green-500 hover:bg-green-50"
                              }`}
                              aria-label={t("dashboard.table.warranty")}
                            >
                              {t("dashboard.table.warranty")}
                            </button>
                            <button
                              className={`py-1 px-3 text-sm font-medium rounded-full border ${
                                transaction.type === "exchange"
                                  ? "border-pink-600 bg-pink-600 text-white"
                                  : "border-pink-500 text-pink-500 hover:bg-pink-50"
                              }`}
                              aria-label={t("dashboard.table.exchange")}
                            >
                              {t("dashboard.table.exchange")}
                            </button>
                            <button
                              className={`py-1 px-3 text-sm font-medium rounded-full border ${
                                transaction.type === "return"
                                  ? "border-gray-600 bg-gray-600 text-white"
                                  : "border-gray-500 text-gray-500 hover:bg-gray-50"
                              }`}
                              aria-label={t("dashboard.table.return")}
                            >
                              {t("dashboard.table.return")}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${
                              transaction.status === "active"
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {t(`dashboard.table.status_${transaction.status}`)}
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
                        {isLoading
                          ? t("dashboard.table.loading")
                          : t("dashboard.table.noResults")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* End Table */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
