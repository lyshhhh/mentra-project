import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";

export default function ChangePassword() {
  const { user, markPasswordChanged } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/change-password", "POST", {
        userId: user.id,
        newPassword
      });

      // ✅ Mark as changed in context + localStorage
      markPasswordChanged();

      // ✅ Redirect to their dashboard
      navigate(`/${user.role}`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT — Image */}
      <div className="relative hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
          alt="Mentra"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-center px-16 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Mentra</h1>
          <p className="text-lg max-w-md">
            Please set your own password before continuing.
          </p>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="flex items-center justify-center bg-[#F8F6EF] px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-xl bg-primary/20">
              🔐
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Set Your Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              You can change your password only once. Keep it safe!
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-sm text-yellow-700">
            ⚠️ This is a one-time change. If you forget your new password, you will need to contact your faculty or admin to reset it.
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password (min 6 chars)"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your new password"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 text-white font-semibold hover:bg-primaryDark transition"
            >
              {loading ? "Saving..." : "Set Password & Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}