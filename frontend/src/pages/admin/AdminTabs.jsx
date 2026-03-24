export default function AdminTabs({ active, setActive }) {
  const tabs = ["Students", "Teachers", "Mentors", "Subjects", "Analytics"];
  return (
    <div className="inline-flex bg-white border border-borderSoft rounded-full p-1 mt-8">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => setActive(t)}
          className={`px-5 py-2 rounded-full text-sm transition
            ${active === t ? "bg-primarySoft text-primary font-medium" : "text-gray-500 hover:text-gray-700"}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
