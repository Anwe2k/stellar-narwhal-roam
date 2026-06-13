"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Flame, Footprints, Ruler, Sparkles } from 'lucide-react';
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
          <Link to="/overview" className="p-2 -ml-2 rounded-full hover:bg-gray-150 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Categories</span>
        </div>

        {/* Premium Layout: 3 key metrics on left, visual graphics with subtle gradient on right */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#6750A4] via-[#5B4396] to-[#4F378B] text-white rounded-3xl p-6 shadow-md">
          <div className="absolute right-[-15px] top-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
            <Footprints size={180} strokeWidth={1} className="text-white rotate-12" />
          </div>

          <div className="relative z-10 flex justify-between items-center">
            <div className="space-y-5">
              <div>
                <p className="text-2xl font-black tracking-tight">{totalSteps.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Steps Taken</p>
              </div>

              <div>
                <p className="text-2xl font-black tracking-tight">
                  {displayDistance.toFixed(2)} <span className="text-xs font-normal opacity-85">{distanceUnit}</span>
                </p>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Distance</p>
              </div>

              <div>
                <p className="text-2xl font-black tracking-tight">
                  {Math.round(convertedEnergyTotal.value).toLocaleString()} <span className="text-xs font-normal opacity-85">{convertedEnergyTotal.label}</span>
                </p>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Active Calories</p>
              </div>
            </div>

            {/* Premium badge on the right */}
            <div className="flex flex-col items-center mr-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Sparkles size={24} className="text-[#EADDFF] animate-pulse" />
              </div>
              <span className="text-[10px] font-bold mt-2 text-[#EADDFF] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">ACTIVE STATE</span>
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