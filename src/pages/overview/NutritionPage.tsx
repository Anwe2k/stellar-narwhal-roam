"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Flame, CupSoda } from 'lucide-react';
import { useUnits } from '@/context/UnitContext';
import { useHealthData } from '@/context/HealthDataContext';
import { CustomTimePicker, CustomDatePicker } from '@/components/ui/CustomDateTimePicker';
import { showSuccess, showError } from '@/utils/toast';
import { z } from 'zod';

const NutritionPage = () => {
  const { settings, convertEnergy, convertWater, convertWaterInverse } = useUnits();
  const { calorieLogs, addCalorieLog, waterLogs, addWaterLog } = useHealthData();

  const [calories, setCalories] = useState('');
  const [mealDesc, setMealDesc] = useState('');
  const [mealDate, setMealDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mealTime, setMealTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  const [water, setWater] = useState('');
  const [waterDate, setWaterDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [waterTime, setWaterTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  const mealSchema = z.object({
    val: z.string().refine(v => {
      const num = parseFloat(v);
      return !isNaN(num) && num > 0 && num < 10000;
    }, { message: 'Calories must be between 1 and 10000' }),
    desc: z.string().min(1, { message: 'Description is required' }),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string()
  });

  const waterSchema = z.object({
    val: z.string().refine(v => {
      const num = parseFloat(v);
      return !isNaN(num) && num > 0 && num < 5000;
    }, { message: 'Hydration volume must be between 1 and 5000' }),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string()
  });

  const handleCalorieSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = mealSchema.safeParse({
      val: calories,
      desc: mealDesc || 'Meal Log',
      date: mealDate,
      time: mealTime
    });

    if (!result.success) {
      showError(result.error.errors[0].message);
      return;
    }

    // Convert display energy to canonical (kcal)
    let parsedVal = parseFloat(calories);
    if (settings.energy === 'kj') {
      parsedVal = parsedVal / 4.184;
    }

    addCalorieLog(parsedVal, mealDesc || 'Logged meal', mealDate, mealTime);
    setCalories('');
    setMealDesc('');
    showSuccess('Calories logged successfully!');
  };

  const handleWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = waterSchema.safeParse({
      val: water,
      date: waterDate,
      time: waterTime
    });

    if (!result.success) {
      showError(result.error.errors[0].message);
      return;
    }

    // Convert water inputs (e.g. oz to canonical ml)
    const canonicalWater = convertWaterInverse(parseFloat(water));

    addWaterLog(canonicalWater, waterDate, waterTime);
    setWater('');
    showSuccess('Water intake logged!');
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const todayCalsLogs = calorieLogs.filter(log => log.date === todayStr);
  const todayWaterLogs = waterLogs.filter(log => log.date === todayStr);

  const totalCalsRaw = todayCalsLogs.reduce((acc, c) => acc + c.val, 0);
  const totalWaterRaw = todayWaterLogs.reduce((acc, w) => acc + w.val, 0);

  const convertedCal = convertEnergy(totalCalsRaw);
  const convertedWater = convertWater(totalWaterRaw);

  return (
    <MobileLayout title="Nutrition" headerGradientClass="from-[#C1E7F4]/50" backPath="/overview">
      <div className="space-y-6 pt-2">
        {/* Stacked top summary visualizer */}
        <div className="flex items-center justify-between py-2">
          <div className="space-y-5">
            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {totalCalsRaw > 0 ? `${Math.round(convertedCal.value)} ${convertedCal.label}` : `0 ${convertedCal.label}`}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Today's Calories Consumed</p>
            </div>
            
            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {totalWaterRaw > 0 ? `${convertedWater.value} ${convertedWater.label}` : `0 ${convertedWater.label}`}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Today's Water Intake</p>
            </div>

            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {todayCalsLogs.length + todayWaterLogs.length}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Dietary Logs Today</p>
            </div>
          </div>

          <div className="w-36 h-48 rounded-[32px] bg-gradient-to-br from-[#C1E7F4] to-[#A8DADC] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <CupSoda size={84} className="text-[#004D61] relative z-10 opacity-90 animate-bounce duration-[4s]" />
          </div>
        </div>

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
                  <Label htmlFor="calories-val" className="text-xs text-gray-500">Amount ({settings.energy === 'kj' ? 'kJ' : 'kcal'})</Label>
                  <Input
                    id="calories-val"
                    type="number"
                    placeholder="e.g. 350"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="rounded-2xl border-gray-200 h-11"
                  />
                </div>
                <CustomDatePicker 
                  label="Meal Date"
                  value={mealDate}
                  onChange={setMealDate}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <CustomTimePicker 
                  label="Meal Time"
                  value={mealTime}
                  onChange={setMealTime}
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-2xl h-11 font-medium">
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
                    className="rounded-2xl border-gray-200 h-11"
                  />
                </div>
                <CustomDatePicker 
                  label="Water Log Date"
                  value={waterDate}
                  onChange={setWaterDate}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="invisible" />
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

        {/* List history */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">Recent Dietary Logs</h4>
          {[...calorieLogs, ...waterLogs].length === 0 ? (
            <div className="bg-white p-6 rounded-3xl text-center">
              <p className="text-sm text-gray-400 font-medium">No dietary logs registered yet.</p>
            </div>
          ) : (
            [...calorieLogs, ...waterLogs].sort((a, b) => b.id - a.id).slice(0, 15).map((log) => {
              const isWater = 'val' in log && !('desc' in log);
              const displayVal = isWater 
                ? convertWater((log as { val: number }).val)
                : convertEnergy((log as { val: number }).val);

              return (
                <div key={log.id} className="bg-white p-4 rounded-3xl flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${isWater ? 'bg-cyan-50 text-cyan-600' : 'bg-amber-50 text-amber-600'} rounded-2xl flex items-center justify-center shrink-0`}>
                      {isWater ? <CupSoda size={20} /> : <Flame size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1C1E]">{isWater ? 'Hydration' : (log as { desc: string }).desc}</p>
                      <p className="text-[11px] text-gray-400">{log.date} at {log.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isWater ? 'text-cyan-600' : 'text-amber-600'}`}>
                      {displayVal.value} {displayVal.label}
                    </p>
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

export default NutritionPage;