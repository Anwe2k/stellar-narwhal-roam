"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, User, Mail } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.j@example.com');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving profile details
    localStorage.setItem('profile_name', name);
    localStorage.setItem('profile_email', email);
    showSuccess('Profile updated successfully!');
    navigate('/profile');
  };

  return (
    <MobileLayout title="Edit Profile" backPath="/profile" headerGradientClass="from-[#C1C8FF] via-[#DCE1FF]/40">
      <div className="space-y-6 pt-4">
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