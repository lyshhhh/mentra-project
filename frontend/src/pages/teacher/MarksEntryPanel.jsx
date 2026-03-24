import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import AddMarksModal from "./AddMarksModal";
import toast from "react-hot-toast";

export default function MarksPanel({ teacherId, selectedSubject }) {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (!teacherId || !selectedSubject) return;
    apiRequest(`/teacher/${teacherId}/students/${selectedSubject.subject_id}`)
      .then(setStudents)
      .catch(console.error);
  }, [teacherId, selectedSubject]);

  const openModal = (student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const saveMarks = async (marksData) => {
    try {
      await apiRequest("/teacher/marks", "POST", {
        student_id: selectedStudent.id,
        subject: selectedSubject.subject,
        exam_type: marksData.exam_type,
        marks: marksData.marks,
        max_marks: marksData.max_marks
      });
      toast.success("Marks added successfully");
      setOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white border border-borderSoft rounded-2xl p-6 mt-6">
      <h3 className="font-semibold mb-4">Marks Entry — {selectedSubject?.subject}</h3>

      {students.length === 0 && (
        <p className="text-sm text-gray-500">No students found</p>
      )}

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left py-2">Roll No</th>
            <th className="text-left">Name</th>
            <th className="text-left">Subject</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b">
              <td className="py-3">{s.roll_no}</td>
              <td>{s.name}</td>
              <td>{selectedSubject?.subject}</td>
              <td className="text-center">
                <button
                  onClick={() => openModal(s)}
                  className="bg-primary text-white px-3 py-1 rounded-lg text-xs hover:bg-primaryDark"
                >
                  Add Marks
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <AddMarksModal
          student={selectedStudent}
          subject={selectedSubject?.subject}
          onClose={() => setOpen(false)}
          onSave={saveMarks}
        />
      )}
    </div>
  );
}