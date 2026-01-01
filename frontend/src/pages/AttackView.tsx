import { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';

interface AttackSession {
  id: string;
  status: 'captured' | 'active' | 'expired';
  created_at: string;
  ip: string;
  user_agent: string;
  geo: { country: string; city: string };
  credentials?: { username: string; password: string };
  timeline: { event: string; timestamp: string }[];
}

// Mock data — replace with API call later
const mockSession: AttackSession = {
  id: 'sess_abc123xyz',
  status: 'captured',
  created_at: '2025-12-27T14:22:18Z',
  ip: '203.0.113.42',
  user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  geo: { country: 'Kenya', city: 'Nairobi' },
  credentials: { username: 'j***@gmail.com', password: 'hunter2' },
  timeline: [
    { event: 'Phishing link clicked', timestamp: '2025-12-27T14:22:18Z' },
    { event: 'Decoy login page loaded', timestamp: '2025-12-27T14:22:22Z' },
    { event: 'Credentials submitted', timestamp: '2025-12-27T14:22:31Z' },
    { event: 'Fake portal accessed', timestamp: '2025-12-27T14:23:05Z' },
  ],
};

export default function AttackView() {
  const [session] = useState<AttackSession>(mockSession);

  const getStatusBadge = () => {
    switch (session.status) {
      case 'captured': return 'bg-green-500/20 text-green-400';
      case 'active': return 'bg-amber-500/20 text-amber-400';
      case 'expired': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Attack Session</h1>
          <p className="text-gray-400">ID: <code className="bg-gray-800 px-2 py-1 rounded">{session.id}</code></p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge()}`}>
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </span>
      </div>

      {/* Fingerprint Card */}
      <GlassCard title="Attacker Fingerprint">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-300 mb-2">Network</h3>
            <div className="space-y-1 text-sm">
              <div><span className="text-gray-500">IP:</span> <span className="ml-2">{session.ip}</span></div>
              <div><span className="text-gray-500">Location:</span> <span className="ml-2">{session.geo.city}, {session.geo.country}</span></div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-300 mb-2">Device</h3>
            <div className="text-sm">
              <div className="truncate">{session.user_agent}</div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Captured Credentials */}
      {session.credentials && (
        <GlassCard title="Captured Credentials">
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">Username:</span>
              <span className="ml-2 font-mono bg-gray-800 px-2 py-1 rounded">{session.credentials.username}</span>
            </div>
            <div>
              <span className="text-gray-500">Password:</span>
              <span className="ml-2 font-mono bg-gray-800 px-2 py-1 rounded text-red-400">••••••••</span>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Timeline */}
      <GlassCard title="Attack Timeline">
        <div className="relative pl-6 border-l-2 border-gray-800">
          {session.timeline.map((item, i) => (
            <div key={i} className="mb-6 last:mb-0">
              <div className="absolute w-3 h-3 rounded-full bg-indigo-500 left-[-7px] top-1"></div>
              <div className="font-medium text-gray-200">{item.event}</div>
              <div className="text-gray-500 text-sm">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
} 

// To connect to backend use 
// useEffect(() => {
//  const fetchSession = async () => {
//    const res = await fetch(`http://localhost:8000/phishing/sessions/${sessionId}`);
//  const data = await res.json();
//    setSession(data);
//  };
//  fetchSession();
//}, [sessionId]);