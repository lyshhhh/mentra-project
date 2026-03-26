import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // 🔥 check localStorage as fallback
  const savedUser = localStorage.getItem("user");

  if (!user && !savedUser) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;