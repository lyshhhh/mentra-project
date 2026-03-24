import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import toast from "react-hot-toast";

export default function MentorFeedbackPanel({ mentorId }) {
  const [mentees, setMentees] = useState([]);
  const [studentFeedbacks, setStudentFeedbacks] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!mentorId) return;
    apiRequest(`/mentor/${mentorId}/mentees`)
      .then(setMentees)
      .catch(console.error);
    apiRequest(`/mentor/${mentorId}/student-feedbacks`)
      .then(setStudentFeedbacks)
      .catch(console.error);
  }, [mentorId]);

  const submitFeedback = async () => {
    if (!selectedStudent || !message) {
      toast.error("Please select student and write feedback");
      return;
    }

    try {
      await apiRequest("/mentor/feedback", "POST", {
        student_id: selectedStudent,
        mentor_id: mentorId,
        message
      });

      toast.success("Feedback submitted successfully");
      setMessage("");
      setSelectedStudent("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* Mentor → Student Feedback */}
      <div className="bg-white border border-borderSoft rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Give Feedback to Student</h3>

        <div className="space-y-4">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Student</option>
            {mentees.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
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
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primaryDark"
          >
            Submit Feedback
          </button>
        </div>
      </div>

      {/* Student → Mentor Feedback */}
      <div className="bg-white border border-borderSoft rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Student Feedback</h3>

        {studentFeedbacks.length === 0 && (
          <p className="text-sm text-gray-500">No feedback from students yet</p>
        )}

        <div className="space-y-4">
          {studentFeedbacks.map((f) => (
            <div key={f.id} className="border rounded-xl p-4 bg-secondary">
              <p className="font-medium">{f.student_name}</p>
              <p className="text-sm text-gray-600 mt-1">{f.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}