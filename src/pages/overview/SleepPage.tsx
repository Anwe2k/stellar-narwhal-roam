"use client";

import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Info, Sparkles, Clock, Activity, ShieldAlert } from 'lucide-react';
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

  const lastLog = sleepLogs.length > 0 ? sleepLogs[sleepLogs.length - 1] : null;
  const lastBedtime = lastLog && lastLog.startTime ? lastLog.startTime : '22:00';
  const lastWaketime = lastLog && lastLog.endTime ? lastLog.endTime : '06:00';
  const lastHrs = lastLog ? lastLog.hrs : 8;

  // Helper to format hours into hours and minutes
  const formatHrs = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  // Sleep stages breakdown calculations
  const stages = [
    { 
      name: 'Awake', 
      percentage: 5, 
      duration: lastHrs * 0.05, 
      color: 'bg-red-400', 
      textColor: 'text-red-500',
      chartColor: '#F87171',
      insight: 'Brief awakenings are normal. Too many can indicate stress or environmental noise.' 
    },
    { 
      name: 'REM', 
      percentage: 22, 
      duration: lastHrs * 0.22, 
      color: 'bg-indigo-400', 
      textColor: 'text-indigo-500',
      chartColor: '#818CF8',
      insight: 'Essential for mental restoration, memory consolidation, and creative dreaming.' 
    },
    { 
      name: 'Light', 
      percentage: 53, 
      duration: lastHrs * 0.53, 
      color: 'bg-blue-400', 
      textColor: 'text-blue-500',
      chartColor: '#60A5FA',
      insight: 'Serves as the transition stage. Helps process memories and relaxes muscles.' 
    },
    { 
      name: 'Deep', 
      percentage: 20, 
      duration: lastHrs * 0.20, 
      color: 'bg-blue-700', 
      textColor: 'text-blue-700',
      chartColor: '#1D4ED8',
      insight: 'Crucial for physical recovery, tissue repair, and immune system strengthening.' 
    },
  ];

  // Generate a realistic step-like sleep cycle timeline based on bedtime and waketime
  const generateSleepTimeline = (startStr: string, endStr: string) => {
    const [bedH, bedM] = startStr.split(':').map(Number);
    const [wakeH, wakeM] = endStr.split(':').map(Number);
    
    let startMins = bedH * 60 + bedM;
    let endMins = wakeH * 60 + wakeM;
    if (endMins < startMins) {
      endMins += 24 * 60;
    }
    
    const totalMins = endMins - startMins;
    const stepsCount = 16;
    const timeline = [];
    
    // Standard sleep cycle pattern: Awake (4) -> Light (2) -> Deep (1) -> Light (2) -> REM (3) -> Light (2) -> Deep (1)...
    const pattern = [4, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 4];
    
    for (let i = 0; i < stepsCount; i++) {
      const currentMins = startMins + (totalMins / (stepsCount - 1)) * i;
      const h = Math.floor((currentMins % (24 * 60)) / 60);
      const m = Math.floor(currentMins % 60);
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      
      const stageVal = pattern[i % pattern.length];
      const stageName = ['Deep', 'Light', 'REM', 'Awake'][stageVal - 1];
      
      timeline.push({
        time: timeStr,
        stageValue: stageVal,
        stageName: stageName
      });
    }
    return timeline;
  };

  const timelineData = generateSleepTimeline(lastBedtime, lastWaketime);

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

  return (
    <MobileLayout title="Sleep Tracker" backPath="/overview">
      <div className="space-y-6 pt-1 pb-12">
        
        {/* Dynamic sleep indicators summary */}
        <div className="flex items-center justify-between py-2 bg-[#F3EDF7] border border-[#CAC4D0]/30 rounded-[28px] p-5">
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
                {avgDuration} <span className="text-xs font-bold text-[#49454F]">HRS</span>
              </p>
              <p className="text-[10px] font-bold text-[#49454F] tracking-wider uppercase">Average Duration</p>
            </div>
            
            <div>
              <p className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
                {sleepScore !== null ? `${sleepScore}/100` : '--'}
              </p>
              <p className="text-[10px] font-bold text-[#49454F] tracking-wider uppercase">Sleep Quality</p>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
                {lastBedtime}
              </p>
              <p className="text-[10px] font-bold text-[#49454F] tracking-wider uppercase">Last Bedtime</p>
            </div>
          </div>

          <div className="w-28 h-36 rounded-[24px] bg-[#D0E1FD] border border-[#A2C4FC] flex items-center justify-center relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <Moon size={64} className="text-[#1A56DB] relative z-10 opacity-95 animate-bounce duration-[6s]" />
          </div>
        </div>

        {/* Sleep stages breakdown - Premium Material Outlined Style */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px] overflow-hidden">
          <CardContent className="p-5 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-[#1D1B20] uppercase tracking-wider">Sleep Stages</h3>
              {sleepScore !== null && (
                <span className="text-[10px] font-extrabold bg-[#EADDFF] text-[#21005D] px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#D0BCFF]">
                  <Sparkles size={11} />
                  {sleepScore >= 85 ? 'Excellent Rest' : sleepScore >= 70 ? 'Good Rest' : 'Restless Rest'}
                </span>
              )}
            </div>

            {sleepLogs.length > 0 ? (
              <div className="space-y-6">
                {/* Horizontal Proportion Bar */}
                <div className="space-y-3">
                  <div className="h-3 w-full rounded-full flex overflow-hidden bg-gray-100 border border-gray-200">
                    {stages.map((stage) => (
                      <div 
                        key={stage.name} 
                        className={`${stage.color} h-full transition-all duration-500`} 
                        style={{ width: `${stage.percentage}%` }}
                        title={`${stage.name}: ${stage.percentage}%`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-[#49454F]">
                    {stages.map((stage) => (
                      <span key={stage.name} className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${stage.color} border border-black/10`} />
                        {stage.name} ({stage.percentage}%)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step-Timeline Sleep Cycle Chart */}
                <div className="space-y-2 border-t border-[#CAC4D0]/20 pt-4">
                  <span className="text-[10px] font-bold text-[#49454F] uppercase tracking-wider block">Sleep Cycle Timeline</span>
                  <div className="h-40 w-full -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineData}>
                        <XAxis 
                          dataKey="time" 
                          stroke="#49454F" 
                          fontSize={9} 
                          axisLine={false} 
                          tickLine={false} 
                        />
                        <YAxis 
                          stroke="#49454F" 
                          fontSize={9} 
                          axisLine={false} 
                          tickLine={false} 
                          domain={[1, 4]}
                          ticks={[1, 2, 3, 4]}
                          tickFormatter={(value) => {
                            return ['Deep', 'Light', 'REM', 'Awake'][value - 1];
                          }}
                          width={45}
                        />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-2.5 rounded-xl shadow-md border border-[#E6E0E9] text-[11px]">
                                  <p className="font-extrabold text-gray-800">{data.stageName} Stage</p>
                                  <p className="text-gray-400">Time: {data.time}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area 
                          type="stepAfter" 
                          dataKey="stageValue" 
                          stroke="#1A56DB" 
                          strokeWidth={2}
                          fill="rgba(26, 86, 219, 0.05)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Stage Insights List */}
                <div className="space-y-3 pt-3 border-t border-[#CAC4D0]/20">
                  {stages.map((stage) => (
                    <div key={stage.name} className="flex gap-3 items-start p-3 rounded-2xl bg-white border border-[#CAC4D0]/10 hover:bg-[#ECE6F0]/20 transition-colors">
                      <div className={`w-2.5 h-2.5 rounded-full ${stage.color} mt-1.5 shrink-0 border border-black/10`} />
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-extrabold text-xs text-gray-800">{stage.name}</span>
                          <span className="text-[10px] font-bold text-gray-400">{formatHrs(stage.duration)}</span>
                          <span className="text-[9px] font-semibold text-gray-400">({stage.percentage}%)</span>
                        </div>
                        <p className="text-[11px] text-[#49454F] leading-relaxed font-medium">{stage.insight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center bg-white border border-[#CAC4D0]/20 rounded-2xl">
                <p className="text-xs text-[#49454F] font-bold">Log sleep periods below to generate phase breakdowns.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Heart Rate During Sleep Graph */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px]">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-[#1D1B20] uppercase tracking-wider">Sleeping Heart Rate (Weekly)</h3>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sleepingHrData}>
                  <XAxis dataKey="day" stroke="#49454F" fontSize={9} axisLine={false} tickLine={false} />
                  <YAxis stroke="#49454F" fontSize={9} axisLine={false} tickLine={false} width={20} domain={['dataMin - 3', 'dataMax + 3']} />
                  <Tooltip />
                  <Area type="monotone" dataKey="bpm" stroke="#EF4444" strokeWidth={2} fill="rgba(239, 68, 68, 0.05)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 7 Days Duration list */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px]">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-[#1D1B20] uppercase tracking-wider">7-Day Sleep Duration</h3>
            {sleepLogs.length > 0 ? (
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepLogs}>
                    <XAxis dataKey="day" stroke="#49454F" fontSize={9} axisLine={false} tickLine={false} />
                    <YAxis stroke="#49454F" fontSize={9} axisLine={false} tickLine={false} width={20} />
                    <Tooltip />
                    <Bar dataKey="hrs" fill="#1A56DB" radius={[6, 6, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-6 text-center bg-white border border-[#CAC4D0]/20 rounded-2xl">
                <p className="text-xs text-[#49454F] font-bold">No sleep logs recorded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Period selection inputs */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px]">
          <CardContent className="p-5">
            <h3 className="text-sm font-extrabold text-[#1D1B20] uppercase tracking-wider mb-4">Log Sleep Period</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
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

              <div className="bg-[#EADDFF] text-[#21005D] border border-[#D0BCFF] p-4 rounded-2xl text-center text-xs font-extrabold">
                Calculated Sleep Time: <span className="text-lg font-black block mt-0.5">{computedHrs} hours</span>
              </div>

              <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-full h-12 font-bold transition-transform active:scale-95">
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