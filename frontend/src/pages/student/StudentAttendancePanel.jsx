export default function StudentAttendancePanel() {
  const subjects = [
    { name: "Mathematics", percent: 90 },
    { name: "Statistics", percent: 90 },
    { name: "Computer Sciencece", percent: 80 }
  ];

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-semibold mb-6">My Attendance</h3>

      <p className="mb-2 text-sm">Overall Attendance</p>
      <div className="h-3 bg-gray-200 rounded mb-6">
        <div className="h-3 bg-green-500 rounded w-[87%]" />
      </div>

      {subjects.map((s) => (
        <div key={s.name} className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>{s.name}</span>
            <span>{s.percent}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-green-500 rounded"
              style={{ width: `${s.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}