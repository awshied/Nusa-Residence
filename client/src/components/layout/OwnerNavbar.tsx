import { useLocation, useNavigate } from "react-router-dom";

import dashboardOutlineIcon from "@/assets/icons/dashboard-outline.png";
import adminManagementOutlineIcon from "@/assets/icons/admin-management-outline.png";
import propertyManagementOutlineIcon from "@/assets/icons/property-management-outline.png";
import reportOutlineIcon from "@/assets/icons/report-outline.png";
import inboxIcon from "@/assets/icons/inbox.png";
import notificationIcon from "@/assets/icons/notification-bell.png";
import logoutIcon from "@/assets/icons/out.png";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import LogoutModal from "./LogoutModal";

interface NavigationPath {
  path?: string;
  label: string;
  icon?: string;
  children?: NavigationPath[];
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const MenuItem: NavigationPath[] = [
  {
    path: "/owner/dashboard",
    label: "Dashboard",
    icon: dashboardOutlineIcon,
  },
  {
    label: "Kelola",
    children: [
      {
        path: "/owner/kelola-admin",
        label: "Admin",
        icon: adminManagementOutlineIcon,
      },
      {
        path: "/owner/kelola-properti",
        label: "Properti",
        icon: propertyManagementOutlineIcon,
      },
    ],
  },
  {
    path: "/owner/laporan",
    label: "Laporan",
    icon: reportOutlineIcon,
  },
];

const OwnerNavbar = ({
  onSearch,
  placeholder = "Cari Properti...",
}: SearchBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

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
    if (currentItem?.icon) return currentItem.icon;
    if (parentItem?.icon) return parentItem.icon;
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
        setRecentSearches(JSON.parse(saved));
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
      <nav className="navbar w-full justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-extrabold text-base-content font-poppins">
            {currentItem?.label || "Dashboard"}
          </h3>

          <div className="breadcrumbs mt-1">
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

        <div className="flex-1 max-w-4xl mx-6">
          <div className="relative" ref={containerRef}>
            <div className="flex items-center rounded-full overflow-hidden bg-base-100 shadow-md">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                placeholder={placeholder}
                className="flex-1 pl-6 pr-3 py-3 font-medium font-mona bg-transparent outline-none text-neutral/70 placeholder:text-neutral/40"
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

        <div className="flex items-center justify-center gap-5">
          <div className="flex items-center gap-4">
            <div className="relative rounded-full p-2.5 bg-base-100 cursor-pointer hover:bg-base-100/60 shadow-md transition-all">
              <img src={inboxIcon} alt="inbox icon" className="w-6 h-6" />
            </div>
            <div className="relative rounded-full p-2.5 bg-base-100 cursor-pointer hover:bg-base-100/60 shadow-md transition-all">
              <img
                src={notificationIcon}
                alt="inbox icon"
                className="w-6 h-6"
              />
            </div>
          </div>
          <div className="w-0.5 h-6 bg-secondary/60 rounded-full" />
          <button
            onClick={() => setIsLogoutOpen(true)}
            className="rounded-full p-2.5 bg-base-100 cursor-pointer hover:bg-base-100/60 shadow-md transition-all"
          >
            <img src={logoutIcon} alt="inbox icon" className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />
    </>
  );
};

export default OwnerNavbar;
