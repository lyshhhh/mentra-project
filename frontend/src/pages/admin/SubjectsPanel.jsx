import { useState } from "react";
import toast from "react-hot-toast";

export default function SubjectsPanel() {
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    year: "",
    division: ""
  });

  const addSubject = () => {
    if (!form.name || !form.year || !form.division) {
      toast.error("Please fill all subject details");
      return;
    }

    setSubjects([
      ...subjects,
      { ...form, id: Date.now() }
    ]);

    setForm({ name: "", year: "", division: "" });
    setShowForm(false);

    toast.success("Subject added successfully");
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    toast.success("Subject removed");
  };

  return (
    <div className="bg-white border border-borderSoft rounded-2xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Subjects Management</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          + Add Subject
        </button>
      </div>

      {/* ADD SUBJECT FORM */}
      {showForm && (
        <div className="border rounded-xl p-4 mb-6 bg-gray-50">
          <input
            placeholder="Subject Name"
            className="border p-2 w-full mb-3"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <select
              className="border p-2"
              value={form.year}
              onChange={(e) =>
                setForm({ ...form, year: e.target.value })
              }
            >
              <option value="">Select Year</option>
              <option>FY BCA</option>
              <option>SY BCA</option>
              <option>TY BCA</option>
            </select>

            <select
              className="border p-2"
              value={form.division}
              onChange={(e) =>
                setForm({ ...form, division: e.target.value })
              }
            >
              <option value="">Select Division</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={addSubject}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Save Subject
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SUBJECT LIST */}
      {subjects.length === 0 && (
        <p className="text-sm text-gray-500">
          No subjects added yet
        </p>
      )}

      <div className="space-y-3">
        {subjects.map((s) => (
          <div
            key={s.id}
            className="flex justify-between items-center border rounded-xl p-4"
          >
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-gray-500">
                {s.year} — Division {s.division}
              </p>
            </div>

            <button
              onClick={() => deleteSubject(s.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}