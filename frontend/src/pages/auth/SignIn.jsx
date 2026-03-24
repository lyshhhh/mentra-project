import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function SignIn() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // This will later be replaced by backend API call
    const userData = {
      role,
      email
    };

    login(userData);
    navigate(`/${role}`);
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
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Mentra
          </h1>
          <p className="text-lg max-w-md">
            Connecting mentors and students for academic excellence
          </p>
        </div>
      </div>

      {/* RIGHT SECTION – LOGIN FORM */}
      <div className="flex items-center justify-center bg-[#F8F6EF] px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-xl bg-primary/20">
              🎓
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Sign In to Mentra
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Role
              </label>
              <select
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select your role</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="mentor">Mentor</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="name@mentra.edu"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2.5 text-white font-semibold hover:bg-primaryDark transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
