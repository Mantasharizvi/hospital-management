import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Dashboard from '../pages/dashboard/Dashboard';
import Placeholder from '../pages/dashboard/Placeholder';
import OpdPage from '../pages/opd/OpdPage';
import IpdPage from '../pages/ipd/IpdPage';
import PharmacyPage from '../pages/pharmacy/PharmacyPage';
import ReportsAnalyticsPage from '../pages/reports-analytics/ReportsAnalyticsPage';
import UserManagementPage from '../pages/user-management/UserManagementPage';
import SettingsPage from '../pages/settings/SettingsPage';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected admin panel */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/opd" element={<OpdPage />} />
          <Route path="/ipd" element={<IpdPage />} />
          <Route path="/pharmacy" element={<PharmacyPage />} />
            <Route path="/reports" element={<ReportsAnalyticsPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
