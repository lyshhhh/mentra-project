export default function StudentStats() {
  const stats = [
    { label: "Attendance", value: "87%" },
    { label: "Average Marks", value: "85.0%" },
    { label: "Backlogs", value: "0" },
    { label: "Upcoming Meetings", value: "1" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white border rounded-2xl p-6"
        >
          <p className="text-sm text-gray-500">{s.label}</p>
          <p className="text-2xl font-semibold mt-2">{s.value}</p>
        </div>
      ))}
    </div>
  );
}