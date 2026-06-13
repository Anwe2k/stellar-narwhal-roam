"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Flame, Footprints, Ruler, Activity } from 'lucide-react';
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
  const distanceUnit = settings.length === 'metric' ? 'km' : 'miles';
  const displayDistance = totalDistance * (settings.length === 'imperial' ? 0.621371 : 1);

  return (
    <MobileLayout title="Activity">
      <div className="space-y-6">
        <div className="flex items-center gap-2 -mt-2">
          <Link to="/overview" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Categories</span>
        </div>

        {/* Card-less Premium Hero Section based on layout reference photo */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6750A4]/15 via-indigo-500/5 to-transparent p-6 flex justify-between items-center min-h-[220px]">
          {/* 3 Most Important Metrics on the Left */}
          <div className="flex flex-col gap-6 z-10">
            <div className="space-y-0.5">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1C1E]">
                {totalSteps > 0 ? totalSteps.toLocaleString() : "0"}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">STEPS</p>
            </div>

            <div className="space-y-0.5">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1C1E]">
                {displayDistance.toFixed(2)}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{distanceUnit.toUpperCase()}</p>
            </div>

            <div className="space-y-0.5">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1C1E]">
                {Math.round(convertedEnergyTotal.value).toLocaleString()}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{convertedEnergyTotal.label.toUpperCase()}</p>
            </div>
          </div>

          {/* Aesthetic High-fidelity illustrative vector element on the right */}
          <div className="absolute right-2 bottom-4 opacity-25 text-[#6750A4] pointer-events-none scale-110">
            <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse duration-3000">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M50 20C58 35 42 65 50 80" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M30 45C38 52 42 38 50 45C58 52 62 38 70 45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Footprints size={64} className="text-[#6750A4]" />
            </div>
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