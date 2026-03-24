import { useState, useEffect } from "react";
import { apiRequest } from "../../services/api";
import toast from "react-hot-toast";

function previewStaffEmail(name) {
  if (!name) return "";
  return name.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/).join(".") + "@mentra.edu";
}

export default function TeachersPanel({ onTeacherAdded }) {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [teacher, setTeacher] = useState({ name: "", subjects: [] });

  useEffect(() => {
    apiRequest("/admin/teachers").then(setTeachers).catch(console.error);
  }, []);

  const generatedEmail = previewStaffEmail(teacher.name);

  const addSubjectRow = () => {
    setTeacher({ ...teacher, subjects: [...teacher.subjects, { subject: "", year: "", division: "" }] });
  };

  const updateSubject = (index, field, value) => {
    const updated = [...teacher.subjects];
    updated[index][field] = value;
    setTeacher({ ...teacher, subjects: updated });
  };

  const saveTeacher = async () => {
    if (!teacher.name || teacher.subjects.length === 0) {
      toast.error("Please complete all fields");
      return;
    }

    try {
      const res = await apiRequest("/admin/teachers", "POST", teacher);

      toast.success("Teacher added successfully");
      alert(
        `✅ Teacher Added!\n\nLogin:\nEmail: ${res.teacherLogin.email}\nPassword: ${res.teacherLogin.password}`
      );

      setTeachers([...teachers, res.teacher]);
      setTeacher({ name: "", subjects: [] });
      setShowForm(false);
      if (onTeacherAdded) onTeacherAdded();

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white border rounded-2xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Teachers & Subjects</h3>
        <button onClick={() => setShowForm(true)} className="bg-primary text-white px-4 py-2 rounded-lg">
          + Add Teacher
        </button>
      </div>

      {showForm && (
        <div className="border rounded-xl p-4 mb-6 bg-gray-50">
          <input
            placeholder="Teacher Name"
            className="border p-2 w-full mb-2"
            value={teacher.name}
            onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
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

          <h4 className="font-medium mb-2">Subject Mapping</h4>

          {teacher.subjects.map((s, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input
                placeholder="Subject Name"
                className="border p-2"
                value={s.subject}
                onChange={(e) => updateSubject(i, "subject", e.target.value)}
              />
              <select className="border p-2" value={s.year} onChange={(e) => updateSubject(i, "year", e.target.value)}>
                <option value="">Year</option>
                <option>FY BCA</option>
                <option>SY BCA</option>
                <option>TY BCA</option>
              </select>
              <select className="border p-2" value={s.division} onChange={(e) => updateSubject(i, "division", e.target.value)}>
                <option value="">Division</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>
          ))}

          <button onClick={addSubjectRow} className="text-sm text-primary mb-4">+ Add Another Subject</button>

          <div className="flex gap-3">
            <button onClick={saveTeacher} className="bg-primary text-white px-4 py-2 rounded-lg">Save</button>
            <button onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {teachers.length === 0 && <p className="text-sm text-gray-500">No teachers added yet</p>}

      <div className="space-y-4">
        {teachers.map((t) => (
          <div key={t.id} className="border rounded-xl p-4">
            <p className="font-medium">{t.name}</p>
            <p className="text-sm text-gray-500">{t.email}</p>
            {t.subjects && (
              <div className="mt-2 text-sm">
                {t.subjects.map((s, i) => (
                  <p key={i}>• {s.subject} — {s.year} ({s.division})</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}