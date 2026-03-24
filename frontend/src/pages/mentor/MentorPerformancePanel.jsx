import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

export default function MentorPerformancePanel({ mentorId }) {
  const [mentees, setMentees] = useState([]);

  useEffect(() => {
    if (!mentorId) return;
    apiRequest(`/mentor/${mentorId}/mentees`)
      .then(setMentees)
      .catch(console.error);
  }, [mentorId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mentees.length === 0 && (
        <p className="text-sm text-gray-500">No mentees assigned yet</p>
      )}

      {mentees.map((s) => (
        <div key={s.id} className="bg-white border border-borderSoft rounded-2xl p-6">
          <h4 className="font-semibold mb-4">{s.name}</h4>

          {/* Attendance */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Attendance</span>
              <span className={s.attendance < 80 ? "text-red-600" : "text-green-600"}>
                {s.attendance ?? 0}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className={`h-2 rounded ${s.attendance < 80 ? "bg-red-500" : "bg-green-500"}`}
                style={{ width: `${s.attendance ?? 0}%` }}
              />
            </div>
          </div>

          {/* Marks */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Average Marks</span>
              <span className="text-blue-600">{s.avg_marks ?? 0}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{ width: `${s.avg_marks ?? 0}%` }}
              />
            </div>
          </div>

          {/* Backlog */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm">Backlog</span>
            {s.backlog ? (
              <span className="text-red-600 text-sm font-medium">Yes</span>
            ) : (
              <span className="text-green-600 text-sm font-medium">No</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}