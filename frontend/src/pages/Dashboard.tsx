import { useState, useEffect } from 'react';
import { Shield, Activity, AlertTriangle, Users, Eye, TrendingUp, Clock, MapPin, Bot, Radar } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import AttackMap from '../components/dashboard/AttackMap';

// Define interfaces based on your actual API responses
interface Alert {
  id: string;
  type: string;
  ip_address: string; // Match your DB field name
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface Session {
  session_id: string;
  ip_address: string;
  credentials_captured: boolean;
  documents_downloaded: number;
  is_active: boolean;
}

interface RiskSummary {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: Activity },
  { name: 'Live Alerts', path: '/dashboard/alerts', icon: AlertTriangle },
  { name: 'Attack Sessions', path: '/dashboard/attack', icon: Eye },
  { name: 'Decoy Logs', path: '/dashboard/logs', icon: Bot },
];

const GlassCard = ({ title, children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'border-slate-700/50 bg-slate-900/40',
    critical: 'border-rose-500/30 bg-rose-900/20 animate-pulse',
    warning: 'border-amber-500/30 bg-amber-900/20',
    success: 'border-emerald-500/30 bg-emerald-900/20',
  };

  return (
    <div className={`relative backdrop-blur-xl border rounded-2xl p-6 shadow-xl hover:bg-slate-800/30 transition-all duration-300 ${variants[variant]} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent rounded-2xl"></div>
      <div className="relative z-10">
        {title && <h3 className="text-lg font-semibold text-slate-200 mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default function Dashboard() {
  console.log("Dashboard component mounted"); // Debugging log

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [currentPath, setCurrentPath] = useState('/dashboard');

  // Live data state
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [riskData, setRiskData] = useState<RiskSummary>({ low: 0, medium: 0, high: 0, critical: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch data every 3 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        console.log("Fetching data from /alerts, /sessions, /risk-summary");

        const [alertsRes, sessionsRes, riskRes] = await Promise.all([
          axios.get('/alerts'),
          axios.get('/sessions'),
          axios.get('/risk-summary')
        ]);

        // CRITICAL FIX: Ensure alerts is always an array
        const alertsData = Array.isArray(alertsRes.data) ? alertsRes.data : [];
        const sessionsData = Array.isArray(sessionsRes.data) ? sessionsRes.data : [];
        const riskDataObj = typeof riskRes.data === 'object' ? riskRes.data : { low: 0, medium: 0, high: 0, critical: 0 };

        setAlerts(alertsData);
        setSessions(sessionsData);
        setRiskData(riskDataObj);

        console.log("✅ Data loaded successfully");
      } catch (err) {
        console.error('❌ Failed to fetch dashboard data:', err);
        setAlerts([]);
        setSessions([]);
        setRiskData({ low: 0, medium: 0, high: 0, critical: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Calculate metrics from live data
  const highRiskAlerts = Array.isArray(alerts) 
    ? alerts.filter(a => ['high', 'critical'].includes(a.severity)).length 
    : 0;

  const activeDecoys = Array.isArray(sessions)
    ? sessions.filter(s => s.is_active).length
    : 0;
  
  const becDetections = Array.isArray(alerts)
    ? alerts.filter(a => a.type.includes('BEC')).length
    : 0;
  
  const totalRiskScore = riskData.critical * 10 + riskData.high * 5 + riskData.medium * 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 flex relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 relative z-10">
        <div className="m-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl h-[calc(100vh-2rem)]">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-purple-400 to-cyan-400">
                  Cerberus
                </h1>
                <p className="text-gray-400 text-xs">Defense Suite</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => setCurrentPath(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white border border-indigo-400/30 shadow-lg shadow-indigo-500/20'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
              <div>
                <div className="text-sm font-medium text-white">Security Admin</div>
                <div className="text-xs text-gray-400">admin@cerberus.io</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {time.toLocaleTimeString()}
            </div>
            <div className="text-xs text-gray-600 mt-2">v1.0.0 • MVP</div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white shadow-lg"
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Sidebar (Overlay) */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-64 h-full backdrop-blur-xl bg-slate-900/95 border-r border-white/10 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Cerberus
              </h1>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => setCurrentPath(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPath === item.path
                        ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Dynamic Page Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {navItems.find(item => item.path === currentPath)?.name || 'Dashboard'}
            </h1>
            <p className="text-gray-300">
              Real-time threat intelligence and decoy engagement analytics
            </p>
          </header>

          {/* Stats Grid - NOW LIVE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassCard>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Live Alerts</div>
                  <div className="text-4xl font-bold text-red-400">{highRiskAlerts}</div>
                  <div className="text-gray-500 text-sm mt-2">Last 5 min</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Active Decoys</div>
                  <div className="text-4xl font-bold text-amber-400">{activeDecoys}</div>
                  <div className="text-gray-500 text-sm mt-2">In progress</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-2">BEC Detections</div>
                  <div className="text-4xl font-bold text-purple-400">{becDetections}</div>
                  <div className="text-gray-500 text-sm mt-2">Pending review</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Risk Score</div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-cyan-400">{Math.min(totalRiskScore, 100)}</span>
                    <span className="text-gray-500 ml-2">/100</span>
                  </div>
                  <div className="text-gray-500 text-sm mt-2">System-wide</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Content Grid - NOW LIVE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Attacker Map */}
              <GlassCard title="Attacker Locations">
                <AttackMap alerts={alerts} />
              </GlassCard>

              {/* Live Alerts Feed */}
              <GlassCard title="Latest Alerts">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.slice(0, 5).map((alert) => (
                      <div 
                        key={alert.id} 
                        className="flex items-start gap-4 p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                          alert.severity === 'critical' ? 'bg-red-600' :
                          alert.severity === 'high' ? 'bg-red-500' : 
                          alert.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-200">{alert.type}</div>
                          <div className="text-sm text-gray-400 mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {alert.ip_address}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-4">No recent alerts</div>
                  )}
                </div>
              </GlassCard>

              <GlassCard title="BEC Detections">
                {becDetections > 0 ? (
                  <div className="space-y-3">
                    {alerts
                      .filter(a => a.type.includes('BEC'))
                      .slice(0, 3)
                      .map((alert) => (
                        <div key={alert.id} className="p-3 rounded-lg bg-purple-900/30 border border-purple-700/30">
                          <div className="font-medium text-purple-300">{alert.type}</div>
                          <div className="text-sm text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <div className="text-gray-400">No suspicious transfers detected</div>
                    <div className="text-sm text-gray-500 mt-2">All clear • System protected</div>
                  </div>
                )}
              </GlassCard>
            </div>

            <div className="space-y-6">
              <GlassCard title="Top Targeted Users">
                <ul className="space-y-3 max-h-60 overflow-y-auto">
                  {[
                    { user: 'jdoe@company.com', count: 3, risk: 'high' },
                    { user: 'admin@company.com', count: 2, risk: 'medium' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center justify-between p-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                          {item.user[0].toUpperCase()}
                        </div>
                        <span className="text-gray-300 text-sm">{item.user}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        item.risk === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {item.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard title="Attacker Fingerprint">
                <div className="space-y-4">
                  {alerts.length > 0 ? (
                    [
                      { label: 'Browser', value: 'Chrome 120', icon: '🌐' },
                      { label: 'OS', value: 'Windows', icon: '💻' },
                      { label: 'IP', value: alerts[0].ip_address, icon: '📍' },
                      { label: 'Location', value: 'Nairobi, KE', icon: '🌍' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10">
                        <span className="text-gray-400 text-sm flex items-center gap-2">
                          <span>{item.icon}</span>
                          {item.label}
                        </span>
                        <span className="text-gray-200 font-medium text-sm">{item.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-4">No active sessions</div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}