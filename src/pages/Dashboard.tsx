"use client";

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import HealthSummary from '@/components/dashboard/HealthSummary';
import ActivityChart from '@/components/dashboard/ActivityChart';
import InsightsSection from '@/components/dashboard/InsightsSection';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  return (
    <MobileLayout title="Good morning, Alex">
      <div className="space-y-6">
        <p className="text-[#44474E] -mt-2">Here's your health summary for today.</p>
        
        {/* Core health summary overview cards */}
        <HealthSummary />
        
        {/* Dynamic rule-based insights and target goal indicators */}
        <InsightsSection />
        
        {/* Activity history chart */}
        <ActivityChart />

        {/* Connect Banner */}
        <div className="bg-[#EADDFF] p-6 rounded-3xl mt-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[#21005D] font-bold text-lg">Health Connect</h3>
            <p className="text-[#21005D]/80 text-sm mt-1 max-w-[200px]">
              Sync your data with Google Health Connect for a better overview.
            </p>
            <Button className="mt-4 bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-full px-6">
              Connect Now
            </Button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <Plus size={120} />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;