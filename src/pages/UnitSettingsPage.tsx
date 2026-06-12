"use client";

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnits } from '@/context/UnitContext';
import { ChevronLeft, Globe, Clock, Ruler, Scale, CupSoda, Flame, Thermometer } from 'lucide-react';
import { Link } from 'react-router-dom';

const UnitSettingsPage = () => {
  const { settings, updateSetting } = useUnits();

  return (
    <MobileLayout title="Units & Formats">
      <div className="space-y-6">
        <div className="flex items-center gap-2 -mt-2">
          <Link to="/profile" className="p-2 -ml-2 rounded-full hover:bg-gray-150 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Profile</span>
        </div>

        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-6 space-y-6">
            
            {/* Time Zone */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Globe size={18} className="text-[#6750A4]" />
                <Label htmlFor="timeZone" className="text-sm font-semibold">Time Zone</Label>
              </div>
              <Select 
                value={settings.timeZone} 
                onValueChange={(val) => updateSetting('timeZone', val)}
              >
                <SelectTrigger className="rounded-2xl border-gray-200 h-12">
                  <SelectValue placeholder="Select Time Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GMT-8">Pacific Time (GMT-8)</SelectItem>
                  <SelectItem value="GMT-5">Eastern Time (GMT-5)</SelectItem>
                  <SelectItem value="GMT+0">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="GMT+1">Central European Time (GMT+1)</SelectItem>
                  <SelectItem value="GMT+8">Singapore Time (GMT+8)</SelectItem>
                  <SelectItem value="GMT+9">Japan Standard Time (GMT+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Format */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={18} className="text-[#6750A4]" />
                <Label htmlFor="timeFormat" className="text-sm font-semibold">Time Format</Label>
              </div>
              <Select 
                value={settings.timeFormat} 
                onValueChange={(val) => updateSetting('timeFormat', val as '12h' | '24h')}
              >
                <SelectTrigger className="rounded-2xl border-gray-200 h-12">
                  <SelectValue placeholder="Select Time Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                  <SelectItem value="24h">24-hour (13:30)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Length / Distance */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Ruler size={18} className="text-[#6750A4]" />
                <Label htmlFor="length" className="text-sm font-semibold">Length & Distance</Label>
              </div>
              <Select 
                value={settings.length} 
                onValueChange={(val) => updateSetting('length', val as 'metric' | 'imperial')}
              >
                <SelectTrigger className="rounded-2xl border-gray-200 h-12">
                  <SelectValue placeholder="Select Length Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (Centimeters, Kilometers)</SelectItem>
                  <SelectItem value="imperial">Imperial (Feet, Miles)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Scale size={18} className="text-[#6750A4]" />
                <Label htmlFor="weight" className="text-sm font-semibold">Weight</Label>
              </div>
              <Select 
                value={settings.weight} 
                onValueChange={(val) => updateSetting('weight', val as 'kg' | 'lbs' | 'st')}
              >
                <SelectTrigger className="rounded-2xl border-gray-200 h-12">
                  <SelectValue placeholder="Select Weight Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="st">Stone (st)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Water */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <CupSoda size={18} className="text-[#6750A4]" />
                <Label htmlFor="water" className="text-sm font-semibold">Water Intake</Label>
              </div>
              <Select 
                value={settings.water} 
                onValueChange={(val) => updateSetting('water', val as 'ml' | 'oz')}
              >
                <SelectTrigger className="rounded-2xl border-gray-200 h-12">
                  <SelectValue placeholder="Select Water Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">Milliliter (ml)</SelectItem>
                  <SelectItem value="oz">Fluid ounces (fl oz)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Energy */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Flame size={18} className="text-[#6750A4]" />
                <Label htmlFor="energy" className="text-sm font-semibold">Energy</Label>
              </div>
              <Select 
                value={settings.energy} 
                onValueChange={(val) => updateSetting('energy', val as 'kcal' | 'kj')}
              >
                <SelectTrigger className="rounded-2xl border-gray-200 h-12">
                  <SelectValue placeholder="Select Energy Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kcal">Calories (kcal)</SelectItem>
                  <SelectItem value="kj">Kilojoules (kJ)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Thermometer size={18} className="text-[#6750A4]" />
                <Label htmlFor="temperature" className="text-sm font-semibold">Temperature</Label>
              </div>
              <Select 
                value={settings.temperature} 
                onValueChange={(val) => updateSetting('temperature', val as 'c' | 'f')}
              >
                <SelectTrigger className="rounded-2xl border-gray-200 h-12">
                  <SelectValue placeholder="Select Temperature Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="c">Celsius (°C)</SelectItem>
                  <SelectItem value="f">Fahrenheit (°F)</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default UnitSettingsPage;