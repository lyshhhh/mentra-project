import { useEffect, useState } from "react";

export default function AttendancePanel({ parentId }) {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetch(`/api/parent/${parentId}/attendance`)
      .then(res => res.json())
      .then(setAttendance);
  }, [parentId]);

  const color = (v) =>
    v > 80 ? "text-green-600"
    : v >= 50 ? "text-orange-500"
    : "text-red-600";

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-semibold mb-4">Attendance</h3>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th>Subject</th>
            <th>Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map(a => (
            <tr key={a.subject} className="border-b">
              <td>{a.subject}</td>
              <td className={color(a.percentage)}>{a.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
