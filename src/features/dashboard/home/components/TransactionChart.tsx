import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const [selectedMonth, setSelectedMonth] = useState("january");

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

  // Get the month index (1-12) for the selected month
  const monthIndex = months.indexOf(selectedMonth) + 1;
  const monthStr = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;

  // Generate labels for 30 days
  const labels = Array.from({ length: 30 }, (_, i) => {
    const day = (i + 1).toString().padStart(2, "0");
    return `${day}/${monthStr}/25`;
  });

  // Generate mock transaction data for 30 days
  // Extend the existing pattern and add more data
  const baseTransactions = [
    200, 300, 400, 868, 500, 600, 550, 700, 650, 600, 500, 450,
  ];
  const transactions = Array.from({ length: 30 }, (_, i) => {
    if (i < baseTransactions.length) {
      return baseTransactions[i];
    }
    // Generate random data for remaining days (between 200 and 900 to stay within chart range)
    return Math.floor(Math.random() * (900 - 200 + 1)) + 200;
  });

  const mockData = {
    labels,
    transactions,
  };

  const chartData = {
    labels: mockData.labels,
    datasets: [
      {
        label: t("dashboard.chart.transactions"),
        data: mockData.transactions,
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
          maxTicksLimit: 10, // Limit the number of ticks to avoid clutter
        },
      },
      y: {
        beginAtZero: true,
        max: 1000,
        ticks: {
          stepSize: 200,
        },
      },
    },
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg max-w-full"
      dir={i18n.language === "ar" ? "ltr" : undefined}
    >
      <div className="flex justify-between items-center p-6 pb-4">
        <h2 className="text-xl font-semibold font-arabic text-gray-800">
          {t("dashboard.chart.title")}
        </h2>
        <select
          className="py-2 px-3 text-sm font-arabic font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          aria-label={t("dashboard.chart.title")}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {t(`dashboard.months.${month}`)}
            </option>
          ))}
        </select>
      </div>
      <div className="h-64 px-6 pb-6">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TransactionChart;
