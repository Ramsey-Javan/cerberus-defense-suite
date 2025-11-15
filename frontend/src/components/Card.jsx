import React from "react";

export default function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold">{title}</h2>
      <p className="text-2xl">{value}</p>
    </div>
  );
}
