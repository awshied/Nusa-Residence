import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";

import emptyProfile from "@/assets/empty-profile.png";
import dashboardOutlineIcon from "@/assets/icons/dashboard-outline.png";
import dashboardFillIcon from "@/assets/icons/dashboard-fill.png";
// import analyticOutlineIcon from "@/assets/icons/analytics-outline.png";
// import analyticFillIcon from "@/assets/icons/analytics-fill.png";
import adminManagementOutlineIcon from "@/assets/icons/admin-management-outline.png";
import adminManagementFillIcon from "@/assets/icons/admin-management-fill.png";
import propertyManagementOutlineIcon from "@/assets/icons/property-management-outline.png";
import propertyManagementFillIcon from "@/assets/icons/property-management-fill.png";
import reportOutlineIcon from "@/assets/icons/report-outline.png";
import reportFillIcon from "@/assets/icons/report-fill.png";

interface MobileTabsProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface NavigationPath {
  path: string;
  label: string;
  iconOutline?: string;
  iconFill: string;
}

const MenuItem: NavigationPath[] = [
  {
    path: "/owner/dashboard",
    label: "Dashboard",
    iconOutline: dashboardOutlineIcon,
    iconFill: dashboardFillIcon,
  },
  // {
  //   path: "/owner/analitik",
  //   label: "Analitik",
  //   iconOutline: analyticOutlineIcon,
  //   iconFill: analyticFillIcon,
  //   text: "Analisis mendalam terkait pola perilaku pengguna dan memprediksi tren kebutuhan pada bulan-bulan berikutnya",
  // },
  {
    path: "/owner/kelola-admin",
    label: "Admin",
    iconOutline: adminManagementOutlineIcon,
    iconFill: adminManagementFillIcon,
  },
  {
    path: "/owner/kelola-properti",
    label: "Properti",
    iconOutline: propertyManagementOutlineIcon,
    iconFill: propertyManagementFillIcon,
  },
  {
    path: "/owner/laporan",
    label: "Laporan",
    iconOutline: reportOutlineIcon,
    iconFill: reportFillIcon,
  },
];

const OwnerMobileTabs = ({ currentPath, onNavigate }: MobileTabsProps) => {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string>("");

  useEffect(() => {
    const currentMenu = MenuItem.find((item) => item.path === currentPath);
    if (currentMenu) {
      setActiveMenu(currentMenu.label);
    }
  }, [currentPath]);

  const handleNavigation = (path: string, label: string) => {
    onNavigate(path);
    setActiveMenu(label);
  };

  return (
    <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-100 border-t border-base-300 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2 max-w-3xl mx-auto">
        {MenuItem.map((item, index) => {
          const isActive = activeMenu === item.label;

          return (
            <motion.button
              key={index}
              whileTap={{ scale: 0.88 }}
              onClick={() => handleNavigation(item.path, item.label)}
              className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ease-in-out cursor-pointer ${isActive ? "opacity-100" : "opacity-80"}`}
            >
              <img
                src={isActive ? item.iconFill : item.iconOutline}
                alt={item.label}
                className="w-6 h-6 object-contain transition-all duration-300"
              />

              <span className="text-[10px] font-poppins text-base-content truncate font-semibold max-w-full">
                {item.label}
              </span>
            </motion.button>
          );
        })}

        <motion.button
          whileTap={{ scale: 0.88 }}
          // onClick={() => handleNavigation("/profil", "Profil")}
          className="relative flex flex-col items-center justify-center gap-0.5"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-base-content transition-all duration-300 cursor-pointer">
            <img
              src={user?.fotoProfil || emptyProfile}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <span className="text-[10px] font-poppins font-semibold text-base-content">
            Saya
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default OwnerMobileTabs;
