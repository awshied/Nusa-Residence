import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import LoginModal from "../auth/LoginModal";
import RegistrasiModal from "../auth/RegistrasiModal";
import SearchBar from "./SearchBar";

import logoWeb from "@/assets/logo-web.png";
import homeOutline from "@/assets/icons/home-outline.png";
import homeFill from "@/assets/icons/home-fill.png";
import residenceOutline from "@/assets/icons/residences-outline.png";
import residenceFill from "@/assets/icons/residences-fill.png";
import wishlistOutline from "@/assets/icons/wishlist-outline.png";
import wishlistFill from "@/assets/icons/wishlist-fill.png";
import orderHistoryOutline from "@/assets/icons/order-history-outline.png";
import orderHistoryFill from "@/assets/icons/order-history-fill.png";
import emptyProfile from "@/assets/empty-profile.png";
import userProfileIcon from "@/assets/icons/username.png";
import settingIcon from "@/assets/icons/setting.png";
import logoutIcon from "@/assets/icons/logout.png";

type NavLink = {
  path: string;
  label: string;
  iconOutline: string;
  iconFill: string;
  count?: number;
};

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navLinks: NavLink[] = [
    {
      path: "/",
      label: "Beranda",
      iconOutline: homeOutline,
      iconFill: homeFill,
    },
    {
      path: "/penginapan",
      label: "Penginapan",
      iconOutline: residenceOutline,
      iconFill: residenceFill,
    },
    {
      path: "/wishlist",
      label: "Wishlist",
      iconOutline: wishlistOutline,
      iconFill: wishlistFill,
      count: 0,
    },
    {
      path: "/pesanan",
      label: "Pesanan",
      iconOutline: orderHistoryOutline,
      iconFill: orderHistoryFill,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  if (!mounted) {
    return <div className="h-16 bg-base-100" />;
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-base-100/95 backdrop-blur-md shadow-md" : "bg-base-100 shadow-sm"}`}
      >
        <div className="container mx-auto p-2">
          <div className="flex justify-between items-center">
            <div className="flex items-start gap-1">
              <a href="/" className="flex items-center shrink-0">
                <img src={logoWeb} alt="logo web" className="w-10 h-auto" />
                <h4 className="text-3xl ml-3 font-lobster font-extrabold text-base-content">
                  Nusa Residence
                </h4>
              </a>
              <p className="text-xs font-semibold font-poppins text-base-content">
                ID
              </p>
            </div>

            <div className="flex-1 max-w-2xl mx-4">
              <SearchBar />
            </div>

            <div className="flex items-center space-x-12">
              <div className="flex items-center gap-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`relative btn btn-ghost btn-circle hover:bg-base-300 transition ${isActive ? "" : ""}`}
                    >
                      <img
                        src={isActive ? link.iconFill : link.iconOutline}
                        alt={link.label}
                        className="w-6 h-auto"
                      />
                      {(link.count ?? 0) > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white font-bold text-xs rounded-full flex items-center justify-center">
                          {(link.count ?? 0) > 9 ? "9+" : link.count}
                        </span>
                      )}
                      {isActive ? (
                        <div className="absolute bottom-0 h-1 w-5 bg-base-content rounded-full" />
                      ) : (
                        <></>
                      )}
                    </Link>
                  );
                })}
              </div>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3 shrink-0 relative group">
                  <div className="flex flex-col items-end justify-center">
                    <p className="text-xs font-bold font-mona text-base-content/70">
                      Selamat Datang
                    </p>
                    <span className="font-extrabold text-base-content font-poppins leading-6">
                      {user?.namaLengkap}
                    </span>
                  </div>
                  <img
                    src={emptyProfile}
                    alt="user profile"
                    className="w-10 h-auto rounded-full"
                  />

                  <ChevronDown
                    size={20}
                    className="transition-transform duration-300 group-hover:rotate-180 text-base-content"
                  />

                  <div className="absolute top-14 right-0 w-64 bg-base-100 rounded-xl shadow-lg opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
                    <div className="flex flex-col p-2">
                      <Link
                        to="/profil"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-base-200 rounded-lg transition-colors"
                      >
                        <img
                          src={userProfileIcon}
                          alt="edit profile"
                          className="w-5 h-auto"
                        />
                        <span className="font-mona font-semibold text-base-content">
                          Profil
                        </span>
                      </Link>
                      <div className="divider px-4 py-0 my-0" />

                      <Link
                        to="/setelan"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-base-200 rounded-lg transition-colors"
                      >
                        <img
                          src={settingIcon}
                          alt="setting"
                          className="w-5 h-auto"
                        />
                        <span className="font-mona font-semibold text-base-content">
                          Setelan
                        </span>
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-error/10 rounded-lg cursor-pointer transition-colors"
                      >
                        <img
                          src={logoutIcon}
                          alt="logout"
                          className="w-5 h-auto"
                        />
                        <span className="font-mona font-semibold text-error">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    className="btn font-mona bg-base-300 text-base-content rounded-xl font-semibold hover:bg-base-300/80"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    Masuk
                  </button>
                  <button
                    className="btn font-mona bg-neutral text-neutral-content rounded-xl font-semibold hover:bg-neutral/80"
                    onClick={() => setIsRegisterOpen(true)}
                  >
                    Daftar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modal Components */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onRegisterClick={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegistrasiModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onLoginClick={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;
