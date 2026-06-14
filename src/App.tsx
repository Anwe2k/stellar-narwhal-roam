"use client";

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Overview from './pages/Overview';
import Profile from './pages/Profile';
import UnitSettingsPage from './pages/UnitSettingsPage';
import BodyMeasurementsPage from './pages/overview/BodyMeasurementsPage';
import HydrationPage from './pages/overview/HydrationPage';
import PersonalSettings from './pages/PersonalSettings';
import { UnitProvider } from './context/UnitContext';
import { HealthDataProvider } from './context/HealthDataContext';

function App() {
  return (
    <BrowserRouter>
      <UnitProvider>
        <HealthDataProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/overview/measurements" element={<BodyMeasurementsPage />} />
            <Route path="/overview/hydration" element={<HydrationPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings/units" element={<UnitSettingsPage />} />
            <Route path="/settings/personal" element={<PersonalSettings />} />
            {/* Fallback to index */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HealthDataProvider>
      </UnitProvider>
    </BrowserRouter>
  );
}

export default App;