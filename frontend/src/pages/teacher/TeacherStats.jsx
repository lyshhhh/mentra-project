import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

export default function TeacherStats({ teacherId }) {
  const [stats, setStats] = useState({
    students: 0, subjects: 0, marksEntered: 0, feedbackGiven: 0
  });

  useEffect(() => {
    if (!teacherId) return;
    apiRequest(`/teacher/${teacherId}/stats`)
      .then(setStats)
      .catch(console.error);
  }, [teacherId]);

  const cards = [
    { label: "My Students",      value: stats.students },
    { label: "Subjects Teaching", value: stats.subjects },
    { label: "Marks Entered",    value: stats.marksEntered },
    { label: "Feedback Given",   value: stats.feedbackGiven }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {cards.map(stat => (
        <div key={stat.label} className="bg-white border border-borderSoft rounded-2xl p-6">
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-2xl font-semibold mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}