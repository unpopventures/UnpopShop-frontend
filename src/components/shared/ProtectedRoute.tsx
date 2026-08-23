import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Role } from "../../types";
import { LoadingBlock } from "../ui/Primitives";

export default function ProtectedRoute({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingBlock label="Checking your session..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    const fallback = user.role === "ADMIN" ? "/admin" : user.role === "MANUFACTURER" ? "/manufacturer" : "/buyer";
    return <Navigate to={fallback} replace />;
  }
  return <>{children}</>;
}
