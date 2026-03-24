import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

function getStatus(student) {
  if (student.attendance < 50 || student.backlog)
    return { label: "Critical", color: "bg-red-100 text-red-600 border-red-300" };
  if (student.attendance < 80 || student.avg_marks < 60)
    return { label: "Warning", color: "bg-orange-100 text-orange-600 border-orange-300" };
  return { label: "Good", color: "bg-green-100 text-green-600 border-green-300" };
}

export default function MentorAlertsPanel({ mentorId }) {
  const [mentees, setMentees] = useState([]);

  useEffect(() => {
    if (!mentorId) return;
    apiRequest(`/mentor/${mentorId}/mentees`)
      .then(setMentees)
      .catch(console.error);
  }, [mentorId]);

  return (
    <div className="bg-white border border-borderSoft rounded-2xl p-6">
      <h3 className="font-semibold mb-6">Student Alerts</h3>

      {mentees.length === 0 && (
        <p className="text-sm text-gray-500">No mentees assigned yet</p>
      )}

      <div className="space-y-4">
        {mentees.map((s) => {
          const status = getStatus(s);
          return (
            <div
              key={s.id}
              className={`border rounded-xl p-4 flex justify-between items-center ${status.color}`}
            >
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs">
                  Attendance: {s.attendance ?? 0}% • Marks: {s.avg_marks ?? 0}%
                </p>
              </div>
              <span className="text-sm font-semibold">{status.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p className="mb-1">Legend:</p>
        <p>🟢 Green — Safe (≥ 80%)</p>
        <p>🟠 Orange — Warning (50–79%)</p>
        <p>🔴 Red — Critical (&lt; 50% / Backlog)</p>
      </div>
    </div>
  );
}