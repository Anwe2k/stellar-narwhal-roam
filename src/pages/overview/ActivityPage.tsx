"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Footprints } from 'lucide-react';
import { useUnits } from '@/context/UnitContext';
import { useHealthData } from '@/context/HealthDataContext';
import { CustomTimePicker, CustomDatePicker } from '@/components/ui/CustomDateTimePicker';
import { showSuccess, showError } from '@/utils/toast';
import { z } from 'zod';

const ActivityPage = () => {
  const { settings, convertEnergy, convertDistance, convertDistanceInverse, formatTime } = useUnits();
  const { activityLogs, addActivityLog } = useHealthData();
  
  const [stepsInput, setStepsInput] = useState('');
  const [energyInput, setEnergyInput] = useState('');
  const [distanceInput, setDistanceInput] = useState('');
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeInput, setTimeInput] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  const activitySchema = z.object({
    steps: z.string().optional().refine((val) => {
      if (val === undefined || val === '') return true;
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 0 && num <= 100000;
    }, { message: 'Steps must be a valid number between 0 and 100,000' }),
    energy: z.string().optional().refine((val) => {
      if (val === undefined || val === '') return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 10000;
    }, { message: 'Energy must be a valid number between 0 and 10,000' }),
    distance: z.string().optional().refine((val) => {
      if (val === undefined || val === '') return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 100;
    }, { message: 'Distance must be a valid number between 0 and 100' }),
    time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Invalid time format. Use HH:MM (24-hour)' }),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Invalid date format' })
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      steps: stepsInput || undefined,
      energy: energyInput || undefined,
      distance: distanceInput || undefined,
      time: timeInput,
      date: logDate
    };

    const result = activitySchema.safeParse(formData);
    if (!result.success) {
      showError(result.error.errors[0].message);
      return;
    }

    const { steps, energy, distance, time, date } = result.data;
    const stepsNum = steps ? parseInt(steps, 10) : 0;
    
    // Convert energy input (it could be entered as kJ if that's preferred, but let's check canonical)
    // The input is entered as the display unit. If settings is kJ, we convert back to kcal.
    let energyKcal = 0;
    if (energy) {
      const parsedVal = parseFloat(energy);
      if (settings.energy === 'kj') {
        energyKcal = parsedVal / 4.184;
      } else {
        energyKcal = parsedVal;
      }
    }

    // Convert distance input (could be entered as miles, convert to canonical km)
    let distanceKm = 0;
    if (distance) {
      distanceKm = convertDistanceInverse(parseFloat(distance));
    }

    addActivityLog(stepsNum, energyKcal, distanceKm, date, time);
    setStepsInput('');
    setEnergyInput('');
    setDistanceInput('');
    showSuccess('Activity log saved successfully!');
  };

  // Filter logs only for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = activityLogs.filter(log => log.date === todayStr);

  const totalSteps = todayLogs.reduce((acc, log) => acc + log.steps, 0);
  const totalEnergy = todayLogs.reduce((acc, log) => acc + log.energy, 0);
  const totalDistance = todayLogs.reduce((acc, log) => acc + log.distance, 0);

  const convertedEnergyTotal = convertEnergy(totalEnergy);
  const convertedDistanceTotal = convertDistance(totalDistance);

  return (
    <MobileLayout title="Activity" headerGradientClass="from-[#EADDFF]/50" backPath="/overview">
      <div className="space-y-6 pt-2">
        {/* Top visual layout */}
        <div className="flex items-center justify-between py-2">
          {/* 3 stacked key metrics */}
          <div className="space-y-5">
            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {totalSteps.toLocaleString()}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Steps Today</p>
            </div>
            
            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {convertedDistanceTotal.value.toFixed(2)}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">{convertedDistanceTotal.label.toUpperCase()}</p>
            </div>

            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {Math.round(convertedEnergyTotal.value).toLocaleString()}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Active {convertedEnergyTotal.label}</p>
            </div>
          </div>

          {/* Large visual category visual */}
          <div className="w-36 h-48 rounded-[32px] bg-gradient-to-br from-[#EADDFF] to-[#D0BCFF]/60 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
            <Footprints size={84} className="text-[#6750A4] relative z-10 opacity-90 animate-pulse" />
          </div>
        </div>

        {/* Log Form */}
        <Card className="border-none shadow-none bg-white rounded-3xl">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-[#1A1C1E] mb-4">Log Active Workout</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="steps" className="text-xs font-medium text-gray-500">Steps Taken</Label>
                  <Input
                    id="steps"
                    type="number"
                    placeholder="e.g. 5000"
                    value={stepsInput}
                    onChange={(e) => setStepsInput(e.target.value)}
                    className="rounded-2xl border-gray-200 focus-visible:ring-[#6750A4]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="energy" className="text-xs font-medium text-gray-500">Calories Burned ({settings.energy === 'kj' ? 'kJ' : 'kcal'})</Label>
                  <Input
                    id="energy"
                    type="number"
                    placeholder="e.g. 250"
                    value={energyInput}
                    onChange={(e) => setEnergyInput(e.target.value)}
                    className="rounded-2xl border-gray-200 focus-visible:ring-[#6750A4]"
                  />
                </div>
              </div>

              <div className="space-y-3 flex flex-col gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="distance" className="text-xs font-medium text-gray-500">Distance ({settings.length === 'metric' ? 'km' : 'miles'})</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.01"
                    placeholder={settings.length === 'metric' ? "e.g. 3.2" : "e.g. 2.0"}
                    value={distanceInput}
                    onChange={(e) => setDistanceInput(e.target.value)}
                    className="rounded-2xl border-gray-200 focus-visible:ring-[#6750A4]"
                  />
                </div>

                <CustomDatePicker 
                  label="Workout Date"
                  value={logDate}
                  onChange={setLogDate}
                />
                <CustomTimePicker 
                  label="Workout Time"
                  value={timeInput}
                  onChange={setTimeInput}
                />
              </div>

              <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-2xl h-11 font-medium">
                Save Activity
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Activity Logs history */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">Active Logs History</h4>
          {activityLogs.length === 0 ? (
            <div className="bg-white p-6 rounded-3xl text-center">
              <p className="text-sm text-gray-400 font-medium">No activity data logged yet.</p>
            </div>
          ) : (
            activityLogs.map((log) => {
              const convertedEnergy = convertEnergy(log.energy);
              const convertedDist = convertDistance(log.distance);
              return (
                <div key={log.id} className="bg-white p-4 rounded-3xl flex justify-between items-center animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#EADDFF] text-[#21005D] rounded-2xl flex items-center justify-center shrink-0">
                      <Footprints size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1C1E]">{log.steps.toLocaleString()} steps</p>
                      <p className="text-[11px] text-gray-400">{log.date} at {formatTime(log.time)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#6750A4]">{Math.round(convertedEnergy.value)} {convertedEnergy.label}</p>
                    <p className="text-xs text-gray-500">{convertedDist.value.toFixed(2)} {convertedDist.label}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default ActivityPage;