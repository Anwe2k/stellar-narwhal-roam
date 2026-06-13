"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Flame, CupSoda, UtensilsCrossed } from 'lucide-react';
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

  return (
    <MobileLayout title="Nutrition">
      <div className="space-y-6">
        <div className="flex items-center gap-2 -mt-2">
          <Link to="/overview" className="p-2 -ml-2 rounded-full hover:bg-gray-150 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Categories</span>
        </div>

        {/* Card-less Elegant Dual Orange/Blue Gradient Header with 3 key stats on the left */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-cyan-500/10 to-transparent p-6 flex justify-between items-center min-h-[220px]">
          {/* 3 Metrics on the Left */}
          <div className="flex flex-col gap-6 z-10">
            <div className="space-y-0.5">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1C1E]">
                {Math.round(convertedCal.value).toLocaleString()} <span className="text-sm font-normal text-gray-500">{convertedCal.label}</span>
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">TOTAL CONSUMED</p>
            </div>

            <div className="space-y-0.5">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1C1E]">
                {convertedWater.value.toLocaleString()} <span className="text-sm font-normal text-gray-500">{convertedWater.label}</span>
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">HYDRATION</p>
            </div>

            <div className="space-y-0.5">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1C1E]">
                {calorieLogs.length}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">MEALS LOGGED</p>
            </div>
          </div>

          {/* Aesthetic Illustrative high-fidelity vector element on the right */}
          <div className="absolute right-3 bottom-4 opacity-25 text-amber-600 pointer-events-none">
            <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
              <path d="M42 35 C42 45 48 55 58 55 C68 55 58 35 42 35 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex gap-1">
              <Flame size={32} className="text-amber-600" />
              <CupSoda size={32} className="text-cyan-600 animate-bounce duration-3000" />
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