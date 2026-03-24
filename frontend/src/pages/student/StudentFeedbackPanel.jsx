import { useState } from "react";

export default function StudentFeedbackPanel() {
  const [message, setMessage] = useState("");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Received */}
      <div className="bg-white border rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Received Feedback</h3>

        <div className="bg-green-100 p-4 rounded-xl mb-3">
          <p className="text-xs">Teacher</p>
          <p className="text-sm">Excellent performance in Mathematics.</p>
        </div>

        <div className="bg-green-100 p-4 rounded-xl">
          <p className="text-xs">Mentor</p>
          <p className="text-sm">Focus on consistency and revision.</p>
        </div>
      </div>

      {/* Send */}
      <div className="bg-white border rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Message to Mentor</h3>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded-xl p-3 text-sm"
          placeholder="Share your concerns or questions..."
        />

        <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg">
          Send Message
        </button>
      </div>
    </div>
  );
}