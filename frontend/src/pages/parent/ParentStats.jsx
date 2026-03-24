import { useEffect, useState } from "react";

export default function ParentStats({ parentId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`/api/parent/${parentId}/stats`)
      .then(res => res.json())
      .then(setStats);
  }, [parentId]);

  if (!stats) return null;

  const cards = [
    { label: "Attendance", value: `${stats.attendance}%` },
    { label: "Backlogs", value: stats.backlogs },
    { label: "Unread Alerts", value: stats.alerts },
    { label: "Meetings", value: stats.meetings }
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mb-6">
      {cards.map(c => (
        <div key={c.label} className="bg-white border rounded-2xl p-6">
          <p className="text-sm text-gray-500">{c.label}</p>
          <p className="text-2xl font-semibold">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
