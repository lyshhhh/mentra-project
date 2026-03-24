import { useState } from "react";

const marksData = {
  "Sem 1": [
    {
      subject: "Programming in Python",
      exam: "Midterm",
      obtained: 42,
      max: 50,
      date: "2025-09-15"
    },
    {
      subject: "DBMS",
      exam: "Internal",
      obtained: 18,
      max: 20,
      date: "2025-09-18"
    }
  ],
  "Sem 2": [
    {
      subject: "Computer Networks",
      exam: "Endsem",
      obtained: 84,
      max: 100,
      date: "2026-01-05"
    }
  ]
};

export default function StudentMarksPanel() {
  const [activeSem, setActiveSem] = useState("Sem 1");

  return (
    <div className="bg-white border border-borderSoft rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">My Marks</h3>

        {/* Semester Toggle */}
        <div className="flex gap-2">
          {Object.keys(marksData).map((sem) => (
            <button
              key={sem}
              onClick={() => setActiveSem(sem)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                activeSem === sem
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {sem}
            </button>
          ))}
        </div>
      </div>

      {/* Marks Table */}
      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left py-2">Subject</th>
            <th>Exam</th>
            <th>Marks</th>
            <th>Percentage</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {marksData[activeSem].map((m, index) => {
            const percentage = ((m.obtained / m.max) * 100).toFixed(1);

            return (
              <tr key={index} className="border-b last:border-none">
                <td className="py-3">{m.subject}</td>
                <td className="text-center">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                    {m.exam}
                  </span>
                </td>
                <td className="text-center">
                  {m.obtained}/{m.max}
                </td>
                <td className="text-center">
                  <span
                    className={`font-medium ${
                      percentage >= 75
                        ? "text-green-600"
                        : percentage >= 50
                        ? "text-orange-500"
                        : "text-red-600"
                    }`}
                  >
                    {percentage}%
                  </span>
                </td>
                <td className="text-center text-gray-500">
                  {m.date}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}