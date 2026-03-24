import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

export default function AnalyticsPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiRequest("/admin/analytics").then(setData);
  }, []);

  if (!data) return null;

  return (
    <div className="mt-6 space-y-6">

      {/* TOP STATS */}
      <div className="grid grid-cols-4 gap-6">
        <Stat title="Students" value={data.students} />
        <Stat title="Teachers" value={data.teachers} />
        <Stat title="Mentors" value={data.mentors} />
        <Stat title="Subjects" value={data.subjects} />
      </div>

      {/* ATTENDANCE OVERVIEW */}
      <div className="bg-white p-6 rounded-2xl">
        <h3 className="font-semibold mb-4">Attendance Overview</h3>

        <div className="space-y-4">
          <Bar label="Above 80%" value={data.green} color="bg-green-500" />
          <Bar label="50% – 80%" value={data.orange} color="bg-orange-400" />
          <Bar label="Below 50%" value={data.red} color="bg-red-500" />
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl border">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function Bar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded">
        <div
          className={`h-2 rounded ${color}`}
          style={{ width: `${Math.min(value * 10, 100)}%` }}
        />
      </div>
    </div>
  );
}
