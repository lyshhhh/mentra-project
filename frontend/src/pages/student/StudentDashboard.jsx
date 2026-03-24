import { useEffect, useState } from "react";
import StudentHeader from "./StudentHeader";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");

  const [profile, setProfile]       = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks]           = useState([]);
  const [feedbacks, setFeedbacks]   = useState([]);
  const [meetings, setMeetings]     = useState([]);
  const [petition, setPetition]     = useState("");
  const [sending, setSending]       = useState(false);

  const studentId = user?.id;

  // ─── Fetch all data on mount ───────────────────────────────────────────────
  useEffect(() => {
    if (!studentId) return;

    apiRequest(`/student/${studentId}/profile`)
      .then(setProfile).catch(console.error);

    apiRequest(`/student/${studentId}/attendance`)
      .then(setAttendance).catch(console.error);

    apiRequest(`/student/${studentId}/marks`)
      .then(setMarks).catch(console.error);

    apiRequest(`/student/${studentId}/feedbacks`)
      .then(setFeedbacks).catch(console.error);

    apiRequest(`/student/${studentId}/meetings`)
      .then(setMeetings).catch(console.error);
  }, [studentId]);

  // ─── Computed stats ────────────────────────────────────────────────────────
  const totalDays     = attendance.length;
  const presentDays   = attendance.filter(a => a.status === "Present").length;
  const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const avgMarks = marks.length > 0
    ? Math.round(marks.reduce((sum, m) => sum + (m.marks / m.max_marks) * 100, 0) / marks.length)
    : 0;

  const upcomingMeetings = meetings.filter(m => m.status === "Scheduled").length;

  // ─── Submit petition ───────────────────────────────────────────────────────
  const submitPetition = async () => {
    if (!petition.trim()) return;
    setSending(true);
    try {
      await apiRequest("/student/petition", "POST", {
        student_id: studentId,
        message: petition
      });
      toast.success("Petition sent to mentor!");
      setPetition("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  // ─── Group marks by subject ────────────────────────────────────────────────
  const subjectMap = {};
  marks.forEach(m => {
    if (!subjectMap[m.subject]) subjectMap[m.subject] = [];
    subjectMap[m.subject].push(m);
  });

  return (
    <div className="bg-secondary min-h-screen">
      <StudentHeader />

      <main className="px-10 py-8">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold">
            Welcome back, {profile?.name || user?.name}!
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Roll No: {profile?.roll_no} | Class {profile?.class} - {profile?.section}
          </p>
          <p className="text-sm text-gray-600">
            Your Mentor: {profile?.mentor_name || "Not assigned yet"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Stat title="Attendance"        value={`${attendancePct}%`} color={attendancePct < 75 ? "text-red-600" : "text-green-600"} />
          <Stat title="Average Marks"     value={`${avgMarks}%`} />
          <Stat title="Backlogs"          value={profile?.backlog ?? 0} color={profile?.backlog > 0 ? "text-red-600" : "text-green-600"} />
          <Stat title="Upcoming Meetings" value={upcomingMeetings} />
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-6">
          {["overview","marks","attendance","feedback","meetings"].map(t => (
            <Tab key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} active={tab === t} onClick={() => setTab(t)} />
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card title="Performance Overview">
              <Progress label="Attendance"    value={attendancePct} color={attendancePct < 75 ? "bg-red-500" : "bg-green-500"} />
              <Progress label="Average Marks" value={avgMarks}      color="bg-blue-500" />
            </Card>

            <Card title="Recent Feedback">
              {feedbacks.length === 0 && <p className="text-sm text-gray-500">No feedback yet</p>}
              {feedbacks.slice(0, 3).map((f, i) => (
                <div key={i} className="bg-green-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium">{f.from_role}</p>
                  <p className="text-sm">{f.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{f.created_at?.slice(0, 10)}</p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── Marks ── */}
        {tab === "marks" && (
          <Card title="My Marks">
            {marks.length === 0 && <p className="text-sm text-gray-500">No marks entered yet</p>}
            {Object.keys(subjectMap).map(subject => (
              <div key={subject} className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">{subject}</h4>
                <table className="w-full text-sm">
                  <thead className="border-b text-gray-500">
                    <tr>
                      <th className="text-left py-2">Exam Type</th>
                      <th>Marks</th>
                      <th>Max</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectMap[subject].map((m, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2">{m.exam_type}</td>
                        <td className="text-center">{m.marks}</td>
                        <td className="text-center">{m.max_marks}</td>
                        <td className={`text-center font-medium ${
                          (m.marks / m.max_marks) * 100 < 40 ? "text-red-600" : "text-green-600"
                        }`}>
                          {((m.marks / m.max_marks) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </Card>
        )}

        {/* ── Attendance ── */}
        {tab === "attendance" && (
          <Card title="My Attendance">
            <Progress label={`Overall Attendance (${presentDays}/${totalDays} days)`} value={attendancePct} color={attendancePct < 75 ? "bg-red-500" : "bg-green-500"} />

            {attendancePct < 75 && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                ⚠️ Your attendance is below 75%. Please attend classes regularly.
              </div>
            )}

            <div className="mt-6 max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-gray-500 sticky top-0 bg-white">
                  <tr>
                    <th className="text-left py-2">Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.slice().reverse().map((a, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{a.date}</td>
                      <td className={`text-center font-medium ${a.status === "Present" ? "text-green-600" : "text-red-600"}`}>
                        {a.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ── Feedback ── */}
        {tab === "feedback" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card title="Received Feedback">
              {feedbacks.length === 0 && <p className="text-sm text-gray-500">No feedback yet</p>}
              {feedbacks.map((f, i) => (
                <div key={i} className="bg-green-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium">{f.from_role}</p>
                  <p className="text-sm">{f.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{f.created_at?.slice(0, 10)}</p>
                </div>
              ))}
            </Card>

            <Card title="Send Petition to Mentor">
              <textarea
                className="w-full border rounded-lg p-3 text-sm"
                rows="4"
                placeholder="Write your petition or message to mentor..."
                value={petition}
                onChange={(e) => setPetition(e.target.value)}
              />
              <button
                onClick={submitPetition}
                disabled={sending}
                className="mt-3 bg-primary text-white px-6 py-2 rounded-lg w-full"
              >
                {sending ? "Sending..." : "Send Petition"}
              </button>
            </Card>
          </div>
        )}

        {/* ── Meetings ── */}
        {tab === "meetings" && (
          <Card title="Mentor Meetings">
            {meetings.length === 0 && <p className="text-sm text-gray-500">No meetings scheduled yet</p>}
            <div className="space-y-3">
              {meetings.map((m, i) => (
                <div key={i} className="bg-green-50 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{m.topic}</p>
                    <p className="text-sm text-gray-600">{m.date} at {m.time}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    m.status === "Completed"
                      ? "bg-green-200 text-green-700"
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

      </main>
    </div>
  );
}

/* ─── Small Components ─────────────────────────────────────────────────────── */

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

function Stat({ title, value, color = "text-gray-800" }) {
  return (
    <div className="bg-white rounded-2xl p-6 border">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-semibold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-6 border">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Progress({ label, value, color = "bg-green-500" }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded">
        <div className={`h-2 rounded ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}