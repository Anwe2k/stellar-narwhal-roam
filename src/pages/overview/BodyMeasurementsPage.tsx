"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Scale, Ruler, ChevronRight, X, Heart, Sparkles } from 'lucide-react';
import { useUnits } from '@/context/UnitContext';
import { useHealthData } from '@/context/HealthDataContext';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { showSuccess, showError } from '@/utils/toast';
import { calculateRFM, calculateWHtR, getWHtRStatus } from '@/utils/bodyComposition';
import PeriodSelector, { PeriodType } from '@/components/ui/PeriodSelector';

const BodyMeasurementsPage = () => {
  const { settings, convertWeight, convertHeight } = useUnits();
  const { weightLogs, addWeightLog, fatLogs, addFatLog, tapeLogs, addTapeLog } = useHealthData();

  // Period states default to 'month'
  const [weightPeriod, setWeightPeriod] = useState<PeriodType>('month');
  const [fatPeriod, setFatPeriod] = useState<PeriodType>('month');
  const [bmiPeriod, setBmiPeriod] = useState<PeriodType>('month');

  const [weightInput, setWeightInput] = useState('');
  const [fatInput, setFatInput] = useState('');
  const [logDay, setLogDay] = useState(new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }));

  // Tape Measurement state
  const [tapeNeck, setTapeNeck] = useState('');
  const [tapeWaist, setTapeWaist] = useState('');
  const [tapeChest, setTapeChest] = useState('');
  const [tapeHips, setTapeHips] = useState('');
  const [tapeBiceps, setTapeBiceps] = useState('');
  const [tapeThighs, setTapeThighs] = useState('');
  const [tapeDate, setTapeDate] = useState(new Date().toISOString().split('T')[0]);

  // Height state initialized from localStorage with fallback
  const [heightRaw, setHeightRaw] = useState<number>(() => {
    const saved = localStorage.getItem('declared_height');
    return saved ? parseFloat(saved) : 180;
  });
  
  // Dialog management states
  const [isHeightDialogOpen, setIsHeightDialogOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [tempHeightInput, setTempHeightInput] = useState('');

  // Touch Swipe Gesture State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);

  // Unit settings values
  const isImperialTape = settings.length === 'imperial';
  const tapeUnitLabel = isImperialTape ? 'in' : 'cm';

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsHeightDialogOpen(false);
      setIsClosing(false);
    }, 230);
  };

  const logWeightEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightInput) return;

    const parsedWeight = parseFloat(weightInput);
    addWeightLog(parsedWeight, logDay);
    setWeightInput('');
    showSuccess('Weight measurement updated!');
  };

  const logFatEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fatInput) return;

    const parsedFat = parseFloat(fatInput);
    addFatLog(parsedFat, logDay);
    setFatInput('');
    showSuccess('Body Fat percentage updated!');
  };

  const saveHeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempHeightInput) return;

    const parsedHeight = parseFloat(tempHeightInput);
    if (parsedHeight > 0) {
      setHeightRaw(parsedHeight);
      localStorage.setItem('declared_height', parsedHeight.toString());
      triggerClose();
      showSuccess('Declared height updated successfully!');
    }
  };

  const handleTapeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tapeWaist) {
      showError('Waist measurement is required for health indices.');
      return;
    }

    // Convert to canonical CM for DB/local storage if inputted in inches
    const toCmValue = (valStr: string) => {
      if (!valStr) return undefined;
      const val = parseFloat(valStr);
      return isImperialTape ? parseFloat((val * 2.54).toFixed(2)) : val;
    };

    addTapeLog(tapeDate, {
      neck: toCmValue(tapeNeck),
      waist: toCmValue(tapeWaist),
      chest: toCmValue(tapeChest),
      hips: toCmValue(tapeHips),
      biceps: toCmValue(tapeBiceps),
      thighs: toCmValue(tapeThighs),
    });

    setTapeNeck('');
    setTapeWaist('');
    setTapeChest('');
    setTapeHips('');
    setTapeBiceps('');
    setTapeThighs('');
    showSuccess('Tape measurements saved successfully!');
  };

  // Convert height and current weight
  const currentHeightConverted = convertHeight(heightRaw);
  const currentWeightRaw = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].val : null;
  const currentWeightConverted = currentWeightRaw !== null ? convertWeight(currentWeightRaw) : null;

  // Compute live BMI (BMI = Weight_kg / Height_m ^ 2)
  const heightMeters = heightRaw / 100;
  const currentBMI = currentWeightRaw !== null 
    ? (currentWeightRaw / (heightMeters * heightMeters)).toFixed(1)
    : null;

  const currentFatRaw = fatLogs.length > 0 ? fatLogs[fatLogs.length - 1].val : null;

  // Active Tape Metrics calculation from current latest tape log
  const latestTapeLog = tapeLogs.length > 0 ? tapeLogs[tapeLogs.length - 1] : null;
  const activeWaistCm = latestTapeLog?.waist;
  
  // Calculate RFM and WHtR
  const userSex = localStorage.getItem('profile_sex') || 'Male';
  const activeRFM = activeWaistCm ? calculateRFM(heightRaw, activeWaistCm, userSex) : null;
  const activeWHtR = activeWaistCm ? calculateWHtR(heightRaw, activeWaistCm) : null;
  const whtrStatus = activeWHtR ? getWHtRStatus(activeWHtR) : null;

  // Render values helper converting CM to displayed preference
  const formatTapeDisplay = (cmValue?: number) => {
    if (cmValue === undefined) return '--';
    const displayed = isImperialTape ? (cmValue / 2.54) : cmValue;
    return `${parseFloat(displayed.toFixed(1))} ${tapeUnitLabel}`;
  };

  // Parsing helper to map log 'day' strings (e.g. "Oct 12") safely to Date objects
  const parseDayLabelToDate = (dayStr: string) => {
    const now = new Date();
    const parts = dayStr.split(' ');
    if (parts.length === 2) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIdx = monthNames.indexOf(parts[0]);
      if (monthIdx !== -1) {
        const dayVal = parseInt(parts[1]);
        if (!isNaN(dayVal)) {
          return new Date(now.getFullYear(), monthIdx, dayVal);
        }
      }
    }
    const parsed = Date.parse(dayStr);
    if (!isNaN(parsed)) return new Date(parsed);
    return now;
  };

  const getFilteredLogsByPeriod = <T extends { day: string }>(logsList: T[], targetPeriod: PeriodType): T[] => {
    const now = new Date();
    return logsList.filter(log => {
      const logDate = parseDayLabelToDate(log.day);
      const diffTime = now.getTime() - logDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (targetPeriod === '24h') return diffDays <= 1;
      if (targetPeriod === 'week') return diffDays <= 7;
      if (targetPeriod === 'month') return diffDays <= 30;
      if (targetPeriod === 'year') return diffDays <= 365;
      return true;
    });
  };

  // Translate weight logs array to match settings unit preference
  const transformedWeightData = weightLogs.map((log) => ({
    day: log.day,
    val: Math.round(convertWeight(log.val).value),
  }));

  // Build BMI logs
  const bmiLogs = weightLogs.map((log) => ({
    day: log.day,
    val: parseFloat((log.val / (heightMeters * heightMeters)).toFixed(1)),
  }));

  // Filter trends by user selected period
  const filteredWeightData = getFilteredLogsByPeriod(transformedWeightData, weightPeriod);
  const filteredFatData = getFilteredLogsByPeriod(fatLogs, fatPeriod);
  const filteredBmiData = getFilteredLogsByPeriod(bmiLogs, bmiPeriod);

  // Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentY = e.targetTouches[0].clientY;
    const diff = currentY - touchStart;
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (translateY > 110) {
      triggerClose();
    }
    setTranslateY(0);
    setTouchStart(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      triggerClose();
    }
  };

  return (
    <MobileLayout title="Biometrics" backPath="/overview">
      <div className="space-y-6 pt-1 pb-12">
        
        {/* Dynamic summary block */}
        <div className="flex items-center justify-between py-2 bg-[#F3EDF7] border border-[#CAC4D0]/30 rounded-[28px] p-5">
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
                {currentWeightConverted !== null ? `${currentWeightConverted.value} ${currentWeightConverted.label}` : '--'}
              </p>
              <p className="text-[10px] font-bold text-[#49454F] tracking-wider uppercase">Body Weight</p>
            </div>
            
            <div>
              <p className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
                {activeRFM !== null ? `${activeRFM} %` : (currentFatRaw !== null ? `${currentFatRaw} %` : '--')}
              </p>
              <p className="text-[10px] font-bold text-[#49454F] tracking-wider uppercase">
                {activeRFM !== null ? 'Relative Fat Mass (RFM)' : 'Body Fat Ratio'}
              </p>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
                {currentBMI !== null ? currentBMI : '--'}
              </p>
              <p className="text-[10px] font-bold text-[#49454F] tracking-wider uppercase">Body Mass Index (BMI)</p>
            </div>
          </div>

          <div className="w-28 h-36 rounded-[24px] bg-[#E2F1E8] border border-[#CBE5D5] flex items-center justify-center relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <Ruler size={64} className="text-[#00512C] relative z-10 opacity-90 animate-pulse duration-[5s]" />
          </div>
        </div>

        {/* Height Trigger */}
        <Card 
          className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[24px] cursor-pointer hover:bg-[#ECE6F0] transition-colors active:scale-[0.99]"
          onClick={() => {
            setTempHeightInput(heightRaw.toString());
            setIsHeightDialogOpen(true);
          }}
        >
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E2F1E8] border border-[#CBE5D5] text-[#00512C] rounded-xl flex items-center justify-center shrink-0">
                <Ruler size={18} />
              </div>
              <div>
                <span className="text-[10px] text-[#49454F] font-bold block uppercase tracking-wider">Declared Height</span>
                <p className="text-sm font-extrabold text-[#6750A4] mt-0.5">
                  {currentHeightConverted.value} <span className="text-xs font-normal text-gray-400">{currentHeightConverted.label}</span>
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400 shrink-0" />
          </CardContent>
        </Card>

        {/* Height update modal popup */}
        {isHeightDialogOpen && (
          <div 
            onClick={handleBackdropClick}
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 cursor-pointer duration-200 ${
              isClosing ? 'animate-out fade-out fill-mode-forwards' : 'animate-in fade-in'
            }`}
          >
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                transform: `translateY(${translateY}px)`,
                transition: touchStart === null ? 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
              }}
              className={`bg-[#FEF7FF] rounded-t-[28px] sm:rounded-[28px] border border-[#CAC4D0]/30 w-full sm:max-w-sm p-6 pb-12 sm:pb-6 space-y-4 cursor-default select-none ${
                isClosing 
                  ? 'animate-out fade-out slide-out-to-bottom-12 duration-200 fill-mode-forwards' 
                  : 'animate-in fade-in slide-in-from-bottom-12 duration-300'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto -mt-2 mb-2 sm:hidden" />
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-base text-gray-900">Update Height</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerClose();
                  }}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
              
              <form onSubmit={saveHeight} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="popup-height" className="text-xs font-bold text-[#49454F]">Height (cm)</Label>
                  <Input
                    id="popup-height"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 180"
                    value={tempHeightInput}
                    onChange={(e) => setTempHeightInput(e.target.value)}
                    className="rounded-xl border-gray-200 h-11"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-full h-11 font-bold">
                  Save Height
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Deep Tape Insights Card */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px] overflow-hidden">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E6E0E9] pb-3">
              <Sparkles size={18} className="text-[#6750A4]" />
              <h3 className="font-extrabold text-xs text-[#1D1B20] uppercase tracking-wider">Body Shape Insights</h3>
            </div>
            
            {activeWaistCm ? (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#FEF7FF] border border-[#CAC4D0]/20 p-3.5 rounded-2xl space-y-0.5">
                    <p className="text-[10px] text-[#49454F] font-bold">Relative Fat Mass</p>
                    <p className="text-lg font-black text-[#1D1B20]">{activeRFM}%</p>
                  </div>

                  <div className="bg-[#FEF7FF] border border-[#CAC4D0]/20 p-3.5 rounded-2xl space-y-0.5">
                    <p className="text-[10px] text-[#49454F] font-bold">Waist-to-Height</p>
                    <p className="text-lg font-black text-[#1D1B20]">{activeWHtR}</p>
                  </div>
                </div>

                {whtrStatus && (
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${whtrStatus.bg}`}>
                    <div>
                      <p className="text-[9px] font-bold text-[#49454F] uppercase tracking-wider">WHtR Profile Status</p>
                      <p className={`text-xs font-black ${whtrStatus.color} mt-0.5`}>{whtrStatus.label}</p>
                    </div>
                    <Heart size={18} className={whtrStatus.color} />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-white border border-[#CAC4D0]/10 rounded-2xl text-center space-y-1">
                <p className="text-xs text-[#49454F] font-bold">No recent waist tape logs.</p>
                <p className="text-[10px] text-[#49454F]">Log waist measurements below to calculate body health shape metrics.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Circumference sizes outline container */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px] overflow-hidden">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-[#1D1B20] uppercase tracking-wider">Circumference Sizes</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: 'Neck Size', val: latestTapeLog?.neck },
                { name: 'Waist Size', val: latestTapeLog?.waist },
                { name: 'Chest Size', val: latestTapeLog?.chest },
                { name: 'Hips Size', val: latestTapeLog?.hips },
                { name: 'Biceps Size', val: latestTapeLog?.biceps },
                { name: 'Thighs Size', val: latestTapeLog?.thighs },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center bg-white border border-[#CAC4D0]/15 p-3 rounded-2xl">
                  <span className="text-[10px] text-[#49454F] font-bold">{item.name}</span>
                  <span className="text-xs font-black text-gray-950">{formatTapeDisplay(item.val)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weight Trend with period selection */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px]">
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-extrabold text-sm text-[#1D1B20] uppercase tracking-wider">Weight Trend</h3>
              <PeriodSelector 
                value={weightPeriod} 
                onChange={setWeightPeriod} 
              />
            </div>
            {filteredWeightData.length > 0 ? (
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredWeightData}>
                    <XAxis dataKey="day" stroke="#49454F" fontSize={9} axisLine={false} tickLine={false} />
                    <YAxis stroke="#49454F" fontSize={9} axisLine={false} tickLine={false} width={20} domain={['dataMin - 3', 'dataMax + 3']} />
                    <Tooltip />
                    <Area type="monotone" dataKey="val" stroke="#6750A4" strokeWidth={2} fill="rgba(103, 80, 164, 0.05)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-6 text-center bg-white border border-[#CAC4D0]/10 rounded-2xl">
                <p className="text-xs text-[#49454F] font-bold">No weight logs for selected period.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Body Fat Trend with period selection */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px]">
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-extrabold text-sm text-[#1D1B20] uppercase tracking-wider">Body Fat Trend</h3>
              <PeriodSelector 
                value={fatPeriod} 
                onChange={setFatPeriod} 
              />
            </div>
            {filteredFatData.length > 0 ? (
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredFatData}>
                    <XAxis dataKey="day" stroke="#49454F" fontSize={9} axisLine={false} tickLine={false} />
                    <YAxis stroke="#49454F" fontSize={9} axisLine={false} tickLine={false} width={20} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip />
                    <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} fill="rgba(16, 185, 129, 0.05)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-6 text-center bg-white border border-[#CAC4D0]/10 rounded-2xl">
                <p className="text-xs text-[#49454F] font-bold">No fat logs for selected period.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* BMI Trend */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px]">
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-extrabold text-sm text-[#1D1B20] uppercase tracking-wider">BMI Trend</h3>
              <PeriodSelector 
                value={bmiPeriod} 
                onChange={setBmiPeriod} 
              />
            </div>
            {filteredBmiData.length > 0 ? (
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredBmiData}>
                    <XAxis dataKey="day" stroke="#49454F" fontSize={9} axisLine={false} tickLine={false} />
                    <YAxis stroke="#49454F" fontSize={9} axisLine={false} tickLine={false} width={20} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip />
                    <Area type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={2} fill="rgba(59, 130, 246, 0.05)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-6 text-center bg-white border border-[#CAC4D0]/10 rounded-2xl">
                <p className="text-xs text-[#49454F] font-bold">No BMI logs for selected period.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Circumference tape logger form */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px]">
          <CardContent className="p-5">
            <h3 className="text-sm font-extrabold text-[#1D1B20] uppercase tracking-wider mb-4">Log Tape Sizes ({tapeUnitLabel})</h3>
            <form onSubmit={handleTapeSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="tape-waist" className="text-xs font-bold text-[#49454F]">Waist Size</Label>
                  <Input
                    id="tape-waist"
                    type="number"
                    step="0.1"
                    placeholder={isImperialTape ? "e.g. 32" : "e.g. 80"}
                    value={tapeWaist}
                    onChange={(e) => setTapeWaist(e.target.value)}
                    className="rounded-xl h-11 focus-visible:ring-[#6750A4]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tape-neck" className="text-xs font-bold text-[#49454F]">Neck Size</Label>
                  <Input
                    id="tape-neck"
                    type="number"
                    step="0.1"
                    placeholder={isImperialTape ? "e.g. 15" : "e.g. 38"}
                    value={tapeNeck}
                    onChange={(e) => setTapeNeck(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tape-chest" className="text-xs font-bold text-[#49454F]">Chest Size</Label>
                  <Input
                    id="tape-chest"
                    type="number"
                    step="0.1"
                    placeholder={isImperialTape ? "e.g. 40" : "e.g. 100"}
                    value={tapeChest}
                    onChange={(e) => setTapeChest(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tape-hips" className="text-xs font-bold text-[#49454F]">Hips Size</Label>
                  <Input
                    id="tape-hips"
                    type="number"
                    step="0.1"
                    placeholder={isImperialTape ? "e.g. 36" : "e.g. 92"}
                    value={tapeHips}
                    onChange={(e) => setTapeHips(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tape-biceps" className="text-xs font-bold text-[#49454F]">Biceps Size</Label>
                  <Input
                    id="tape-biceps"
                    type="number"
                    step="0.1"
                    placeholder={isImperialTape ? "e.g. 13" : "e.g. 33"}
                    value={tapeBiceps}
                    onChange={(e) => setTapeBiceps(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tape-thighs" className="text-xs font-bold text-[#49454F]">Thighs Size</Label>
                  <Input
                    id="tape-thighs"
                    type="number"
                    step="0.1"
                    placeholder={isImperialTape ? "e.g. 21" : "e.g. 54"}
                    value={tapeThighs}
                    onChange={(e) => setTapeThighs(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="tape-date" className="text-xs font-bold text-[#49454F]">Log Date</Label>
                <Input
                  id="tape-date"
                  type="date"
                  value={tapeDate}
                  onChange={(e) => setTapeDate(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>

              <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-full h-12 font-bold transition-transform active:scale-95 mt-2">
                Save Tape Measurements
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Logging inputs */}
        <Card className="border border-[#CAC4D0]/30 shadow-none bg-[#F7F2FA] rounded-[28px]">
          <CardContent className="p-5 space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-[#1D1B20] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Scale size={16} className="text-[#6750A4]" />
                Update Weight
              </h3>
              <form onSubmit={logWeightEntry} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="weight-input" className="text-xs font-bold text-[#49454F]">Weight ({settings.weight === 'kg' ? 'kg' : settings.weight === 'lbs' ? 'lbs' : 'st'})</Label>
                  <Input
                    id="weight-input"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 75.2"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    className="rounded-xl border-gray-200 h-11"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-full h-12 font-bold transition-transform active:scale-95">
                  Update Weight
                </Button>
              </form>
            </div>

            <div className="border-t border-[#CAC4D0]/20 pt-6">
              <h3 className="text-sm font-extrabold text-[#1D1B20] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Scale size={16} className="text-[#10B981]" />
                Update Body Fat
              </h3>
              <form onSubmit={logFatEntry} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="fat-input" className="text-xs font-bold text-[#49454F]">Body Fat (%)</Label>
                  <Input
                    id="fat-input"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 15.5"
                    value={fatInput}
                    onChange={(e) => setFatInput(e.target.value)}
                    className="rounded-xl border-gray-200 h-11"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white rounded-full h-12 font-bold transition-transform active:scale-95">
                  Update Fat Ratio
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default BodyMeasurementsPage;