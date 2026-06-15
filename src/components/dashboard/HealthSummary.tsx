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
      color: 'bg-red-100 text-red-600' 
    },
    { 
      label: 'Calories Burned', 
      value: totalCaloriesBurned > 0 ? convertEnergy(totalCaloriesBurned).value.toLocaleString() : 'No data', 
      unit: totalCaloriesBurned > 0 ? convertEnergy(totalCaloriesBurned).label : '', 
      icon: Flame, 
      color: 'bg-orange-100 text-orange-600' 
    },
    { 
      label: 'Steps', 
      value: totalSteps > 0 ? totalSteps.toLocaleString() : 'No data', 
      unit: totalSteps > 0 ? 'steps' : '', 
      icon: Footprints, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      label: 'Sleep', 
      value: totalSleep > 0 ? totalSleep.toString() : 'No data', 
      unit: totalSleep > 0 ? 'hrs' : '', 
      icon: Moon, 
      color: 'bg-purple-100 text-purple-600' 
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-none bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-5">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3", stat.color)}>
              <stat.icon size={20} />
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={cn("font-bold", stat.value === 'No data' ? 'text-sm text-gray-400' : 'text-2xl')}>{stat.value}</span>
              {stat.unit && <span className="text-xs text-gray-400">{stat.unit}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HealthSummary;