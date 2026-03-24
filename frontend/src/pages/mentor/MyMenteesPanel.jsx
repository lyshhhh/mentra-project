import { useEffect, useState } from "react";

export default function MyMenteesPanel({ mentorId }) {
  const [mentees, setMentees] = useState([]);

  useEffect(() => {
    fetch(`/api/mentor/${mentorId}/mentees`)
      .then(res => res.json())
      .then(setMentees);
  }, [mentorId]);

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-semibold mb-4">My Mentees</h3>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Attendance</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {mentees.map(m => (
            <tr key={m.id} className="border-b">
              <td>{m.rollNo}</td>
              <td>{m.name}</td>
              <td className={m.attendance < 50 ? "text-red-600" : "text-green-600"}>
                {m.attendance}%
              </td>
              <td>{m.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
