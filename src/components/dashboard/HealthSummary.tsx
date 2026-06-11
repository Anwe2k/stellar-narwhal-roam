"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Flame, Footprints, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const HealthSummary = () => {
  const stats = [
    { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, color: 'bg-red-100 text-red-600' },
    { label: 'Calories', value: '1,240', unit: 'kcal', icon: Flame, color: 'bg-orange-100 text-orange-600' },
    { label: 'Steps', value: '8,432', unit: 'steps', icon: Footprints, color: 'bg-blue-100 text-blue-600' },
    { label: 'Sleep', value: '7.5', unit: 'hrs', icon: Moon, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-5">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3", stat.color)}>
              <stat.icon size={20} />
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs text-gray-400">{stat.unit}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HealthSummary;