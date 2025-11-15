import React from "react";

export default function Navbar({ setPage }) {
  return (
    <nav className="bg-blue-600 text-white p-4 flex space-x-4">
      <button onClick={() => setPage("dashboard")}>Dashboard</button>
      <button onClick={() => setPage("alerts")}>Alerts</button>
      <button onClick={() => setPage("attacks")}>Decoy Sessions</button>
      <button onClick={() => setPage("bec")}>BEC Flags</button>
    </nav>
  );
}
