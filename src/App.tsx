import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import Profile from "./pages/Profile";
import UnitSettingsPage from "./pages/UnitSettingsPage";

// New sub-pages import
import ActivityPage from "./pages/overview/ActivityPage";
import VitalsPage from "./pages/overview/VitalsPage";
import SleepPage from "./pages/overview/SleepPage";
import NutritionPage from "./pages/overview/NutritionPage";
import BodyMeasurementsPage from "./pages/overview/BodyMeasurementsPage";

import NotFound from "./pages/NotFound";
import { UnitProvider } from "./context/UnitContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UnitProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/overview/activity" element={<ActivityPage />} />
            <Route path="/overview/vitals" element={<VitalsPage />} />
            <Route path="/overview/sleep" element={<SleepPage />} />
            <Route path="/overview/nutrition" element={<NutritionPage />} />
            <Route path="/overview/body-measurements" element={<BodyMeasurementsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings/units" element={<UnitSettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UnitProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;