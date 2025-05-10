import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import MetricCard from "./components/MetricCard";
import TransactionChart from "./components/TransactionChart";
import TransactionTable from "./components/TransactionTable";
import {
  ShieldCheckIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { getDashboardOverview } from "./services/dashboardService";

const DashboardHomePage: React.FC = () => {
  const { t } = useTranslation("dashboard");

  const {
    data: overview,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: getDashboardOverview,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const metrics = overview?.data
    ? [
        {
          title: t("dashboard.metrics.totalWarranties"),
          value: overview.data.totalWarranties.toString(),
          icon: ShieldCheckIcon,
          iconBgColor: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          title: t("dashboard.metrics.eligibleReturns"),
          value: overview.data.eligibleReturns.toString(),
          icon: ArrowUturnLeftIcon,
          iconBgColor: "bg-blue-100",
          iconColor: "text-blue-500",
        },
        {
          title: t("dashboard.metrics.eligibleExchanges"),
          value: overview.data.eligibleExchanges.toString(),
          icon: ArrowPathIcon,
          iconBgColor: "bg-pink-100",
          iconColor: "text-pink-500",
        },
        {
          title: t("dashboard.metrics.averageRating"),
          value: overview.data.averageRating.toFixed(1),
          icon: StarIcon,
          iconBgColor: "bg-yellow-100",
          iconColor: "text-yellow-500",
        },
      ]
    : [];

  if (error) {
    return (
      <div className="p-6 max-w-full overflow-x-hidden">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {t("dashboard.title")}
        </h1>
        <p className="text-red-500">
          Error loading dashboard data: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-x-hidden">
      <h1
        className="text-2xl font-bold text-gray-800 mb-6"
        aria-label={t("dashboard.title")}
      >
        {t("dashboard.title")}
      </h1>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-gray-200 w-12 h-12"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))
          : metrics.map((metric) => (
              <MetricCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                iconBgColor={metric.iconBgColor}
                iconColor={metric.iconColor}
              />
            ))}
      </div>
      {/* Transaction Chart */}
      <div className="mb-6 max-w-full">
        <TransactionChart />
      </div>
      {/* Transaction Table */}
      <div className="max-w-full">
        <TransactionTable
          transactions={overview?.data.recentTransactions || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default DashboardHomePage;
