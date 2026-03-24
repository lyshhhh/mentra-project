import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import toast from "react-hot-toast";

export default function AttendancePanel({ teacherId, selectedSubject }) {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  // ✅ Load students
  useEffect(() => {
    if (!teacherId || !selectedSubject) return;
    apiRequest(`/teacher/${teacherId}/students/${selectedSubject.subject_id}`)
      .then((data) => {
        setStudents(data);
        // Default all to Present
        setRecords(data.map(s => ({ student_id: s.id, name: s.name, roll_no: s.roll_no, status: "Present" })));
      })
      .catch(console.error);
  }, [teacherId, selectedSubject]);

  // ✅ When date changes, load existing attendance
  useEffect(() => {
    if (!date) return;
    apiRequest(`/teacher/attendance/${date}`)
      .then((existing) => {
        if (existing.length > 0) {
          setRecords(prev => prev.map(r => {
            const found = existing.find(e => e.student_id === r.student_id);
            return found ? { ...r, status: found.status } : r;
          }));
        }
      })
      .catch(console.error);
  }, [date]);

  const toggleAttendance = (studentId) => {
    setRecords(prev => prev.map(r =>
      r.student_id === studentId
        ? { ...r, status: r.status === "Present" ? "Absent" : "Present" }
        : r
    ));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      await apiRequest("/teacher/attendance", "POST", { records, date });
      toast.success("Attendance saved successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-borderSoft rounded-2xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Mark Attendance — {selectedSubject?.subject}</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm"
        />
      </div>

      {students.length === 0 && (
        <p className="text-sm text-gray-500">No students found</p>
      )}

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left py-2">Roll No</th>
            <th className="text-left">Name</th>
            <th className="text-left">Class</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.student_id} className="border-b">
              <td className="py-3">{r.roll_no}</td>
              <td>{r.name}</td>
              <td>{selectedSubject?.subject}</td>
              <td className="text-center">
                <button
                  onClick={() => toggleAttendance(r.student_id)}
                  className={`px-4 py-1 rounded-full text-xs font-medium ${
                    r.status === "Present"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {r.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={saveAttendance}
        disabled={saving || students.length === 0}
        className="mt-6 bg-primary text-white px-5 py-2 rounded-lg hover:bg-primaryDark disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Attendance"}
      </button>
    </div>
  );
}