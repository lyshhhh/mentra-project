import { useState } from "react";
import toast from "react-hot-toast";

export default function ParentCommunicationPanel() {
  const [recipient, setRecipient] = useState("mentor");
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState([]);

  const contacts = {
    mentor: {
      name: "Fr. Savio D’Souza",
      email: "savio.dsouza@gmail.com"
    },
    teacher: {
      name: "Leah D’Souza",
      email: "leahd@mentra.edu.in"
    }
  };

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSentMessages((prev) => [
      {
        to: contacts[recipient].name,
        text: message,
        date: new Date().toLocaleString()
      },
      ...prev
    ]);

    setMessage("");
    toast.success("Message sent successfully");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Send Message */}
      <div className="bg-white border border-borderSoft rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Message Teacher / Mentor</h3>

        <label className="text-sm text-gray-600">Select Recipient</label>
        <select
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1 mb-4"
        >
          <option value="mentor">Mentor</option>
          <option value="teacher">Teacher</option>
        </select>

        <p className="text-sm text-gray-500 mb-2">
          Sending to: <span className="font-medium">{contacts[recipient].name}</span>
        </p>

        <textarea
          rows="5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <button
          onClick={handleSend}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
        >
          Send Message
        </button>
      </div>

      {/* Sent Messages */}
      <div className="bg-white border border-borderSoft rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Sent Messages</h3>

        {sentMessages.length === 0 && (
          <p className="text-sm text-gray-500">No messages sent yet</p>
        )}

        <div className="space-y-4">
          {sentMessages.map((m, index) => (
            <div
              key={index}
              className="border rounded-xl p-4"
            >
              <p className="text-sm font-medium">To: {m.to}</p>
              <p className="text-sm text-gray-600 mt-1">{m.text}</p>
              <p className="text-xs text-gray-400 mt-2">{m.date}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}