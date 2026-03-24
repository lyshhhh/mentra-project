import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

export default function MentorStats({ mentorId }) {
  const [stats, setStats] = useState({
    mentees: 0,
    lowAttendance: 0,
    backlogs: 0,
    meetings: 0,
    parents: 0
  });

  useEffect(() => {
    if (!mentorId) return;
    apiRequest(`/mentor/${mentorId}/stats`)
      .then(setStats)
      .catch(console.error);
  }, [mentorId]);

  const cards = [
    { label: "My Mentees",        value: stats.mentees },
    { label: "Low Attendance",    value: stats.lowAttendance },
    { label: "Backlogs",          value: stats.backlogs },
    { label: "Meetings Scheduled",value: stats.meetings },
    { label: "Parent Details",    value: stats.parents }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      {cards.map((s) => (
        <div
          key={s.label}
          className="bg-white border border-borderSoft rounded-2xl p-6 text-left"
        >
          <p className="text-sm text-gray-500">{s.label}</p>
          <p className="text-2xl font-semibold mt-2">{s.value}</p>
        </div>
      ))}
    </div>
  );
}