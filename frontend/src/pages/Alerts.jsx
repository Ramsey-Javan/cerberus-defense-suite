
import React from "react";

const alerts = [
  {
    id: 1,
    type: "Phishing Attempt",
    message: "Decoy portal triggered by attacker.",
    time: "2 minutes ago",
    level: "high",
  },
  {
    id: 2,
    type: "Credential Anomaly",
    message: "Unusual typing pattern detected.",
    time: "10 minutes ago",
    level: "medium",
  },
  {
    id: 3,
    type: "BEC Suspicion",
    message: "Email flagged for suspicious urgency wording.",
    time: "1 hour ago",
    level: "high",
  },
];

const levelColor = {
  high: "bg-red-500",
  medium: "bg-orange-500",
  low: "bg-green-500",
};

export default function Alerts() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Live Alerts</h2>

      <div className="space-y-4">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="border rounded-lg p-4 shadow flex items-start gap-4"
          >
            <div className={`w-3 h-3 rounded-full mt-2 ${levelColor[a.level]}`} />

            <div>
              <h3 className="font-semibold">{a.type}</h3>
              <p className="text-sm text-gray-600">{a.message}</p>
              <p className="text-xs text-gray-400 mt-1">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
