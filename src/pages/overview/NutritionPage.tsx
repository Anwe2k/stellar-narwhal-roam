"use client";

import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Flame, CupSoda, Info, Sparkles, Scale, Heart, ShieldAlert, ArrowRight, TrendingDown, TrendingUp, RefreshCw } from 'lucide-react';
import { useUnits } from '@/context/UnitContext';
import { useHealthData } from '@/context/HealthDataContext';
import { CustomTimePicker } from '@/components/ui/CustomDateTimePicker';
import { showSuccess } from '@/utils/toast';
import { calculateBMR, calculateTDEE, calculateHydrationTarget } from '@/utils/metabolic';

const NutritionPage = () => {
  const { settings, convertEnergy, convertWater } = useUnits();
  const { calorieLogs, addCalorieLog, waterLogs, addWaterLog, weightLogs, activityLogs } = useHealthData();

  // Log Inputs
  const [calories, setCalories] = useState('');
  const [mealDesc, setMealDesc] = useState('');
  const [mealTime, setMealTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  const [water, setWater] = useState('');
  const [waterTime, setWaterTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  // Profile data for metabolic calculations (fetched from localStorage)
  const [userAge, setUserAge] = useState(28);
  const [userSex, setUserSex] = useState('Male');
  const [userHeight, setUserHeight] = useState(180);

  useEffect(() => {
    const savedSex = localStorage.getItem('profile_sex');
    const savedDob = localStorage.getItem('profile_dob');
    const savedHeight = localStorage.getItem('declared_height');

    if (savedSex) setUserSex(savedSex);
    if (savedHeight) setUserHeight(parseFloat(savedHeight));
    
    if (savedDob) {
      const birthDate = new Date(savedDob);
      const differenceMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(differenceMs);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (!isNaN(calculatedAge)) {
        setUserAge(calculatedAge);
      }
    }
  }, []);

  const handleCalorieSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calories) return;
    addCalorieLog(parseInt(calories), mealDesc || 'Logged meal', mealTime);
    setCalories('');
    setMealDesc('');
    showSuccess('Calories logged successfully!');
  };

  const handleWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!water) return;
    
    // Convert fluid oz to ml for database storage if necessary
    const waterVal = parseInt(water);
    const mlValue = settings.water === 'oz' ? Math.round(waterVal / 0.033814) : waterVal;

    addWaterLog(mlValue, waterTime);
    setWater('');
    showSuccess('Water intake logged!');
  };

  // 1. Core values from Logs
  const totalCalsRaw = calorieLogs.reduce((acc, c) => acc + c.val, 0);
  const totalWaterRaw = waterLogs.reduce((acc, w) => acc + w.val, 0);
  const totalWorkoutBurnToday = activityLogs.reduce((acc, log) => acc + log.energy, 0);

  // 2. Fetch latest Weight
  const currentWeightRaw = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].val : 75; // fallback 75kg

  // 3. Metabolic Calculations
  const calculatedBMR = calculateBMR(currentWeightRaw, userHeight, userAge, userSex);
  const calculatedTDEE = calculateTDEE(calculatedBMR, totalWorkoutBurnToday);
  const waterTargetMl = calculateHydrationTarget(currentWeightRaw);

  // Converted outputs based on system preference
  const displayCalConsumed = convertEnergy(totalCalsRaw);
  const displayTDEE = convertEnergy(calculatedTDEE);
  const displayBMR = convertEnergy(calculatedBMR);
  const displayWorkoutBurn = convertEnergy(totalWorkoutBurnToday);

  // Caloric balance
  const caloricBalanceVal = totalCalsRaw - calculatedTDEE;
  const displayCaloricBalance = convertEnergy(Math.abs(caloricBalanceVal));

  // Hydration sufficiency ratio
  const displayWaterIntake = convertWater(totalWaterRaw);
  const displayWaterTarget = convertWater(waterTargetMl);
  const waterProgressPercent = Math.min(100, Math.round((totalWaterRaw / waterTargetMl) * 100));

  // Colors for caloric balance
  const isDeficit = caloricBalanceVal < 0;
  const balanceColorClass = isDeficit ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100";

  return (
    <MobileLayout title="Nutrition" headerGradientClass="from-[#C1E7F4]/50" backPath="/overview">
      <div className="space-y-6 pt-2 pb-10">
        
        {/* Top Summary Header Row */}
        <div className="flex items-center justify-between py-2">
          <div className="space-y-5">
            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {totalCalsRaw > 0 ? `${displayCalConsumed.value} ${displayCalConsumed.label}` : `0 ${displayCalConsumed.label}`}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Consumed Today</p>
            </div>
            
            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {totalWaterRaw > 0 ? `${displayWaterIntake.value} ${displayWaterIntake.label}` : `0 ${displayWaterIntake.label}`}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Hydration Intake</p>
            </div>

            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {calorieLogs.length + waterLogs.length}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Dietary Logs Added</p>
            </div>
          </div>

          <div className="w-36 h-48 rounded-[32px] bg-gradient-to-br from-[#C1E7F4] to-[#A8DADC] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <CupSoda size={84} className="text-[#004D61] relative z-10 opacity-90 animate-bounce duration-[4s]" />
          </div>
        </div>

        {/* METABOLIC BASICS ROW (Compact BMR card next to workout logs) */}
        <div className="grid grid-cols-2 gap-4">
          {/* COMPACT BMR CARD */}
          <Card className="border-none shadow-none bg-white rounded-3xl overflow-hidden relative group">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Metabolic Baseline</span>
                <h4 className="text-sm font-black text-gray-800 mt-0.5">BMR</h4>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-black text-[#6750A4]">
                  {displayBMR.value} <span className="text-xs font-semibold text-gray-400">{displayBMR.label}</span>
                </p>
                <p className="text-[9px] text-gray-400 mt-1 leading-tight">
                  Calories burned at rest purely to sustain vital organs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ACTIVE WORKOUT BURN CARD */}
          <Card className="border-none shadow-none bg-white rounded-3xl overflow-hidden relative group">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Workouts</span>
                <h4 className="text-sm font-black text-gray-800 mt-0.5">Exercise Burn</h4>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-black text-amber-600">
                  {displayWorkoutBurn.value} <span className="text-xs font-semibold text-gray-400">{displayWorkoutBurn.label}</span>
                </p>
                <p className="text-[9px] text-gray-400 mt-1 leading-tight">
                  Additional active calories logged via workouts today.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* METRIC 1: TDEE & Caloric Balance Indicator */}
        <Card className="border-none shadow-none bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-amber-500" />
                <h3 className="font-bold text-base text-[#1A1C1E]">Energy Expenditure & Balance</h3>
              </div>
              <span className="text-xs font-semibold text-gray-400">Live Estimate</span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F7F9FC] p-4 rounded-2xl">
                  <span className="text-xs text-gray-400 font-semibold block">TDEE Total Target</span>
                  <p className="text-xl font-black text-gray-800 mt-1">
                    {displayTDEE.value} <span className="text-xs font-semibold text-gray-400">{displayTDEE.label}</span>
                  </p>
                  <span className="text-[9px] text-gray-400 mt-0.5 block leading-normal">
                    Baseline (BMR &times; 1.2) + Workouts
                  </span>
                </div>

                <div className="bg-[#F7F9FC] p-4 rounded-2xl">
                  <span className="text-xs text-gray-400 font-semibold block">Calories Logged</span>
                  <p className="text-xl font-black text-gray-800 mt-1">
                    {displayCalConsumed.value} <span className="text-xs font-semibold text-gray-400">{displayCalConsumed.label}</span>
                  </p>
                  <span className="text-[9px] text-gray-400 mt-0.5 block leading-normal">
                    Total calories consumed from food
                  </span>
                </div>
              </div>

              {/* Dynamic Caloric Balance banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${balanceColorClass}`}>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Caloric Balance</span>
                  <div className="flex items-center gap-1.5">
                    {isDeficit ? <TrendingDown size={18} className="text-emerald-600" /> : <TrendingUp size={18} className="text-amber-600" />}
                    <span className="text-sm font-black">
                      {isDeficit ? `-${displayCaloricBalance.value}` : `+${displayCaloricBalance.value}`} {displayCaloricBalance.label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Zone</span>
                  <span className="text-xs font-black uppercase tracking-wider block mt-1">
                    {isDeficit ? "Deficit (Fat Burn)" : "Surplus (Anabolic)"}
                  </span>
                </div>
              </div>

              {/* Graphical Balance Bar */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs text-gray-400 font-medium">
                  <span>0 Consumed</span>
                  <span>Target TDEE ({displayTDEE.value} {displayTDEE.label})</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isDeficit ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                    style={{ width: `${Math.min(100, (totalCalsRaw / calculatedTDEE) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* METRIC 2: Personalized Hydration Sufficiency Card */}
        <Card className="border-none shadow-none bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <CupSoda size={18} className="text-cyan-500" />
                <h3 className="font-bold text-base text-[#1A1C1E]">Hydration Sufficiency</h3>
              </div>
              <span className="text-xs font-semibold bg-cyan-50 text-cyan-600 px-2 py-0.5 rounded-full">{waterProgressPercent}% Goal Reached</span>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F7F9FC] p-4 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs text-gray-400 font-semibold block">Personalized Daily Goal</span>
                  <p className="text-lg font-black text-gray-800">
                    {displayWaterTarget.value} <span className="text-xs font-semibold text-gray-400">{displayWaterTarget.label}</span>
                  </p>
                  <span className="text-[9px] text-gray-400 leading-normal block">
                    Calculated for your current body weight ({currentWeightRaw} kg &times; 35ml)
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-500 flex items-center justify-center shrink-0 font-bold text-sm">
                  {waterProgressPercent}%
                </div>
              </div>

              {/* Progress Bar with Water droplets scale */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-cyan-100/30 rounded-full overflow-hidden border border-cyan-100/50 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-700"
                    style={{ width: `${waterProgressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-bold px-1">
                  <span>Logged: {displayWaterIntake.value} {displayWaterIntake.label}</span>
                  <span>Goal: {displayWaterTarget.value} {displayWaterTarget.label}</span>
                </div>
              </div>

              {waterProgressPercent >= 100 && (
                <div className="p-3 bg-cyan-50/50 border border-cyan-100 rounded-2xl text-cyan-700 flex items-center gap-2 text-xs font-semibold">
                  <Sparkles size={16} className="text-cyan-500 shrink-0" />
                  Amazing! You have hit your recommended daily water sufficiency target.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Log calories form */}
        <Card className="border-none shadow-none bg-white rounded-3xl">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-[#1A1C1E] mb-3 flex items-center gap-2">
              <Flame size={18} className="text-amber-600" />
              Log Calorie Intake
            </h3>
            <form onSubmit={handleCalorieSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="calories-val" className="text-xs text-gray-500">Amount (kcal)</Label>
                  <Input
                    id="calories-val"
                    type="number"
                    placeholder="e.g. 350"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="rounded-2xl border-gray-200 h-11 focus-visible:ring-[#6750A4]"
                  />
                </div>
                <CustomTimePicker 
                  label="Meal Time"
                  value={mealTime}
                  onChange={setMealTime}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="calories-desc" className="text-xs text-gray-500">Description / Meal Name</Label>
                <Input
                  id="calories-desc"
                  type="text"
                  placeholder="e.g. Avocado Toast"
                  value={mealDesc}
                  onChange={(e) => setMealDesc(e.target.value)}
                  className="rounded-2xl border-gray-200 h-11 focus-visible:ring-[#6750A4]"
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-2xl h-11 font-medium transition-colors">
                Log Meal
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Log Water Form */}
        <Card className="border-none shadow-none bg-white rounded-3xl">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-[#1A1C1E] mb-3 flex items-center gap-2">
              <CupSoda size={18} className="text-cyan-600" />
              Log Water Consumption
            </h3>
            <form onSubmit={handleWaterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="water-val" className="text-xs text-gray-500">Amount ({settings.water === 'ml' ? 'ml' : 'fl oz'})</Label>
                  <Input
                    id="water-val"
                    type="number"
                    placeholder={settings.water === 'ml' ? 'e.g. 250' : 'e.g. 8'}
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                    className="rounded-2xl border-gray-200 h-11 focus-visible:ring-cyan-500"
                  />
                </div>
                <CustomTimePicker 
                  label="Water Log Time"
                  value={waterTime}
                  onChange={setWaterTime}
                />
              </div>
              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl h-11 font-medium transition-colors">
                Log Hydration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default NutritionPage;