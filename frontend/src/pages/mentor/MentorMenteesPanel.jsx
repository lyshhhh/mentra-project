import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import toast from "react-hot-toast";

export default function MentorMeetingsPanel({ mentorId }) {
  const [meetings, setMeetings] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [form, setForm] = useState({
    student_id: "all",
    date: "",
    time: "",
    topic: ""
  });

  useEffect(() => {
    if (!mentorId) return;
    // Load mentees for dropdown
    apiRequest(`/mentor/${mentorId}/mentees`)
      .then(setMentees)
      .catch(console.error);
    // Load meetings
    apiRequest(`/mentor/${mentorId}/meetings`)
      .then(setMeetings)
      .catch(console.error);
  }, [mentorId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const scheduleMeeting = async () => {
    if (!form.date || !form.time || !form.topic) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await apiRequest("/mentor/meetings", "POST", {
        ...form,
        mentor_id: mentorId
      });

      setMeetings([res.meeting, ...meetings]);
      setForm({ student_id: "all", date: "", time: "", topic: "" });
      toast.success("Meeting scheduled successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* Schedule Meeting */}
      <div className="bg-white border border-borderSoft rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Schedule Meeting</h3>

        <div className="space-y-4">
          <select
            name="student_id"
            value={form.student_id}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="all">All Students</option>
            {mentees.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            name="topic"
            placeholder="Meeting topic"
            value={form.topic}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <button
            onClick={scheduleMeeting}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primaryDark"
          >
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* Meetings List */}
      <div className="bg-white border border-borderSoft rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Meetings</h3>

        {meetings.length === 0 && (
          <p className="text-sm text-gray-500">No meetings scheduled yet</p>
        )}

        <div className="space-y-4">
          {meetings.map((m) => (
            <div
              key={m.id}
              className="border rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{m.topic}</p>
                <p className="text-xs text-gray-500">
                  {m.student_name || "All Students"} • {m.date} • {m.time}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  m.status === "Completed"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {m.status || "Scheduled"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}