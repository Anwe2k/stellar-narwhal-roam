"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Flame, Footprints, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUnits } from '@/context/UnitContext';
import { useHealthData } from '@/context/HealthDataContext';
import { CustomTimePicker } from '@/components/ui/CustomDateTimePicker';
import { showSuccess } from '@/utils/toast';

const ActivityPage = () => {
  const { settings, convertEnergy, formatTime } = useUnits();
  const { activityLogs, addActivityLog } = useHealthData();
  
  const [stepsInput, setStepsInput] = useState('');
  const [energyInput, setEnergyInput] = useState('');
  const [distanceInput, setDistanceInput] = useState('');
  const [timeInput, setTimeInput] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const steps = stepsInput ? parseInt(stepsInput) : 0;
    const energy = energyInput ? parseFloat(energyInput) : 0;
    const distance = distanceInput ? parseFloat(distanceInput) : 0;

    if (!steps && !energy && !distance) return;

    addActivityLog(steps, energy, distance, timeInput);
    setStepsInput('');
    setEnergyInput('');
    setDistanceInput('');
    showSuccess('Activity log saved successfully!');
  };

  const totalSteps = activityLogs.reduce((acc, log) => acc + log.steps, 0);
  const totalEnergy = activityLogs.reduce((acc, log) => acc + log.energy, 0);
  const totalDistance = activityLogs.reduce((acc, log) => acc + log.distance, 0);

  const convertedEnergyTotal = convertEnergy(totalEnergy);
  const distanceUnit = settings.length === 'metric' ? 'KM' : 'MILES';
  const displayDistance = totalDistance * (settings.length === 'imperial' ? 0.621371 : 1);

  return (
    <MobileLayout title="Activity">
      <div className="space-y-6">
        <div className="flex items-center gap-2 -mt-2">
          <Link to="/overview" className="p-2 -ml-2 rounded-full hover:bg-gray-150 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Categories</span>
        </div>

        {/* Top visual layout inspired by original photo */}
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
                {displayDistance.toFixed(2)}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">{distanceUnit}</p>
            </div>

            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {Math.round(convertedEnergyTotal.value).toLocaleString()}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Active {convertedEnergyTotal.label}</p>
            </div>
          </div>

          {/* Large gorgeous category visual on the right */}
          <div className="w-36 h-48 rounded-[32px] bg-gradient-to-br from-[#EADDFF] to-[#D0BCFF]/60 flex items-center justify-center relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
            <Footprints size={84} className="text-[#6750A4] relative z-10 opacity-90 animate-pulse duration-[3s]" />
          </div>
        </div>

        {/* Log Form */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-[#1A1C1E] mb-4">Log Active Workout</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="energy" className="text-xs font-medium text-gray-500">Calories Burned (kcal)</Label>
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

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="distance" className="text-xs font-medium text-gray-500">Distance ({settings.length === 'metric' ? 'km' : 'miles'})</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    placeholder={settings.length === 'metric' ? "e.g. 3.2" : "e.g. 2.0"}
                    value={distanceInput}
                    onChange={(e) => setDistanceInput(e.target.value)}
                    className="rounded-2xl border-gray-200 focus-visible:ring-[#6750A4]"
                  />
                </div>

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
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">Today's Active Logs</h4>
          {activityLogs.length === 0 ? (
            <div className="bg-white p-6 rounded-3xl text-center shadow-sm">
              <p className="text-sm text-gray-400 font-medium">No activity data logged yet.</p>
            </div>
          ) : (
            activityLogs.map((log) => {
              const convertedEnergy = convertEnergy(log.energy);
              const dist = log.distance * (settings.length === 'imperial' ? 0.621371 : 1);
              return (
                <div key={log.id} className="bg-white p-4 rounded-3xl flex justify-between items-center shadow-sm animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#EADDFF] text-[#21005D] rounded-2xl flex items-center justify-center shrink-0">
                      <Footprints size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1C1E]">{log.steps.toLocaleString()} steps</p>
                      <p className="text-xs text-gray-400">At {formatTime(log.time)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#6750A4]">{Math.round(convertedEnergy.value)} {convertedEnergy.label}</p>
                    <p className="text-xs text-gray-500">{dist.toFixed(1)} {distanceUnit}</p>
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