"use client";

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Profile from '@/pages/Profile';
import ProfileSettings from '@/pages/ProfileSettings';
import BodyMeasurementsPage from '@/pages/overview/BodyMeasurementsPage';
import UnitsSettingsPage from '@/pages/settings/UnitsSettingsPage';
import OverviewPage from '@/pages/OverviewPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/overview" element={<OverviewPage />} />
      <Route path="/overview/measurements" element={<BodyMeasurementsPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile-settings" element={<ProfileSettings />} />
      <Route path="/settings/units" element={<UnitsSettingsPage />} />
    </Routes>
  );
}

export default App;