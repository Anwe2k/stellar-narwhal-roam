"use client";

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Flame, Footprints, Moon, Heart, Scale, CupSoda } from 'lucide-react';
import { Link } from 'react-router-dom';

const Overview = () => {
  const sections = [
    {
      title: 'Activity',
      description: 'Steps, Energy, and Distance logs',
      path: '/overview/activity',
      icon: Footprints,
      color: 'bg-[#E8DEF8] text-[#21005D]',
    },
    {
      title: 'Sleep',
      description: 'Duration, sleep phases, and sleep quality',
      path: '/overview/sleep',
      icon: Moon,
      color: 'bg-[#D0BCFF] text-[#381E72]',
    },
    {
      title: 'Nutrition',
      description: 'Calories consumed and daily hydration',
      path: '/overview/nutrition',
      icon: CupSoda,
      color: 'bg-[#C1E7F4] text-[#001F2A]',
    },
    {
      title: 'Vitals',
      description: 'Heart rate, SpO2, and core metrics',
      path: '/overview/vitals',
      icon: Heart,
      color: 'bg-[#FFDAD6] text-[#410002]',
    },
    {
      title: 'Body Measurements',
      description: 'Weight, Height, Body Fat, and BMI progress',
      path: '/overview/body-measurements',
      icon: Scale,
      color: 'bg-[#E2F1E8] text-[#002111]',
    },
  ];

  return (
    <MobileLayout title="Health Metrics">
      <div className="space-y-4">
        <p className="text-[#44474E] -mt-2">Select a health category to view history and log entries.</p>
        
        <div className="space-y-4 pt-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.title} to={section.path} className="block group">
                <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-3xl overflow-hidden">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${section.color} transition-transform group-hover:scale-105 duration-300`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-[#1A1C1E]">{section.title}</h3>
                        <p className="text-sm text-[#44474E]">{section.description}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#44474E] group-hover:translate-x-1 transition-transform duration-300">
                      <ChevronRight size={18} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Overview;