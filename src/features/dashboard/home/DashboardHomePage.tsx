import React from "react";
import { useTranslation } from "react-i18next";
import MetricCard from "./components/MetricCard";
import TransactionChart from "./components/TransactionChart";
import TransactionTable from "./components/TransactionTable";
import {
  ShieldCheckIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const DashboardHomePage: React.FC = () => {
  const { t } = useTranslation("dashboard");

  const metrics = [
    {
      title: t("dashboard.metrics.totalWarranties"),
      value: "40,689",
      icon: ShieldCheckIcon,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      title: t("dashboard.metrics.eligibleReturns"),
      value: "10,293",
      icon: ArrowUturnLeftIcon,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      title: t("dashboard.metrics.eligibleExchanges"),
      value: "15,340",
      icon: ArrowPathIcon,
      iconBgColor: "bg-pink-100",
      iconColor: "text-pink-500",
    },
    {
      title: t("dashboard.metrics.averageRating"),
      value: "4.3",
      icon: StarIcon,
      iconBgColor: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
  ];

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
        {metrics.map((metric) => (
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
        <TransactionTable />
      </div>
    </div>
  );
};

export default DashboardHomePage;
