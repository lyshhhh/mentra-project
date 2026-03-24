import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

export default function ParentContactsPanel({ mentorId }) {
  const [parents, setParents] = useState([]);

  useEffect(() => {
    if (!mentorId) return;
    apiRequest(`/mentor/${mentorId}/parents`)
      .then(setParents)
      .catch(console.error);
  }, [mentorId]);

  return (
    <div className="bg-white border border-borderSoft rounded-2xl p-6 mb-10">
      <h3 className="font-semibold mb-4">Parent Contact Details</h3>

      {parents.length === 0 && (
        <p className="text-sm text-gray-500">No parent details available</p>
      )}

      <div className="space-y-4">
        {parents.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center border rounded-xl p-4"
          >
            <div>
              <p className="font-medium">{p.student_name}</p>
              <p className="text-sm text-gray-500">
                Parent: {p.parent_name}
              </p>
              <p className="text-sm text-gray-500">
                Phone: {p.phone ? p.phone : "Not added"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}