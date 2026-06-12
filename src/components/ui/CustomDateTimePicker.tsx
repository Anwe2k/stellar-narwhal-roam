"use client";

import React, { useEffect, useState } from 'react';
import { useUnits } from '@/context/UnitContext';
import { Label } from '@/components/ui/label';

interface CustomTimePickerProps {
  label: string;
  value: string; // "HH:MM" 24h format
  onChange: (val: string) => void;
}

export const CustomTimePicker = ({ label, value, onChange }: CustomTimePickerProps) => {
  const { settings } = useUnits();
  const is12h = settings.timeFormat === '12h';

  // Parse initial 24h value
  const [hour, min] = value.split(':').map(Number);
  const initialHour = isNaN(hour) ? 12 : hour;
  const initialMin = isNaN(min) ? 0 : min;

  // Derive initial values for local states
  let displayHour = initialHour;
  let ampm = 'AM';

  if (is12h) {
    ampm = initialHour >= 12 ? 'PM' : 'AM';
    displayHour = initialHour % 12;
    if (displayHour === 0) displayHour = 12;
  }

  const [selectedHour, setSelectedHour] = useState(displayHour);
  const [selectedMin, setSelectedMin] = useState(initialMin);
  const [selectedAmpm, setSelectedAmpm] = useState(ampm);

  useEffect(() => {
    let finalHour = selectedHour;
    if (is12h) {
      if (selectedAmpm === 'PM' && selectedHour < 12) {
        finalHour = selectedHour + 12;
      } else if (selectedAmpm === 'AM' && selectedHour === 12) {
        finalHour = 0;
      }
    }
    const hh = String(finalHour).padStart(2, '0');
    const mm = String(selectedMin).padStart(2, '0');
    onChange(`${hh}:${mm}`);
  }, [selectedHour, selectedMin, selectedAmpm, is12h]);

  const hoursList = is12h 
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i);

  const minsList = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-500 font-medium">{label}</Label>
      <div className="flex gap-2 items-center">
        {/* Hour Select */}
        <select
          value={selectedHour}
          onChange={(e) => setSelectedHour(Number(e.target.value))}
          className="flex-1 bg-white border border-gray-200 rounded-2xl h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] focus:border-transparent appearance-none"
        >
          {hoursList.map((h) => (
            <option key={h} value={h}>
              {String(h).padStart(2, '0')}
            </option>
          ))}
        </select>

        <span className="text-gray-400 font-bold">:</span>

        {/* Minute Select */}
        <select
          value={selectedMin}
          onChange={(e) => setSelectedMin(Number(e.target.value))}
          className="flex-1 bg-white border border-gray-200 rounded-2xl h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] focus:border-transparent appearance-none"
        >
          {minsList.map((m) => (
            <option key={m} value={m}>
              {String(m).padStart(2, '0')}
            </option>
          ))}
        </select>

        {/* AM/PM Select */}
        {is12h && (
          <select
            value={selectedAmpm}
            onChange={(e) => setSelectedAmpm(e.target.value)}
            className="w-16 bg-white border border-gray-200 rounded-2xl h-11 px-2 text-sm font-semibold text-[#6750A4] focus:outline-none focus:ring-2 focus:ring-[#6750A4] focus:border-transparent appearance-none"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        )}
      </div>
    </div>
  );
};

interface CustomDatePickerProps {
  label: string;
  value: string; // "YYYY-MM-DD" raw string format
  onChange: (val: string) => void;
}

export const CustomDatePicker = ({ label, value, onChange }: CustomDatePickerProps) => {
  const { settings } = useUnits();
  const format = settings.dateFormat; // 'DD/MM/YYYY' or 'MM/DD/YYYY'

  // Parse raw input value
  const parsedDate = new Date(value);
  const initialYear = isNaN(parsedDate.getTime()) ? new Date().getFullYear() : parsedDate.getFullYear();
  const initialMonth = isNaN(parsedDate.getTime()) ? new Date().getMonth() + 1 : parsedDate.getMonth() + 1;
  const initialDay = isNaN(parsedDate.getTime()) ? new Date().getDate() : parsedDate.getDate();

  const [day, setDay] = useState(initialDay);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  useEffect(() => {
    const yyyy = String(year).padStart(4, '0');
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
  }, [day, month, year]);

  const daysList = Array.from({ length: 31 }, (_, i) => i + 1);
  const monthsList = Array.from({ length: 12 }, (_, i) => i + 1);
  const yearsList = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  // Dynamic ordering of selectors based on settings format
  const isDMY = format === 'DD/MM/YYYY';

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-500 font-medium">{label}</Label>
      <div className="flex gap-2">
        {isDMY ? (
          <>
            {/* Day Selector */}
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="flex-1 bg-white border border-gray-200 rounded-2xl h-11 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] focus:border-transparent"
            >
              {daysList.map((d) => (
                <option key={d} value={d}>
                  {String(d).padStart(2, '0')} (Day)
                </option>
              ))}
            </select>

            {/* Month Selector */}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="flex-1 bg-white border border-gray-200 rounded-2xl h-11 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] focus:border-transparent"
            >
              {monthsList.map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1, 1).toLocaleString([], { month: 'short' })}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            {/* Month Selector */}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="flex-1 bg-white border border-gray-200 rounded-2xl h-11 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] focus:border-transparent"
            >
              {monthsList.map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1, 1).toLocaleString([], { month: 'short' })}
                </option>
              ))}
            </select>

            {/* Day Selector */}
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="flex-1 bg-white border border-gray-200 rounded-2xl h-11 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] focus:border-transparent"
            >
              {daysList.map((d) => (
                <option key={d} value={d}>
                  {String(d).padStart(2, '0')} (Day)
                </option>
              ))}
            </select>
          </>
        )}

        {/* Year Selector */}
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="flex-1 bg-white border border-gray-200 rounded-2xl h-11 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] focus:border-transparent"
        >
          {yearsList.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};