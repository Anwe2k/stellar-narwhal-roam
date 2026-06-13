"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Flame, CupSoda, Apple } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUnits } from '@/context/UnitContext';
import { useHealthData } from '@/context/HealthDataContext';
import { CustomTimePicker } from '@/components/ui/CustomDateTimePicker';
import { showSuccess } from '@/utils/toast';

const NutritionPage = () => {
  const { settings, convertEnergy, convertWater } = useUnits();
  const { calorieLogs, addCalorieLog, waterLogs, addWaterLog } = useHealthData();

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
    addWaterLog(parseInt(water), waterTime);
    setWater('');
    showSuccess('Water intake logged!');
  };

  const totalCalsRaw = calorieLogs.reduce((acc, c) => acc + c.val, 0);
  const totalWaterRaw = waterLogs.reduce((acc, w) => acc + w.val, 0);

  const convertedCal = convertEnergy(totalCalsRaw);
  const convertedWater = convertWater(totalWaterRaw);
  const totalMealsCount = calorieLogs.length;

  return (
    <MobileLayout title="Nutrition">
      <div className="space-y-6">
        <div className="flex items-center gap-2 -mt-2">
          <Link to="/overview" className="p-2 -ml-2 rounded-full hover:bg-gray-150 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Categories</span>
        </div>

        {/* Premium Nutrition layout mirroring the photo */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#EA580C] via-[#E11D48] to-[#BE123C] text-white rounded-3xl p-6 shadow-md">
          <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
            <Apple size={170} strokeWidth={1} className="text-white rotate-12" />
          </div>

          <div className="relative z-10 flex justify-between items-center">
            <div className="space-y-5">
              <div>
                <p className="text-2xl font-black tracking-tight">
                  {convertedCal.value.toLocaleString()} <span className="text-xs font-normal opacity-85">{convertedCal.label}</span>
                </p>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Total Consumed</p>
              </div>

              <div>
                <p className="text-2xl font-black tracking-tight">
                  {convertedWater.value.toLocaleString()} <span className="text-xs font-normal opacity-85">{convertedWater.label}</span>
                </p>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Hydration</p>
              </div>

              <div>
                <p className="text-2xl font-black tracking-tight">{totalMealsCount}</p>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Logged Meals</p>
              </div>
            </div>

            <div className="flex flex-col items-center mr-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <CupSoda size={24} className="text-[#FFE4E6] animate-bounce" />
              </div>
              <span className="text-[10px] font-bold mt-2 text-[#FFE4E6] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">NOURISH</span>
            </div>
          </div>
        </div>

        {/* Log calories form */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
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
                    className="rounded-2xl border-gray-200 h-11"
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
                  className="rounded-2xl border-gray-200 h-11"
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-2xl h-11 font-medium">
                Log Meal
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Log Water Form */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
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
                    className="rounded-2xl border-gray-200 h-11"
                  />
                </div>
                <CustomTimePicker 
                  label="Water Log Time"
                  value={waterTime}
                  onChange={setWaterTime}
                />
              </div>
              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl h-11 font-medium">
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