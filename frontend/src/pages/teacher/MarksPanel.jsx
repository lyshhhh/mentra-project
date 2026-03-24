import { useState } from "react";
import AddMarksModal from "./AddMarksModal";
import toast from "react-hot-toast";

export default function MarksPanel() {
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    {
      id: 1,
      rollNo: "2305802",
      name: "Rohan Naik",
      subject: "Internet Technology"
    },
    {
      id: 2,
      rollNo: "2305834",
      name: "Siya Fernandes",
      subject: "Cloud Computing"
    },
    {
      id: 3,
      rollNo: "2305821",
      name: "Lean D’as",
      subject: "Cloud Computing"
    }
  ];

  const openModal = (student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const saveMarks = () => {
    toast.success("Marks added successfully");
    setOpen(false);
  };

  return (
    <div className="bg-white border border-borderSoft rounded-2xl p-6 mt-6">
      <h3 className="font-semibold mb-4">Marks Entry</h3>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left py-2">Roll No</th>
            <th>Name</th>
            <th>Subject</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b">
              <td className="py-3">{s.rollNo}</td>
              <td>{s.name}</td>
              <td>{s.subject}</td>
              <td>
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
          onClose={() => setOpen(false)}
          onSave={saveMarks}
        />
      )}
    </div>
  );
}
