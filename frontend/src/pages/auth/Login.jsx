import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("api/auth/login", "POST", { email, password });

      // Save token + user in context
      login(data);

      // ✅ First time login → force password change
      if (data.user.password_changed === 0) {
        navigate("/change-password");
        return;
      }

      // ✅ Already changed → go to dashboard
      navigate(`/${data.user.role}`);

    } catch (err) {
      setError(err.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT SECTION – IMAGE + TEXT */}
      <div className="relative hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
          alt="Mentra"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 h-full flex flex-col justify-center px-16 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Mentra</h1>
          <p className="text-lg max-w-md">
            Connecting mentors, teachers, students & parents for academic excellence
          </p>
        </div>
      </div>

      {/* RIGHT SECTION – LOGIN FORM */}
      <div className="flex items-center justify-center bg-[#F8F6EF] px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-xl bg-primary/20">
              🎓
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Sign In to Mentra</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="name@mentra.edu"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* ✅ Forgot password message */}
            <p className="text-xs text-gray-400 text-right">
              Forgot password? Contact your faculty or admin.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 text-white font-semibold hover:bg-primaryDark transition"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}