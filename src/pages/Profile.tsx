"use client";

import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Bell, Shield, LogOut, ChevronRight, Activity, Flame, Globe, Clock, User, Sunrise, Palette } from 'lucide-react';
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
      className="p-2.5 rounded-full bg-white/40 backdrop-blur-md text-[#535C8A] hover:bg-white/60 active:scale-95 transition-all shadow-sm"
      title="Settings"
    >
      <Settings size={22} className="animate-[spin_1s_ease-in-out]" />
    </Link>
  );

  return (
    <MobileLayout 
      title="Profile" 
      headerGradientClass="from-[#C1C8FF] via-[#DCE1FF]/40" 
      rightAction={gearAction}
    >
      <div className="space-y-6">
        
        <Link 
          to="/profile-settings"
          className="flex items-center justify-between p-2 mt-4 bg-transparent rounded-3xl active:scale-[0.98] transition-transform duration-200 group"
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-white/80 shadow-md">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop" />
              <AvatarFallback className="bg-[#C1C8FF] text-[#1A1C1E] font-black">AJ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-black text-[#1A1C1E] tracking-tight group-hover:text-[#6750A4] transition-colors">
                {profileName}
              </h2>
              <p className="text-xs text-gray-500 font-semibold">{profileEmail}</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1A1C1E] shadow-sm group-hover:translate-x-1 transition-transform">
            <ChevronRight size={20} strokeWidth={2.5} />
          </div>
        </Link>

        <Card className="border-none shadow-none bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Activity size={18} className="text-[#6750A4]" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Metrics Overview</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F7F9FC] p-4 rounded-2xl space-y-1">
                <p className="text-xs text-gray-400 font-semibold">Age</p>
                <p className="text-lg font-black text-[#1A1C1E]">{age}</p>
              </div>
              <div className="bg-[#F7F9FC] p-4 rounded-2xl space-y-1">
                <p className="text-xs text-gray-400 font-semibold">Blood Type</p>
                <p className="text-lg font-black text-[#1A1C1E]">{bloodType}</p>
              </div>
              <div className="bg-[#F7F9FC] p-4 rounded-2xl space-y-1">
                <p className="text-xs text-gray-400 font-semibold">Sex</p>
                <p className="text-lg font-black text-[#1A1C1E]">{sex}</p>
              </div>
              <div className="bg-[#F7F9FC] p-4 rounded-2xl space-y-1">
                <p className="text-xs text-gray-400 font-semibold">Target Bedtime</p>
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-gray-400 shrink-0" />
                  <p className="text-lg font-black text-[#1A1C1E]">{formatTime(bedtime)}</p>
                </div>
              </div>
              <div className="bg-[#F7F9FC] p-4 rounded-2xl space-y-1">
                <p className="text-xs text-gray-400 font-semibold">Wake Up Time</p>
                <div className="flex items-center gap-1">
                  <Sunrise size={14} className="text-gray-400 shrink-0" />
                  <p className="text-lg font-black text-[#1A1C1E]">{formatTime(wakeUpTime)}</p>
                </div>
              </div>
              <div className="bg-[#F7F9FC] p-4 rounded-2xl space-y-1">
                <p className="text-xs text-gray-400 font-semibold">Country</p>
                <div className="flex items-center gap-1">
                  <Globe size={14} className="text-gray-400 shrink-0" />
                  <p className="text-lg font-black text-[#1A1C1E] truncate max-w-full">{country}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-2 space-y-0.5">
            <Link to="/settings/look-and-feel" className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 active:scale-[0.99] transition-all text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <Palette size={20} className="text-purple-500" />
                </div>
                <span className="font-bold text-sm text-[#1A1C1E]">Look & Feel</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </Link>

            {[
              { icon: Bell, label: 'Notifications', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: Shield, label: 'Privacy & Security', color: 'text-green-500', bg: 'bg-green-50' },
              { icon: Flame, label: 'Goals Configuration', color: 'text-orange-500', bg: 'bg-orange-50' },
              { icon: LogOut, label: 'Sign Out', color: 'text-red-500', bg: 'bg-red-50' },
            ].map((item, idx) => (
              <button 
                key={item.label}
                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 active:scale-[0.99] transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <item.icon size={20} className={item.color} />
                  </div>
                  <span className="font-bold text-sm text-[#1A1C1E]">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            ))}
          </CardContent>
        </Card>

      </div>
    </MobileLayout>
  );
};

export default Profile;