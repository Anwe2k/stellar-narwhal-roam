"use client";

import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Moon, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useHealthData } from '@/context/HealthDataContext';
import { CustomTimePicker, CustomDatePicker } from '@/components/ui/CustomDateTimePicker';
import { showSuccess } from '@/utils/toast';

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

  // Default sleeping phase ratios based on latest sleep record or fallback
  const phaseData = sleepLogs.length > 0 ? [
    { name: 'Awake', duration: Math.round(sleepLogs[sleepLogs.length - 1].hrs * 6), fill: '#FFB2AB' },
    { name: 'REM', duration: Math.round(sleepLogs[sleepLogs.length - 1].hrs * 12), fill: '#D0BCFF' },
    { name: 'Light', duration: Math.round(sleepLogs[sleepLogs.length - 1].hrs * 30), fill: '#A8DADC' },
    { name: 'Deep', duration: Math.round(sleepLogs[sleepLogs.length - 1].hrs * 12), fill: '#6750A4' },
  ] : [];

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

  return (
    <MobileLayout title="Sleep Tracker">
      <div className="space-y-6">
        <div className="flex items-center gap-2 -mt-2">
          <Link to="/overview" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Categories</span>
        </div>

        {/* Card-less Ambient Dark-Gradient Header presentation */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#381E72]/15 via-indigo-900/5 to-transparent p-6 flex justify-between items-center min-h-[220px]">
          {/* 3 Key Metrics on the Left */}
          <div className="flex flex-col gap-6 z-10">
            <div className="space-y-0.5">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1C1E]">
                {avgDuration} <span className="text-sm font-normal text-gray-500">hrs</span>
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">AVG DURATION</p>
            </div>

            <div className="space-y-0.5">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1C1E]">
                {sleepScore !== null ? `${sleepScore}/100` : '--'}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">SLEEP SCORE</p>
            </div>

            <div className="space-y-0.5">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1C1E]">
                {sleepLogs.length > 0 ? sleepLogs[sleepLogs.length - 1].startTime || bedtime : bedtime}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">LAST BEDTIME</p>
            </div>
          </div>

          {/* Aesthetic High-fidelity illustrative Star/Moon vector element on the right */}
          <div className="absolute right-4 bottom-4 opacity-25 text-[#381E72] pointer-events-none">
            <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse duration-5000">
              <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <path d="M55 25C65 25 75 35 75 45C75 55 65 65 55 65C45 65 35 55 35 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="absolute top-[42%] left-[45%] -translate-x-1/2 -translate-y-1/2">
              <Moon size={56} className="text-[#381E72]" />
            </div>
          </div>
        </div>

        {/* Sleep phases visualization */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A1C1E]">Sleep Phases Breakdown</h3>
            {sleepLogs.length > 0 ? (
              <>
                <div className="h-28 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={phaseData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#888" fontSize={11} width={50} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="duration" radius={[0, 8, 8, 0]} barSize={12} fill="#6750A4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center text-gray-400">
                  <div><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FFB2AB] mr-1"></span>Awake</div>
                  <div><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D0BCFF] mr-1"></span>REM</div>
                  <div><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#A8DADC] mr-1"></span>Light</div>
                  <div><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#6750A4] mr-1"></span>Deep</div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-400 font-medium">Log sleep periods below to generate sleep phase calculations.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Heart Rate During Sleep Graph */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A1C1E]">Sleeping Heart Rate (Weekly)</h3>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sleepingHrData}>
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} width={20} />
                  <Tooltip />
                  <Area type="monotone" dataKey="bpm" stroke="#EF4444" strokeWidth={2} fill="rgba(239, 68, 68, 0.05)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 7 Days duration list and input */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
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
              <div className="p-6 text-center bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-400 font-medium">No 7-day sleep duration logged yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Period selection inputs */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
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