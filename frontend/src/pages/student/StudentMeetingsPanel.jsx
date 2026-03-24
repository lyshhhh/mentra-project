export default function StudentMeetingsPanel() {
  return (
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-semibold mb-4">Mentor Meetings</h3>

      <div className="bg-green-100 p-4 rounded-xl">
        <p className="font-medium">Career guidance and semester planning</p>
        <p className="text-sm">With: Dr. David Williams</p>
        <p className="text-sm">2025-10-10 · 10:00 AM</p>
        <span className="text-xs bg-green-200 px-3 py-1 rounded-full">
          Scheduled
        </span>
      </div>
    </div>
  );
}