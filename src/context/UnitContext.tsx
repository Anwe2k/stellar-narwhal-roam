"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UnitSettings {
  timeZone: string;
  timeFormat: '12h' | '24h';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY';
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
  convertWeightInverse: (val: number) => number; // convert to kg
  convertHeight: (cmVal: number) => { value: string; label: string };
  convertHeightInverse: (val: number) => number; // convert to cm
  convertWater: (mlVal: number) => { value: number; label: string };
  convertWaterInverse: (val: number) => number; // convert to ml
  convertEnergy: (kcalVal: number) => { value: number; label: string };
  convertEnergyInverse: (val: number) => number; // convert to kcal
  convertTemperature: (cVal: number) => { value: number; label: string };
  convertTemperatureInverse: (val: number) => number; // convert to c
  convertDistance: (kmVal: number) => { value: number; label: string };
  convertDistanceInverse: (val: number) => number; // convert to km
  formatTime: (timeString: string) => string;
  formatDate: (dateString: string) => string;
}

const defaultSettings: UnitSettings = {
  timeZone: 'GMT+1',
  timeFormat: '12h',
  dateFormat: 'DD/MM/YYYY',
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

  const convertWeightInverse = (val: number) => {
    if (settings.weight === 'lbs') {
      return val / 2.20462;
    }
    if (settings.weight === 'st') {
      return val / 0.157473;
    }
    return val;
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

  const convertHeightInverse = (val: number) => {
    return val; // simple cm direct input
  };

  const convertWater = (mlVal: number) => {
    if (settings.water === 'oz') {
      return { value: Math.round(mlVal * 0.033814), label: 'fl oz' };
    }
    return { value: mlVal, label: 'ml' };
  };

  const convertWaterInverse = (val: number) => {
    if (settings.water === 'oz') {
      return val / 0.033814;
    }
    return val;
  };

  const convertEnergy = (kcalVal: number) => {
    if (settings.energy === 'kj') {
      return { value: Math.round(kcalVal * 4.184), label: 'kJ' };
    }
    return { value: kcalVal, label: 'kcal' };
  };

  const convertEnergyInverse = (val: number) => {
    if (settings.energy === 'kj') {
      return val / 4.184;
    }
    return val;
  };

  const convertTemperature = (cVal: number) => {
    if (settings.temperature === 'f') {
      return { value: Math.round(((cVal * 9) / 5 + 32) * 10) / 10, label: '°F' };
    }
    return { value: Math.round(cVal * 10) / 10, label: '°C' };
  };

  const convertTemperatureInverse = (val: number) => {
    if (settings.temperature === 'f') {
      return ((val - 32) * 5) / 9;
    }
    return val;
  };

  const convertDistance = (kmVal: number) => {
    if (settings.length === 'imperial') {
      return { value: Math.round(kmVal * 0.621371 * 100) / 100, label: 'mi' };
    }
    return { value: Math.round(kmVal * 100) / 100, label: 'km' };
  };

  const convertDistanceInverse = (val: number) => {
    if (settings.length === 'imperial') {
      return val / 0.621371;
    }
    return val;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const parts = timeString.split(':');
    if (parts.length < 2) return timeString;
    const hoursStr = parts[0];
    const minutesStr = parts[1];
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr;
    
    if (isNaN(hours)) return timeString;

    if (settings.timeFormat === '12h') {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    
    return `${hoursStr.padStart(2, '0')}:${minutes}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    if (settings.dateFormat === 'MM/DD/YYYY') {
      return `${month}/${day}/${year}`;
    }
    return `${day}/${month}/${year}`;
  };

  return (
    <UnitContext.Provider value={{
      settings,
      updateSetting,
      convertWeight,
      convertWeightInverse,
      convertHeight,
      convertHeightInverse,
      convertWater,
      convertWaterInverse,
      convertEnergy,
      convertEnergyInverse,
      convertTemperature,
      convertTemperatureInverse,
      convertDistance,
      convertDistanceInverse,
      formatTime,
      formatDate
    }}>
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