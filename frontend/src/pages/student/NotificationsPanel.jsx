import { useEffect, useState } from "react";

export default function NotificationsPanel({ studentId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`/api/student/${studentId}/notifications`)
      .then(res => res.json())
      .then(setNotifications);
  }, [studentId]);

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-semibold mb-4">Notifications</h3>

      {notifications.map(n => (
        <div key={n.id} className="border-b py-2 text-sm">
          {n.message}
        </div>
      ))}
    </div>
  );
}
