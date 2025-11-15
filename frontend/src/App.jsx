import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import AttackView from "./pages/AttackView";
import BECFlags from "./pages/BECFlags";
import Navbar from "./components/Navbar";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div>
      <Navbar setPage={setPage} />
      <div className="p-4">
        {page === "dashboard" && <Dashboard />}
        {page === "alerts" && <Alerts />}
        {page === "attacks" && <AttackView />}
        {page === "bec" && <BECFlags />}
      </div>
    </div>
  );
}
