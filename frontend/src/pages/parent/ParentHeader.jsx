import { useAuth } from "../../context/AuthContext";

export default function ParentHeader() {
  const { user, logout } = useAuth();

  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "P";

  return (
    <header className="bg-white border-b px-10 py-4 flex justify-between items-center">
      
      {/* Left */}
      <div>
        <p className="font-semibold">Mentra</p>
        <p className="text-xs text-gray-500">Parent Portal</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">
            {user?.name || "Parent"}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {user?.role}
          </p>
        </div>

        <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
          {initial}
        </div>

        <button
          onClick={logout}
          className="border rounded-lg px-4 py-2 hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
