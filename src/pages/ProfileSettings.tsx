"use client";

import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, User, Mail, Calendar, Globe, Clock, Heart, Users, Sunrise } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.j@example.com');
  const [dob, setDob] = useState('1995-06-15');
  const [country, setCountry] = useState('United States');
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeUpTime, setWakeUpTime] = useState('06:30');
  const [sex, setSex] = useState('Male');
  const [bloodType, setBloodType] = useState('O+');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop');

  useEffect(() => {
    const savedName = localStorage.getItem('profile_name');
    const savedEmail = localStorage.getItem('profile_email');
    const savedDob = localStorage.getItem('profile_dob');
    const savedCountry = localStorage.getItem('profile_country');
    const savedBedtime = localStorage.getItem('profile_bedtime');
    const savedWakeUpTime = localStorage.getItem('profile_wakeup_time');
    const savedSex = localStorage.getItem('profile_sex');
    const savedBloodType = localStorage.getItem('profile_blood_type');

    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedDob) setDob(savedDob);
    if (savedCountry) setCountry(savedCountry);
    if (savedBedtime) setBedtime(savedBedtime);
    if (savedWakeUpTime) setWakeUpTime(savedWakeUpTime);
    if (savedSex) setSex(savedSex);
    if (savedBloodType) setBloodType(savedBloodType);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('profile_name', name);
    localStorage.setItem('profile_email', email);
    localStorage.setItem('profile_dob', dob);
    localStorage.setItem('profile_country', country);
    localStorage.setItem('profile_bedtime', bedtime);
    localStorage.setItem('profile_wakeup_time', wakeUpTime);
    localStorage.setItem('profile_sex', sex);
    localStorage.setItem('profile_blood_type', bloodType);

    showSuccess('Profile updated successfully!');
    navigate('/profile');
  };

  return (
    <MobileLayout title="Edit Profile" backPath="/profile" headerGradientClass="from-[#C1C8FF] via-[#DCE1FF]/40">
      <div className="space-y-6 pt-4 pb-8">
        {/* Avatar edit section */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative group cursor-pointer">
            <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-[#C1C8FF] text-[#1A1C1E] text-2xl font-black">AJ</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
          </div>
          <span className="text-xs text-gray-400 font-semibold">Tap to change avatar</span>
        </div>

        {/* Form container */}
        <Card className="border-none shadow-none bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="profile-name" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} className="text-[#6750A4]" />
                  Full Name
                </Label>
                <Input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl border-gray-150 h-12 focus-visible:ring-[#6750A4] font-semibold text-sm"
                  placeholder="e.g. Alex Johnson"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-email" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={14} className="text-[#6750A4]" />
                  Email Address
                </Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border-gray-150 h-12 focus-visible:ring-[#6750A4] font-semibold text-sm"
                  placeholder="e.g. alex.j@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-dob" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#6750A4]" />
                  Date of Birth
                </Label>
                <Input
                  id="profile-dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="rounded-2xl border-gray-150 h-12 focus-visible:ring-[#6750A4] font-semibold text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-country" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={14} className="text-[#6750A4]" />
                  Country
                </Label>
                <Input
                  id="profile-country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="rounded-2xl border-gray-150 h-12 focus-visible:ring-[#6750A4] font-semibold text-sm"
                  placeholder="e.g. United States"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="profile-bedtime" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={14} className="text-[#6750A4]" />
                    Target Bedtime
                  </Label>
                  <Input
                    id="profile-bedtime"
                    type="time"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className="rounded-2xl border-gray-150 h-12 focus-visible:ring-[#6750A4] font-semibold text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-wakeup" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sunrise size={14} className="text-[#6750A4]" />
                    Wake Up Time
                  </Label>
                  <Input
                    id="profile-wakeup"
                    type="time"
                    value={wakeUpTime}
                    onChange={(e) => setWakeUpTime(e.target.value)}
                    className="rounded-2xl border-gray-150 h-12 focus-visible:ring-[#6750A4] font-semibold text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="profile-sex" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={14} className="text-[#6750A4]" />
                    Sex
                  </Label>
                  <select
                    id="profile-sex"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-3 h-12 text-sm font-semibold text-gray-800 outline-none focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4] transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-bloodtype" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Heart size={14} className="text-[#6750A4]" />
                    Blood Type
                  </Label>
                  <select
                    id="profile-bloodtype"
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-3 h-12 text-sm font-semibold text-gray-800 outline-none focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4] transition-all"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-2xl h-12 font-bold transition-all shadow-md mt-4 flex items-center justify-center gap-2">
                <Save size={18} />
                Save Profile Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default ProfileSettings;