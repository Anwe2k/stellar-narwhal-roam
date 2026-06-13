"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Scale, Ruler, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUnits } from '@/context/UnitContext';
import { useHealthData } from '@/context/HealthDataContext';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { showSuccess } from '@/utils/toast';

const BodyMeasurementsPage = () => {
  const { settings, convertWeight, convertHeight } = useUnits();
  const { weightLogs, addWeightLog, fatLogs, addFatLog } = useHealthData();

  const [weightInput, setWeightInput] = useState('');
  const [fatInput, setFatInput] = useState('');
  const [logDay, setLogDay] = useState(new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }));

  const logWeightEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightInput) return;

    const parsedWeight = parseFloat(weightInput);
    addWeightLog(parsedWeight, logDay);
    setWeightInput('');
    showSuccess('Weight measurement updated!');
  };

  const logFatEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fatInput) return;

    const parsedFat = parseFloat(fatInput);
    addFatLog(parsedFat, logDay);
    setFatInput('');
    showSuccess('Body Fat percentage updated!');
  };

  // Convert height and current weight
  const heightRaw = 180; // static base height (cm)
  const currentHeightConverted = convertHeight(heightRaw);
  
  const currentWeightRaw = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].val : null;
  const currentWeightConverted = currentWeightRaw !== null ? convertWeight(currentWeightRaw) : null;

  // Compute live BMI (BMI = Weight_kg / Height_m ^ 2)
  const heightMeters = heightRaw / 100;
  const currentBMI = currentWeightRaw !== null 
    ? (currentWeightRaw / (heightMeters * heightMeters)).toFixed(1)
    : null;

  // Translate weight logs array to match settings unit preference
  const transformedWeightData = weightLogs.map((log) => ({
    day: log.day,
    val: Math.round(convertWeight(log.val).value),
  }));

  // Build BMI logs
  const bmiLogs = weightLogs.map((log) => ({
    day: log.day,
    val: parseFloat((log.val / (heightMeters * heightMeters)).toFixed(1)),
  }));

  return (
    <MobileLayout title="Measurements">
      <div className="space-y-6">
        <div className="flex items-center gap-2 -mt-2">
          <Link to="/overview" className="p-2 -ml-2 rounded-full hover:bg-gray-150 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Categories</span>
        </div>

        {/* Premium Body Measurements layout mirroring the prompt photo */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#059669] via-[#0D9488] to-[#0F766E] text-white rounded-3xl p-6 shadow-md">
          <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
            <Scale size={170} strokeWidth={1} className="text-white rotate-12" />
          </div>

          <div className="relative z-10 flex justify-between items-center">
            <div className="space-y-5">
              <div>
                <p className="text-2xl font-black tracking-tight">
                  {currentWeightConverted !== null ? (
                    <>
                      {currentWeightConverted.value} <span className="text-xs font-normal opacity-85">{currentWeightConverted.label}</span>
                    </>
                  ) : (
                    '--'
                  )}
                </p>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Current Weight</p>
              </div>

              <div>
                <p className="text-2xl font-black tracking-tight">
                  {currentHeightConverted.value} <span className="text-xs font-normal opacity-85">{currentHeightConverted.label}</span>
                </p>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Body Height</p>
              </div>

              <div>
                <p className="text-2xl font-black tracking-tight">
                  {currentBMI !== null ? currentBMI : '--'}
                </p>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">BMI (Body Mass Index)</p>
              </div>
            </div>

            <div className="flex flex-col items-center mr-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Heart size={24} className="text-[#CCFBF1] animate-pulse" />
              </div>
              <span className="text-[10px] font-bold mt-2 text-[#CCFBF1] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">BODY MASS</span>
            </div>
          </div>
        </div>

        {/* Weight 30 days trends area graph */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A1C1E]">Weight Trend (30 days)</h3>
            {weightLogs.length > 0 ? (
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={transformedWeightData}>
                    <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} width={20} />
                    <Tooltip />
                    <Area type="monotone" dataKey="val" stroke="#6750A4" strokeWidth={2} fill="rgba(103, 80, 164, 0.05)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-6 text-center bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-400 font-medium">Log weight entries below to construct weight charts.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Body Fat 30 days trends area graph */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A1C1E]">Body Fat (%) (30 days)</h3>
            {fatLogs.length > 0 ? (
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fatLogs}>
                    <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} width={20} />
                    <Tooltip />
                    <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} fill="rgba(16, 185, 129, 0.05)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-6 text-center bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-400 font-medium">Log body fat entries below to view percentage trends.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* BMI 30 days trends area graph */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-[#1A1C1E]">BMI Trend</h3>
              {currentBMI !== null && (
                <span className="text-sm font-bold bg-[#EADDFF] text-[#21005D] px-2.5 py-1 rounded-full">Current: {currentBMI}</span>
              )}
            </div>
            {weightLogs.length > 0 ? (
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bmiLogs}>
                    <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} width={20} />
                    <Tooltip />
                    <Area type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={2} fill="rgba(59, 130, 246, 0.05)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-6 text-center bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-400 font-medium">No BMI records available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logging inputs */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold text-[#1A1C1E] mb-3 flex items-center gap-2">
                <Scale size={18} className="text-[#6750A4]" />
                Update Weight
              </h3>
              <form onSubmit={logWeightEntry} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="weight-input" className="text-xs text-gray-500">Weight ({settings.weight === 'kg' ? 'kg' : settings.weight === 'lbs' ? 'lbs' : 'st'})</Label>
                  <Input
                    id="weight-input"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 75.2"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    className="rounded-2xl border-gray-200 h-11"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-2xl h-11 font-medium">
                  Update Weight
                </Button>
              </form>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1C1E] mb-3 flex items-center gap-2">
                <Scale size={18} className="text-[#10B981]" />
                Update Body Fat
              </h3>
              <form onSubmit={logFatEntry} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fat-input" className="text-xs text-gray-500">Body Fat (%)</Label>
                  <Input
                    id="fat-input"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 15.5"
                    value={fatInput}
                    onChange={(e) => setFatInput(e.target.value)}
                    className="rounded-2xl border-gray-200 h-11"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white rounded-2xl h-11 font-medium">
                  Update Fat Ratio
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default BodyMeasurementsPage;