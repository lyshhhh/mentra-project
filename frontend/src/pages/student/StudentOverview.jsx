export default function StudentOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Performance Overview */}
      <div className="bg-white border border-borderSoft rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Performance Overview</h3>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Overall Attendance</p>
          <div className="h-2 bg-gray-200 rounded">
            <div className="h-2 bg-green-500 rounded w-[87%]" />
          </div>
          <p className="text-sm text-right mt-1">87%</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Average Marks</p>
          <div className="h-2 bg-gray-200 rounded">
            <div className="h-2 bg-blue-500 rounded w-[85%]" />
          </div>
          <p className="text-sm text-right mt-1">85%</p>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white border border-borderSoft rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Recent Feedback</h3>

        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
            <span className="text-xs font-medium text-green-700">Mentor</span>
            <p className="mt-1">
              Great progress overall. Focus on time management for better results.
            </p>
            <p className="text-xs text-gray-500 mt-1">2025-09-22</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
            <span className="text-xs font-medium text-green-700">Teacher</span>
            <p className="mt-1">
              Excellent performance in Mathematics. Keep up the good work!
            </p>
            <p className="text-xs text-gray-500 mt-1">2025-09-20</p>
          </div>
        </div>
      </div>

    </div>
  );
}