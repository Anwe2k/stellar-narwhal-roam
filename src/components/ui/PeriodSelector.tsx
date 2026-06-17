"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export type PeriodType = '24h' | 'week' | 'month' | 'year';

interface PeriodSelectorProps {
  value: PeriodType;
  onChange: (value: PeriodType) => void;
  className?: string;
  activeColorClass?: string;
}

const PeriodSelector = ({ value, onChange, className, activeColorClass = "text-[#6750A4]" }: PeriodSelectorProps) => {
  const periods: { key: PeriodType; label: string }[] = [
    { key: '24h', label: '24H' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' }
  ];

  return (
    <div className={cn("flex bg-gray-100/80 p-1 rounded-2xl w-full max-w-xs", className)}>
      {periods.map((period) => (
        <button
          key={period.key}
          type="button"
          onClick={() => onChange(period.key)}
          className={cn(
            "flex-1 py-1.5 text-[11px] font-bold rounded-xl transition-all duration-200",
            value === period.key
              ? `bg-white shadow-sm scale-[1.02] ${activeColorClass}`
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;