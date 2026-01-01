import { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { usePolling } from '../hooks/usePolling';
import ExportPDFButton from '../components/ui/ExportPDFButton';

interface Alert {
  id: string;
  type: 'phishing' | 'bec' | 'anomaly';
  severity: 'low' | 'medium' | 'high';
  message: string;
  attacker_ip?: string;
  timestamp: string;
}

// Mock API (replace with your real endpoint later)
const fetchAlerts = async (): Promise<Alert[]> => {
  // In production, use:
  // const res = await fetch('http://localhost:8000/alerts');
  // return res.json();

  // For now: mock data that updates over time
  const now = new Date();
  return [
    {
      id: 'a1',
      type: 'phishing',
      severity: 'high',
      message: 'Decoy login triggered',
      attacker_ip: '203.0.113.42',
      timestamp: now.toISOString(),
    },
    {
      id: 'a2',
      type: 'bec',
      severity: 'high',
      message: 'Suspicious wire transfer request',
      attacker_ip: '198.51.100.17',
      timestamp: new Date(now.getTime() - 120_000).toISOString(),
    },
    {
      id: 'a3',
      type: 'anomaly',
      severity: 'medium',
      message: 'Unusual login pattern detected',
      attacker_ip: '192.0.2.99',
      timestamp: new Date(now.getTime() - 300_000).toISOString(),
    },
  ];
};

const severityColors = {
  low: 'text-green-400',
  medium: 'text-amber-400',
  high: 'text-red-400',
};

const typeIcons = {
  phishing: '🎣',
  bec: '💸',
  anomaly: '⚠️',
};

export default function Alerts() {
  const { data: alerts, loading, error, refetch } = usePolling(fetchAlerts, 3000);

  useEffect(() => {
    // Auto-scroll to top on new alerts
    const container = document.getElementById('alerts-container');
    if (container && alerts?.length) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [alerts]);

  return (
    <ExportPDFButton title="Cerberus Alert Report">
      <GlassCard title="Live Alerts">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {loading ? 'Refreshing...' : `Last updated: ${new Date().toLocaleTimeString()}`}
          </div>
          <button
            onClick={refetch}
            className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded transition"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="text-red-400 text-sm mb-4 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M4.5 12a7.5 7.5 0 0115 0" />
            </svg>
            {error}
          </div>
        )}

        <div
          id="alerts-container"
          className="max-h-96 overflow-y-auto pr-2 space-y-4"
        >
          {loading && !alerts ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : alerts && alerts.length > 0 ? (
            alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 transition-transform hover:scale-[1.01] ${
                  alert.severity === 'high'
                    ? 'border-red-500 bg-red-500/5'
                    : alert.severity === 'medium'
                    ? 'border-amber-500 bg-amber-500/5'
                    : 'border-green-500 bg-green-500/5'
                }`}
              >
                <div className="flex items-start">
                  <span className="text-xl mr-3">{typeIcons[alert.type]}</span>
                  <div className="flex-1">
                    <div className="flex items-baseline">
                      <span className={`font-medium ${severityColors[alert.severity]}`}>
                        {alert.message}
                      </span>
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-gray-800">
                        {alert.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {alert.attacker_ip && `IP: ${alert.attacker_ip} • `}
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No active alerts
            </div>
          )}
        </div>
      </GlassCard>
    </ExportPDFButton>
  );
}

// When ready to connect to backend use const fetchAlerts = () => fetch('http://localhost:8000/alerts').then(res => res.json());