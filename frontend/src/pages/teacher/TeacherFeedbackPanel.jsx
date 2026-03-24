import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import toast from "react-hot-toast";

export default function TeacherFeedbackPanel({ teacherId }) {
  const [students, setStudents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!teacherId) return;
    // Load all students
    apiRequest(`/teacher/${teacherId}/students/0`)
      .then(setStudents)
      .catch(console.error);

    // Load feedback given by this teacher
    apiRequest(`/teacher/${teacherId}/feedback`)
      .then(setFeedbacks)
      .catch(console.error);
  }, [teacherId]);

  const submitFeedback = async () => {
    if (!selectedStudent || !message.trim()) {
      toast.error("Please select student and write feedback");
      return;
    }
    setSaving(true);
    try {
      await apiRequest("/teacher/feedback", "POST", {
        from_user_id: teacherId,
        student_id: selectedStudent,
        message
      });
      toast.success("Feedback submitted successfully!");
      setMessage("");
      setSelectedStudent("");

      // Refresh feedback list
      apiRequest(`/teacher/${teacherId}/feedback`).then(setFeedbacks);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">

      {/* Give Feedback */}
      <div className="bg-white border border-borderSoft rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Give Feedback to Student</h3>
        <p className="text-xs text-gray-400 mb-4">
          This feedback will be visible to the student, their mentor, and their parent.
        </p>

        <div className="space-y-4">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.roll_no})
              </option>
            ))}
          </select>

          <textarea
            placeholder="Write feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-4 py-2"
          />

          <button
            onClick={submitFeedback}
            disabled={saving}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primaryDark disabled:opacity-50"
          >
            {saving ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>

      {/* Previous Feedback */}
      <div className="bg-white border border-borderSoft rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Previously Given Feedback</h3>

        {feedbacks.length === 0 && (
          <p className="text-sm text-gray-500">No feedback given yet</p>
        )}

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {feedbacks.map((f) => (
            <div key={f.id} className="border rounded-xl p-3 bg-gray-50">
              <p className="font-medium text-sm">{f.student_name}</p>
              <p className="text-sm text-gray-600 mt-1">{f.message}</p>
              <p className="text-xs text-gray-400 mt-1">{f.created_at?.slice(0, 10)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}