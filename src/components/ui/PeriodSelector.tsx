"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export type PeriodType = '24h' | 'week' | 'month' | 'year';

interface PeriodSelectorProps {
  value: PeriodType;
  onChange: (value: PeriodType) => void;
  activeColorClass?: string;
  className?: string;
}

const PeriodSelector = ({ value, onChange, className }: PeriodSelectorProps) => {
  const options: { label: string; val: PeriodType }[] = [
    { label: '24H', val: '24h' },
    { label: 'W', val: 'week' },
    { label: 'M', val: 'month' },
    { label: 'Y', val: 'year' },
  ];

  return (
    <div className={cn(
      "flex bg-[#ECE6F0] p-1 rounded-full border border-[#CAC4D0] inline-flex items-center self-center shrink-0 shadow-sm",
      className
    )}>
      {options.map((opt, idx) => {
        const isSelected = value === opt.val;
        return (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(opt.val)}
            className={cn(
              "px-4 py-1.5 text-xs font-bold transition-all duration-200 rounded-full select-none flex items-center justify-center min-w-[50px] relative overflow-hidden",
              isSelected 
                ? "bg-[#E8DEF8] text-[#1D192B] shadow-sm font-extrabold" 
                : "text-[#49454F] hover:bg-[#49454F]/8 active:bg-[#49454F]/12"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default PeriodSelector;