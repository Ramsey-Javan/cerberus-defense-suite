import React from "react";
import Card from "../components/Card";

export default function Dashboard() {
  const mockData = [
    { title: "Active Decoy Sessions", value: 5 },
    { title: "High-Risk Logins", value: 2 },
    { title: "BEC Alerts", value: 1 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {mockData.map((item, i) => (
        <Card key={i} title={item.title} value={item.value} />
      ))}
    </div>
  );
}
