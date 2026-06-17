import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Overview from '@/pages/Overview';
import ActivityPage from '@/pages/overview/ActivityPage';
import SleepPage from '@/pages/overview/SleepPage';
import NutritionPage from '@/pages/overview/NutritionPage';
import BodyMeasurementsPage from '@/pages/overview/BodyMeasurementsPage';
import VitalsPage from '@/pages/overview/VitalsPage';
import VitalDetailPage from '@/pages/overview/VitalDetailPage';
import VO2MaxDetailPage from '@/pages/overview/VO2MaxDetailPage';
import Profile from '@/pages/Profile';
import ProfileSettings from '@/pages/ProfileSettings';
import UnitSettingsPage from '@/pages/UnitSettingsPage';
import LookAndFeelSettingsPage from '@/pages/LookAndFeelSettingsPage';
import NotFound from '@/pages/NotFound';
import { HealthDataProvider } from '@/context/HealthDataContext';
import { UnitProvider } from '@/context/UnitContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/sonner';

const App = () => {
  return (
    <ThemeProvider>
      <UnitProvider>
        <HealthDataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/index" element={<Index />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/overview/activity" element={<ActivityPage />} />
              <Route path="/overview/sleep" element={<SleepPage />} />
              <Route path="/overview/nutrition" element={<NutritionPage />} />
              <Route path="/overview/body-measurements" element={<BodyMeasurementsPage />} />
              <Route path="/overview/vitals" element={<VitalsPage />} />
              <Route path="/overview/vitals/vo2max" element={<VO2MaxDetailPage />} />
              <Route path="/overview/vitals/:vitalKey" element={<VitalDetailPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile-settings" element={<ProfileSettings />} />
              <Route path="/settings/units" element={<UnitSettingsPage />} />
              <Route path="/settings/look-and-feel" element={<LookAndFeelSettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-center" />
          </BrowserRouter>
        </HealthDataProvider>
      </UnitProvider>
    </ThemeProvider>
  );
};

export default App;