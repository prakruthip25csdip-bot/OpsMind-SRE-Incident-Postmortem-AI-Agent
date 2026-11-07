import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ApiProvider } from './context/ApiContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

// Layouts
import LandingLayout from './layouts/LandingLayout';
import MainLayout from './layouts/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import MemoryExplorerPage from './pages/MemoryExplorerPage';
import ComparisonPage from './pages/ComparisonPage';
import CustomersPage from './pages/CustomersPage';
import TicketsPage from './pages/TicketsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <ApiProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Standalone Authentication Route */}
                <Route path="/login" element={<LoginPage />} />

                {/* Public Marketing Landing Layout */}
                <Route element={<LandingLayout />}>
                  <Route path="/" element={<LandingPage />} />
                </Route>

                {/* Protected / SaaS Application Layout */}
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/memory-explorer" element={<MemoryExplorerPage />} />
                  <Route path="/comparison" element={<ComparisonPage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/tickets" element={<TicketsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}
