import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

export default function TeacherStudentsPanel({ teacherId, selectedSubject }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!teacherId || !selectedSubject) return;
    apiRequest(`/teacher/${teacherId}/students/${selectedSubject.subject_id}`)
      .then(setStudents)
      .catch(console.error);
  }, [teacherId, selectedSubject]);

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-semibold mb-4">
        Students — {selectedSubject?.subject || ""}
      </h3>

      {students.length === 0 && (
        <p className="text-sm text-gray-500">No students found</p>
      )}

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left py-2">Roll No</th>
            <th className="text-left">Name</th>
            <th className="text-left">Class</th>
            <th className="text-left">Section</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b">
              <td className="py-3">{s.roll_no}</td>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {s.section}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}