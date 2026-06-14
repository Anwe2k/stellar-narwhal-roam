"use client";

import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Save, User, Mail, Calendar, Globe, Clock, Heart, Activity } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.j@example.com');
  const [dob, setDob] = useState('1995-06-15');
  const [country, setCountry] = useState('United States');
  const [bedtime, setBedtime] = useState('22:00');
  const [sex, setSex] = useState('Male');
  const [bloodType, setBloodType] = useState('O+');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop');

  useEffect(() => {
    const savedName = localStorage.getItem('profile_name');
    const savedEmail = localStorage.getItem('profile_email');
    const savedDob = localStorage.getItem('profile_dob');
    const savedCountry = localStorage.getItem('profile_country');
    const savedBedtime = localStorage.getItem('profile_bedtime');
    const savedSex = localStorage.getItem('profile_sex');
    const savedBloodType = localStorage.getItem('profile_blood_type');

    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedDob) setDob(savedDob);
    if (savedCountry) setCountry(savedCountry);
    if (savedBedtime) setBedtime(savedBedtime);
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
    localStorage.setItem('profile_sex', sex);
    localStorage.setItem('profile_blood_type', bloodType);

    showSuccess('Profile settings updated successfully!');
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
            <form onSubmit={handleSave} className="space-y-5">
              
              {/* Basic Fields */}
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

              {/* Country Selection */}
              <div className="space-y-1.5">
                <Label htmlFor="profile-country" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={14} className="text-[#6750A4]" />
                  Country
                </Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="profile-country" className="rounded-2xl border-gray-150 h-12 text-sm font-semibold">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedtime */}
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

              {/* Sex / Gender */}
              <div className="space-y-1.5">
                <Label htmlFor="profile-sex" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} className="text-[#6750A4]" />
                  Biological Sex
                </Label>
                <Select value={sex} onValueChange={setSex}>
                  <SelectTrigger id="profile-sex" className="rounded-2xl border-gray-150 h-12 text-sm font-semibold">
                    <SelectValue placeholder="Select biological sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Blood Type */}
              <div className="space-y-1.5">
                <Label htmlFor="profile-blood-type" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart size={14} className="text-[#6750A4]" />
                  Blood Type
                </Label>
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger id="profile-blood-type" className="rounded-2xl border-gray-150 h-12 text-sm font-semibold">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
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