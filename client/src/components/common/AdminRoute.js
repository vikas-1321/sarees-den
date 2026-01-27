import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Logged in but not admin
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  // Admin access allowed
  return children;
};

export default AdminRoute;
