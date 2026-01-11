import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';  
import DecoyPage from './pages/DecoyPage';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import AttackView from './pages/AttackView';

// Simple auth check (replace with real auth later)
const isAuthenticated = () => {
  // TODO: Replace with actual auth logic (e.g., check token)
  return localStorage.getItem('isAuthenticated') === 'true';
};

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DecoyPage />} />

      {/* Protected Dashboard Routes */}
      <Route 
        path="/dashboard/*" 
        element={
          isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />
        } 
      >
        <Route index element={<div className="text-gray-400 p-4">Select a section</div>} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="attack" element={<AttackView />} />
      </Route>

      {/* Redirect unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}