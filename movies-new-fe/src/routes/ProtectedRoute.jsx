import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function ProtectedRoute({ children, requireRole }) {
  const { isAuthed, role } = useAuth();

  if (!isAuthed)
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  if (requireRole && role !== requireRole)
    return (
      <Navigate
        to="/"
        replace
      />
    );

  return children;
}
