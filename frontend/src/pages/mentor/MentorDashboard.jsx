import { useState } from "react";
import MentorHeader from "./MentorHeader";
import MentorStats from "./MentorStats";
import MentorMenteesPanel from "./MentorMenteesPanel";
import MentorPerformancePanel from "./MentorPerformancePanel";
import MentorMeetingsPanel from "./MentorMeetingsPanel";
import MentorFeedbackPanel from "./MentorFeedbackPanel";
import MentorAlertsPanel from "./MentorAlertsPanel";
import ParentContactsPanel from "./ParentContactsPanel";
import { useAuth } from "../../context/AuthContext";

export default function MentorDashboard() {
  const [activeTab, setActiveTab] = useState("mentees");
  const { user } = useAuth();
  const mentorId = user?.id;

  return (
    <div className="bg-secondary min-h-screen">
      <MentorHeader />

      <main className="px-10 py-8">
        <h1 className="text-3xl font-semibold text-textDark mb-6">
          Mentor Dashboard
        </h1>

        {/* ===== TOP STATS ===== */}
        <MentorStats mentorId={mentorId} />

        {/* ===== TABS ===== */}
        <div className="flex flex-wrap gap-6 border-b mb-6 mt-8">
          <Tab label="My Mentees"   active={activeTab === "mentees"}     onClick={() => setActiveTab("mentees")} />
          <Tab label="Performance"  active={activeTab === "performance"} onClick={() => setActiveTab("performance")} />
          <Tab label="Meetings"     active={activeTab === "meetings"}    onClick={() => setActiveTab("meetings")} />
          <Tab label="Feedback"     active={activeTab === "feedback"}    onClick={() => setActiveTab("feedback")} />
          <Tab label="Alerts"       active={activeTab === "alerts"}      onClick={() => setActiveTab("alerts")} />
          <Tab label="Parent Details" active={activeTab === "parents"}   onClick={() => setActiveTab("parents")} />
        </div>

        {/* ===== PANELS ===== */}
        {activeTab === "mentees"     && <MentorMenteesPanel     mentorId={mentorId} />}
        {activeTab === "performance" && <MentorPerformancePanel mentorId={mentorId} />}
        {activeTab === "meetings"    && <MentorMeetingsPanel    mentorId={mentorId} />}
        {activeTab === "feedback"    && <MentorFeedbackPanel    mentorId={mentorId} />}
        {activeTab === "alerts"      && <MentorAlertsPanel      mentorId={mentorId} />}
        {activeTab === "parents"     && <ParentContactsPanel    mentorId={mentorId} />}
      </main>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 font-medium transition ${
        active ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}