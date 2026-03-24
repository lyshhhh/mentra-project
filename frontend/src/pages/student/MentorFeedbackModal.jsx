import { useState } from "react";
import { apiRequest } from "../../services/api";

export default function MentorFeedbackModal({ open, onClose }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submitFeedback = async () => {
    if (!message.trim()) {
      alert("Please enter feedback");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/student/mentor-feedback", "POST", {
        message
      });

      alert("Feedback sent to mentor");
      setMessage("");
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        
        <h3 className="font-semibold text-lg mb-4">
          Send Feedback to Mentor
        </h3>

        <textarea
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full border rounded-lg p-3 text-sm"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={submitFeedback}
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
