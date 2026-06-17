"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHealthData } from '@/context/HealthDataContext';
import { useUnits } from '@/context/UnitContext';
import { 
  Sparkles, 
  Droplet, 
  Moon, 
  Footprints, 
  Scale, 
  Heart, 
  Plus, 
  CheckCircle2, 
  HelpCircle,
  TrendingDown,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const InsightsSection = () => {
  const { 
    activityLogs, 
    sleepLogs, 
    waterLogs, 
    weightLogs, 
    vitalsData, 
    addWaterLog, 
    addActivityLog,
    addWeightLog
  } = useHealthData();
  
  const { convertWater, convertWeight, convertEnergy } = useUnits();

  // Custom targets (can be saved in localStorage, defaulting to healthy baseline goals)
  const stepGoal = 8000;
  const sleepGoal = 8; // hours
  const caloriesBurnedGoal = 400; // kcal
  
  // Dynamic personalized water target (35ml per kg of weight)
  const currentWeightRaw = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].val : 75; // fallback 75kg
  const waterGoalMl = Math.round(currentWeightRaw * 35);

  // Today's computed progress
  const todaySteps = activityLogs.reduce((acc, log) => acc + log.steps, 0);
  const todayWaterMl = waterLogs.reduce((acc, log) => acc + log.val, 0);
  const todayCaloriesBurned = activityLogs.reduce((acc, log) => acc + log.energy, 0);
  const todaySleepLog = sleepLogs[sleepLogs.length - 1];
  const todaySleep = todaySleepLog ? todaySleepLog.hrs : 0;

  // Formatting values
  const formattedWaterToday = convertWater(todayWaterMl);
  const formattedWaterGoal = convertWater(waterGoalMl);
  const formattedWeightToday = convertWeight(currentWeightRaw);

  // Quick Action Handlers
  const logQuickWater = (amountMl: number) => {
    addWaterLog(amountMl);
    const converted = convertWater(amountMl);
    showSuccess(`Quick Logged: +${converted.value} ${converted.label} of Water!`);
  };

  const logQuickSteps = (stepsCount: number) => {
    // Estimating roughly 40 kcal burned per 1000 steps, and 0.8 km distance per 1000 steps
    const energyBurned = Math.round(stepsCount * 0.04);
    const distanceKm = parseFloat((stepsCount * 0.0008).toFixed(2));
    addActivityLog(stepsCount, energyBurned, distanceKm);
    showSuccess(`Quick Logged: +${stepsCount.toLocaleString()} steps!`);
  };

  // Rule-Based Non-Diagnostic Insights Engine
  const insights: Array<{
    id: string;
    category: 'hydration' | 'sleep' | 'steps' | 'weight' | 'vitals' | 'missing';
    title: string;
    description: string;
    type: 'positive' | 'warning' | 'tip';
    icon: React.ComponentType<any>;
    colorClass: string;
    bgClass: string;
    action?: React.ReactNode;
  }> = [];

  // 1. Hydration Insights
  const waterPercent = Math.round((todayWaterMl / waterGoalMl) * 100);
  if (todayWaterMl === 0) {
    insights.push({
      id: 'water-none',
      category: 'hydration',
      title: 'Hydration Target Pending',
      description: `You haven't logged any hydration today. Aim for ${formattedWaterGoal.value} ${formattedWaterGoal.label} to stay fully hydrated.`,
      type: 'tip',
      icon: Droplet,
      colorClass: 'text-cyan-600',
      bgClass: 'bg-cyan-50 border-cyan-100',
      action: (
        <div className="flex gap-2 mt-3">
          <Button 
            onClick={() => logQuickWater(250)} 
            variant="outline" 
            size="sm" 
            className="rounded-xl text-xs font-bold border-cyan-200 hover:bg-cyan-50 text-cyan-700 bg-white"
          >
            +250ml
          </Button>
          <Button 
            onClick={() => logQuickWater(500)} 
            variant="outline" 
            size="sm" 
            className="rounded-xl text-xs font-bold border-cyan-200 hover:bg-cyan-50 text-cyan-700 bg-white"
          >
            +500ml
          </Button>
        </div>
      )
    });
  } else if (waterPercent < 100) {
    insights.push({
      id: 'water-progress',
      category: 'hydration',
      title: 'Excellent Water Progress',
      description: `You've reached ${waterPercent}% of your daily fluid goal. Drink another ${Math.max(0, formattedWaterGoal.value - formattedWaterToday.value)} ${formattedWaterToday.label} to finish strong.`,
      type: 'positive',
      icon: Droplet,
      colorClass: 'text-cyan-500',
      bgClass: 'bg-cyan-50/50 border-cyan-100/40',
      action: (
        <div className="flex gap-2 mt-3">
          <Button 
            onClick={() => logQuickWater(250)} 
            variant="outline" 
            size="sm" 
            className="rounded-xl text-xs font-bold border-cyan-200 hover:bg-cyan-50 text-cyan-700 bg-white"
          >
            +250ml
          </Button>
          <Button 
            onClick={() => logQuickWater(500)} 
            variant="outline" 
            size="sm" 
            className="rounded-xl text-xs font-bold border-cyan-200 hover:bg-cyan-50 text-cyan-700 bg-white"
          >
            +500ml
          </Button>
        </div>
      )
    });
  } else {
    insights.push({
      id: 'water-done',
      category: 'hydration',
      title: 'Hydration Target Reached!',
      description: `Incredible job! You've logged ${formattedWaterToday.value} ${formattedWaterToday.label}, meeting your recommended hydration sufficiency goals.`,
      type: 'positive',
      icon: CheckCircle2,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50 border-emerald-100',
    });
  }

  // 2. Sleep Insights (Compare with average sleep duration)
  if (sleepLogs.length >= 2) {
    const totalSleepSum = sleepLogs.reduce((acc, log) => acc + log.hrs, 0);
    const avgSleep = parseFloat((totalSleepSum / sleepLogs.length).toFixed(1));
    const latestSleep = sleepLogs[sleepLogs.length - 1].hrs;
    const diff = parseFloat((latestSleep - avgSleep).toFixed(1));

    if (diff < -1) {
      insights.push({
        id: 'sleep-deficit',
        category: 'sleep',
        title: 'Sleep is Lower Than Usual',
        description: `Last night's sleep of ${latestSleep} hrs is ${Math.abs(diff)} hrs less than your 7-day average of ${avgSleep} hrs. Focus on wind-down routines tonight.`,
        type: 'warning',
        icon: Moon,
        colorClass: 'text-amber-600',
        bgClass: 'bg-amber-50 border-amber-100',
      });
    } else if (diff > 1) {
      insights.push({
        id: 'sleep-surplus',
        category: 'sleep',
        title: 'Extended Sleep Recovery',
        description: `You got ${latestSleep} hrs of rest, which is ${diff} hrs more than your recent typical baseline (${avgSleep} hrs). Your body might be catching up on recovery.`,
        type: 'positive',
        icon: Sparkles,
        colorClass: 'text-indigo-600',
        bgClass: 'bg-indigo-50 border-indigo-100',
      });
    }
  }

  // 3. Step/Activity Insights
  if (todaySteps === 0) {
    insights.push({
      id: 'steps-none',
      category: 'steps',
      title: 'Daily Momentum Awaiting',
      description: `Ready to move? Complete a quick 15-minute power walk to activate cardiovascular and circulatory baseline functions.`,
      type: 'tip',
      icon: Footprints,
      colorClass: 'text-purple-600',
      bgClass: 'bg-purple-50 border-purple-100',
      action: (
        <div className="flex gap-2 mt-3">
          <Button 
            onClick={() => logQuickSteps(2000)} 
            variant="outline" 
            size="sm" 
            className="rounded-xl text-xs font-bold border-purple-200 hover:bg-purple-50 text-purple-700 bg-white"
          >
            +2,000 Steps
          </Button>
          <Button 
            onClick={() => logQuickSteps(5000)} 
            variant="outline" 
            size="sm" 
            className="rounded-xl text-xs font-bold border-purple-200 hover:bg-purple-50 text-purple-700 bg-white"
          >
            +5,000 Steps
          </Button>
        </div>
      )
    });
  } else if (todaySteps < stepGoal) {
    const stepsRemaining = stepGoal - todaySteps;
    insights.push({
      id: 'steps-progress',
      category: 'steps',
      title: 'Goal Within Reach',
      description: `You've clocked ${todaySteps.toLocaleString()} steps. You need roughly ${stepsRemaining.toLocaleString()} steps to conquer your daily goal of ${stepGoal.toLocaleString()} steps.`,
      type: 'tip',
      icon: Footprints,
      colorClass: 'text-purple-500',
      bgClass: 'bg-purple-50/50 border-purple-100/40',
      action: (
        <div className="flex gap-2 mt-3">
          <Button 
            onClick={() => logQuickSteps(2000)} 
            variant="outline" 
            size="sm" 
            className="rounded-xl text-xs font-bold border-purple-200 hover:bg-purple-50 text-purple-700 bg-white"
          >
            +2,000 Steps
          </Button>
        </div>
      )
    });
  } else {
    insights.push({
      id: 'steps-completed',
      category: 'steps',
      title: 'Step Goal Unlocked!',
      description: `Sensational pacing! You've achieved ${todaySteps.toLocaleString()} steps, exceeding your recommended daily baseline step targets.`,
      type: 'positive',
      icon: CheckCircle2,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50 border-emerald-100',
    });
  }

  // 4. Weight Trend Insights
  if (weightLogs.length >= 2) {
    const latestWeight = weightLogs[weightLogs.length - 1].val;
    const previousWeight = weightLogs[weightLogs.length - 2].val;
    const weightDiff = parseFloat((latestWeight - previousWeight).toFixed(1));

    if (Math.abs(weightDiff) >= 0.2) {
      const convertedDiff = convertWeight(Math.abs(weightDiff));
      const directionStr = weightDiff > 0 ? 'gained' : 'shed';
      const trendIcon = weightDiff > 0 ? TrendingUp : TrendingDown;
      
      insights.push({
        id: 'weight-trend',
        category: 'weight',
        title: `Weight Trend Direction`,
        description: `Your weight logged a dynamic change of ${weightDiff > 0 ? '+' : '-'}${convertedDiff.value} ${convertedDiff.label} since your previous reading. Ensure readings are taken consistently before breakfast.`,
        type: 'tip',
        icon: trendIcon,
        colorClass: 'text-emerald-600',
        bgClass: 'bg-emerald-50/50 border-emerald-100/40',
      });
    }
  }

  // 5. Heart Rate Vitals Check (Typical range resting HR is 60-100)
  const hrLogs = vitalsData.hr || [];
  if (hrLogs.length > 0) {
    const latestHr = hrLogs[hrLogs.length - 1].value;
    if (latestHr > 100) {
      insights.push({
        id: 'vitals-hr-high',
        category: 'vitals',
        title: 'Elevated Pulse Reading',
        description: `Your last heart rate reading was ${latestHr} bpm, which is higher than the typical resting baseline of 60-100 bpm. This is worth monitoring if sustained.`,
        type: 'warning',
        icon: AlertCircle,
        colorClass: 'text-rose-600',
        bgClass: 'bg-rose-50 border-rose-100',
      });
    } else if (latestHr < 50) {
      insights.push({
        id: 'vitals-hr-low',
        category: 'vitals',
        title: 'Lower Pulse Reading',
        description: `Your last heart rate of ${latestHr} bpm is lower than typical averages. For active athletes, this can represent supreme physical conditioning, but is worth monitoring if accompanied by dizziness.`,
        type: 'tip',
        icon: Heart,
        colorClass: 'text-blue-600',
        bgClass: 'bg-blue-50 border-blue-100',
      });
    }
  }

  // 6. Missing Core Data Flag Insights
  if (weightLogs.length === 0) {
    insights.push({
      id: 'missing-weight',
      category: 'missing',
      title: 'Water Targets Pending Baseline',
      description: 'Your personalized metabolic hydration targets are currently calculated using standard fallbacks. Please log your weight to unlock precise formulas.',
      type: 'tip',
      icon: HelpCircle,
      colorClass: 'text-orange-600',
      bgClass: 'bg-orange-50 border-orange-100',
    });
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Daily Progress Rings / Metrics Progress Summary */}
      <Card className="border-none shadow-none bg-white rounded-3xl overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#6750A4]" />
              <h3 className="font-extrabold text-base text-[#1A1C1E]">Today's Goals Progress</h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#6750A4] bg-[#EADDFF] px-2 py-0.5 rounded-full">Rule-Based Active Tracker</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Steps Goal Progress */}
            <div className="bg-[#F7F9FC] p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Steps Goal</span>
                <span className="font-black text-xl text-gray-800 mt-1 block">
                  {todaySteps.toLocaleString()} <span className="text-xs font-normal text-gray-400">/ {stepGoal.toLocaleString()}</span>
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (todaySteps / stepGoal) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 font-bold block text-right">
                  {Math.round(Math.min(100, (todaySteps / stepGoal) * 100))}% Reached
                </span>
              </div>
            </div>

            {/* Water Goal Progress */}
            <div className="bg-[#F7F9FC] p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Water Intake Goal</span>
                <span className="font-black text-xl text-gray-800 mt-1 block">
                  {formattedWaterToday.value} <span className="text-xs font-normal text-gray-400">/ {formattedWaterGoal.value} {formattedWaterGoal.label}</span>
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (todayWaterMl / waterGoalMl) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 font-bold block text-right">
                  {Math.round(Math.min(100, (todayWaterMl / waterGoalMl) * 100))}% Reached
                </span>
              </div>
            </div>

            {/* Sleep Target Progress */}
            <div className="bg-[#F7F9FC] p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Sleep Target</span>
                <span className="font-black text-xl text-gray-800 mt-1 block">
                  {todaySleep} <span className="text-xs font-normal text-gray-400">/ {sleepGoal} hrs</span>
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (todaySleep / sleepGoal) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 font-bold block text-right">
                  {Math.round(Math.min(100, (todaySleep / sleepGoal) * 100))}% Reached
                </span>
              </div>
            </div>

            {/* Calories Burned Goal Progress */}
            <div className="bg-[#F7F9FC] p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Burn Goal</span>
                <span className="font-black text-xl text-gray-800 mt-1 block">
                  {todayCaloriesBurned.toLocaleString()} <span className="text-xs font-normal text-gray-400">/ {caloriesBurnedGoal} kcal</span>
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (todayCaloriesBurned / caloriesBurnedGoal) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 font-bold block text-right">
                  {Math.round(Math.min(100, (todayCaloriesBurned / caloriesBurnedGoal) * 100))}% Reached
                </span>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* 2. Personal Health Assistant - Dynamic Rule-Based Insights Card */}
      <div className="space-y-4">
        <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest px-1">Personal Assistant Insights</h4>
        
        {insights.length === 0 ? (
          <Card className="border-none shadow-none bg-white rounded-3xl p-6 text-center space-y-2">
            <Sparkles className="text-gray-300 mx-auto" size={32} />
            <p className="text-sm text-gray-800 font-bold">Awaiting Data to Spark Insights</p>
            <p className="text-xs text-gray-400 max-w-[260px] mx-auto leading-relaxed">
              Log steps, sleep, water, and vitals over the next couple of days. Our local rule-based engine will automatically evaluate correlations!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => {
              const IconComponent = insight.icon;
              return (
                <div 
                  key={insight.id} 
                  className={`p-5 rounded-3xl border flex items-start gap-4 transition-all duration-300 ${insight.bgClass}`}
                >
                  <div className={`p-2.5 rounded-2xl ${insight.colorClass} bg-white/60 shrink-0 mt-0.5`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <h5 className="font-extrabold text-sm text-gray-900 leading-snug">{insight.title}</h5>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{insight.description}</p>
                    {insight.action}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default InsightsSection;