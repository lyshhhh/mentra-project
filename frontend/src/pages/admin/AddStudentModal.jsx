import { useState } from "react";

export default function AddStudentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    rollNo: "",
    name: "",
    email: "",
    className: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-textDark mb-4">
          Add Student
        </h3>

        <form onSubmit={submit} className="space-y-4">
          <input
            name="rollNo"
            placeholder="Roll Number"
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            name="name"
            placeholder="Student Name"
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            name="className"
            placeholder="Class (e.g. CS-2024)"
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <div className="flex justify-end gap-3 mt-4">
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
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
