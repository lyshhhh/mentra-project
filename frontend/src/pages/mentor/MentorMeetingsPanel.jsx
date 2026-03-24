import { useState } from "react";

const students = [
  "All Students",
  "Riya D’Silva",
  "Kevin Rodrigues",
  "Alisha Fernandes"
];

const initialMeetings = [
  {
    id: 1,
    student: "All Students",
    date: "2026-01-10",
    time: "10:00",
    topic: "Introduction to Python Programming",
    status: "Scheduled"
  },
  {
    id: 2,
    student: "Riya D’Silva",
    date: "2026-01-12",
    time: "14:30",
    topic: "Loops & Conditional Statements",
    status: "Scheduled"
  },
  {
    id: 3,
    student: "Kevin Rodrigues",
    date: "2026-01-14",
    time: "11:00",
    topic: "SQL Basics – Select Queries",
    status: "Completed"
  }
];

export default function MentorMeetingsPanel() {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [form, setForm] = useState({
    student: "All Students",
    date: "",
    time: "",
    topic: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const scheduleMeeting = () => {
    if (!form.date || !form.time || !form.topic) {
      alert("Please fill all fields");
      return;
    }

    setMeetings([
      {
        id: Date.now(),
        ...form,
        status: "Scheduled"
      },
      ...meetings
    ]);

    setForm({
      student: "All Students",
      date: "",
      time: "",
      topic: ""
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* Schedule Meeting */}
      <div className="bg-white border border-borderSoft rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Schedule Meeting</h3>

        <div className="space-y-4">
          <select
            name="student"
            value={form.student}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            {students.map((s) => (
              <option key={s}>{s}</option>
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

        <div className="space-y-4">
          {meetings.map((m) => (
            <div
              key={m.id}
              className="border rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{m.topic}</p>
                <p className="text-xs text-gray-500">
                  {m.student} • {m.date} • {m.time}
                </p>
              </div>

              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  m.status === "Completed"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
