import { useState } from "react";
import { apiRequest } from "../../services/api";

export default function MentorRemarksPanel({ mentees }) {
  const [activeStudent, setActiveStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitRemark = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      await apiRequest("/mentor/feedback", "POST", {
        student_id: activeStudent,
        message
      });

      alert("Remark saved successfully");
      setMessage("");
      setActiveStudent(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-borderSoft rounded-2xl p-6">
      <h3 className="font-semibold mb-4">Mentor Remarks</h3>

      {mentees.length === 0 && (
        <p className="text-sm text-gray-500">No mentees assigned</p>
      )}

      {mentees.map((m) => (
        <div
          key={m.student_id}
          className="flex justify-between items-center mb-3 bg-primary/10 p-4 rounded-xl"
        >
          <div>
            <p className="font-medium">{m.name}</p>
            <p className="text-xs text-gray-500">
              Roll No: {m.roll_no}
            </p>
          </div>

          <button
            onClick={() => setActiveStudent(m.student_id)}
            className="border px-3 py-1 rounded-lg hover:bg-white"
          >
            + Add Remark
          </button>
        </div>
      ))}

      {/* Remark Input */}
      {activeStudent && (
        <div className="mt-4">
          <textarea
            className="w-full border rounded-lg p-3 text-sm"
            rows="3"
            placeholder="Enter mentor remark"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="flex gap-3 mt-3">
            <button
              onClick={submitRemark}
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              {loading ? "Saving..." : "Save Remark"}
            </button>

            <button
              onClick={() => {
                setActiveStudent(null);
                setMessage("");
              }}
              className="border px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
