import { useEffect, useState } from "react";

export default function FeedbackPanel({ parentId }) {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    fetch(`/api/parent/${parentId}/feedback`)
      .then(res => res.json())
      .then(setFeedback);
  }, [parentId]);

  const sendMessage = async () => {
    const text = prompt("Send message to mentor/teacher");
    if (!text) return;

    await fetch("/api/parent/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentId, text })
    });

    alert("Message sent");
  };

  return (
    <div className="bg-white border rounded-2xl p-6">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">Feedback</h3>
        <button
          onClick={sendMessage}
          className="border px-4 py-1 rounded"
        >
          Send Message
        </button>
      </div>

      {feedback.map(f => (
        <div key={f.id} className="border rounded-lg p-3 mb-2">
          <p className="text-xs text-gray-500">{f.from}</p>
          <p>{f.text}</p>
        </div>
      ))}
    </div>
  );
}
