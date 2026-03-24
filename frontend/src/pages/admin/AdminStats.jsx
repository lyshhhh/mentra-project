import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { apiRequest } from "../../services/api";

function StatCard({ title, value, icon, bg }) {
  return (
    <div className="bg-card border border-borderSoft rounded-2xl p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-semibold mt-1">
          {value ?? "—"}
        </p>
      </div>
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${bg}`}>
        {icon}
      </div>
    </div>
  );
}

const AdminStats = forwardRef((props, ref) => {
  const [stats, setStats] = useState(null);

  const fetchStats = () => {
    apiRequest("/admin/stats")
      .then(setStats)
      .catch(console.error);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // expose refresh to parent
  useImperativeHandle(ref, () => ({
    refresh: fetchStats
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Total Students"
        value={stats?.students}
        icon="👥"
        bg="bg-blue-500 text-white"
      />
      <StatCard
        title="Total Teachers"
        value={stats?.teachers}
        icon="📘"
        bg="bg-blue-400 text-white"
      />
      <StatCard
        title="Total Mentors"
        value={stats?.mentors}
        icon="🎓"
        bg="bg-indigo-500 text-white"
      />
      <StatCard
        title="Active Subjects"
        value={stats?.subjects ?? 0}
        icon="📈"
        bg="bg-sky-500 text-white"
      />
    </div>
  );
});

export default AdminStats;