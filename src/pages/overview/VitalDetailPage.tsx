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
import { showSuccess, showError } from '@/utils/toast';
import { z } from 'zod';

const vitalTypes = [
  { key: 'hr', title: 'Heart Rate', unit: 'bpm', color: '#EF4444', gradient: 'rgba(239, 68, 68, 0.1)', description: 'Beats per minute measures how fast your heart beats. Normal is between 60-100 bpm.' },
  { key: 'rhr', title: 'Resting Heart Rate', unit: 'bpm', color: '#F97316', gradient: 'rgba(249, 115, 22, 0.1)', description: 'Your heart rate when calm and rested. An indicator of cardiovascular fitness.' },
  { key: 'spo2', title: 'Blood Oxygen (SpO2)', unit: '%', color: '#06B6D4', gradient: 'rgba(6, 182, 212, 0.1)', description: 'The percentage of oxygen-saturated hemoglobin relative to total hemoglobin in the blood.' },
  { key: 'bp', title: 'Blood Pressure', unit: 'mmHg', color: '#3B82F6', gradient: 'rgba(59, 130, 246, 0.1)', description: 'Pressure of circulating blood against blood vessel walls. Measured as Systolic over Diastolic.' },
  { key: 'sugar', title: 'Blood Sugar', unit: 'mg/dL', color: '#10B981', gradient: 'rgba(16, 185, 129, 0.1)', description: 'The concentration of glucose in your blood. Checked fasting or after meals.' },
  { key: 'temp', title: 'Body Temperature', unit: '°C', color: '#8B5CF6', gradient: 'rgba(139, 92, 246, 0.1)', description: 'The normal core body temperature is around 37°C.' },
];

const VitalDetailPage = () => {
  const { vitalKey } = useParams<{ vitalKey: string }>();
  const { vitalsData, addVitalLog } = useHealthData();
  const { settings, formatDate, convertTemperature, convertTemperatureInverse } = useUnits();

  const vitalObj = vitalTypes.find(v => v.key === vitalKey);

  const [newValue, setNewValue] = useState('');
  const [systolicVal, setSystolicVal] = useState('');
  const [diastolicVal, setDiastolicVal] = useState('');
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

  // Active validation ranges (including temp fahrenheit handling)
  const isTempF = vitalKey === 'temp' && settings.temperature === 'f';
  const displayUnit = vitalKey === 'temp' ? (isTempF ? '°F' : '°C') : vitalObj.unit;

  const getValidationSchema = () => {
    if (vitalKey === 'bp') {
      return z.object({
        systolic: z.string().refine(val => {
          const num = parseInt(val, 10);
          return !isNaN(num) && num >= 40 && num <= 250;
        }, { message: 'Systolic must be between 40 and 250 mmHg' }),
        diastolic: z.string().refine(val => {
          const num = parseInt(val, 10);
          return !isNaN(num) && num >= 30 && num <= 150;
        }, { message: 'Diastolic must be between 30 and 150 mmHg' }),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
      });
    }

    return z.object({
      value: z.string().refine((val) => {
        if (val === '') return false;
        const num = parseFloat(val);
        if (isNaN(num)) return false;
        if (vitalKey === 'hr') return num >= 30 && num <= 250;
        if (vitalKey === 'rhr') return num >= 30 && num <= 120;
        if (vitalKey === 'spo2') return num >= 70 && num <= 100;
        if (vitalKey === 'sugar') return num >= 0 && num <= 500;
        if (vitalKey === 'temp') {
          // If entering in Fahrenheit
          if (isTempF) return num >= 86 && num <= 113; // equivalents for 30 to 45 C
          return num >= 30 && num <= 45;
        }
        return true;
      }, { message: `Invalid value for ${vitalObj.title}` }),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Invalid date format' }),
      time: vitalKey === 'rhr' 
        ? z.string().optional() 
        : z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Invalid time format' })
    });
  };

  const saveVitalLog = (e: React.FormEvent) => {
    e.preventDefault();
    const schema = getValidationSchema();

    if (vitalKey === 'bp') {
      const result = schema.safeParse({
        systolic: systolicVal,
        diastolic: diastolicVal,
        date: logDate,
        time: logTime
      });

      if (!result.success) {
        showError(result.error.errors[0].message);
        return;
      }

      const sys = parseInt(systolicVal, 10);
      const dia = parseInt(diastolicVal, 10);
      // store average pressure as main value, but attach exact systolic & diastolic
      const avgPressure = Math.round((sys + dia) / 2);

      addVitalLog(vitalKey, avgPressure, logDate, logTime, sys, dia);
      setSystolicVal('');
      setDiastolicVal('');
      showSuccess('Blood Pressure recorded successfully!');
    } else {
      const result = schema.safeParse({
        value: newValue,
        date: logDate,
        time: vitalKey === 'rhr' ? undefined : logTime
      });

      if (!result.success) {
        showError(result.error.errors[0].message);
        return;
      }

      let parsedVal = parseFloat(newValue);
      // Canonical Celsius storage conversions
      if (vitalKey === 'temp') {
        parsedVal = convertTemperatureInverse(parsedVal);
      }

      addVitalLog(vitalKey, parsedVal, logDate, vitalKey === 'rhr' ? undefined : logTime);
      setNewValue('');
      showSuccess(`${vitalObj.title} logged successfully!`);
    }
  };

  const dataSet = vitalsData[vitalObj.key] || [];
  const hasData = dataSet.length > 0;
  
  // Grab the absolute latest vital entry
  const latestEntry = hasData ? dataSet[dataSet.length - 1] : null;

  // Format display representations appropriately
  const getDisplayVal = (entry: typeof latestEntry) => {
    if (!entry) return '--';
    if (vitalObj.key === 'bp') {
      return entry.systolic && entry.diastolic 
        ? `${entry.systolic}/${entry.diastolic}` 
        : `${entry.value}`;
    }
    if (vitalObj.key === 'temp') {
      return convertTemperature(entry.value).value.toString();
    }
    return entry.value.toString();
  };

  const formattedHistory = dataSet.map(item => {
    let label = '';
    if (vitalObj.key === 'hr') {
      label = item.time || (item.date ? formatDate(item.date) : '');
    } else {
      label = item.date ? formatDate(item.date) : (item.time || '');
    }
    
    let chartValue = item.value;
    if (vitalObj.key === 'temp') {
      chartValue = convertTemperature(item.value).value;
    } else if (vitalObj.key === 'bp' && item.systolic) {
      chartValue = item.systolic; // Chart the systolic value as representative trend
    }

    return {
      ...item,
      value: chartValue,
      displayDate: label
    };
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
                  {getDisplayVal(latestEntry)}
                </span>
                <span className="text-sm text-gray-400 font-bold ml-1">{displayUnit}</span>
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
            <h3 className="font-bold text-base text-[#1A1C1E]">
              {vitalObj.key === 'bp' ? 'Systolic Trends' : 'Trends'}
            </h3>
            {hasData ? (
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={formattedHistory}>
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
                <span className="text-sm text-gray-400 font-medium">No recorded graphs. Add below.</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Log Form */}
        <Card className="border-none shadow-none bg-white rounded-3xl">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-[#1A1C1E] mb-4">Add Entry</h3>
            <form onSubmit={saveVitalLog} className="space-y-4">
              
              {vitalObj.key === 'bp' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systolic-val" className="text-xs text-gray-500">Systolic (mmHg)</Label>
                    <Input
                      id="systolic-val"
                      type="number"
                      placeholder="e.g. 120"
                      value={systolicVal}
                      onChange={(e) => setSystolicVal(e.target.value)}
                      className="rounded-2xl border-gray-200 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diastolic-val" className="text-xs text-gray-500">Diastolic (mmHg)</Label>
                    <Input
                      id="diastolic-val"
                      type="number"
                      placeholder="e.g. 80"
                      value={diastolicVal}
                      onChange={(e) => setDiastolicVal(e.target.value)}
                      className="rounded-2xl border-gray-200 h-11"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="vital-val" className="text-xs text-gray-500">Value ({displayUnit})</Label>
                  <Input
                    id="vital-val"
                    type="number"
                    step="0.1"
                    placeholder={`e.g. ${vitalObj.key === 'temp' ? (isTempF ? '98.6' : '37.0') : '75'}`}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="rounded-2xl border-gray-200 h-11"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <CustomDatePicker 
                  label="Date"
                  value={logDate}
                  onChange={setLogDate}
                />
                {vitalObj.key !== 'rhr' && (
                  <CustomTimePicker 
                    label="Time"
                    value={logTime}
                    onChange={setLogTime}
                  />
                )}
              </div>
              
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
            [...dataSet].reverse().map((log, idx) => {
              const displayValStr = vitalObj.key === 'bp' && log.systolic && log.diastolic
                ? `${log.systolic}/${log.diastolic}`
                : (vitalObj.key === 'temp' ? `${convertTemperature(log.value).value}` : `${log.value}`);

              return (
                <div key={idx} className="bg-white p-4 rounded-3xl flex justify-between items-center animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${vitalObj.color}15`, color: vitalObj.color }}>
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1C1E]">{displayValStr} {displayUnit}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(log.date)} {log.time ? `at ${log.time}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default VitalDetailPage;