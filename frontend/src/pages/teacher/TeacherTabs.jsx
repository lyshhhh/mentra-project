export default function TeacherTabs({ active, setActive }) {
  const tabs = ["Students", "Attendance", "Marks", "Feedback", "Analytics"];

  return (
    <div className="inline-flex bg-white border rounded-full p-1 mt-6">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-5 py-2 rounded-full text-sm ${
            active === tab
              ? "bg-primary/10 text-primary font-medium"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
