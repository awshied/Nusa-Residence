import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import logoWeb from "@/assets/logo-web.png";
import dashboardOutlineIcon from "@/assets/icons/dashboard-outline.png";
import dashboardFillIcon from "@/assets/icons/dashboard-fill.png";
import managementOutlineIcon from "@/assets/icons/management-outline.png";
import managementFillIcon from "@/assets/icons/management-fill.png";
import adminManagementOutlineIcon from "@/assets/icons/admin-management-outline.png";
import adminManagementFillIcon from "@/assets/icons/admin-management-fill.png";
import propertyManagementOutlineIcon from "@/assets/icons/property-management-outline.png";
import propertyManagementFillIcon from "@/assets/icons/property-management-fill.png";
import reportOutlineIcon from "@/assets/icons/report-outline.png";
import reportFillIcon from "@/assets/icons/report-fill.png";
import emptyProfile from "@/assets/empty-profile.png";
import ProfileModal from "./ProfileModal";
import OwnerNavbar from "./OwnerNavbar";

interface NavigationPath {
  path?: string;
  label: string;
  iconOutline: string;
  iconFill: string;
  children?: NavigationPath[];
}

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const MenuItem: NavigationPath[] = [
  {
    path: "/owner/dashboard",
    label: "Dashboard",
    iconOutline: dashboardOutlineIcon,
    iconFill: dashboardFillIcon,
  },
  {
    label: "Kelola",
    iconOutline: managementOutlineIcon,
    iconFill: managementFillIcon,
    children: [
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
    ],
  },
  {
    path: "/owner/laporan",
    label: "Laporan",
    iconOutline: reportOutlineIcon,
    iconFill: reportFillIcon,
  },
];

const OwnerSidebar = ({ isOpen, setIsOpen }: Props) => {
  const location = useLocation();
  const { user } = useAuth();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    Kelola: false,
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (path?: string): boolean => {
    if (!path) return false;
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const isDropdownActive = (children?: NavigationPath[]): boolean => {
    if (!children) return false;
    return children.some((child) => isActive(child.path));
  };

  const hasChildren = (item: NavigationPath): boolean => {
    return !!(item.children && item.children.length > 0);
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-full bg-base-100 transition-all duration-300 z-40 flex flex-col shadow-lg ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="relative flex items-center shrink-0">
          <div
            className={`w-full flex items-center gap-3 mx-3 px-2 py-4 border-b border-base-300 overflow-hidden ${!isOpen && "justify-center"}`}
          >
            <img
              src={logoWeb}
              alt="logo web"
              className="w-10 h-10 object-contain"
            />
            <div
              className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}
            >
              <h4 className="text-2xl font-lobster font-extrabold text-base-content whitespace-nowrap">
                Nusa Residence
              </h4>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute -right-5 rounded-full p-1.5 bg-base-content border-5 border-base-200 hover:bg-neutral cursor-pointer shadow-none transition-all"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-base-100" />
            ) : (
              <ChevronRight className="w-5 h-5 text-base-100" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {MenuItem.map((item) => {
              const hasChildrenItems = hasChildren(item);
              const isActiveState = isActive(item.path);
              const isDropdownActiveState = isDropdownActive(item.children);
              const isOpenDropdown = openDropdowns[item.label];

              if (hasChildrenItems) {
                return (
                  <div
                    key={item.label}
                    className="relative group"
                    onMouseEnter={() =>
                      isOpen &&
                      setOpenDropdowns((prev) => ({
                        ...prev,
                        [item.label]: true,
                      }))
                    }
                    onMouseLeave={() =>
                      isOpen &&
                      setOpenDropdowns((prev) => ({
                        ...prev,
                        [item.label]: false,
                      }))
                    }
                  >
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                        isDropdownActiveState || isOpenDropdown
                          ? "text-base-content"
                          : "text-base-content/70 hover:text-base-content hover:bg-base-content/5"
                      } ${!isOpen && "justify-center"}`}
                      title={!isOpen ? item.label : undefined}
                      onClick={() => isOpen && toggleDropdown(item.label)}
                    >
                      <img
                        src={
                          isDropdownActiveState
                            ? item.iconFill
                            : item.iconOutline
                        }
                        alt={item.label}
                        className="w-6 h-6 shrink-0"
                      />

                      {isOpen && (
                        <>
                          <span
                            className={`flex-1 text-left font-mona font-bold group-hover:text-base-content ${isDropdownActiveState ? "text-base-content" : "text-base-content/70"}`}
                          >
                            {item.label}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-300 ${
                              isOpenDropdown
                                ? "group-hover:rotate-180 text-base-content/70"
                                : "group-hover:text-base-content"
                            }`}
                          />
                        </>
                      )}
                    </div>

                    <div
                      className={`ml-4 pl-4 space-y-1 transition-all duration-200 overflow-hidden ${
                        isOpenDropdown
                          ? "max-h-96 opacity-100 mt-1"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.children?.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path || "#"}
                          className={`flex items-center gap-3 px-3 py-2 border-l-3 transition-all ${
                            isActive(child.path)
                              ? "bg-base-content/10 text-base-content border-base-content rounded-r-lg"
                              : "text-base-content/70 hover:bg-base-content/5 hover:text-base-content border-base-content/0 rounded-lg"
                          }`}
                        >
                          <img
                            src={
                              isActive(child.path)
                                ? child.iconFill
                                : child.iconOutline
                            }
                            alt={child.label}
                            className="w-5 h-5 shrink-0"
                          />
                          <span className="text-sm font-mona font-bold">
                            {child.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              } else {
                return (
                  <Link
                    key={item.path}
                    to={item.path || "#"}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      isActive(item.path)
                        ? "bg-base-content/10 text-base-content"
                        : "text-base-content/70 hover:bg-base-content/5 hover:text-base-content"
                    } ${!isOpen && "justify-center"}`}
                    title={!isOpen ? item.label : undefined}
                  >
                    <img
                      src={isActiveState ? item.iconFill : item.iconOutline}
                      alt={item.label}
                      className="w-6 h-6 shrink-0"
                    />
                    {isOpen && (
                      <span className="font-mona font-bold">{item.label}</span>
                    )}
                  </Link>
                );
              }
            })}
          </div>
        </nav>

        <div className="border-t border-base-300 py-3 mx-3 shrink-0">
          <button
            onClick={() => setIsProfileOpen(true)}
            className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-base-content/5 transition-all duration-300 cursor-pointer ${
              !isOpen ? "justify-center rounded-full" : "rounded-lg"
            }`}
            title={!isOpen ? user?.namaLengkap || user?.email : undefined}
          >
            {user?.fotoProfil ? (
              <img
                src={user.fotoProfil}
                alt={user.namaLengkap || user.email}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <img
                src={emptyProfile}
                alt="user profile"
                className="w-8 h-8 rounded-full shrink-0"
              />
            )}

            {isOpen && (
              <div className="flex-1 text-left overflow-hidden">
                <p className="font-extrabold text-base-content text-sm font-mona truncate">
                  {user?.namaLengkap}
                </p>
                <p className="text-xs text-base-content/60 font-medium truncate -mt-0.5">
                  {user?.email}
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>

      <div
        className={`transition-all duration-300 px-6 py-3 ${isOpen ? "ml-64" : "ml-20"}`}
      >
        <OwnerNavbar />
        <main className="mt-3">
          <Outlet />
        </main>
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default OwnerSidebar;
