import React from "react";
import { useTranslation } from "react-i18next";

interface Transaction {
  product: {
    id: string;
    name: string;
    image: string | null;
    category: string;
  };
  customer: {
    name: string;
    phone: string;
  };
  date: string;
  type: string[];
  status: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading,
}) => {
  const { t, i18n } = useTranslation("dashboard");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}${
      date.getHours() >= 12 ? "PM" : "AM"
    }`;
  };

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
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("dashboard.table.title")}
                </h2>
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
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {t("dashboard.table.loading")}
                      </td>
                    </tr>
                  ) : transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-x-2">
                            <img
                              src={
                                transaction.product.image ||
                                "https://via.placeholder.com/40"
                              }
                              alt={transaction.product.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <span className="text-sm text-gray-800 font-normal">
                              {transaction.product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {transaction.customer.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {transaction.customer.phone}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 font-normal">
                            {formatDate(transaction.date)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-x-2">
                            <button
                              className={`py-1 px-3 text-sm font-medium rounded-full border ${
                                transaction.type.includes("Warranty")
                                  ? "border-green-600 bg-green-600 text-white"
                                  : "border-green-500 text-green-500 hover:bg-green-50"
                              }`}
                              aria-label={t("dashboard.table.warranty")}
                            >
                              {t("dashboard.table.warranty")}
                            </button>
                            <button
                              className={`py-1 px-3 text-sm font-medium rounded-full border ${
                                transaction.type.includes("Exchange")
                                  ? "border-pink-600 bg-pink-600 text-white"
                                  : "border-pink-500 text-pink-500 hover:bg-pink-50"
                              }`}
                              aria-label={t("dashboard.table.exchange")}
                            >
                              {t("dashboard.table.exchange")}
                            </button>
                            <button
                              className={`py-1 px-3 text-sm font-medium rounded-full border ${
                                transaction.type.includes("Return")
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
                              transaction.status.toLowerCase() === "active"
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {t(
                              `dashboard.table.status_${transaction.status.toLowerCase()}`
                            )}
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
                        {t("dashboard.table.noResults")}
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
