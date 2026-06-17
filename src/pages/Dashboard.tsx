"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import HealthSummary from '@/components/dashboard/HealthSummary';
import ActivityChart from '@/components/dashboard/ActivityChart';
import { Button } from '@/components/ui/button';
import { Plus, Flame, Footprints, Moon, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Dashboard = () => {
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  return (
    <MobileLayout title="Alex's Space">
      <div className="space-y-6 pb-12">
        {/* Dynamic Greeting/Status Section */}
        <div className="space-y-1">
          <p className="text-[#49454F] text-sm font-medium">Good morning</p>
          <h2 className="text-3xl font-extrabold text-[#1D1B20] tracking-tight">
            Ready for today?
          </h2>
        </div>
        
        {/* Material 3 Health Summary Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#49454F] uppercase tracking-wider">Metrics Overview</span>
            <Link to="/overview" className="text-xs font-bold text-[#6750A4] hover:underline">
              See detailed
            </Link>
          </div>
          <HealthSummary />
        </div>
        
        {/* Material 3 Styled Activity Chart */}
        <ActivityChart />

        {/* Dynamic Connect Banner - Styled as M3 Outlined Container */}
        <div className="bg-[#EADDFF] border border-[#6750A4]/10 p-6 rounded-[28px] relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <div className="relative z-10 space-y-3">
            <span className="text-xs font-bold text-[#21005D] uppercase tracking-widest bg-[#EADDFF]/50 px-2 py-0.5 rounded-md">Integrations</span>
            <h3 className="text-[#21005D] font-extrabold text-xl tracking-tight">Health Connect</h3>
            <p className="text-[#21005D]/80 text-xs leading-relaxed max-w-[220px]">
              Sync your health signals automatically with Google Health Connect to streamline analytics.
            </p>
            <Button className="mt-2 bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-full px-5 text-xs font-bold h-10 transition-transform active:scale-95">
              Connect Now
            </Button>
          </div>
          <div className="absolute right-[-10px] bottom-[-20px] opacity-10 text-[#6750A4] transform group-hover:scale-110 transition-transform duration-500">
            <Plus size={160} strokeWidth={3} />
          </div>
        </div>

        {/* Floating Action Button (M3 Extended FAB) */}
        <Dialog open={quickLogOpen} onOpenChange={setQuickLogOpen}>
          <DialogTrigger asChild>
            <button 
              className="fixed bottom-24 right-6 bg-[#EADDFF] text-[#21005D] hover:bg-[#D0BCFF] active:scale-95 transition-all shadow-[0_4px_16px_rgba(103,80,164,0.15)] flex items-center gap-2 px-5 py-4 rounded-[16px] z-50 font-bold text-sm tracking-wide"
              aria-label="Quick Log Entry"
            >
              <Plus size={20} className="stroke-[2.5]" />
              Quick Log
            </button>
          </DialogTrigger>
          <DialogContent className="rounded-t-[28px] sm:rounded-[28px] border-none bg-[#FEF7FF] p-6 max-w-md mx-auto">
            <DialogHeader className="border-b border-[#E6E0E9] pb-3">
              <DialogTitle className="text-lg font-bold text-[#1D1B20]">Quick Log Entry</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link 
                to="/overview/activity" 
                onClick={() => setQuickLogOpen(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#E8DEF8] hover:bg-[#D0BCFF] transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-[#EADDFF] flex items-center justify-center text-[#21005D]">
                  <Footprints size={20} />
                </div>
                <span className="text-xs font-bold text-[#1D192B]">Activity</span>
              </Link>
              
              <Link 
                to="/overview/sleep" 
                onClick={() => setQuickLogOpen(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#D0E1FD] hover:bg-[#A2C4FC] transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-[#E0ECFF] flex items-center justify-center text-[#1A56DB]">
                  <Moon size={20} />
                </div>
                <span className="text-xs font-bold text-[#1D192B]">Sleep</span>
              </Link>

              <Link 
                to="/overview/nutrition" 
                onClick={() => setQuickLogOpen(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#C1E7F4] hover:bg-[#99D5ED] transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-[#D1F2FF] flex items-center justify-center text-[#004D61]">
                  <Flame size={20} />
                </div>
                <span className="text-xs font-bold text-[#1D192B]">Nutrition</span>
              </Link>

              <Link 
                to="/overview/vitals" 
                onClick={() => setQuickLogOpen(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#FFDAD6] hover:bg-[#FFB2AB] transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FFEAE5] flex items-center justify-center text-[#BA1A1A]">
                  <Heart size={20} />
                </div>
                <span className="text-xs font-bold text-[#1D192B]">Vitals</span>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;