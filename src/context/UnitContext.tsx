"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UnitSettings {
  timeZone: string;
  timeFormat: '12h' | '24h';
  length: 'metric' | 'imperial'; // Centimeters/Kilometers vs Feet/Miles
  weight: 'kg' | 'lbs' | 'st';
  water: 'ml' | 'oz';
  energy: 'kcal' | 'kj';
  temperature: 'c' | 'f';
}

interface UnitContextType {
  settings: UnitSettings;
  updateSetting: <K extends keyof UnitSettings>(key: K, value: UnitSettings[K]) => void;
  // Conversion helper functions
  convertWeight: (kgVal: number) => { value: number; label: string };
  convertHeight: (cmVal: number) => { value: string; label: string };
  convertWater: (mlVal: number) => { value: number; label: string };
  convertEnergy: (kcalVal: number) => { value: number; label: string };
  formatTime: (timeString: string) => string;
}

const defaultSettings: UnitSettings = {
  timeZone: 'GMT+1',
  timeFormat: '12h',
  length: 'metric',
  weight: 'kg',
  water: 'ml',
  energy: 'kcal',
  temperature: 'c',
};

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UnitSettings>(() => {
    const saved = localStorage.getItem('health_unit_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('health_unit_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof UnitSettings>(key: K, value: UnitSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const convertWeight = (kgVal: number) => {
    if (settings.weight === 'lbs') {
      return { value: Math.round(kgVal * 2.20462), label: 'lbs' };
    }
    if (settings.weight === 'st') {
      return { value: Math.round(kgVal * 0.157473 * 10) / 10, label: 'st' };
    }
    return { value: kgVal, label: 'kg' };
  };

  const convertHeight = (cmVal: number) => {
    if (settings.length === 'imperial') {
      const totalInches = cmVal / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return { value: `${feet}'${inches}"`, label: 'ft' };
    }
    return { value: `${cmVal}`, label: 'cm' };
  };

  const convertWater = (mlVal: number) => {
    if (settings.water === 'oz') {
      return { value: Math.round(mlVal * 0.033814), label: 'fl oz' };
    }
    return { value: mlVal, label: 'ml' };
  };

  const convertEnergy = (kcalVal: number) => {
    if (settings.energy === 'kj') {
      return { value: Math.round(kcalVal * 4.184), label: 'kJ' };
    }
    return { value: kcalVal, label: 'kcal' };
  };

  const formatTime = (timeString: string) => {
    // Expecting "HH:MM" e.g. "14:30" or "10:30"
    const [hoursStr, minutesStr] = timeString.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr;
    
    if (isNaN(hours)) return timeString;

    if (settings.timeFormat === '12h') {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${hours}:${minutes} ${ampm}`;
    }
    
    return `${hoursStr.padStart(2, '0')}:${minutes}`;
  };

  return (
    <UnitContext.Provider value={{ settings, updateSetting, convertWeight, convertHeight, convertWater, convertEnergy, formatTime }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnits = () => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error('useUnits must be used within a UnitProvider');
  }
  return context;
};