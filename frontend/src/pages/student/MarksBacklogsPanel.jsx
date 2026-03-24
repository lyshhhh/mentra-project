import { useEffect, useState } from "react";

export default function MarksBacklogsPanel({ studentId }) {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    fetch(`/api/student/${studentId}/marks`)
      .then(res => res.json())
      .then(setMarks);
  }, [studentId]);

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-semibold mb-4">Marks & Backlogs</h3>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th>Subject</th>
            <th>Marks</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {marks.map(m => (
            <tr key={m.subject} className="border-b">
              <td>{m.subject}</td>
              <td>{m.marks}</td>
              <td className={m.marks < 40 ? "text-red-600" : "text-green-600"}>
                {m.marks < 40 ? "Backlog" : "Clear"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
