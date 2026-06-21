import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Beranda from "@/pages/Beranda";

const App = () => {
  useEffect(() => {
    const handleUnauthorized = () => {
      window.location.href = "/";
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, []);
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <Routes>
          <Route path="/" element={<Beranda />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
