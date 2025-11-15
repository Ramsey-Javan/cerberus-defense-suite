// src/components/BecFlags.jsx
import React from "react";

const flaggedEmails = [
  {
    id: 1,
    from: "cfo@company.com",
    to: "accounts@company.com",
    subject: "URGENT: Release Payment NOW",
    risk: "High",
    reason: "Urgency keywords + sender mismatch",
  },
  {
    id: 2,
    from: "hr-team@company.com",
    to: "staff@company.com",
    subject: "Update your payroll details",
    risk: "Medium",
    reason: "Possible credential harvesting",
  },
];

const color = {
  High: "text-red-500",
  Medium: "text-orange-500",
  Low: "text-green-500",
};

export default function BecFlags() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">BEC Flagged Emails</h2>

      <div className="space-y-4">
        {flaggedEmails.map((email) => (
          <div
            key={email.id}
            className="border rounded-lg p-4 shadow"
          >
            <h3 className="font-semibold">{email.subject}</h3>

            <p className="text-sm text-gray-600 mt-1">
              <strong>From:</strong> {email.from}
            </p>
            <p className="text-sm text-gray-600">
              <strong>To:</strong> {email.to}
            </p>

            <p className={`mt-2 font-semibold ${color[email.risk]}`}>
              Risk: {email.risk}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Reason: {email.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
