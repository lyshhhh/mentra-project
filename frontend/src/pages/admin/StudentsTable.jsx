import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import { toast } from "react-hot-toast";

export default function StudentsPanel() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    roll_no: "",
    class_name: "",
    session: ""
  });

  const fetchStudents = async () => {
    try {
      const data = await apiRequest("/admin/students");
      setStudents(data);
    } catch {
      toast.error("Failed to load students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest("/admin/students", "POST", form);
      toast.success("Student added successfully");
      alert("Auto password: " + res.autoPassword);
      setForm({
        name: "",
        email: "",
        roll_no: "",
        class_name: "",
        session: ""
      });
      fetchStudents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mt-6 space-y-6">

      {/* ADD STUDENT */}
      <div className="bg-white p-6 rounded-2xl">
        <h3 className="font-semibold mb-4">Add Student</h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="Name" onChange={handleChange} value={form.name} className="border p-2 rounded" />
          <input name="email" placeholder="Email" onChange={handleChange} value={form.email} className="border p-2 rounded" />
          <input name="roll_no" placeholder="Roll No" onChange={handleChange} value={form.roll_no} className="border p-2 rounded" />
          <input name="class_name" placeholder="Class" onChange={handleChange} value={form.class_name} className="border p-2 rounded" />
          <input name="session" placeholder="Session" onChange={handleChange} value={form.session} className="border p-2 rounded" />

          <button className="col-span-2 bg-primary text-white py-2 rounded">
            Add Student
          </button>
        </form>
      </div>

      {/* STUDENT LIST */}
      <div className="bg-white p-6 rounded-2xl">
        <h3 className="font-semibold mb-4">Students</h3>

        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left py-2">Name</th>
              <th>Email</th>
              <th>Roll</th>
              <th>Class</th>
              <th>Session</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-b">
                <td className="py-3">{s.name}</td>
                <td>{s.email}</td>
                <td>{s.roll_no}</td>
                <td>{s.class_name}</td>
                <td>{s.session}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
