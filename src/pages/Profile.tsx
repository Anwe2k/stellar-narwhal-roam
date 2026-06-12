"use client";

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Shield, LogOut, Plus, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useUnits } from '@/context/UnitContext';

const Profile = () => {
  const { convertWeight, convertHeight } = useUnits();

  // Convert basic metrics (Weight: 75kg, Height: 180cm)
  const weightConverted = convertWeight(75);
  const heightConverted = convertHeight(180);

  return (
    <MobileLayout title="Profile">
      <div className="space-y-6">
        <div className="flex flex-col items-center py-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-md">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop" />
            <AvatarFallback>AX</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mt-4">Alex Johnson</h2>
          <p className="text-sm text-gray-500">alex.j@example.com</p>
        </div>

        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Basic Info</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Age</p>
                  <p className="font-medium">28 years</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="font-medium">{weightConverted.value} {weightConverted.label}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Height</p>
                  <p className="font-medium">{heightConverted.value} {heightConverted.label}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Blood Type</p>
                  <p className="font-medium">O+</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Units Tab & Rest Settings */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider px-1">Settings</h3>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            
            {/* Measurement Units tab */}
            <Link 
              to="/settings/units"
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <Ruler size={20} className="text-[#6750A4]" />
                <span className="font-medium text-[#1A1C1E]">Units & Formats</span>
              </div>
              <div className="w-6 h-6 flex items-center justify-center text-[#6750A4] font-bold">
                <Plus size={16} />
              </div>
            </Link>

            {[
              { icon: Bell, label: 'Notifications', color: 'text-blue-500' },
              { icon: Shield, label: 'Privacy & Security', color: 'text-green-500' },
              { icon: Settings, label: 'App Settings', color: 'text-gray-500' },
              { icon: LogOut, label: 'Sign Out', color: 'text-red-500' },
            ].map((item, idx) => (
              <button 
                key={item.label}
                className={cn(
                  "w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors",
                  idx !== 3 && "border-b border-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={item.color} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="w-6 h-6 flex items-center justify-center text-gray-300">
                  <Plus size={16} className="rotate-45" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Profile;