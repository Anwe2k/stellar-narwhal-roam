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
  const balanceColorClass = isDeficit 
    ? "text-emerald-700 bg-emerald-50 border-emerald-200" 
    : "text-[#FF8F00] bg-[#FFE082]/10 border-amber-200";

  return (
    <MobileLayout title="Nutrition" backPath="/overview">
      <div className="space-y-6 pt-1 pb-12">
        
        {/* Top Summary Header Row */}
        <div className="flex items-center justify-between py-2 bg-[#F3EDF7] border border-[#CAC4D0]/30 rounded-[28px] p-5">
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
                {totalCalsRaw > 0 ? `${displayCalConsumed.value} ${displayCalConsumed.label}` : `0 ${displayCalConsumed.label}`}
              </p>
              <p className="text-[10px] font-bold text-[#49454F] tracking-wider uppercase">Consumed Today</p>
            </div>
            
            <div>
              <p className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
                {totalWaterRaw > 0 ? `${displayWaterIntake.value} ${displayWaterIntake.label}` : `0 ${displayWaterIntake.label}`}
              </p>
              <p className="text-[10px] font-bold text-[#49454F] tracking-wider uppercase">Hydration Intake</p>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
                {calorieLogs.length + waterLogs.length}
              </p>
              <p className="text-[10px] font-bold text-[#49454F] tracking-wider uppercase">Dietary Logs Added</p>
            </div>
          </div>

          <div className="w-28 h-36 rounded-[24px] bg-[#C1E7F4] border border-[#99D5ED] flex items-center justify-center relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <CupSoda size={64} className="text-[#004D61] relative z-10 opacity-90 animate-bounce duration-[4s]" />
          </div>
        </div>

        {/* METABOLIC BASICS ROW */}
        <div className="grid grid-cols-2 gap-3">
          {/* BMR CARD */}
          <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[24px] overflow-hidden">
            <CardContent className="p-4 flex flex-col justify-between h-full min-h-[120px]">
              <div>
                <span className="text-[9px] font-bold text-[#49454F] uppercase tracking-wider block">Metabolic Baseline</span>
                <h4 className="text-xs font-extrabold text-gray-800 mt-0.5">BMR Rate</h4>
              </div>
              <div className="mt-3">
                <p className="text-xl font-black text-[#6750A4]">
                  {displayBMR.value} <span className="text-[10px] font-bold text-[#49454F]">{displayBMR.label}</span>
                </p>
                <p className="text-[9px] text-[#49454F] font-bold mt-1 leading-normal">
                  Calories burned at absolute rest.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ACTIVE WORKOUT BURN CARD */}
          <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[24px] overflow-hidden">
            <CardContent className="p-4 flex flex-col justify-between h-full min-h-[120px]">
              <div>
                <span className="text-[9px] font-bold text-[#49454F] uppercase tracking-wider block">Active Workouts</span>
                <h4 className="text-xs font-extrabold text-gray-800 mt-0.5">Exercise Burn</h4>
              </div>
              <div className="mt-3">
                <p className="text-xl font-black text-amber-600">
                  {displayWorkoutBurn.value} <span className="text-[10px] font-bold text-[#49454F]">{displayWorkoutBurn.label}</span>
                </p>
                <p className="text-[9px] text-[#49454F] font-bold mt-1 leading-normal">
                  Active exercises logged today.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* METRIC 1: TDEE & Caloric Balance Indicator */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px] overflow-hidden">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E0E9] pb-3">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-amber-500" />
                <h3 className="font-extrabold text-sm text-[#1D1B20] uppercase tracking-wider">Energy & Balance</h3>
              </div>
              <span className="text-[10px] font-bold text-[#49454F]">Live TDEE</span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FEF7FF] border border-[#CAC4D0]/10 p-3 rounded-2xl">
                  <span className="text-[10px] text-[#49454F] font-bold block">TDEE Target</span>
                  <p className="text-base font-extrabold text-gray-800 mt-0.5">
                    {displayTDEE.value} <span className="text-xs font-bold text-[#49454F]">{displayTDEE.label}</span>
                  </p>
                </div>

                <div className="bg-[#FEF7FF] border border-[#CAC4D0]/10 p-3 rounded-2xl">
                  <span className="text-[10px] text-[#49454F] font-bold block">Food Intake</span>
                  <p className="text-base font-extrabold text-gray-800 mt-0.5">
                    {displayCalConsumed.value} <span className="text-xs font-bold text-[#49454F]">{displayCalConsumed.label}</span>
                  </p>
                </div>
              </div>

              {/* Dynamic Caloric Balance banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${balanceColorClass}`}>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider block">Caloric Balance</span>
                  <div className="flex items-center gap-1.5">
                    {isDeficit ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                    <span className="text-xs font-extrabold">
                      {isDeficit ? `-${displayCaloricBalance.value}` : `+${displayCaloricBalance.value}`} {displayCaloricBalance.label}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {isDeficit ? "Deficit" : "Surplus"}
                </span>
              </div>

              {/* Graphical Balance Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] text-[#49454F] font-bold">
                  <span>0 Consumed</span>
                  <span>Target TDEE ({displayTDEE.value} {displayTDEE.label})</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-[#CAC4D0]/10">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isDeficit ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                    style={{ width: `${Math.min(100, (totalCalsRaw / calculatedTDEE) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* METRIC 2: Personalized Hydration Card */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px] overflow-hidden">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E0E9] pb-3">
              <div className="flex items-center gap-2">
                <CupSoda size={18} className="text-cyan-500" />
                <h3 className="font-extrabold text-sm text-[#1D1B20] uppercase tracking-wider">Hydration Targets</h3>
              </div>
              <span className="text-[10px] font-extrabold bg-[#C1E7F4] text-[#004D61] px-2 py-0.5 rounded-full">{waterProgressPercent}% Goal</span>
            </div>

            <div className="space-y-4">
              <div className="bg-[#FEF7FF] border border-[#CAC4D0]/10 p-4 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#49454F] font-bold block">Personalized Daily Goal</span>
                  <p className="text-base font-extrabold text-gray-800">
                    {displayWaterTarget.value} <span className="text-xs font-bold text-[#49454F]">{displayWaterTarget.label}</span>
                  </p>
                  <span className="text-[9px] text-[#49454F] font-bold block leading-relaxed">
                    Based on body weight ({currentWeightRaw} kg &times; 35ml)
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-500 flex items-center justify-center shrink-0 font-extrabold text-xs">
                  {waterProgressPercent}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-cyan-50 rounded-full overflow-hidden border border-cyan-100/35 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-700"
                    style={{ width: `${waterProgressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#49454F] font-bold px-1">
                  <span>Logged: {displayWaterIntake.value} {displayWaterIntake.label}</span>
                  <span>Goal: {displayWaterTarget.value} {displayWaterTarget.label}</span>
                </div>
              </div>

              {waterProgressPercent >= 100 && (
                <div className="p-3 bg-cyan-50/50 border border-cyan-100 rounded-2xl text-cyan-700 flex items-center gap-2 text-xs font-extrabold leading-relaxed">
                  <Sparkles size={14} className="text-cyan-500 shrink-0" />
                  You have hit your daily recommended water target!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Log calories form */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px]">
          <CardContent className="p-5">
            <h3 className="text-sm font-extrabold text-[#1D1B20] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Flame size={16} className="text-amber-600" />
              Log Calorie Intake
            </h3>
            <form onSubmit={handleCalorieSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="calories-val" className="text-xs font-bold text-[#49454F]">Amount (kcal)</Label>
                  <Input
                    id="calories-val"
                    type="number"
                    placeholder="e.g. 350"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="rounded-xl border-gray-200 h-11 focus-visible:ring-[#6750A4]"
                  />
                </div>
                <CustomTimePicker 
                  label="Meal Time"
                  value={mealTime}
                  onChange={setMealTime}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="calories-desc" className="text-xs font-bold text-[#49454F]">Meal Description</Label>
                <Input
                  id="calories-desc"
                  type="text"
                  placeholder="e.g. Avocado Toast"
                  value={mealDesc}
                  onChange={(e) => setMealDesc(e.target.value)}
                  className="rounded-xl border-gray-200 h-11 focus-visible:ring-[#6750A4]"
                />
              </div>
              <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-full h-12 font-bold transition-transform active:scale-95">
                Log Meal
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Log Water Form */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px]">
          <CardContent className="p-5">
            <h3 className="text-sm font-extrabold text-[#1D1B20] uppercase tracking-wider mb-4 flex items-center gap-2">
              <CupSoda size={16} className="text-cyan-600" />
              Log Water Consumption
            </h3>
            <form onSubmit={handleWaterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="water-val" className="text-xs font-bold text-[#49454F]">Amount ({settings.water === 'ml' ? 'ml' : 'fl oz'})</Label>
                  <Input
                    id="water-val"
                    type="number"
                    placeholder={settings.water === 'ml' ? 'e.g. 250' : 'e.g. 8'}
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                    className="rounded-xl border-gray-200 h-11 focus-visible:ring-cyan-500"
                  />
                </div>
                <CustomTimePicker 
                  label="Water Log Time"
                  value={waterTime}
                  onChange={setWaterTime}
                />
              </div>
              <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-full h-12 font-bold transition-transform active:scale-95">
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