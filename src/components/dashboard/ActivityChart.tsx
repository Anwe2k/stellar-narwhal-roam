"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { useHealthData } from '@/context/HealthDataContext';

const getDayName = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

const ActivityChart = () => {
  const { activityLogs } = useHealthData();

  // Generate last 7 days of real or empty data
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    return {
      date: dateStr,
      name: getDayName(dateStr),
      steps: 0
    };
  }).reverse();

  // Aggregate user steps for those days
  activityLogs.forEach(log => {
    const match = days.find(day => day.date === log.date);
    if (match) {
      match.steps += log.steps;
    }
  });

  const hasData = activityLogs.length > 0;

  return (
    <Card className="mt-6 border-none shadow-none bg-white rounded-3xl">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-full">
          {hasData ? 'Active Logged Data' : 'Sample Empty Baseline'}
        </span>
      </CardHeader>
      <CardContent className="h-[200px] w-full pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hasData ? days : days.map((d, i) => ({ ...d, steps: [2000, 4500, 1500, 3000, 6000, 2500, 3800][i] }))}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#888' }} 
            />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '12px', border: 'none' }}
            />
            <Bar 
              dataKey="steps" 
              fill="#6750A4" 
              radius={[6, 6, 0, 0]} 
              barSize={20}
              opacity={hasData ? 1 : 0.4}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;