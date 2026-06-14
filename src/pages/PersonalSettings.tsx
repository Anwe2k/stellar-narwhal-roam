"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Calendar, Droplets } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

const PersonalSettings = () => {
  const navigate = useNavigate();
  
  // Loaded from simulated local storage or fallbacks
  const [name, setName] = useState(() => localStorage.getItem('user_name') || 'Alex Johnson');
  const [email, setEmail] = useState(() => localStorage.getItem('user_email') || 'alex.j@example.com');
  const [age, setAge] = useState(() => localStorage.getItem('user_age') || '28');
  const [bloodType, setBloodType] = useState(() => localStorage.getItem('user_blood_type') || 'O+');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_age', age);
    localStorage.setItem('user_blood_type', bloodType);
    
    showSuccess('Personal profile settings updated successfully!');
    setTimeout(() => {
      navigate('/profile');
    }, 600);
  };

  return (
    <MobileLayout title="Personal Info" headerGradientClass="from-[#C1C8FF]/40" backPath="/profile">
      <div className="space-y-6 pt-2">
        <Card className="border-none shadow-none bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-5">
              
              <div className="space-y-1.5">
                <Label htmlFor="name-input" className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                  <User size={14} className="text-[#6750A4]" /> Full Name
                </Label>
                <Input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl border-gray-200 h-11 focus-visible:ring-[#6750A4]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email-input" className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                  <Mail size={14} className="text-[#6750A4]" /> Email Address
                </Label>
                <Input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border-gray-200 h-11 focus-visible:ring-[#6750A4]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="age-input" className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#6750A4]" /> Age
                  </Label>
                  <Input
                    id="age-input"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="rounded-2xl border-gray-200 h-11 focus-visible:ring-[#6750A4]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="blood-type" className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                    <Droplets size={14} className="text-[#6750A4]" /> Blood Type
                  </Label>
                  <Select value={bloodType} onValueChange={setBloodType}>
                    <SelectTrigger id="blood-type" className="rounded-2xl border-gray-200 h-11 focus:ring-[#6750A4]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                        <SelectItem key={type} value={type} className="rounded-xl">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-2xl h-11 font-medium transition-colors mt-2 shadow-sm">
                Save Personal Info
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default PersonalSettings;