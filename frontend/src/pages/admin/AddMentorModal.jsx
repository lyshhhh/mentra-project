import { useState } from "react";

export default function AddMentorModal({ students, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    assignedStudents: []
  });

  const toggleStudent = (rollNo) => {
    setForm((prev) => ({
      ...prev,
      assignedStudents: prev.assignedStudents.includes(rollNo)
        ? prev.assignedStudents.filter((s) => s !== rollNo)
        : [...prev.assignedStudents, rollNo]
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-textDark mb-4">
          Add Mentor
        </h3>

        <form onSubmit={submit} className="space-y-4">
          <input
            placeholder="Mentor Name"
            required
            className="w-full border rounded-lg px-4 py-2"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border rounded-lg px-4 py-2"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div>
            <p className="text-sm font-medium mb-2">
              Assign Students
            </p>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
              {students.map((s) => (
                <label
                  key={s.rollNo}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.assignedStudents.includes(s.rollNo)}
                    onChange={() => toggleStudent(s.rollNo)}
                  />
                  {s.name} ({s.rollNo})
                </label>
              ))}

              {students.length === 0 && (
                <p className="text-sm text-gray-400">
                  No students available
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark"
            >
              Add Mentor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
