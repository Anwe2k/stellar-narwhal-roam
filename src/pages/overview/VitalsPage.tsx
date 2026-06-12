"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ArrowUpRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { showSuccess } from '@/utils/toast';

const VitalsPage = () => {
  // Setup detailed expanded logs view
  const [selectedVital, setSelectedVital] = useState<string | null>(null);
  
  // Static state data logs for vitals
  const [vitalsData, setVitalsData] = useState({
    hr: [
      { time: '08:00', value: 72 }, { time: '10:00', value: 75 },
      { time: '12:00', value: 85 }, { time: '14:00', value: 68 },
      { time: '16:00', value: 74 }, { time: '18:00', value: 80 }
    ],
    rhr: [
      { time: '08:00', value: 58 }, { time: '10:00', value: 59 },
      { time: '12:00', value: 58 }, { time: '14:00', value: 57 },
      { time: '16:00', value: 58 }, { time: '18:00', value: 57 }
    ],
    spo2: [
      { time: '08:00', value: 98 }, { time: '10:00', value: 99 },
      { time: '12:00', value: 97 }, { time: '14:00', value: 98 },
      { time: '16:00', value: 99 }, { time: '18:00', value: 98 }
    ],
    bp: [
      { time: '08:00', value: 120 }, { time: '10:00', value: 118 },
      { time: '12:00', value: 122 }, { time: '14:00', value: 115 },
      { time: '16:00', value: 120 }, { time: '18:00', value: 121 }
    ],
    sugar: [
      { time: '08:00', value: 95 }, { time: '10:00', value: 110 },
      { time: '12:00', value: 102 }, { time: '14:00', value: 98 },
      { time: '16:00', value: 94 }, { time: '18:00', value: 105 }
    ],
    temp: [
      { time: '08:00', value: 36.6 }, { time: '10:00', value: 36.7 },
      { time: '12:00', value: 36.8 }, { time: '14:00', value: 36.5 },
      { time: '16:00', value: 36.6 }, { time: '18:00', value: 36.7 }
    ]
  });

  const [newValue, setNewValue] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  const saveVitalLog = () => {
    if (!newValue || !selectedVital) return;

    const valNum = parseFloat(newValue);
    const newEntry = { time: 'Now', value: valNum };

    setVitalsData(prev => ({
      ...prev,
      [selectedVital]: [...prev[selectedVital as keyof typeof vitalsData], newEntry]
    }));

    setNewValue('');
    setSelectedVital(null);
    showSuccess('Vital measurement logged successfully!');
  };

  const vitalTypes = [
    { key: 'hr', title: 'Heart Rate', current: '72', unit: 'bpm', color: '#EF4444', gradient: 'rgba(239, 68, 68, 0.1)' },
    { key: 'rhr', title: 'Resting Heart Rate', current: '58', unit: 'bpm', color: '#F97316', gradient: 'rgba(249, 115, 22, 0.1)' },
    { key: 'spo2', title: 'Blood Oxygen (SpO2)', current: '98', unit: '%', color: '#06B6D4', gradient: 'rgba(6, 182, 212, 0.1)' },
    { key: 'bp', title: 'Blood Pressure', current: '120/80', unit: 'mmHg', color: '#3B82F6', gradient: 'rgba(59, 130, 246, 0.1)' },
    { key: 'sugar', title: 'Blood Sugar', current: '105', unit: 'mg/dL', color: '#10B981', gradient: 'rgba(16, 185, 129, 0.1)' },
    { key: 'temp', title: 'Body Temperature', current: '36.7', unit: '°C', color: '#8B5CF6', gradient: 'rgba(139, 92, 246, 0.1)' },
  ];

  return (
    <MobileLayout title="Vitals">
      <div className="space-y-6">
        <div className="flex items-center gap-2 -mt-2">
          <Link to="/overview" className="p-2 -ml-2 rounded-full hover:bg-gray-150 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Categories</span>
        </div>

        {/* Dynamic Vitals Grid with interactive quick popups */}
        <div className="grid grid-cols-1 gap-4">
          {vitalTypes.map((vital) => {
            const dataSet = vitalsData[vital.key as keyof typeof vitalsData];
            return (
              <Card key={vital.key} className="border-none shadow-sm bg-white rounded-3xl overflow-hidden relative group">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{vital.title}</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-gray-800">{vital.current}</span>
                        <span className="text-xs text-gray-400">{vital.unit}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedVital(vital.key)}
                      className="p-2 rounded-full bg-gray-50 text-[#6750A4] hover:bg-[#EADDFF] transition-colors"
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>

                  {/* Micro-Graph last 12 hours */}
                  <div className="h-16 w-full mt-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dataSet}>
                        <defs>
                          <linearGradient id={`color-${vital.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={vital.color} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={vital.color} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip content={() => null} />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={vital.color} 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill={`url(#color-${vital.key})`} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <span className="text-[10px] text-gray-400 block text-right mt-1">Last 12 hours</span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Large Chart Modal & Log screen */}
        {selectedVital && (() => {
          const vitalObj = vitalTypes.find(v => v.key === selectedVital);
          if (!vitalObj) return null;
          return (
            <Dialog open={true} onOpenChange={() => setSelectedVital(null)}>
              <DialogContent className="rounded-3xl w-[92%] max-w-md mx-auto p-6 bg-white border-none">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Activity size={20} style={{ color: vitalObj.color }} />
                    {vitalObj.title} Analyzer
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-6">
                  {/* Big interactive historical area chart */}
                  <div className="h-44 w-full bg-gray-50/50 p-2 rounded-2xl">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={vitalsData[selectedVital as keyof typeof vitalsData]}>
                        <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} width={25} />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={vitalObj.color} 
                          strokeWidth={2.5}
                          fill={vitalObj.gradient} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Daily Measurement Logging Form */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-700">Add New Entry</h4>
                    <div className="space-y-2">
                      <Label htmlFor="vital-val" className="text-xs text-gray-500">Value ({vitalObj.unit})</Label>
                      <Input
                        id="vital-val"
                        type="number"
                        placeholder={`e.g. ${vitalObj.current}`}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="rounded-2xl border-gray-250 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vital-date" className="text-xs text-gray-500">Date</Label>
                      <Input
                        id="vital-date"
                        type="date"
                        value={logDate}
                        onChange={(e) => setLogDate(e.target.value)}
                        className="rounded-2xl border-gray-250 h-11"
                      />
                    </div>
                    <Button 
                      onClick={saveVitalLog}
                      className="w-full text-white rounded-2xl h-11 font-medium transition-colors"
                      style={{ backgroundColor: vitalObj.color }}
                    >
                      Save to Cloud
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          );
        })()}
      </div>
    </MobileLayout>
  );
};

export default VitalsPage;