"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useHealthData } from '@/context/HealthDataContext';
import { useUnits } from '@/context/UnitContext';
import { CustomTimePicker, CustomDatePicker } from '@/components/ui/CustomDateTimePicker';
import { showSuccess } from '@/utils/toast';
import PeriodSelector, { PeriodType } from '@/components/ui/PeriodSelector';

const vitalTypes = [
  { key: 'hr', title: 'Heart Rate', unit: 'bpm', color: '#EF4444', gradient: 'rgba(239, 68, 68, 0.1)', description: 'Beats per minute measures how fast your heart beats. Normal is between 60-100 bpm.' },
  { key: 'rhr', title: 'Resting Heart Rate', unit: 'bpm', color: '#F97316', gradient: 'rgba(249, 115, 22, 0.1)', description: 'Your heart rate when calm and rested. An indicator of cardiovascular fitness.' },
  { key: 'spo2', title: 'Blood Oxygen (SpO2)', unit: '%', color: '#06B6D4', gradient: 'rgba(6, 182, 212, 0.1)', description: 'The percentage of oxygen-saturated hemoglobin relative to total hemoglobin in the blood.' },
  { key: 'bp', title: 'Blood Pressure', unit: 'mmHg', color: '#3B82F6', gradient: 'rgba(59, 130, 246, 0.1)', description: 'Pressure of circulating blood against blood vessel walls. Normal systolic pressure is < 120.' },
  { key: 'sugar', title: 'Blood Sugar', unit: 'mg/dL', color: '#10B981', gradient: 'rgba(16, 185, 129, 0.1)', description: 'The concentration of glucose in your blood. Checked fasting or after meals.' },
  { key: 'temp', title: 'Body Temperature', unit: '°C', color: '#8B5CF6', gradient: 'rgba(139, 92, 246, 0.1)', description: 'The normal core body temperature is around 37°C. Tracks fever or hypothermia.' },
];

const VitalDetailPage = () => {
  const { vitalKey } = useParams<{ vitalKey: string }>();
  const { vitalsData, addVitalLog } = useHealthData();
  const { formatDate } = useUnits();

  const vitalObj = vitalTypes.find(v => v.key === vitalKey);

  // Default Resting HR, Blood Pressure, and Blood Sugar to 'week'
  const [period, setPeriod] = useState<PeriodType>('week');
  const [newValue, setNewValue] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logTime, setLogTime] = useState('');

  useEffect(() => {
    const now = new Date();
    setLogTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  }, [vitalKey]);

  if (!vitalObj) {
    return (
      <MobileLayout title="Not Found">
        <div className="space-y-4 text-center py-12">
          <p className="text-gray-500">Metric not found</p>
          <Link to="/overview/vitals" className="text-[#6750A4] font-bold">Back to Vitals</Link>
        </div>
      </MobileLayout>
    );
  }

  const dataSet = vitalsData[vitalObj.key] || [];
  const hasData = dataSet.length > 0;
  const currentDisplay = hasData ? dataSet[dataSet.length - 1].value : null;

  const saveVitalLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue) return;

    const valNum = parseFloat(newValue);
    const activeTime = vitalObj.key === 'rhr' ? undefined : logTime;

    addVitalLog(vitalObj.key, valNum, logDate, activeTime);

    setNewValue('');
    showSuccess(`${vitalObj.title} logged successfully!`);
  };

  const formattedHistory = dataSet.map(item => {
    let label = '';
    if (vitalObj.key === 'hr') {
      label = item.time || (item.date ? formatDate(item.date) : '');
    } else {
      label = item.date ? formatDate(item.date) : (item.time || '');
    }
    return {
      ...item,
      displayDate: label
    };
  });

  // Filter trend records based on selected period
  const now = new Date();
  const filteredHistory = formattedHistory.filter(item => {
    const itemDate = new Date(item.date);
    if (isNaN(itemDate.getTime())) return true;
    
    const diffTime = now.getTime() - itemDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (period === '24h') {
      return diffDays <= 1;
    } else if (period === 'week') {
      return diffDays <= 7;
    } else if (period === 'month') {
      return diffDays <= 30;
    } else if (period === 'year') {
      return diffDays <= 365;
    }
    return true;
  });

  return (
    <MobileLayout title={vitalObj.title} backPath="/overview/vitals">
      <div className="space-y-6 pt-2">
        {/* Big visual summary card */}
        <Card className="border-none shadow-none bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Reading</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black" style={{ color: vitalObj.color }}>
                  {currentDisplay !== null ? currentDisplay : '--'}
                </span>
                {currentDisplay !== null && <span className="text-sm text-gray-400 font-bold">{vitalObj.unit}</span>}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${vitalObj.color}20`, color: vitalObj.color }}>
              <Activity size={24} />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Description */}
        <p className="text-xs text-gray-500 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed">
          {vitalObj.description}
        </p>

        {/* Chart */}
        <Card className="border-none shadow-none bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-bold text-base text-[#1A1C1E]">Trends</h3>
              <PeriodSelector 
                value={period} 
                onChange={setPeriod} 
                activeColorClass="text-[#1A1C1E] font-extrabold"
              />
            </div>
            {filteredHistory.length > 0 ? (
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredHistory}>
                    <XAxis dataKey="displayDate" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} width={25} domain={['dataMin - 5', 'dataMax + 5']} />
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
            ) : (
              <div className="h-44 w-full flex items-center justify-center bg-gray-50 rounded-2xl">
                <span className="text-sm text-gray-400 font-medium">No recorded logs for this period.</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Log Form */}
        <Card className="border-none shadow-none bg-white rounded-3xl">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-[#1A1C1E] mb-4">Add Entry</h3>
            <form onSubmit={saveVitalLog} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vital-val" className="text-xs text-gray-500">Value ({vitalObj.unit})</Label>
                <Input
                  id="vital-val"
                  type="number"
                  step="0.1"
                  placeholder={`e.g. 75`}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="rounded-2xl border-gray-200 h-11"
                />
              </div>
              
              <CustomDatePicker 
                label="Date"
                value={logDate}
                onChange={setLogDate}
              />
              
              {/* Hide Time Selector for Resting HR (rhr) */}
              {vitalObj.key !== 'rhr' && (
                <CustomTimePicker 
                  label="Time"
                  value={logTime}
                  onChange={setLogTime}
                />
              )}
              
              {vitalObj.key === 'rhr' && (
                <div className="text-xs text-gray-400">
                  * Resting HR represents overall baseline (no time log needed).
                </div>
              )}

              <Button 
                type="submit"
                className="w-full text-white rounded-2xl h-11 font-medium transition-colors"
                style={{ backgroundColor: vitalObj.color }}
              >
                Save Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History Log List */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">History</h4>
          {dataSet.length === 0 ? (
            <div className="bg-white p-6 rounded-3xl text-center">
              <p className="text-sm text-gray-400 font-medium">No logged data yet.</p>
            </div>
          ) : (
            [...dataSet].reverse().map((log, idx) => (
              <div key={idx} className="bg-white p-4 rounded-3xl flex justify-between items-center animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${vitalObj.color}15`, color: vitalObj.color }}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[#1A1C1E]">{log.value} {vitalObj.unit}</p>
                    <p className="text-xs text-gray-400">
                      {formatDate(log.date)} {log.time ? `at ${log.time}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default VitalDetailPage;