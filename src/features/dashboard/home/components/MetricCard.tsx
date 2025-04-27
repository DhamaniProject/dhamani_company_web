import React from "react";
import { IconType } from "@heroicons/react/24/outline";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  iconBgColor: string;
  iconColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4">
      <div className={`p-3 rounded-full ${iconBgColor}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;
