"use client";

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import ProfileSettings from '@/pages/ProfileSettings';
import Overview from '@/pages/Overview';
import ActivityPage from '@/pages/overview/ActivityPage';
import SleepPage from '@/pages/overview/SleepPage';
import NutritionPage from '@/pages/overview/NutritionPage';
import VitalsPage from '@/pages/overview/VitalsPage';
import VitalDetailPage from '@/pages/overview/VitalDetailPage';
import BodyMeasurementsPage from '@/pages/overview/BodyMeasurementsPage';
import UnitSettingsPage from '@/pages/UnitSettingsPage';
import { HealthDataProvider } from '@/context/HealthDataContext';
import { UnitProvider } from '@/context/UnitContext';

function App() {
  return (
    <BrowserRouter>
      <UnitProvider>
        <HealthDataProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/overview/activity" element={<ActivityPage />} />
            <Route path="/overview/sleep" element={<SleepPage />} />
            <Route path="/overview/nutrition" element={<NutritionPage />} />
            <Route path="/overview/vitals" element={<VitalsPage />} />
            <Route path="/overview/vitals/:vitalKey" element={<VitalDetailPage />} />
            <Route path="/overview/body-measurements" element={<BodyMeasurementsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/settings/units" element={<UnitSettingsPage />} />
          </Routes>
        </HealthDataProvider>
      </UnitProvider>
    </BrowserRouter>
  );
}

export default App;