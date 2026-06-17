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
    <MobileLayout title="Activity Logs" backPath="/overview">
      <div className="space-y-6 pt-1 pb-12">
        {/* Top visual layout inspired by Material 3 */}
        <div className="flex items-center justify-between py-2 bg-[#F3EDF7] border border-[#CAC4D0]/30 rounded-[28px] p-5">
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
                {totalSteps.toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-[#49454F] tracking-wider uppercase">Steps Today</p>
            </div>
            
            <div>
              <p className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
                {displayDistance.toFixed(2)}
              </p>
              <p className="text-[10px] font-bold text-[#49454F] tracking-wider uppercase">{distanceUnit}</p>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
                {Math.round(convertedEnergyTotal.value).toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-[#49454F] tracking-wider uppercase">Active {convertedEnergyTotal.label}</p>
            </div>
          </div>

          <div className="w-28 h-36 rounded-[24px] bg-[#EADDFF] border border-[#D0BCFF] flex items-center justify-center relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <Footprints size={64} className="text-[#6750A4] relative z-10 opacity-95 animate-pulse duration-[3s]" />
          </div>
        </div>

        {/* Log Form */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px]">
          <CardContent className="p-5">
            <h3 className="text-sm font-extrabold text-[#1D1B20] uppercase tracking-wider mb-4">Log Active Workout</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="steps" className="text-xs font-bold text-[#49454F]">Steps Taken</Label>
                  <Input
                    id="steps"
                    type="number"
                    placeholder="e.g. 5000"
                    value={stepsInput}
                    onChange={(e) => setStepsInput(e.target.value)}
                    className="rounded-xl border-gray-200 h-11 focus-visible:ring-[#6750A4]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="energy" className="text-xs font-bold text-[#49454F]">Calories (kcal)</Label>
                  <Input
                    id="energy"
                    type="number"
                    placeholder="e.g. 250"
                    value={energyInput}
                    onChange={(e) => setEnergyInput(e.target.value)}
                    className="rounded-xl border-gray-200 h-11 focus-visible:ring-[#6750A4]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="distance" className="text-xs font-bold text-[#49454F]">Distance ({settings.length === 'metric' ? 'km' : 'miles'})</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    placeholder={settings.length === 'metric' ? "e.g. 3.2" : "e.g. 2.0"}
                    value={distanceInput}
                    onChange={(e) => setDistanceInput(e.target.value)}
                    className="rounded-xl border-gray-200 h-11 focus-visible:ring-[#6750A4]"
                  />
                </div>

                <CustomTimePicker 
                  label="Workout Time"
                  value={timeInput}
                  onChange={setTimeInput}
                />
              </div>

              <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-full h-12 font-bold transition-transform active:scale-95">
                Save Activity
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Activity Logs history */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-[#49454F] uppercase tracking-wider px-1">Today's Active Logs</h4>
          {activityLogs.length === 0 ? (
            <div className="bg-white border border-[#CAC4D0]/20 p-6 rounded-[24px] text-center">
              <p className="text-xs text-[#49454F] font-bold">No activity data logged yet.</p>
            </div>
          ) : (
            activityLogs.map((log) => {
              const convertedEnergy = convertEnergy(log.energy);
              const dist = log.distance * (settings.length === 'imperial' ? 0.621371 : 1);
              return (
                <div key={log.id} className="bg-white border border-[#CAC4D0]/10 p-4 rounded-[24px] flex justify-between items-center animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#EADDFF] border border-[#D0BCFF] text-[#21005D] rounded-xl flex items-center justify-center shrink-0">
                      <Footprints size={18} />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-[#1D1B20]">{log.steps.toLocaleString()} steps</p>
                      <p className="text-[10px] text-[#49454F] font-bold">At {formatTime(log.time)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-sm text-[#6750A4]">{Math.round(convertedEnergy.value)} {convertedEnergy.label}</p>
                    <p className="text-[10px] text-[#49454F] font-bold">{dist.toFixed(1)} {distanceUnit}</p>
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