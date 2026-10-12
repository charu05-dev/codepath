import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { PracticePage } from './pages/PracticePage';
import { MistakesPage } from './pages/MistakesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* App Shell Dashboard & Core Navigation */}
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            }
          />

          <Route
            path="/roadmap"
            element={
              <AppLayout>
                <RoadmapPage />
              </AppLayout>
            }
          />

          <Route
            path="/practice"
            element={
              <AppLayout>
                <PracticePage />
              </AppLayout>
            }
          />

          <Route
            path="/mistakes"
            element={
              <AppLayout>
                <MistakesPage />
              </AppLayout>
            }
          />

          <Route
            path="/analytics"
            element={
              <AppLayout>
                <AnalyticsPage />
              </AppLayout>
            }
          />

          <Route
            path="/settings"
            element={
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            }
          />

          {/* Fallback to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
