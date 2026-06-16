import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Beranda from "@/pages/Beranda";

const App = () => {
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
