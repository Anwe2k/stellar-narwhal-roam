"use client";

import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Sparkles, Wind, Timer, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useHealthData } from '@/context/HealthDataContext';
import { useUnits } from '@/context/UnitContext';
import { showSuccess, showError } from '@/utils/toast';

const VO2MaxDetailPage = () => {
  const { vitalsData, addVitalLog, weightLogs } = useHealthData();
  const { settings } = useUnits();

  // Calculation states
  const [method, setMethod] = useState<'ratio' | 'rockport'>('ratio');
  const [maxHR, setMaxHR] = useState('190');
  const [restingHR, setRestingHR] = useState('60');
  const [walkTimeMins, setWalkTimeMins] = useState('15');
  const [walkTimeSecs, setWalkTimeSecs] = useState('00');
  const [walkHR, setWalkHR] = useState('120');

  const logs = vitalsData.vo2max || [];
  const latestValue = logs.length > 0 ? logs[logs.length - 1].value : 0;
  const hasData = latestValue > 0;

  // Derive age and gender from localstorage if possible
  const dob = localStorage.getItem('profile_dob');
  const sex = localStorage.getItem('profile_sex') || 'Male';
  const age = dob ? Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970) : 28;

  const isMetric = settings.length === 'metric';
  const walkDistanceLabel = isMetric ? '1.6 km' : '1 mile';

  const getFitnessCategory = (vo2: number) => {
    if (vo2 >= 55) return { label: 'Elite', color: 'text-purple-500', bg: 'bg-purple-50' };
    if (vo2 >= 45) return { label: 'Excellent', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (vo2 >= 35) return { label: 'Good', color: 'text-green-500', bg: 'bg-green-50' };
    if (vo2 >= 25) return { label: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    return { label: 'Poor', color: 'text-red-500', bg: 'bg-red-50' };
  };

  const calculateRatio = () => {
    const m = parseFloat(maxHR);
    const r = parseFloat(restingHR);
    if (r === 0) return 0;
    return Math.round((15.3 * (m / r)) * 10) / 10;
  };

  const calculateRockport = () => {
    const currentWeightRaw = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].val : 75;
    const weightLbs = currentWeightRaw * 2.20462;
    const genderVal = sex.toLowerCase() === 'male' ? 1 : 0;
    const timeTotal = parseFloat(walkTimeMins) + (parseFloat(walkTimeSecs) / 60);
    const hr = parseFloat(walkHR);

    // Equation: 132.853 - (0.0769 × Weight) - (0.3877 × Age) + (6.315 × Gender) - (3.2649 × Time) - (0.1565 × Heart Rate)
    const result = 132.853 - (0.0769 * weightLbs) - (0.3877 * age) + (6.315 * genderVal) - (3.2649 * timeTotal) - (0.1565 * hr);
    return Math.round(result * 10) / 10;
  };

  const handleSave = () => {
    const val = method === 'ratio' ? calculateRatio() : calculateRockport();
    if (val <= 0 || isNaN(val)) {
      showError("Please check your input values");
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    addVitalLog('vo2max', val, today);
    showSuccess(`Logged VO2 Max: ${val}`);
  };

  const category = getFitnessCategory(latestValue);

  return (
    <MobileLayout title="VO2 Max Detail" headerGradientClass="from-[#FFDAD6]/40" backPath="/overview/vitals">
      <div className="space-y-6 pt-2 pb-10">
        
        {/* Hero Card */}
        <Card className="border-none shadow-none bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <div className={`w-16 h-16 rounded-full ${hasData ? category.bg : 'bg-gray-100'} flex items-center justify-center`}>
              <Wind size={32} className={hasData ? category.color : 'text-gray-400'} />
            </div>
            <div>
              <p className="text-5xl font-black text-[#1A1C1E] tracking-tighter">
                {latestValue || '--'}
              </p>
              <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">ml/kg/min</p>
            </div>
            {hasData ? (
              <div className={`px-4 py-1.5 rounded-full ${category.bg} ${category.color} text-xs font-black uppercase tracking-wider`}>
                {category.label} Fitness
              </div>
            ) : (
              <div className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-400 text-xs font-black uppercase tracking-wider">
                No Data
              </div>
            )}
            <p className="text-xs text-gray-400 leading-relaxed max-w-[240px]">
              VO2 Max is the single best measure of cardiovascular fitness and aerobic power.
            </p>
          </CardContent>
        </Card>

        {/* History Graph */}
        <Card className="border-none shadow-none bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A1C1E]">Fitness Trend</h3>
            {hasData ? (
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={logs}>
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2.5 rounded-xl shadow-md border border-gray-100 text-xs">
                              <p className="font-bold text-gray-800">{payload[0].value} ml/kg/min</p>
                              <p className="text-gray-400">{payload[0].payload.date}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#F43F5E" strokeWidth={3} fill="rgba(244, 63, 94, 0.05)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-40 w-full flex items-center justify-center bg-gray-50 rounded-2xl">
                <span className="text-sm text-gray-400 font-medium">No recorded graphs. Add below.</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calculator Section */}
        <Card className="border-none shadow-none bg-white rounded-[32px]">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-[#1A1C1E]">Update VO2 Max</h3>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setMethod('ratio')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${method === 'ratio' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400'}`}
                >
                  Quick
                </button>
                <button 
                  onClick={() => setMethod('rockport')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${method === 'rockport' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400'}`}
                >
                  Walk Test
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {method === 'ratio' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Max HR (bpm)</label>
                    <input 
                      type="number" value={maxHR} onChange={e => setMaxHR(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl h-12 px-4 font-bold text-[#1A1C1E] focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Resting HR (bpm)</label>
                    <input 
                      type="number" value={restingHR} onChange={e => setRestingHR(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl h-12 px-4 font-bold text-[#1A1C1E] focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Walk Mins</label>
                      <input 
                        type="number" value={walkTimeMins} onChange={e => setWalkTimeMins(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl h-12 px-4 font-bold text-[#1A1C1E]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Walk Secs</label>
                      <input 
                        type="number" value={walkTimeSecs} onChange={e => setWalkTimeSecs(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl h-12 px-4 font-bold text-[#1A1C1E]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">End Heart Rate (bpm)</label>
                    <input 
                      type="number" value={walkHR} onChange={e => setWalkHR(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl h-12 px-4 font-bold text-[#1A1C1E]"
                    />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-2xl flex gap-3 items-center">
                    <Timer size={18} className="text-blue-500 shrink-0" />
                    <p className="text-[10px] text-blue-700 leading-tight">
                      For the most accurate result, walk exactly {walkDistanceLabel} as fast as possible and record your heart rate immediately at the finish.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-pink-50 p-4 rounded-2xl flex flex-col items-center gap-1 border border-pink-100/50">
                <span className="text-[10px] font-bold text-pink-400 uppercase">Calculated Estimate</span>
                <span className="text-2xl font-black text-pink-600">
                  {method === 'ratio' ? calculateRatio() : calculateRockport()}
                </span>
              </div>

              <Button onClick={handleSave} className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-2xl h-12 font-bold transition-all shadow-lg shadow-pink-100">
                Log New Score
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Base */}
        <Card className="border-none shadow-none bg-white rounded-[32px]">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A1C1E]">Fitness Insights</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-700">Weight & Accuracy</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  VO2 Max is relative to body weight. Losing body fat while maintaining muscle often increases your score automatically.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
                <div className="flex items-center gap-2">
                  <Timer size={14} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-700">The 1-Mile Walk Test</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  The Rockport Walk Test is medically validated. It is best performed on a flat track with a consistent pace.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </MobileLayout>
  );
};

export default VO2MaxDetailPage;