import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Dashboard from '../pages/dashboard/Dashboard';
import Placeholder from '../pages/dashboard/Placeholder';
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
          <Route path="/patients" element={<Placeholder title="Patients" />} />
          <Route path="/appointments" element={<Placeholder title="Appointments" />} />
          <Route path="/doctors" element={<Placeholder title="Doctors" />} />
          <Route path="/wards" element={<Placeholder title="Wards & Beds" />} />
          <Route path="/pharmacy" element={<Placeholder title="Pharmacy" />} />
          <Route path="/lab" element={<Placeholder title="Lab Reports" />} />
          <Route path="/billing" element={<Placeholder title="Billing" />} />
          <Route path="/settings" element={<Placeholder title="Settings" />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
