import { useState } from "react";

export default function AddTeacherModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subjects: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        subjects: form.subjects.split(",").map(s => s.trim())
      })
    });

    const created = await res.json();
    onAdded(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
      <form onSubmit={submit} className="bg-white p-6 rounded-xl w-96 space-y-4">
        <h3 className="font-semibold">Add Teacher</h3>

        <input
          placeholder="Name"
          className="border w-full px-4 py-2 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="border w-full px-4 py-2 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Subjects (comma separated)"
          className="border w-full px-4 py-2 rounded"
          onChange={(e) => setForm({ ...form, subjects: e.target.value })}
        />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose}>Cancel</button>
          <button className="bg-primary text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
