import { useState, useEffect } from "react";
import { apiRequest } from "../../services/api";
import toast from "react-hot-toast";

function previewStaffEmail(name) {
  if (!name) return "";
  return name.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/).join(".") + "@mentra.edu";
}

export default function MentorsPanel({ onMentorAdded }) {
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [mentor, setMentor] = useState({ name: "", students: [] });

  useEffect(() => {
    apiRequest("/admin/mentors").then(setMentors).catch(console.error);
    apiRequest("/admin/students").then(setStudents).catch(console.error);
  }, []);

  const generatedEmail = previewStaffEmail(mentor.name);

  const toggleStudent = (id) => {
    setMentor((prev) => ({
      ...prev,
      students: prev.students.includes(id)
        ? prev.students.filter((s) => s !== id)
        : [...prev.students, id]
    }));
  };

  const saveMentor = async () => {
    if (!mentor.name) {
      toast.error("Please fill mentor name");
      return;
    }

    try {
      const res = await apiRequest("/admin/mentors", "POST", mentor);

      toast.success("Mentor added successfully");
      alert(
        `✅ Mentor Added!\n\nLogin:\nEmail: ${res.mentorLogin.email}\nPassword: ${res.mentorLogin.password}`
      );

      setMentors([...mentors, res.mentor]);
      setMentor({ name: "", students: [] });
      setShowForm(false);
      if (onMentorAdded) onMentorAdded();

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white border border-borderSoft rounded-2xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Mentors Management</h3>
        <button onClick={() => setShowForm(true)} className="bg-primary text-white px-4 py-2 rounded-lg">
          + Add Mentor
        </button>
      </div>

      {showForm && (
        <div className="border rounded-xl p-4 mb-6 bg-gray-50">
          <input
            placeholder="Mentor Name"
            className="border p-2 w-full mb-2"
            value={mentor.name}
            onChange={(e) => setMentor({ ...mentor, name: e.target.value })}
          />

          {/* ✅ Auto email preview */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-1 block">Auto-generated Mentra Email</label>
            <input
              value={generatedEmail || "Fill name to preview..."}
              readOnly
              className="border p-2 w-full bg-gray-50 text-gray-500 cursor-not-allowed rounded"
            />
          </div>

          <h4 className="font-medium mb-2">Assign Students</h4>
          <div className="space-y-2 mb-4">
            {students.length === 0 && <p className="text-sm text-gray-500">No students added yet</p>}
            {students.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={mentor.students.includes(s.id)}
                  onChange={() => toggleStudent(s.id)}
                />
                {s.name} ({s.roll_no})
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={saveMentor} className="bg-primary text-white px-4 py-2 rounded-lg">Save Mentor</button>
            <button onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {mentors.length === 0 && <p className="text-sm text-gray-500">No mentors added yet</p>}

      <div className="space-y-4">
        {mentors.map((m) => (
          <div key={m.id} className="border rounded-xl p-4">
            <p className="font-medium">{m.name}</p>
            <p className="text-sm text-gray-500">{m.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}