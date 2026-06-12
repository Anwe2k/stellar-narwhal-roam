"use client";

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity } from 'lucide-react';
import { useUnits } from '@/context/UnitContext';

const Overview = () => {
  const { settings, formatTime, convertWater } = useUnits();

  // Convert basic logs for visual correctness
  const logValue1 = convertWater(250); // e.g. 250ml or equivalent fl oz

  return (
    <MobileLayout title="Log Health Data">
      <div className="space-y-6">
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="metric" className="text-sm font-medium text-gray-600">Metric Type</Label>
              <Select>
                <SelectTrigger className="rounded-2xl border-gray-200 h-12">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="steps">Steps</SelectItem>
                  <SelectItem value="weight">Weight ({settings.weight === 'kg' ? 'kg' : settings.weight === 'lbs' ? 'lbs' : 'st'})</SelectItem>
                  <SelectItem value="water">Water Intake ({settings.water === 'ml' ? 'ml' : 'fl oz'})</SelectItem>
                  <SelectItem value="sleep">Sleep Duration (hrs)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value" className="text-sm font-medium text-gray-600">Value</Label>
              <Input 
                id="value" 
                type="number" 
                placeholder="Enter value" 
                className="rounded-2xl border-gray-200 h-12 focus-visible:ring-[#6750A4]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-gray-600">Date</Label>
              <Input 
                id="date" 
                type="date" 
                className="rounded-2xl border-gray-200 h-12 focus-visible:ring-[#6750A4]"
              />
            </div>

            <Button className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-2xl h-12 font-semibold mt-4">
              Save Entry
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold px-1">Recent Logs</h3>
          
          <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Activity size={20} />
              </div>
              <div>
                <p className="font-medium">Steps</p>
                <p className="text-xs text-gray-400">Today, {formatTime("10:30")}</p>
              </div>
            </div>
            <span className="font-bold text-[#6750A4]">1,200</span>
          </div>

          <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600">
                <Activity size={20} />
              </div>
              <div>
                <p className="font-medium">Water Intake</p>
                <p className="text-xs text-gray-400">Today, {formatTime("08:15")}</p>
              </div>
            </div>
            <span className="font-bold text-[#6750A4]">{logValue1.value} {logValue1.label}</span>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Overview;