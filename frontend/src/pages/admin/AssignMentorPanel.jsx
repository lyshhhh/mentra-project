import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import { toast } from "react-hot-toast";

export default function AssignMentorPanel() {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("");

  useEffect(() => {
    apiRequest("/admin/students").then(setStudents);
    apiRequest("/admin/mentors").then(setMentors);
  }, []);

  const handleAssign = async () => {
    if (!selectedStudent || !selectedMentor) {
      toast.error("Select both student and mentor");
      return;
    }

    try {
      await apiRequest("/admin/assign-mentor", "POST", {
        student_id: selectedStudent,
        mentor_id: selectedMentor
      });

      toast.success("Mentor assigned successfully");
      setSelectedStudent("");
      setSelectedMentor("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl mt-6">
      <h3 className="font-semibold mb-6">Assign Mentor to Student</h3>

      <div className="grid grid-cols-2 gap-6">
        <select
          className="border p-2 rounded"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.roll_no})
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={selectedMentor}
          onChange={(e) => setSelectedMentor(e.target.value)}
        >
          <option value="">Select Mentor</option>
          {mentors.map(m => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.department})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAssign}
        className="mt-6 bg-primary text-white px-6 py-2 rounded"
      >
        Assign Mentor
      </button>
    </div>
  );
}
