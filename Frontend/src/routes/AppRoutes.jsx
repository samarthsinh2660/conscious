import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../modules/auth';
import { OnboardingPage } from '../modules/onboarding';
import { Sidebar } from '../modules/dashboard';
import { DashboardRoutes } from '../modules/dashboard';
import { ProtectedRoute } from './ProtectedRoute';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <DashboardRoutes />
      </div>
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
