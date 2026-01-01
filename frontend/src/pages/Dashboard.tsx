// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Shield, Activity, AlertTriangle, Users, Eye, TrendingUp, Clock, MapPin, Bot, Radar } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';

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
        {title && <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
          {title}
        </h3>}
        {children}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const currentNavItem = navItems.find(item => location.pathname.startsWith(item.path)) || navItems[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 flex relative overflow-hidden">
      {/* Animated Background — tactical green/blue tones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
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
        <div className="m-4 backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 shadow-xl h-[calc(100vh-2rem)]">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-sky-600 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-200">Cerberus</h1>
                <p className="text-xs text-slate-400">Defense Suite</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </a>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-700/30">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {time.toLocaleTimeString()}
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
              <Radar className="w-3 h-3 text-emerald-500 animate-pulse" /> 
              <span>System Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-200"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-64 h-full bg-slate-900/95 border-r border-slate-700/50 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-sky-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-200">Cerberus</h1>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`block px-4 py-3 rounded-xl flex items-center gap-3 ${
                      location.pathname.startsWith(item.path)
                        ? 'bg-emerald-900/40 text-emerald-200'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-slate-100">
              {currentNavItem.name}
            </h1>
            <p className="text-slate-400 mt-1">
              {currentNavItem.name === 'Overview' 
                ? 'Real-time threat intelligence and decoy engagement analytics' 
                : 'Detailed view of active security events'}
            </p>
          </header>

          <Outlet />
        </div>
      </main>
    </div>
  );
}