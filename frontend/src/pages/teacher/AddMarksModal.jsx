import { useState } from "react";

export default function AddMarksModal({ student, subject, onClose, onSave }) {
  const [examType, setExamType] = useState("");
  const [marks, setMarks] = useState("");
  const [maxMarks, setMaxMarks] = useState("");

  const handleSave = () => {
    if (!examType || !marks || !maxMarks) {
      alert("Please fill all fields");
      return;
    }
    if (Number(marks) > Number(maxMarks)) {
      alert("Marks cannot exceed max marks");
      return;
    }
    onSave({
      exam_type: examType,
      marks: Number(marks),
      max_marks: Number(maxMarks)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="font-semibold mb-1">Add Marks — {student.name}</h3>
        <p className="text-sm text-gray-500 mb-4">Subject: {subject}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Exam Type</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            >
              <option value="">Select exam</option>
              <option>Internal</option>
              <option>Semester</option>
              <option>Mid Term</option>
              <option>Practical</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Marks Obtained</label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g. 18"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max Marks</label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g. 20"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg">Save Marks</button>
        </div>
      </div>
    </div>
  );
}