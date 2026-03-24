import { useEffect, useState } from "react";
import TeacherHeader from "./TeacherHeader";
import TeacherStats from "./TeacherStats";
import TeacherStudentsPanel from "./TeacherStudentsPanel";
import MarksPanel from "./MarksPanel";
import AttendancePanel from "./AttendancePanel";
import TeacherFeedbackPanel from "./TeacherFeedbackPanel";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const teacherId = user?.id;

  const [activeTab, setActiveTab] = useState("students");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // ✅ Load teacher's real subjects from DB
  useEffect(() => {
    if (!teacherId) return;
    apiRequest(`/teacher/${teacherId}/subjects`)
      .then((data) => {
        setSubjects(data);
        if (data.length > 0) setSelectedSubject(data[0]);
      })
      .catch(console.error);
  }, [teacherId]);

  return (
    <div className="bg-secondary min-h-screen">
      <TeacherHeader />

      <main className="px-10 py-8">
        <h1 className="text-3xl font-semibold text-textDark mb-4">
          Teacher Dashboard
        </h1>

        {/* ✅ Real subject/class dropdown */}
        <div className="mb-6 max-w-md">
          <label className="text-sm text-gray-600 mb-1 block">
            Select Subject
          </label>
          {subjects.length === 0 ? (
            <p className="text-sm text-gray-400">No subjects assigned yet</p>
          ) : (
            <select
              className="border rounded-lg p-2 w-full"
              value={selectedSubject?.subject_id || ""}
              onChange={(e) =>
                setSelectedSubject(subjects.find(s => s.subject_id === Number(e.target.value)))
              }
            >
              {subjects.map((s) => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.subject} ({s.department})
                </option>
              ))}
            </select>
          )}
        </div>

        <TeacherStats teacherId={teacherId} />

        {/* Tabs */}
        <div className="flex gap-6 border-b mt-8 mb-6">
          <Tab label="Students"   active={activeTab === "students"}   onClick={() => setActiveTab("students")} />
          <Tab label="Attendance" active={activeTab === "attendance"} onClick={() => setActiveTab("attendance")} />
          <Tab label="Marks Entry" active={activeTab === "marks"}     onClick={() => setActiveTab("marks")} />
          <Tab label="Feedback"   active={activeTab === "feedback"}   onClick={() => setActiveTab("feedback")} />
        </div>

        {/* Panels */}
        {activeTab === "students"   && <TeacherStudentsPanel teacherId={teacherId} selectedSubject={selectedSubject} />}
        {activeTab === "attendance" && <AttendancePanel      teacherId={teacherId} selectedSubject={selectedSubject} />}
        {activeTab === "marks"      && <MarksPanel           teacherId={teacherId} selectedSubject={selectedSubject} />}
        {activeTab === "feedback"   && <TeacherFeedbackPanel teacherId={teacherId} />}
      </main>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 font-medium ${
        active ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}