"use client";

import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Bell, Shield, LogOut, ChevronRight, Activity, Flame, Globe, Clock, User, Sunrise } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUnits } from '@/context/UnitContext';
import { useHealthData } from '@/context/HealthDataContext';

const Profile = () => {
  const { convertWeight, convertHeight, formatTime } = useUnits();
  const { weightLogs } = useHealthData();

  const [profileName, setProfileName] = useState('Alex Johnson');
  const [profileEmail, setProfileEmail] = useState('alex.j@example.com');
  const [age, setAge] = useState('28 years');
  const [bloodType, setBloodType] = useState('O+');
  const [country, setCountry] = useState('United States');
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeUpTime, setWakeUpTime] = useState('06:30');
  const [sex, setSex] = useState('Male');

  useEffect(() => {
    const savedName = localStorage.getItem('profile_name');
    const savedEmail = localStorage.getItem('profile_email');
    const savedDob = localStorage.getItem('profile_dob');
    const savedBloodType = localStorage.getItem('profile_blood_type');
    const savedCountry = localStorage.getItem('profile_country');
    const savedBedtime = localStorage.getItem('profile_bedtime');
    const savedWakeUpTime = localStorage.getItem('profile_wakeup_time');
    const savedSex = localStorage.getItem('profile_sex');

    if (savedName) setProfileName(savedName);
    if (savedEmail) setProfileEmail(savedEmail);
    if (savedBloodType) setBloodType(savedBloodType);
    if (savedCountry) setCountry(savedCountry);
    if (savedBedtime) setBedtime(savedBedtime);
    if (savedWakeUpTime) setWakeUpTime(savedWakeUpTime);
    if (savedSex) setSex(savedSex);

    if (savedDob) {
      const birthDate = new Date(savedDob);
      const differenceMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(differenceMs);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (!isNaN(calculatedAge)) {
        setAge(`${calculatedAge} years`);
      }
    }
  }, []);

  const currentWeightRaw = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].val : 75;
  const weightConverted = convertWeight(currentWeightRaw);
  const heightConverted = convertHeight(180);

  const gearAction = (
    <Link 
      to="/settings/units" 
      className="w-11 h-11 rounded-full bg-[#EADDFF] text-[#21005D] hover:bg-[#D0BCFF] active:scale-95 transition-all flex items-center justify-center shadow-sm"
      title="Units Settings"
    >
      <Settings size={20} className="stroke-[2.5]" />
    </Link>
  );

  return (
    <MobileLayout 
      title="My Space" 
      rightAction={gearAction}
    >
      <div className="space-y-6 pb-12">
        
        {/* Profile Card Block */}
        <Link 
          to="/profile-settings"
          className="flex items-center justify-between p-4 bg-[#F7F2FA] border border-[#CAC4D0]/30 rounded-[28px] active:scale-[0.98] hover:bg-[#ECE6F0] transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-white/85 shadow-sm">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop" />
              <AvatarFallback className="bg-[#EADDFF] text-[#21005D] font-black">AJ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-extrabold text-[#1D1B20] tracking-tight group-hover:text-[#6750A4] transition-colors">
                {profileName}
              </h2>
              <p className="text-xs text-[#49454F] font-bold mt-0.5">{profileEmail}</p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1D1B20] shadow-sm group-hover:translate-x-1 transition-transform">
            <ChevronRight size={16} strokeWidth={2.5} />
          </div>
        </Link>

        {/* M3 Tonal Metrics Card */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px] overflow-hidden">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E6E0E9] pb-3">
              <Activity size={18} className="text-[#6750A4]" />
              <span className="text-xs font-bold text-[#49454F] uppercase tracking-wider">Metrics Profile</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FEF7FF] border border-[#CAC4D0]/20 p-4 rounded-2xl space-y-1">
                <p className="text-[10px] text-[#49454F] font-bold uppercase tracking-wider">Age</p>
                <p className="text-base font-extrabold text-[#1D1B20]">{age}</p>
              </div>
              <div className="bg-[#FEF7FF] border border-[#CAC4D0]/20 p-4 rounded-2xl space-y-1">
                <p className="text-[10px] text-[#49454F] font-bold uppercase tracking-wider">Blood Type</p>
                <p className="text-base font-extrabold text-[#1D1B20]">{bloodType}</p>
              </div>
              <div className="bg-[#FEF7FF] border border-[#CAC4D0]/20 p-4 rounded-2xl space-y-1">
                <p className="text-[10px] text-[#49454F] font-bold uppercase tracking-wider">Sex</p>
                <p className="text-base font-extrabold text-[#1D1B20]">{sex}</p>
              </div>
              <div className="bg-[#FEF7FF] border border-[#CAC4D0]/20 p-4 rounded-2xl space-y-1">
                <p className="text-[10px] text-[#49454F] font-bold uppercase tracking-wider">Bedtime Target</p>
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-[#6750A4] shrink-0" />
                  <p className="text-base font-extrabold text-[#1D1B20]">{formatTime(bedtime)}</p>
                </div>
              </div>
              <div className="bg-[#FEF7FF] border border-[#CAC4D0]/20 p-4 rounded-2xl space-y-1">
                <p className="text-[10px] text-[#49454F] font-bold uppercase tracking-wider">Wakeup Target</p>
                <div className="flex items-center gap-1">
                  <Sunrise size={14} className="text-[#6750A4] shrink-0" />
                  <p className="text-base font-extrabold text-[#1D1B20]">{formatTime(wakeUpTime)}</p>
                </div>
              </div>
              <div className="bg-[#FEF7FF] border border-[#CAC4D0]/20 p-4 rounded-2xl space-y-1">
                <p className="text-[10px] text-[#49454F] font-bold uppercase tracking-wider">Region</p>
                <div className="flex items-center gap-1 min-w-0">
                  <Globe size={14} className="text-[#6750A4] shrink-0" />
                  <p className="text-base font-extrabold text-[#1D1B20] truncate max-w-full">{country}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Settings Action Rows */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px] overflow-hidden">
          <CardContent className="p-2.5 space-y-1">
            {[
              { icon: Bell, label: 'Push Notifications', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
              { icon: Shield, label: 'Security & Privacy', color: 'text-green-500', bg: 'bg-green-50 border-green-100' },
              { icon: Flame, label: 'Goal Configuration', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' },
              { icon: LogOut, label: 'Sign Out Account', color: 'text-red-500', bg: 'bg-red-50 border-red-100' },
            ].map((item, idx) => (
              <button 
                key={item.label}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-white active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${item.bg} border rounded-xl flex items-center justify-center shrink-0`}>
                    <item.icon size={18} className={item.color} />
                  </div>
                  <span className="font-extrabold text-sm text-[#1D1B20]">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </CardContent>
        </Card>

      </div>
    </MobileLayout>
  );
};

export default Profile;