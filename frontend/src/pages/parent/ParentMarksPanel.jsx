export default function ParentMarksPanel() {
  const marks = [
    {
      subject: "Programming in Python",
      exam: "Midterm",
      obtained: 42,
      max: 50,
      date: "2026-01-05"
    },
    {
      subject: "Database Management Systems (DBMS)",
      exam: "Internal",
      obtained: 18,
      max: 20,
      date: "2026-01-08"
    },
    {
      subject: "Computer Networks",
      exam: "Endsem",
      obtained: 84,
      max: 100,
      date: "2026-01-12"
    }
  ];

  return (
    <div className="bg-white border border-borderSoft rounded-2xl p-6">
      <h3 className="font-semibold text-lg mb-1">Marks Details</h3>
      <p className="text-sm text-gray-500 mb-4">
        Semester-wise exam marks and scores
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left py-3">Subject</th>
              <th className="text-left">Exam Type</th>
              <th className="text-center">Marks Obtained</th>
              <th className="text-center">Max Marks</th>
              <th className="text-center">Percentage</th>
              <th className="text-right">Date</th>
            </tr>
          </thead>

          <tbody>
            {marks.map((m, index) => {
              const percentage = (
                (m.obtained / m.max) *
                100
              ).toFixed(1);

              return (
                <tr key={index} className="border-b">
                  <td className="py-3">{m.subject}</td>
                  <td>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-xs">
                      {m.exam}
                    </span>
                  </td>
                  <td className="text-center">
                    {m.obtained}
                  </td>
                  <td className="text-center">
                    {m.max}
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
                  <td className="text-right text-gray-500">
                    {m.date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}