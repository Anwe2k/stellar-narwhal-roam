"use client";

import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sparkles, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useHealthData } from '@/context/HealthDataContext';
import { CustomTimePicker, CustomDatePicker } from '@/components/ui/CustomDateTimePicker';
import { showSuccess } from '@/utils/toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const SleepPage = () => {
  const { sleepLogs, addSleepLog } = useHealthData();
  const [bedtime, setBedtime] = useState('22:00');
  const [waketime, setWaketime] = useState('06:00');
  const [computedHrs, setComputedHrs] = useState(8);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [isStagesExpanded, setIsStagesExpanded] = useState(false);

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

  // Sleep stages breakdown calculations - Explicitly marked as estimated
  const stages = [
    { 
      name: 'Awake', 
      percentage: 5, 
      duration: lastHrs * 0.05, 
      color: 'bg-red-400', 
      textColor: 'text-red-500',
      chartColor: '#F87171',
      insight: 'Brief awakenings are calculated baseline averages.' 
    },
    { 
      name: 'REM', 
      percentage: 22, 
      duration: lastHrs * 0.22, 
      color: 'bg-indigo-400', 
      textColor: 'text-indigo-500',
      chartColor: '#818CF8',
      insight: 'Essential mental recovery cycles (Estimated from duration).' 
    },
    { 
      name: 'Light', 
      percentage: 53, 
      duration: lastHrs * 0.53, 
      color: 'bg-blue-400', 
      textColor: 'text-blue-500',
      chartColor: '#60A5FA',
      insight: 'Body transition stage (Estimated from duration).' 
    },
    { 
      name: 'Deep', 
      percentage: 20, 
      duration: lastHrs * 0.20, 
      color: 'bg-blue-700', 
      textColor: 'text-blue-700',
      chartColor: '#1D4ED8',
      insight: 'Physical recovery cycles (Estimated from duration).' 
    },
  ];

  // Generate estimated step-like sleep cycle timeline
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

  // Heart Rate During Sleep Graph values - Labeled explicitly as estimated averages
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
    <MobileLayout title="Sleep Tracker" headerGradientClass="from-[#D0E1FD]/50" backPath="/overview">
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

          <div className="w-36 h-48 rounded-[32px] bg-gradient-to-br from-[#D0E1FD] to-[#A2C4FC] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <Moon size={84} className="text-[#1A56DB] relative z-10 opacity-90 animate-bounce duration-[6s]" />
          </div>
        </div>

        {/* Sleep stages breakdown - Collapsible */}
        <Card className="border-none shadow-none bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <Collapsible
              open={isStagesExpanded}
              onOpenChange={setIsStagesExpanded}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <button className="w-full p-6 flex justify-between items-center text-left hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-base text-[#1A1C1E]">Estimated Sleep Stages</h3>
                    <p className="text-[10px] text-gray-400 italic">Tap to view breakdown and timeline</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {sleepScore !== null && (
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Sparkles size={10} />
                        {sleepScore >= 85 ? 'Excellent' : sleepScore >= 70 ? 'Good' : 'Restless'}
                      </span>
                    )}
                    {isStagesExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 space-y-6">
                {sleepLogs.length > 0 ? (
                  <div className="space-y-6 pt-2 border-t border-gray-100">
                    {/* Horizontal Proportion Bar */}
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded-full flex overflow-hidden bg-gray-100">
                        {stages.map((stage) => (
                          <div 
                            key={stage.name} 
                            className={`${stage.color} h-full transition-all`} 
                            style={{ width: `${stage.percentage}%` }}
                            title={`${stage.name}: ${stage.percentage}% (Estimated)`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
                        {stages.map((stage) => (
                          <span key={stage.name} className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                            {stage.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Step-Timeline Sleep Cycle Chart */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Estimated Sleep Cycle Timeline</span>
                      <div className="h-48 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={timelineData}>
                            <XAxis 
                              dataKey="time" 
                              stroke="#9CA3AF" 
                              fontSize={10} 
                              axisLine={false} 
                              tickLine={false} 
                            />
                            <YAxis 
                              stroke="#9CA3AF" 
                              fontSize={10} 
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
                                    <div className="bg-white p-2.5 rounded-xl shadow-md border border-gray-100 text-xs">
                                      <p className="font-bold text-gray-800">{data.stageName}</p>
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
                              stroke="#3B82F6" 
                              strokeWidth={2.5}
                              fill="rgba(59, 130, 246, 0.08)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Detailed Stage Insights List */}
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      {stages.map((stage) => (
                        <div key={stage.name} className="flex gap-3 items-start p-3 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          <div className={`w-2.5 h-2.5 rounded-full ${stage.color} mt-1.5 shrink-0`} />
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-sm text-gray-800">{stage.name}</span>
                              <span className="text-xs font-bold text-gray-500">{formatHrs(stage.duration)}</span>
                              <span className="text-[10px] font-semibold text-gray-400">({stage.percentage}%)</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{stage.insight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center bg-gray-50 rounded-2xl">
                    <p className="text-sm text-gray-400 font-medium">Log sleep periods below to generate sleep phase calculations.</p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Heart Rate During Sleep Graph - Estimated */}
        <Card className="border-none shadow-none bg-white rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-[#1A1C1E]">Sleeping Heart Rate</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded-full">Estimated Baseline</span>
            </div>
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

        {/* 7 Days history */}
        <Card className="border-none shadow-none bg-white rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A1C1E]">7-Day Duration History</h3>
            {sleepLogs.length > 0 ? (
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepLogs}>
                    <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={11} axisLine={false} tickLine={false} width={20} />
                    <Tooltip />
                    <Bar dataKey="hrs" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={16} />
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
        <Card className="border-none shadow-none bg-white rounded-3xl">
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

              <div className="bg-blue-50 text-blue-900 p-3.5 rounded-2xl text-center text-sm font-medium">
                Calculated Sleep Time: <span className="font-bold text-lg text-blue-600">{computedHrs}</span> hours
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-11 font-medium">
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