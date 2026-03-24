import { useState } from "react";
import toast from "react-hot-toast";

export default function FeedbackPanel() {
  const [students] = useState([
    {
      id: 1,
      rollNo: "2305802",
      name: "Rohan Naik",
      class: "TY BCA",
      section: "A"
    },
    {
      id: 2,
      rollNo: "2305834",
      name: "Siya Fernandes",
      class: "TY BCA",
      section: "B"
    },
    {
      id: 3,
      rollNo: "2305821",
      name: "Lean D’as",
      class: "TY BCA",
      section: "B"
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");

  const submitFeedback = () => {
    if (!message.trim()) {
      toast.error("Feedback cannot be empty");
      return;
    }

    toast.success("Feedback submitted successfully");
    setSelectedStudent(null);
    setMessage("");
  };

  return (
    <div className="bg-white border border-borderSoft rounded-2xl p-6 mt-6">
      <h3 className="font-semibold mb-4">Student Feedback</h3>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left py-2">Roll No</th>
            <th>Name</th>
            <th>Class</th>
            <th>Section</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b">
              <td className="py-3">{s.rollNo}</td>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {s.section}
                </span>
              </td>
              <td>
                <button
                  onClick={() => setSelectedStudent(s)}
                  className="text-primary hover:underline text-sm"
                >
                  Give Feedback
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h4 className="font-semibold mb-2">
              Feedback for {selectedStudent.name}
            </h4>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter feedback here..."
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}