"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Flame, Footprints, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnits } from '@/context/UnitContext';
import { useHealthData } from '@/context/HealthDataContext';

const HealthSummary = () => {
  const { convertEnergy } = useUnits();
  const { activityLogs, vitalsData, sleepLogs } = useHealthData();

  // Dynamic values computation
  const totalSteps = activityLogs.reduce((acc, log) => acc + log.steps, 0);
  const totalCaloriesBurned = activityLogs.reduce((acc, log) => acc + log.energy, 0);
  const latestHR = vitalsData.hr && vitalsData.hr.length > 0 ? vitalsData.hr[vitalsData.hr.length - 1].value : null;
  const totalSleep = sleepLogs.reduce((acc, log) => acc + log.hrs, 0);

  const stats = [
    { 
      label: 'Heart Rate', 
      value: latestHR !== null ? latestHR.toString() : 'No data', 
      unit: latestHR !== null ? 'bpm' : '', 
      icon: Heart, 
      color: 'bg-[#FFDAD6] text-[#410002] border-[#FFB2AB]' 
    },
    { 
      label: 'Calories Burned', 
      value: totalCaloriesBurned > 0 ? convertEnergy(totalCaloriesBurned).value.toLocaleString() : 'No data', 
      unit: totalCaloriesBurned > 0 ? convertEnergy(totalCaloriesBurned).label : '', 
      icon: Flame, 
      color: 'bg-[#FFE082]/30 text-[#FF8F00] border-[#FFD54F]' 
    },
    { 
      label: 'Steps Taken', 
      value: totalSteps > 0 ? totalSteps.toLocaleString() : 'No data', 
      unit: totalSteps > 0 ? 'steps' : '', 
      icon: Footprints, 
      color: 'bg-[#EADDFF] text-[#21005D] border-[#D0BCFF]' 
    },
    { 
      label: 'Sleep Duration', 
      value: totalSleep > 0 ? totalSleep.toString() : 'No data', 
      unit: totalSleep > 0 ? 'hrs' : '', 
      icon: Moon, 
      color: 'bg-[#D0E1FD] text-[#1A56DB] border-[#A2C4FC]' 
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5">
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className="border border-[#CAC4D0]/40 shadow-none bg-[#F7F2FA] rounded-[24px] overflow-hidden hover:bg-[#ECE6F0] active:scale-[0.98] transition-all duration-200"
        >
          <CardContent className="p-4 flex flex-col justify-between min-h-[140px]">
            <div className={cn("w-10 h-10 rounded-[12px] flex items-center justify-center mb-1 border", stat.color)}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-[11px] text-[#49454F] font-bold tracking-wider uppercase">{stat.label}</p>
              <div className="flex items-baseline gap-0.5 mt-0.5">
                <span className={cn("font-extrabold tracking-tight text-gray-950", stat.value === 'No data' ? 'text-xs text-gray-400' : 'text-xl')}>
                  {stat.value}
                </span>
                {stat.unit && <span className="text-[10px] text-[#49454F] font-bold ml-0.5">{stat.unit}</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HealthSummary;