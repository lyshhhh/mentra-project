import { useAuth } from "../../context/AuthContext";

export default function AdminHeader() {
  const { user, logout } = useAuth();

  // Get first letter for avatar
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <header className="bg-white border-b border-borderSoft px-10 py-4 flex items-center justify-between">
      
      {/* Left side */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primarySoft flex items-center justify-center">
          🎓
        </div>
        <div>
          <p className="font-semibold">Mentra</p>
          <p className="text-xs text-gray-500">Admin Portal</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-medium">
            {user?.name || "Admin"}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {user?.role}
          </p>
        </div>

        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
          {initial}
        </div>

        <button
          onClick={logout}
          className="border border-borderSoft rounded-lg px-4 py-2 hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
