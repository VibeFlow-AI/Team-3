"use client";

import { FilterSectionProps } from "./types";

export default function FilterSection({ filterStatus, onFilterChange, statusCounts }: FilterSectionProps) {
  const filterButtons = [
    {
      key: "all",
      label: `All Sessions (${statusCounts.total})`,
      activeClass: "bg-black text-white",
      inactiveClass: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
    },
    {
      key: "upcoming",
      label: `Upcoming (${statusCounts.upcoming})`,
      activeClass: "bg-blue-600 text-white",
      inactiveClass: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
    },
    {
      key: "completed",
      label: `Completed (${statusCounts.completed})`,
      activeClass: "bg-green-600 text-white",
      inactiveClass: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
    },
    {
      key: "cancelled",
      label: `Cancelled (${statusCounts.cancelled})`,
      activeClass: "bg-red-600 text-white",
      inactiveClass: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {filterButtons.map((button) => (
          <button
            key={button.key}
            onClick={() => onFilterChange(button.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === button.key ? button.activeClass : button.inactiveClass
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
