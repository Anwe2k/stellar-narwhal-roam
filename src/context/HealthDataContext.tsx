"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ActivityLog {
  id: number;
  steps: number;
  energy: number; // kcal
  distance: number; // km
  time: string;
  date: string;
}

export interface VitalLog {
  time?: string;
  date: string;
  value: number;
  systolic?: number;
  diastolic?: number;
}

export interface SleepLog {
  day: string;
  hrs: number;
  date: string;
  startTime?: string;
  endTime?: string;
}

export interface NutritionLog {
  id: number;
  val: number; // kcal
  desc: string;
  time: string;
  date: string;
}

export interface WaterLog {
  id: number;
  val: number; // ml
  time: string;
  date: string;
}

export interface WeightLog {
  day: string;
  val: number; // kg
}

export interface FatLog {
  day: string;
  val: number; // %
}

export interface TapeMeasurementLog {
  id: number;
  date: string;
  neck?: number;   // stored in cm
  waist?: number;  // stored in cm
  chest?: number;  // stored in cm
  hips?: number;   // stored in cm
  biceps?: number; // stored in cm
  thighs?: number; // stored in cm
}

interface HealthDataContextType {
  activityLogs: ActivityLog[];
  addActivityLog: (steps: number, energy: number, distance: number, date: string, customTime?: string) => void;
  
  vitalsData: Record<string, VitalLog[]>;
  addVitalLog: (key: string, value: number, date: string, customTime?: string, systolic?: number, diastolic?: number) => void;
  
  sleepLogs: SleepLog[];
  addSleepLog: (hrs: number, date: string, startTime?: string, endTime?: string) => void;
  
  calorieLogs: NutritionLog[];
  addCalorieLog: (val: number, desc: string, date: string, customTime?: string) => void;
  
  waterLogs: WaterLog[];
  addWaterLog: (val: number, date: string, customTime?: string) => void;
  
  weightLogs: WeightLog[];
  addWeightLog: (val: number, day: string) => void;
  
  fatLogs: FatLog[];
  addFatLog: (val: number, day: string) => void;

  tapeLogs: TapeMeasurementLog[];
  addTapeLog: (date: string, neck?: number, waist?: number, chest?: number, hips?: number, biceps?: number, thighs?: number) => void;
  
  clearAllData: () => void;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('health_activity');
    return saved ? JSON.parse(saved) : [];
  });

  const [vitalsData, setVitalsData] = useState<Record<string, VitalLog[]>>(() => {
    const saved = localStorage.getItem('health_vitals');
    return saved ? JSON.parse(saved) : {
      hr: [], rhr: [], spo2: [], bp: [], sugar: [], temp: []
    };
  });

  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(() => {
    const saved = localStorage.getItem('health_sleep');
    return saved ? JSON.parse(saved) : [];
  });

  const [calorieLogs, setCalorieLogs] = useState<NutritionLog[]>(() => {
    const saved = localStorage.getItem('health_calories');
    return saved ? JSON.parse(saved) : [];
  });

  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => {
    const saved = localStorage.getItem('health_water');
    return saved ? JSON.parse(saved) : [];
  });

  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(() => {
    const saved = localStorage.getItem('health_weight');
    return saved ? JSON.parse(saved) : [];
  });

  const [fatLogs, setFatLogs] = useState<FatLog[]>(() => {
    const saved = localStorage.getItem('health_fat');
    return saved ? JSON.parse(saved) : [];
  });

  const [tapeLogs, setTapeLogs] = useState<TapeMeasurementLog[]>(() => {
    const saved = localStorage.getItem('health_tape_measurements');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('health_activity', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('health_vitals', JSON.stringify(vitalsData));
  }, [vitalsData]);

  useEffect(() => {
    localStorage.setItem('health_sleep', JSON.stringify(sleepLogs));
  }, [sleepLogs]);

  useEffect(() => {
    localStorage.setItem('health_calories', JSON.stringify(calorieLogs));
  }, [calorieLogs]);

  useEffect(() => {
    localStorage.setItem('health_water', JSON.stringify(waterLogs));
  }, [waterLogs]);

  useEffect(() => {
    localStorage.setItem('health_weight', JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    localStorage.setItem('health_fat', JSON.stringify(fatLogs));
  }, [fatLogs]);

  useEffect(() => {
    localStorage.setItem('health_tape_measurements', JSON.stringify(tapeLogs));
  }, [tapeLogs]);

  const addActivityLog = (steps: number, energy: number, distance: number, date: string, customTime?: string) => {
    const activeTime = customTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const newLog: ActivityLog = {
      id: Date.now(),
      steps,
      energy,
      distance,
      time: activeTime,
      date
    };
    setActivityLogs(prev => {
      // Avoid identical timestamps on the *same day* only
      const filtered = prev.filter(log => !(log.time === activeTime && log.date === date));
      return [newLog, ...filtered];
    });
  };

  const addVitalLog = (key: string, value: number, date: string, customTime?: string, systolic?: number, diastolic?: number) => {
    const activeTime = customTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const newEntry: VitalLog = { time: activeTime, date, value, systolic, diastolic };
    
    setVitalsData(prev => {
      const currentList = prev[key] || [];
      const filtered = currentList.filter(entry => {
        if (key === 'rhr') {
          return entry.date !== date;
        } else {
          return !(entry.date === date && entry.time === activeTime);
        }
      });
      return {
        ...prev,
        [key]: [...filtered, newEntry]
      };
    });
  };

  const addSleepLog = (hrs: number, date: string, startTime?: string, endTime?: string) => {
    const parsedDate = new Date(date);
    const dayLabel = parsedDate.toLocaleDateString([], { weekday: 'short' });
    const newLog: SleepLog = { day: dayLabel, hrs, date, startTime, endTime };
    setSleepLogs(prev => {
      const filtered = prev.filter(log => log.date !== date);
      return [...filtered, newLog];
    });
  };

  const addCalorieLog = (val: number, desc: string, date: string, customTime?: string) => {
    const activeTime = customTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const newLog: NutritionLog = { id: Date.now(), val, desc, time: activeTime, date };
    setCalorieLogs(prev => {
      const filtered = prev.filter(log => !(log.time === activeTime && log.date === date));
      return [...filtered, newLog];
    });
  };

  const addWaterLog = (val: number, date: string, customTime?: string) => {
    const activeTime = customTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const newLog: WaterLog = { id: Date.now(), val, time: activeTime, date };
    setWaterLogs(prev => {
      const filtered = prev.filter(log => !(log.time === activeTime && log.date === date));
      return [...filtered, newLog];
    });
  };

  const addWeightLog = (val: number, day: string) => {
    const newLog: WeightLog = { day, val };
    setWeightLogs(prev => {
      const filtered = prev.filter(log => log.day !== day);
      return [...filtered, newLog];
    });
  };

  const addFatLog = (val: number, day: string) => {
    const newLog: FatLog = { day, val };
    setFatLogs(prev => {
      const filtered = prev.filter(log => log.day !== day);
      return [...filtered, newLog];
    });
  };

  const addTapeLog = (date: string, neck?: number, waist?: number, chest?: number, hips?: number, biceps?: number, thighs?: number) => {
    const newLog: TapeMeasurementLog = {
      id: Date.now(),
      date,
      neck,
      waist,
      chest,
      hips,
      biceps,
      thighs
    };
    setTapeLogs(prev => {
      const filtered = prev.filter(log => log.date !== date);
      return [newLog, ...filtered];
    });
  };

  const clearAllData = () => {
    setActivityLogs([]);
    setVitalsData({ hr: [], rhr: [], spo2: [], bp: [], sugar: [], temp: [] });
    setSleepLogs([]);
    setCalorieLogs([]);
    setWaterLogs([]);
    setWeightLogs([]);
    setFatLogs([]);
    setTapeLogs([]);
  };

  return (
    <HealthDataContext.Provider value={{
      activityLogs, addActivityLog,
      vitalsData, addVitalLog,
      sleepLogs, addSleepLog,
      calorieLogs, addCalorieLog,
      waterLogs, addWaterLog,
      weightLogs, addWeightLog,
      fatLogs, addFatLog,
      tapeLogs, addTapeLog,
      clearAllData
    }}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};