"use client";

import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Info } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useHealthData } from '@/context/HealthDataContext';
import { CustomTimePicker, CustomDatePicker } from '@/components/ui/CustomDateTimePicker';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const SleepPage = () => {
  const { sleepLogs, addSleepLog } = useHealthData();
  const [bedtime, setBedtime] = useState('22:00');
  const [waketime, setWaketime] = useState('06:00');
  const [computedHrs, setComputedHrs] = useState(8);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  // Recalculate computed hours when bedtime or waketime changes
  useEffect(() => {
    const [bedH, bedM] = bedtime.split(':').map(Number);
    const [wakeH, wakeM] = waketime.split(':').map(Number);
    
    let diffMins = (wakeH * 60 + wakeM) - (bedH * 60 + bedM);
    if (diffMins < 0) {
      // Sleep crossed midnight
      diffMins += 24 * 60;
    }
    const finalHrs = Math.round((diffMins / 60) * 10) / 10;
    setComputedHrs(finalHrs);
  }, [bedtime, waketime]);

  const latestSleep = sleepLogs.length > 0 ? sleepLogs[sleepLogs.length - 1] : null;
  const totalHrs = latestSleep ? latestSleep.hrs : 0;

  // Helper to format hours into "Xh Ym"
  const formatDuration = (hrs: number) => {
    const h = Math.floor(hrs);
    const m = Math.round((hrs - h) * 60);
    return `${h}h ${m}m`;
  };

  // Sleep phase breakdown logic (using standard healthy sleep ratios)
  const phases = [
    { name: 'Awake', percentage: 5, color: 'bg-[#FFB2AB]', text: 'text-[#FFB2AB]' },
    { name: 'REM', percentage: 20, color: 'bg-[#D0BCFF]', text: 'text-[#D0BCFF]' },
    { name: 'Light', percentage: 50, color: 'bg-[#A8DADC]', text: 'text-[#A8DADC]' },
    { name: 'Deep', percentage: 25, color: 'bg-[#6750A4]', text: 'text-[#6750A4]' },
  ];

  // Heart Rate During Sleep Graph values - Weekly Average
  const sleepingHrData = [
    { day: 'Mon', bpm: 58 },
    { day: 'Tue', bpm: 56 },
    { day: 'Wed', bpm: 54 },
    { day: 'Thu', bpm: 55 },
    { day: 'Fri', bpm: 52 },
    { day: 'Sat', bpm: 57 },
    { day: 'Sun', bpm: 55 },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (computedHrs <= 0) return;

    addSleepLog(computedHrs, logDate, bedtime, waketime);
    showSuccess(`Logged sleep period! Total duration: ${computedHrs} hrs`);
  };

  const avgDuration = sleepLogs.length > 0 
    ? (sleepLogs.reduce((acc, curr) => acc + curr.hrs, 0) / sleepLogs.length).toFixed(1)
    : '0';

  const sleepScore = sleepLogs.length > 0
    ? Math.min(100, Math.round((sleepLogs[sleepLogs.length - 1].hrs / 8) * 100))
    : null;

  const lastBedtime = sleepLogs.length > 0 && sleepLogs[sleepLogs.length - 1].startTime
    ? sleepLogs[sleepLogs.length - 1].startTime
    : '22:00';

  return (
    <MobileLayout title="Sleep Tracker" headerGradientClass="from-[#D0BCFF]/40" backPath="/overview">
      <div className="space-y-6 pt-2">
        {/* Stacked top summary visualizer */}
        <div className="flex items-center justify-between py-2">
          <div className="space-y-5">
            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {avgDuration} <span className="text-base font-normal text-gray-400">HRS</span>
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Average Duration</p>
            </div>
            
            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {sleepScore !== null ? `${sleepScore}/100` : '--'}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Sleep Quality Score</p>
            </div>

            <div>
              <p className="text-3xl font-black text-[#1A1C1E] tracking-tight">
                {lastBedtime}
              </p>
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Last Logged Bedtime</p>
            </div>
          </div>

          <div className="w-36 h-48 rounded-[32px] bg-gradient-to-br from-[#E8DEF8] to-[#D0BCFF] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <Moon size={84} className="text-[#381E72] relative z-10 opacity-90 animate-bounce duration-[6s]" />
          </div>
        </div>

        {/* Sleep stages visualization - Reworked to match image */}
        <Card className="border-none shadow-none bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#1A1C1E]">Sleep stages</h3>
              <Info size={18} className="text-gray-300" />
            </div>

            {latestSleep ? (
              <div className="space-y-8">
                {/* Segmented Horizontal Bar */}
                <div className="h-10 w-full flex rounded-full overflow-hidden">
                  {phases.map((phase) => (
                    <div 
                      key={phase.name}
                      style={{ width: `${phase.percentage}%` }}
                      className={cn(phase.color, "h-full transition-all duration-500")}
                    />
                  ))}
                </div>

                {/* Detailed Legend */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  {phases.map((phase) => {
                    const duration = (totalHrs * phase.percentage) / 100;
                    return (
                      <div key={phase.name} className="flex items-start gap-3">
                        <div className={cn("w-1.5 h-10 rounded-full shrink-0", phase.color)} />
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{phase.name}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-[#1A1C1E]">{phase.percentage}%</span>
                            <span className="text-xs font-medium text-gray-400">({formatDuration(duration)})</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center bg-gray-50 rounded-[24px]">
                <p className="text-sm text-gray-400 font-medium px-6">Log a sleep period below to see your sleep stage breakdown.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Heart Rate During Sleep Graph */}
        <Card className="border-none shadow-none bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A1C1E]">Sleeping Heart Rate (Weekly)</h3>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sleepingHrData}>
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} width={20} domain={['dataMin - 3', 'dataMax + 3']} />
                  <Tooltip />
                  <Area type="monotone" dataKey="bpm" stroke="#EF4444" strokeWidth={2} fill="rgba(239, 68, 68, 0.05)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 7 Days duration list and input */}
        <Card className="border-none shadow-none bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A1C1E]">7-Day History</h3>
            {sleepLogs.length > 0 ? (
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepLogs}>
                    <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={11} axisLine={false} tickLine={false} width={20} />
                    <Tooltip />
                    <Bar dataKey="hrs" fill="#6750A4" radius={[6, 6, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-6 text-center bg-gray-50 rounded-[24px]">
                <p className="text-sm text-gray-400 font-medium">No 7-day sleep duration logged yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Period selection inputs */}
        <Card className="border-none shadow-none bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-[#1A1C1E] mb-3">Log Sleep Period</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CustomTimePicker 
                  label="Went to Bed"
                  value={bedtime}
                  onChange={setBedtime}
                />
                <CustomTimePicker 
                  label="Woke Up"
                  value={waketime}
                  onChange={setWaketime}
                />
              </div>

              <CustomDatePicker 
                label="Sleep Date"
                value={logDate}
                onChange={setLogDate}
              />

              <div className="bg-[#EADDFF]/40 text-[#21005D] p-3.5 rounded-2xl text-center text-sm font-medium">
                Calculated Sleep Time: <span className="font-bold text-lg text-[#6750A4]">{computedHrs}</span> hours
              </div>

              <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-2xl h-11 font-medium">
                Log Sleep Period
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default SleepPage;