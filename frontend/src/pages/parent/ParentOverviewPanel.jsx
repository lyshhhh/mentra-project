import { useEffect, useState } from "react";

export default function OverviewPanel({ parentId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/parent/${parentId}/overview`)
      .then(res => res.json())
      .then(setData);
  }, [parentId]);

  if (!data) return null;

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-semibold mb-4">Child Overview</h3>

      <p><strong>Name:</strong> {data.studentName}</p>
      <p><strong>Class:</strong> {data.className}</p>
      <p><strong>Mentor:</strong> {data.mentor}</p>
      <p><strong>Status:</strong>{" "}
        <span className={data.backlogs > 0 ? "text-red-600" : "text-green-600"}>
          {data.backlogs > 0 ? "Academic Issues" : "Good Standing"}
        </span>
      </p>
    </div>
  );
}
