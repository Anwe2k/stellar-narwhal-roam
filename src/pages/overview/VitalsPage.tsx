"use client";

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ArrowUpRight } from 'lucide-react';
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

  return (
    <MobileLayout title="Vitals">
      <div className="space-y-6">
        <div className="flex items-center gap-2 -mt-2">
          <Link to="/overview" className="p-2 -ml-2 rounded-full hover:bg-gray-150 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Categories</span>
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