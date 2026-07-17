import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../layout/Loading";

const ClientGuard = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading isLoading={pageLoading} />
      </div>
    );
  }

  if (isAuthenticated && user?.peran === "PEMILIK") {
    return <Navigate to="/owner/dashboard" replace />;
  }

  return <Outlet />;
};

export default ClientGuard;
