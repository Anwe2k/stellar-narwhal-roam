"use client";

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ArrowUpRight, Activity, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useHealthData } from '@/context/HealthDataContext';

const VitalsPage = () => {
  const { vitalsData } = useHealthData();

  const vitalTypes = [
    { key: 'hr', title: 'Heart Rate', current: 'Heart Rate', unit: 'bpm', color: '#EF4444', gradient: 'rgba(239, 68, 68, 0.1)', periodText: 'Last 12 hours' },
    { key: 'rhr', title: 'Resting Heart Rate', current: 'Resting HR', unit: 'bpm', color: '#F97316', gradient: 'rgba(249, 115, 22, 0.1)', periodText: 'Last week' },
    { key: 'spo2', title: 'Blood Oxygen (SpO2)', current: 'SpO2', unit: '%', color: '#06B6D4', gradient: 'rgba(6, 182, 212, 0.1)', periodText: 'Last week' },
    { key: 'bp', title: 'Blood Pressure', current: 'BP', unit: 'mmHg', color: '#3B82F6', gradient: 'rgba(59, 130, 246, 0.1)', periodText: 'Last week' },
    { key: 'sugar', title: 'Blood Sugar', current: 'Blood Sugar', unit: 'mg/dL', color: '#10B981', gradient: 'rgba(16, 185, 129, 0.1)', periodText: 'Last week' },
    { key: 'temp', title: 'Body Temperature', current: 'Temperature', unit: '°C', color: '#8B5CF6', gradient: 'rgba(139, 92, 246, 0.1)', periodText: 'Last week' },
  ];

  // Dynamic values computation for the 3 key vitals on left
  const getLatestValue = (key: string) => {
    const list = vitalsData[key] || [];
    return list.length > 0 ? list[list.length - 1].value : null;
  };

  const hrVal = getLatestValue('hr');
  const rhrVal = getLatestValue('rhr');
  const spo2Val = getLatestValue('spo2');

  return (
    <MobileLayout title="Vitals">
      <div className="space-y-6">
        <div className="flex items-center gap-2 -mt-2">
          <Link to="/overview" className="p-2 -ml-2 rounded-full hover:bg-gray-150 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Categories</span>
        </div>

        {/* Premium Vitals layout mirroring the photo */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#881337] text-white rounded-3xl p-6 shadow-md">
          <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
            <Heart size={170} strokeWidth={1} className="text-white rotate-12 fill-white" />
          </div>

          <div className="relative z-10 flex justify-between items-center">
            <div className="space-y-5">
              <div>
                <p className="text-2xl font-black tracking-tight">
                  {hrVal !== null ? `${hrVal} ` : '-- '}
                  {hrVal !== null && <span className="text-xs font-normal opacity-85">bpm</span>}
                </p>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Heart Rate</p>
              </div>

              <div>
                <p className="text-2xl font-black tracking-tight">
                  {rhrVal !== null ? `${rhrVal} ` : '-- '}
                  {rhrVal !== null && <span className="text-xs font-normal opacity-85">bpm</span>}
                </p>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Resting Heart Rate</p>
              </div>

              <div>
                <p className="text-2xl font-black tracking-tight">
                  {spo2Val !== null ? `${spo2Val} ` : '-- '}
                  {spo2Val !== null && <span className="text-xs font-normal opacity-85">%</span>}
                </p>
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Blood Oxygen (SpO2)</p>
              </div>
            </div>

            <div className="flex flex-col items-center mr-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Activity size={24} className="text-[#FFE4E6] animate-pulse" />
              </div>
              <span className="text-[10px] font-bold mt-2 text-[#FFE4E6] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">VITALS</span>
            </div>
          </div>
        </div>

        {/* Dynamic Vitals Grid with sub-page transitions */}
        <div className="grid grid-cols-1 gap-4">
          {vitalTypes.map((vital) => {
            const dataSet = vitalsData[vital.key] || [];
            const hasData = dataSet.length > 0;
            const currentDisplay = hasData ? dataSet[dataSet.length - 1].value : null;

            return (
              <Link key={vital.key} to={`/overview/vitals/${vital.key}`} className="block">
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-white rounded-3xl overflow-hidden relative group">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{vital.title}</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-black text-gray-800">
                            {currentDisplay !== null ? currentDisplay : 'No data'}
                          </span>
                          {currentDisplay !== null && <span className="text-xs text-gray-400">{vital.unit}</span>}
                        </div>
                      </div>

                      <div className="p-2 rounded-full bg-gray-50 text-[#6750A4] group-hover:bg-[#EADDFF] transition-colors shrink-0">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>

                    {/* Micro-Graph */}
                    {hasData ? (
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
                    ) : (
                      <div className="h-16 w-full mt-3 flex items-center justify-center bg-gray-50 rounded-2xl">
                        <span className="text-xs text-gray-400 font-medium">No readings registered</span>
                      </div>
                    )}
                    <span className="text-[10px] text-gray-400 block text-right mt-1">{vital.periodText}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
};

export default VitalsPage;