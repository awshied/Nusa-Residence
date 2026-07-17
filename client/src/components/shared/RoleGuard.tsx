import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleGuard = ({ allowedRoles, redirectTo = "/" }: Props) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user || !allowedRoles.includes(user.peran)) {
    console.warn("⛔ Role not allowed, redirecting to:", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};

export default RoleGuard;
