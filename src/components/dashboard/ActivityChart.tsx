"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Mon', steps: 4000 },
  { name: 'Tue', steps: 3000 },
  { name: 'Wed', steps: 2000 },
  { name: 'Thu', steps: 2780 },
  { name: 'Fri', steps: 1890 },
  { name: 'Sat', steps: 2390 },
  { name: 'Sun', steps: 3490 },
];

const ActivityChart = () => {
  return (
    <Card className="border border-[#CAC4D0]/40 shadow-none bg-[#F7F2FA] rounded-[28px] overflow-hidden">
      <CardHeader className="pb-1 pt-5 px-6">
        <CardTitle className="text-sm font-extrabold text-[#1D1B20] tracking-wider uppercase">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="h-[210px] w-full pt-2 px-4 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#49454F', fontWeight: 'bold' }} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(103, 80, 164, 0.06)', radius: 8 }}
              contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#FEF7FF', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            />
            <Bar 
              dataKey="steps" 
              fill="#6750A4" 
              radius={[8, 8, 0, 0]} 
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;