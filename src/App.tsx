"use client";

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Profile from '@/pages/Profile';
import ProfileSettings from '@/pages/ProfileSettings';
import BodyMeasurementsPage from '@/pages/overview/BodyMeasurementsPage';
import UnitSettingsPage from '@/pages/UnitSettingsPage';
import Overview from '@/pages/Overview';
import { HealthDataProvider } from '@/context/HealthDataContext';
import { UnitProvider } from '@/context/UnitContext';

function App() {
  return (
    <BrowserRouter>
      <UnitProvider>
        <HealthDataProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/overview/measurements" element={<BodyMeasurementsPage />} />
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