// src/components/RequireAuth.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/account" state={{ from: location }} replace />;
  return children;
}
