import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, Search, X } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import LogoutModal from "./LogoutModal";
import ProfileModal from "./ProfileModal";

import emptyProfile from "@/assets/empty-profile.png";
import dashboardOutlineIcon from "@/assets/icons/dashboard-outline.png";
import dashboardFillIcon from "@/assets/icons/dashboard-fill.png";
import analyticOutlineIcon from "@/assets/icons/analytics-outline.png";
import analyticFillIcon from "@/assets/icons/analytics-fill.png";
import managementOutlineIcon from "@/assets/icons/management-outline.png";
import managementFillIcon from "@/assets/icons/management-fill.png";
import adminManagementOutlineIcon from "@/assets/icons/admin-management-outline.png";
import adminManagementFillIcon from "@/assets/icons/admin-management-fill.png";
import propertyManagementOutlineIcon from "@/assets/icons/property-management-outline.png";
import propertyManagementFillIcon from "@/assets/icons/property-management-fill.png";
import reportOutlineIcon from "@/assets/icons/report-outline.png";
import reportFillIcon from "@/assets/icons/report-fill.png";
import inboxIcon from "@/assets/icons/inbox.png";
import notificationIcon from "@/assets/icons/notification-bell.png";
import logoutIcon from "@/assets/icons/out.png";

interface NavigationPath {
  path?: string;
  label: string;
  iconOutline?: string;
  iconFill: string;
  text: string;
  children?: NavigationPath[];
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onInbox: () => void;
  onNotification: () => void;
}

const MenuItem: NavigationPath[] = [
  {
    path: "/owner/dashboard",
    label: "Dashboard",
    iconOutline: dashboardOutlineIcon,
    iconFill: dashboardFillIcon,
    text: "Tinjau ringkasan visual mengenai kondisi sistem serta lonjakan lalu lintas",
  },
  {
    path: "/owner/analitik",
    label: "Analitik",
    iconOutline: analyticOutlineIcon,
    iconFill: analyticFillIcon,
    text: "Analisis mendalam terkait pola perilaku pengguna dan memprediksi tren kebutuhan pada bulan-bulan berikutnya",
  },
  {
    label: "Kelola",
    iconOutline: managementOutlineIcon,
    iconFill: managementFillIcon,
    text: "Keterampilan manajerial dalam mengelola admin atau properti sebagai pondasi dasar",
    children: [
      {
        path: "/owner/kelola-admin",
        label: "Admin",
        iconOutline: adminManagementOutlineIcon,
        iconFill: adminManagementFillIcon,
        text: "Kelola staff admin dengan memprioritaskan rasa tanggung jawab yang tinggi",
      },
      {
        path: "/owner/kelola-properti",
        label: "Properti",
        iconOutline: propertyManagementOutlineIcon,
        iconFill: propertyManagementFillIcon,
        text: "Kelola properti pada titik koordinat tertentu yang memiliki fasilitas lengkap serta harga terjangkau",
      },
    ],
  },
  {
    path: "/owner/laporan",
    label: "Laporan",
    iconOutline: reportOutlineIcon,
    iconFill: reportFillIcon,
    text: "Laporan admin dalam satu bulan penuh maupun harian",
  },
];

// Komponen menu untuk mobile
const MobileMenu = ({
  isOpen,
  onClose,
  currentPath,
  onNavigate,
  onLogout,
  onInbox,
  onNotification,
}: MobileMenuProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const handleNavigation = (path?: string) => {
    if (path) {
      onNavigate(path);
      onClose();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 bg-base-100 h-full w-full max-w-md z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-2 border-b border-base-300">
            <h2 className="text-xl font-bold text-base-content">
              Pilih Halaman
            </h2>
            <button onClick={onClose} className="btn btn-ghost btn-square">
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {MenuItem.map((item, index) => {
              const isActive =
                currentPath === item.path ||
                item.children?.some((child) => child.path === currentPath);
              const isExpanded = expandedItems.includes(item.label);

              return (
                <div key={index} className="mb-2">
                  <button
                    onClick={() => {
                      if (item.children) {
                        toggleExpand(item.label);
                      } else if (item.path) {
                        handleNavigation(item.path);
                      }
                    }}
                    className={`relative flex flex-col items-center justify-center w-full p-3 border-b-2 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "border-base-content opacity-100"
                        : "border-secondary text-base-content opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={isActive ? item.iconFill : item.iconOutline}
                      alt={item.label}
                      className="w-8 h-8"
                    />
                    <span className="font-bold font-poppins text-base text-center mt-2">
                      {item.label}
                    </span>
                    <p className="font-medium text-xs text-center">
                      {item.text}
                    </p>
                    {item.children && (
                      <div className="absolute right-0 top-0 flex items-center justify-center gap-2">
                        <span className="text-xs font-medium">
                          ({item.children.length}) Opsi Tersedia
                        </span>
                        <ChevronDown
                          size={12}
                          className={`transform transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    )}
                  </button>

                  {item.children && (
                    <div
                      className="overflow-hidden transition-all duration-500 ease-in-out"
                      style={{
                        maxHeight: isExpanded
                          ? `${item.children.length * 180}px`
                          : "0px",
                      }}
                    >
                      <div className="mt-2 space-y-1">
                        {item.children.map((child, childIndex) => {
                          const isChildActive = currentPath === child.path;
                          return (
                            <button
                              key={childIndex}
                              onClick={() => handleNavigation(child.path)}
                              className={`flex flex-col items-center justify-center gap-2 w-full p-3 border-b-2 transition-all duration-300 cursor-pointer transform ${
                                isChildActive
                                  ? "border-base-content opacity-100"
                                  : "border-secondary text-base-content opacity-70 hover:opacity-100"
                              }`}
                              style={{
                                transform: isExpanded
                                  ? "translateX(0)"
                                  : "translateX(-20px)",
                                opacity: isExpanded ? 1 : 0,
                                transitionDelay: `${childIndex * 50}ms`,
                              }}
                            >
                              <img
                                src={
                                  isChildActive
                                    ? child.iconFill
                                    : child.iconOutline
                                }
                                alt={child.label}
                                className="w-8 h-8"
                              />
                              <span className="font-bold font-poppins text-base text-center mt-2">
                                {child.label}
                              </span>
                              <p className="font-medium text-xs text-center">
                                {child.text}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="px-4 py-2">
            <div className="flex items-center justify-center gap-10">
              <button
                onClick={() => {
                  onInbox();
                  onClose();
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="relative rounded-full p-2 border border-base-content">
                  <img src={inboxIcon} alt="inbox icon" className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-base-content">
                  Inbox
                </span>
              </button>

              <button
                onClick={() => {
                  onNotification();
                  onClose();
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="relative rounded-full p-2 border border-base-content">
                  <img
                    src={notificationIcon}
                    alt="notification icon"
                    className="w-6 h-6"
                  />
                </div>
                <span className="text-xs font-medium text-base-content">
                  Notifikasi
                </span>
              </button>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="relative rounded-full p-2 border border-base-content">
                  <img src={logoutIcon} alt="logout icon" className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-base-content">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Navigation bar Owner
const OwnerNavbar = ({
  onSearch,
  placeholder = "Cari Properti...",
}: SearchBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleInbox = () => {
    navigate("/owner/inbox");
  };

  const handleNotification = () => {
    navigate("/owner/notifikasi");
  };

  const findMenuItem = (path: string): NavigationPath | null => {
    for (const item of MenuItem) {
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.path === path) {
            return child;
          }
        }
      }
    }
    return null;
  };

  const findParentItem = (path: string): NavigationPath | null => {
    for (const item of MenuItem) {
      if (item.children) {
        for (const child of item.children) {
          if (child.path === path) {
            return item;
          }
        }
      }
    }
    return null;
  };

  const currentItem = findMenuItem(location.pathname);
  const parentItem = findParentItem(location.pathname);

  const getBreadcrumbIcon = () => {
    if (currentItem?.iconOutline) return currentItem.iconOutline;
    if (parentItem?.iconOutline) return parentItem.iconOutline;
    return dashboardOutlineIcon;
  };

  const getBreadcrumbLabel = () => {
    if (currentItem?.label) return currentItem.label;
    return "Dashboard";
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.every((value): value is string => typeof value === "string")
        ) {
          setRecentSearches(parsed);
        }
      }
    } catch (error) {
      console.error("Gagal memuat pencarian:", error);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveSearch = (searchQuery: string): void => {
    if (!searchQuery.trim()) return;
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    } catch (error) {
      console.error("Gagal menyimpan pencarian:", error);
    }
  };

  const handleSearch = (): void => {
    if (!query.trim()) return;
    saveSearch(query);
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/residences?search=${encodeURIComponent(query)}`);
    }
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleRecentClick = (term: string): void => {
    setQuery(term);
    saveSearch(term);
    if (onSearch) {
      onSearch(term);
    } else {
      navigate(`/residences?search=${encodeURIComponent(term)}`);
    }
    setIsFocused(false);
  };

  const clearRecentSearches = (): void => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("recentSearches");
    } catch (error) {
      console.error("Gagal menghapus pencarian:", error);
    }
  };

  const showDropdown =
    isFocused && query.length === 0 && recentSearches.length > 0;

  return (
    <>
      <nav className="relative flex w-full items-center justify-between bg-base-100 lg:bg-transparent px-3 lg:px-6 min-h-12 lg:min-h-20">
        {/* Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMobileMenuOpen}
            className="btn btn-ghost btn-square"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Page Label - Mobile */}
        <div className="lg:hidden flex items-center">
          <h3 className="text-lg font-bold text-base-content font-poppins">
            {currentItem?.label || "Dashboard"}
          </h3>
        </div>

        {/* Page Label - Desktop */}
        <div className="hidden lg:block">
          <h3 className="text-2xl font-extrabold text-base-content font-poppins">
            {currentItem?.label || "Dashboard"}
          </h3>

          <div className="flex breadcrumbs mt-1">
            <ul>
              <li>
                <img
                  src={getBreadcrumbIcon()}
                  alt="page icon"
                  className="w-4 h-4"
                />
              </li>

              {parentItem && (
                <li>
                  <p className="text-sm font-medium text-base-content font-mona">
                    {parentItem.label}
                  </p>
                </li>
              )}

              <li>
                <p className="text-sm font-medium text-base-content font-mona">
                  {getBreadcrumbLabel()}
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Searchbar */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-6">
          <div className="relative w-full" ref={containerRef}>
            <div className="flex items-center rounded-full overflow-hidden bg-base-100 shadow-md">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                placeholder={placeholder}
                className="flex-1 pl-6 pr-3 py-3 font-medium font-mona bg-transparent outline-none text-neutral/70 placeholder:text-neutral/40 min-w-50"
              />
              {query ? (
                <button
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="py-3 pr-2 bg-transparent outline-none text-neutral/70 border-none transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              ) : null}
              <button
                onClick={handleSearch}
                className="btn btn-circle btn-lg bg-base-content hover:bg-neutral text-base-200 transition"
              >
                <Search size={20} />
              </button>
            </div>
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-base-300 rounded-lg shadow-lg border border-base-100 z-50">
                <div className="p-2">
                  <div className="flex justify-between items-center px-2 py-1">
                    <span className="text-xs text-base-content">
                      Pencarian Terbaru
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="btn btn-xs btn-ghost hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recentSearches.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRecentClick(term)}
                        className="btn btn-xs btn-circle transition"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Icons */}
        <div className="hidden lg:flex items-center justify-center gap-5">
          <div className="flex items-center gap-4">
            <button
              onClick={handleInbox}
              className="relative rounded-full p-2.5 bg-base-100 cursor-pointer hover:bg-base-100/60 shadow-md transition-all"
            >
              <img src={inboxIcon} alt="inbox icon" className="w-6 h-6" />
            </button>
            <button
              onClick={handleNotification}
              className="relative rounded-full p-2.5 bg-base-100 cursor-pointer hover:bg-base-100/60 shadow-md transition-all"
            >
              <img
                src={notificationIcon}
                alt="notification icon"
                className="w-6 h-6"
              />
            </button>
          </div>
          <div className="w-0.5 h-6 bg-secondary/60 rounded-full" />
          <button
            onClick={() => setIsLogoutOpen(true)}
            className="rounded-full p-2.5 bg-base-100 cursor-pointer hover:bg-base-100/60 shadow-md transition-all"
          >
            <img src={logoutIcon} alt="logout icon" className="w-6 h-6" />
          </button>
        </div>

        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="btn btn-ghost btn-square"
          >
            {user?.fotoProfil ? (
              <img
                src={user.fotoProfil}
                alt={user.namaLengkap || user.email}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <img
                src={emptyProfile}
                alt="user profile"
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
          </button>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={location.pathname}
        onNavigate={handleNavigate}
        onLogout={() => setIsLogoutOpen(true)}
        onInbox={handleInbox}
        onNotification={handleNotification}
      />

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default OwnerNavbar;
