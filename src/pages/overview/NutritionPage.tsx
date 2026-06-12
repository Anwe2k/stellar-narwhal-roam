"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Flame, CupSoda } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUnits } from '@/context/UnitContext';
import { useHealthData } from '@/context/HealthDataContext';
import { showSuccess } from '@/utils/toast';

const NutritionPage = () => {
  const { settings, convertEnergy, convertWater } = useUnits();
  const { calorieLogs, addCalorieLog, waterLogs, addWaterLog } = useHealthData();

  const [calories, setCalories] = useState('');
  const [mealDesc, setMealDesc] = useState('');
  const [water, setWater] = useState('');

  const handleCalorieSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calories) return;
    addCalorieLog(parseInt(calories), mealDesc || 'Logged meal');
    setCalories('');
    setMealDesc('');
    showSuccess('Calories logged successfully!');
  };

  const handleWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!water) return;
    addWaterLog(parseInt(water));
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

        {/* Combined summary visualizer card */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-sm bg-amber-50 text-amber-900 rounded-3xl">
            <CardContent className="p-5">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-2">
                <Flame size={16} />
              </div>
              <span className="text-xs font-semibold text-gray-500 block">Total Consumed</span>
              <p className="text-2xl font-black mt-1">
                {totalCalsRaw > 0 ? (
                  <>
                    {convertedCal.value} <span className="text-xs font-normal text-gray-500">{convertedCal.label}</span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-gray-400">No data</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-cyan-50 text-cyan-900 rounded-3xl">
            <CardContent className="p-5">
              <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 mb-2">
                <CupSoda size={16} />
              </div>
              <span className="text-xs font-semibold text-gray-500 block">Hydration</span>
              <p className="text-2xl font-black mt-1">
                {totalWaterRaw > 0 ? (
                  <>
                    {convertedWater.value} <span className="text-xs font-normal text-gray-500">{convertedWater.label}</span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-gray-400">No data</span>
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Log calories form */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-[#1A1C1E] mb-3 flex items-center gap-2">
              <Flame size={18} className="text-amber-600" />
              Log Calorie Intake
            </h3>
            <form onSubmit={handleCalorieSubmit} className="space-y-4">
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