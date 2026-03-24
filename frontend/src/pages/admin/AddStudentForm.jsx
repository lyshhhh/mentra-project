import React, { useState } from "react";

function AddStudentForm({ onAdd }) {
  const [form, setForm] = useState({
    roll_no: "",
    name: "",
    email: "",
    className: "",
    section: "",
    parentName: "",
    parentEmail: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAdd(form);

    setForm({
      roll_no: "",
      name: "",
      email: "",
      className: "",
      section: "",
      parentName: "",
      parentEmail: ""
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Add Student</h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          name="roll_no"
          placeholder="Roll Number"
          value={form.roll_no}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2"
        />

        <input
          name="name"
          placeholder="Student Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2"
        />

        <input
          name="className"
          placeholder="Class (e.g. TY BCA)"
          value={form.className}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2"
        />

        <input
          name="section"
          placeholder="Section (A/B)"
          value={form.section}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2"
        />

        <input
          name="parentName"
          placeholder="Parent Name"
          value={form.parentName}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2"
        />

        <input
          name="parentEmail"
          type="email"
          placeholder="Parent Email"
          value={form.parentEmail}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2"
        />

        <button
          type="submit"
          className="md:col-span-4 bg-primary text-white py-2 rounded-lg hover:bg-primaryDark"
        >
          Add Student
        </button>
      </form>
    </div>
  );
}

export default AddStudentForm;