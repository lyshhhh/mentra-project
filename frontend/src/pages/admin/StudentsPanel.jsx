import { useState } from "react";
import { apiRequest } from "../../services/api";
import { toast } from "react-hot-toast";

// Auto-generate preview email same way as backend
function previewEmail(name, roll_no) {
  if (!name || !roll_no) return "";
  const first = name.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/)[0];
  return `${first}.${roll_no}@mentra.edu`;
}

export default function StudentsPanel({ onStudentAdded }) {
  const [form, setForm] = useState({
    name: "",
    roll_no: "",
    className: "",
    section: "",
    parentName: "",
    parentPhone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Auto-generated email preview
  const generatedEmail = previewEmail(form.name, form.roll_no);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiRequest("/admin/students", "POST", form);

      toast.success("Student added successfully");

      alert(
        `✅ Student Added!\n\n` +
        `Student Login:\nEmail: ${res.studentLogin.email}\nPassword: ${res.studentLogin.password}\n\n` +
        `Parent Login:\nEmail: ${res.parentLogin.email}\nPassword: ${res.parentLogin.password}`
      );

      setForm({
        name: "",
        roll_no: "",
        className: "",
        section: "",
        parentName: "",
        parentPhone: ""
      });

      if (onStudentAdded) onStudentAdded();

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl mt-6">
      <h3 className="font-semibold mb-4">Add Student</h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        <input
          name="name"
          placeholder="Student Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="roll_no"
          placeholder="Roll Number"
          value={form.roll_no}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* ✅ Auto-generated email preview */}
        <div className="col-span-2">
          <label className="text-xs text-gray-500 mb-1 block">
            Auto-generated Mentra Email
          </label>
          <input
            value={generatedEmail || "Fill name & roll no to preview..."}
            readOnly
            className="border p-2 rounded w-full bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        <input
          name="className"
          placeholder="Class (e.g. TY BCA)"
          value={form.className}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="section"
          placeholder="Section (A/B)"
          value={form.section}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <div className="col-span-2 border-t pt-4 mt-2">
          <p className="text-sm font-medium text-gray-600 mb-3">Parent Details</p>
        </div>

        <input
          name="parentName"
          placeholder="Parent Name"
          value={form.parentName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="parentPhone"
          placeholder="Parent Phone Number"
          value={form.parentPhone}
          onChange={handleChange}
          className="border p-2 rounded"
          type="tel"
          required
        />

        <button
          type="submit"
          className="col-span-2 bg-primary text-white py-2 rounded mt-2"
        >
          Add Student
        </button>

      </form>
    </div>
  );
}