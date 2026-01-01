import { Routes, Route } from 'react-router-dom';
import DecoyPage from './pages/DecoyPage';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import AttackView from './pages/AttackView';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DecoyPage />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<div className="text-gray-400 p-4">👈 Select a section</div>} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="attack" element={<AttackView />} />
      </Route>
    </Routes>
  );
}