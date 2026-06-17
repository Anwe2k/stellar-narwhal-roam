"use client";

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Footprints, Moon, Heart, Scale, CupSoda } from 'lucide-react';
import { Link } from 'react-router-dom';

const Overview = () => {
  const sections = [
    {
      title: 'Activity Insights',
      description: 'Steps taken, energetic burn & distances logs',
      path: '/overview/activity',
      icon: Footprints,
      color: 'bg-[#EADDFF] text-[#21005D] border-[#D0BCFF]',
    },
    {
      title: 'Sleep Tracking',
      description: 'Duration cycles & calculated rest quality',
      path: '/overview/sleep',
      icon: Moon,
      color: 'bg-[#D0E1FD] text-[#1A56DB] border-[#A2C4FC]',
    },
    {
      title: 'Dietary Nutrition',
      description: 'Metabolic fuel logs & personalized water status',
      path: '/overview/nutrition',
      icon: CupSoda,
      color: 'bg-[#C1E7F4] text-[#004D61] border-[#99D5ED]',
    },
    {
      title: 'Cardiac & Vitals',
      description: 'Pulse fluctuations, oxygen rate & biometric logs',
      path: '/overview/vitals',
      icon: Heart,
      color: 'bg-[#FFDAD6] text-[#410002] border-[#FFB2AB]',
    },
    {
      title: 'Body Composition',
      description: 'Circumferences, weight balance & body indexes',
      path: '/overview/body-measurements',
      icon: Scale,
      color: 'bg-[#E2F1E8] text-[#00512C] border-[#CBE5D5]',
    },
  ];

  return (
    <MobileLayout title="Health Signals">
      <div className="space-y-5 pb-12">
        <p className="text-[#49454F] text-sm font-medium -mt-1.5">
          Select any physiological signal category to view trend logs or add manual measurements.
        </p>
        
        <div className="space-y-3 pt-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.title} to={section.path} className="block group">
                <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[24px] overflow-hidden hover:bg-[#ECE6F0] active:scale-[0.99] transition-all duration-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 border ${section.color} transition-transform group-hover:scale-105 duration-300`}>
                        <Icon size={22} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-sm text-[#1D1B20] tracking-tight">{section.title}</h3>
                        <p className="text-xs text-[#49454F] font-medium mt-0.5 truncate leading-relaxed">{section.description}</p>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 text-[#49454F] group-hover:translate-x-1 transition-transform duration-300 shadow-sm">
                      <ChevronRight size={16} strokeWidth={2.5} />
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