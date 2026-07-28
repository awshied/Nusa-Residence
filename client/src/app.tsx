import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Loading from "./components/layout/Loading";
import Navbar from "./components/layout/Navbar";
import OwnerSidebar from "./components/layout/OwnerSidebar";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import RoleGuard from "./components/shared/RoleGuard";
import ClientGuard from "./components/shared/ClientGuard";

import Beranda from "@/pages/Beranda";
import ResetPassword from "@/pages/ResetPassword";
import Wishlist from "@/pages/Wishlist";
import OwnerDashboard from "@/pages/owner/OwnerDashboard";
import Analitik from "@/pages/owner/Analitik";
import ManajemenAdmin from "@/pages/owner/ManajemenAdmin";
import ManajemenProperti from "@/pages/owner/ManajemenProperti";
import Laporan from "@/pages/owner/Laporan";

const App = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      window.location.href = "/";
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, []);

  return (
    <>
      <Loading isLoading={pageLoading} />
      <div className="min-h-screen bg-base-200">
        <Routes>
          <Route element={<ClientGuard />}>
            <Route element={<Navbar />}>
              <Route path="/" element={<Beranda />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/wishlist" element={<Wishlist />} />
              </Route>
            </Route>
          </Route>

          <Route element={<RoleGuard allowedRoles={["PEMILIK"]} />}>
            <Route
              element={
                <OwnerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
              }
            >
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/analitik" element={<Analitik />} />
              <Route path="/owner/kelola-admin" element={<ManajemenAdmin />} />
              <Route
                path="/owner/kelola-properti"
                element={<ManajemenProperti />}
              />
              <Route path="/owner/laporan" element={<Laporan />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
