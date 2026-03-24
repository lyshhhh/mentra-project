import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Toaster } from "react-hot-toast";

import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import ParentDashboard from "./pages/parent/ParentDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Toast notifications */}
        <Toaster position="top-right" />

        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentor"
            element={
              <ProtectedRoute role="mentor">
                <MentorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parent"
            element={
              <ProtectedRoute role="parent">
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}