// src/components/AttackView.jsx
import React from "react";

export default function AttackView() {
  const attacker = {
    ip: "102.67.19.4",
    location: "Nairobi, Kenya",
    browser: "Chrome 118",
    os: "Windows 10",
    method: "Phishing Login Attempt",
    behavior: "Fast typing, password pasted",
    risk: "High",
  };

  const session = {
    id: "DEC-12933",
    page: "fake_portal",
    time: "3 mins ago",
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Attacker Session Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Attacker Info */}
        <div className="border p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Attacker Fingerprint</h3>

          <ul className="space-y-1 text-sm text-gray-700">
            <li><strong>IP:</strong> {attacker.ip}</li>
            <li><strong>Location:</strong> {attacker.location}</li>
            <li><strong>Browser:</strong> {attacker.browser}</li>
            <li><strong>Operating System:</strong> {attacker.os}</li>
            <li><strong>Method:</strong> {attacker.method}</li>
            <li><strong>Behavior:</strong> {attacker.behavior}</li>
            <li><strong>Risk Level:</strong> <span className="text-red-500">{attacker.risk}</span></li>
          </ul>
        </div>

        {/* Decoy Session */}
        <div className="border p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Decoy Session</h3>

          <ul className="space-y-1 text-sm text-gray-700">
            <li><strong>Session ID:</strong> {session.id}</li>
            <li><strong>Decoy Page:</strong> {session.page}</li>
            <li><strong>Triggered:</strong> {session.time}</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
