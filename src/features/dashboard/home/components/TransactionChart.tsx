import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { getTransactionChartData } from "../services/dashboardService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TransactionChart: React.FC = () => {
  const { t, i18n } = useTranslation("dashboard");

  const {
    data: chartResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactionChart"],
    queryFn: getTransactionChartData,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const labels =
    chartResponse?.data.map((entry) => {
      const date = new Date(entry.date);
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
    }) || [];

  const transactions =
    chartResponse?.data.map((entry) => entry.transactionCount) || [];

  const chartData = {
    labels,
    datasets: [
      {
        label: t("dashboard.chart.transactions"),
        data: transactions,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(34, 197, 94)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(34, 197, 94)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg max-w-full p-6">
        <h2 className="text-xl font-semibold font-arabic text-gray-800">
          {t("dashboard.chart.title")}
        </h2>
        <p className="text-red-500">
          Error loading chart data: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl shadow-lg max-w-full"
      dir={i18n.language === "ar" ? "ltr" : undefined}
    >
      <div className="p-6 pb-4">
        <h2 className="text-xl font-semibold font-arabic text-gray-800">
          {t("dashboard.chart.title")}
        </h2>
      </div>
      {isLoading ? (
        <div className="h-64 px-6 pb-6 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">
            {t("dashboard.table.loading")}
          </div>
        </div>
      ) : (
        <div className="h-64 px-6 pb-6">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default TransactionChart;
