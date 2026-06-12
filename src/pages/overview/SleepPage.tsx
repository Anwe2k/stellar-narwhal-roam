"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Moon, Star, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { showSuccess } from '@/utils/toast';

const SleepPage = () => {
  const [durationInput, setDurationInput] = useState('');
  const [sleepScore, setSleepScore] = useState('85');

  // Sleep Phases breakdown data
  const phaseData = [
    { name: 'Awake', duration: 45, fill: '#FFB2AB' },
    { name: 'REM', duration: 90, fill: '#D0BCFF' },
    { name: 'Light', duration: 240, fill: '#A8DADC' },
    { name: 'Deep', duration: 115, fill: '#6750A4' },
  ];

  // Sleep duration last 7 days
  const [history, setHistory] = useState([
    { day: 'Mon', hrs: 7.2 },
    { day: 'Tue', hrs: 6.8 },
    { day: 'Wed', hrs: 8.0 },
    { day: 'Thu', hrs: 7.5 },
    { day: 'Fri', hrs: 7.0 },
    { day: 'Sat', hrs: 8.5 },
    { day: 'Sun', hrs: 7.8 },
  ]);

  // HR during Sleep graph
  const sleepingHrData = [
    { time: '23:00', bpm: 62 },
    { time: '01:00', bpm: 58 },
    { time: '03:00', bpm: 54 },
    { time: '05:00', bpm: 56 },
    { time: '07:00', bpm: 60 },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!durationInput) return;

    const newLog = {
      day: 'Today',
      hrs: parseFloat(durationInput),
    };

    setHistory([...history.slice(1), newLog]);
    setDurationInput('');
    showSuccess('Sleep log added successfully!');
  };

  const avgDuration = (history.reduce((acc, curr) => acc + curr.hrs, 0) / history.length).toFixed(1);

  return (
    <MobileLayout title="Sleep Tracker">
      <div className="space-y-6">
        <div className="flex items-center gap-2 -mt-2">
          <Link to="/overview" className="p-2 -ml-2 rounded-full hover:bg-gray-150 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Categories</span>
        </div>

        {/* Average and Score Dashboard summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-sm bg-[#D0BCFF] text-[#381E72] rounded-3xl">
            <CardContent className="p-5">
              <span className="text-xs font-semibold opacity-80 uppercase">Avg Sleep</span>
              <p className="text-3xl font-black mt-2">{avgDuration} <span className="text-xs font-normal">hrs/day</span></p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white rounded-3xl">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-gray-400 uppercase">Sleep Score</span>
              <p className="text-3xl font-black text-[#6750A4] mt-2">{sleepScore} <span className="text-xs font-normal text-gray-400">/100</span></p>
            </CardContent>
          </Card>
        </div>

        {/* Sleep phases visualization */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A1C1E]">Sleep Phases Breakdown</h3>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#888" fontSize={11} width={50} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="duration" radius={[0, 8, 8, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-1 text-[10px] text-center text-gray-400">
              <div><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FFB2AB] mr-1"></span>Awake</div>
              <div><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D0BCFF] mr-1"></span>REM</div>
              <div><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#A8DADC] mr-1"></span>Light</div>
              <div><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#6750A4] mr-1"></span>Deep</div>
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate During Sleep Graph */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A1C1E]">Sleeping Heart Rate</h3>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sleepingHrData}>
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
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
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history}>
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} axisLine={false} tickLine={false} width={20} />
                  <Tooltip />
                  <Bar dataKey="hrs" fill="#6750A4" radius={[6, 6, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Input Log block */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-[#1A1C1E] mb-3">Add Sleep Duration</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="duration" className="text-xs font-medium text-gray-500">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 8.2"
                  value={durationInput}
                  onChange={(e) => setDurationInput(e.target.value)}
                  className="rounded-2xl border-gray-200 h-11"
                />
              </div>
              <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-2xl h-11 font-medium">
                Log Night
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default SleepPage;