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
import { showSuccess } from '@/utils/toast';

const ActivityPage = () => {
  const { settings, convertEnergy, formatTime } = useUnits();
  const { activityLogs, addActivityLog } = useHealthData();
  
  const [stepsInput, setStepsInput] = useState('');
  const [energyInput, setEnergyInput] = useState('');
  const [distanceInput, setDistanceInput] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const steps = stepsInput ? parseInt(stepsInput) : 0;
    const energy = energyInput ? parseFloat(energyInput) : 0;
    const distance = distanceInput ? parseFloat(distanceInput) : 0;

    if (!steps && !energy && !distance) return;

    addActivityLog(steps, energy, distance);
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

        {/* Dynamic Activity Progress Card */}
        <Card className="border-none shadow-sm bg-gradient-to-br from-[#6750A4] to-[#4F378B] text-white rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="font-semibold opacity-90 text-sm">Today's Active Total</h3>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 opacity-80 text-xs">
                  <Footprints size={14} />
                  <span>Steps</span>
                </div>
                <p className="text-xl font-bold">{totalSteps.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 opacity-80 text-xs">
                  <Flame size={14} />
                  <span>Active</span>
                </div>
                <p className="text-xl font-bold">
                  {Math.round(convertedEnergyTotal.value)} <span className="text-xs font-normal">{convertedEnergyTotal.label}</span>
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 opacity-80 text-xs">
                  <Ruler size={14} />
                  <span>Distance</span>
                </div>
                <p className="text-xl font-bold">
                  {displayDistance.toFixed(1)} <span className="text-xs font-normal">{distanceUnit}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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

              <div className="space-y-1.5">
                <Label htmlFor="distance" className="text-xs font-medium text-gray-500">Distance ({settings.length === 'metric' ? 'Kilometers' : 'Miles'})</Label>
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