import { useState, useRef } from "react";
import AdminHeader from "./AdminHeader";
import AdminStats from "./AdminStats";
import AdminTabs from "./AdminTabs";
import AnalyticsPanel from "./AnalyticsPanel";
import StudentsPanel from "./StudentsPanel";
import TeachersPanel from "./TeachersPanel";
import MentorsPanel from "./MentorsPanel";
import AssignMentorPanel from "./AssignMentorPanel";
import SubjectsPanel from "./SubjectsPanel";

export default function AdminDashboard() {
  const [active, setActive] = useState("Students");
  const statsRef = useRef();

  // ✅ Called after any add (student/teacher/mentor) to refresh stats instantly
  const handleRefresh = () => {
    if (statsRef.current) statsRef.current.refresh();
  };

  return (
    <div className="bg-secondary min-h-screen">
      <AdminHeader />

      <main className="px-10 py-8">
        <h1 className="text-3xl font-semibold text-textDark mb-6">
          Admin Dashboard
        </h1>

        {/* ✅ ref lets us refresh stats from any panel */}
        <AdminStats ref={statsRef} />
        <AdminTabs active={active} setActive={setActive} />

        {/* Panels */}
        {active === "Students" && (
          <StudentsPanel onStudentAdded={handleRefresh} />
        )}

        {active === "Teachers" && (
          <TeachersPanel onTeacherAdded={handleRefresh} />
        )}

        {active === "Mentors" && (
          <MentorsPanel onMentorAdded={handleRefresh} />
        )}

        {active === "Analytics" && <AnalyticsPanel />}

        {active === "Assign" && <AssignMentorPanel />}

        {active === "Subjects" && <SubjectsPanel />}
      </main>
    </div>
  );
}