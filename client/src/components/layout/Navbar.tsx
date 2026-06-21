import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import LoginModal from "../auth/LoginModal";
import RegistrasiModal from "../auth/RegistrasiModal";
import SearchBar from "./SearchBar";
import ProfileModal from "./ProfileModal";

import logoWeb from "@/assets/logo-web.png";
import homeOutline from "@/assets/icons/home-outline.png";
import homeFill from "@/assets/icons/home-fill.png";
import residenceOutline from "@/assets/icons/residences-outline.png";
import residenceFill from "@/assets/icons/residences-fill.png";
import wishlistOutline from "@/assets/icons/wishlist-outline.png";
import wishlistFill from "@/assets/icons/wishlist-fill.png";
import orderHistoryOutline from "@/assets/icons/order-history-outline.png";
import orderHistoryFill from "@/assets/icons/order-history-fill.png";
import loginOutline from "@/assets/icons/login-outline.png";
import registerOutline from "@/assets/icons/register-outline.png";
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
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
    return <div className="h-12 bg-base-100" />;
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-base-100/95 backdrop-blur-md shadow-md" : "bg-base-100 shadow-sm"}`}
      >
        <div className="container mx-auto p-2">
          <div className="flex justify-between items-center">
            {/* Icon Menu untuk Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden btn btn-ghost btn-square"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-start gap-1">
              <a href="/" className="flex items-center shrink-0">
                <img
                  src={logoWeb}
                  alt="logo web"
                  className="w-10 h-auto hidden md:flex"
                />
                <h4 className="text-xl md:text-3xl ml-3 font-lobster font-extrabold text-base-content">
                  Nusa Residence
                </h4>
              </a>
              <p className="text-xs font-semibold font-poppins text-base-content">
                ID
              </p>
            </div>

            {/* Kolom Input Pencarian */}
            <div className="flex-1 hidden md:block max-w-2xl mx-4">
              <SearchBar />
            </div>

            {/* Link ke Halaman Lain */}
            <div className="flex items-center space-x-12">
              <div className="hidden md:flex items-center gap-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="relative btn btn-ghost btn-circle hover:bg-base-300 transition"
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

              {/* Profil Singkat */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 shrink-0 relative group">
                  <div className="flex flex-col items-end justify-center">
                    <p className="text-[10px] md:text-xs font-bold font-mona text-base-content/70">
                      Selamat Datang
                    </p>
                    <span className="font-extrabold text-xs md:text-base text-base-content font-poppins leading-4 md:leading-6">
                      {user?.namaLengkap}
                    </span>
                  </div>
                  {user?.fotoProfil ? (
                    <img
                      src={user.fotoProfil}
                      alt={user.namaLengkap || user.email}
                      className="w-8 md:w-10 h-auto rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={emptyProfile}
                      alt="user profile"
                      className="w-8 md:w-10 h-auto rounded-full"
                    />
                  )}

                  <ChevronDown
                    size={20}
                    className="transition-transform hidden md:flex duration-300 group-hover:rotate-180 text-base-content"
                  />

                  {/* Dropdown Auth */}
                  <div className="absolute hidden md:flex top-14 right-0 w-64 bg-base-100 rounded-xl shadow-lg opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
                    <div className="flex flex-col p-2 w-full">
                      <button
                        onClick={() => setIsProfileOpen(true)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-base-200 rounded-lg cursor-pointer transition-colors"
                      >
                        <img
                          src={userProfileIcon}
                          alt="edit profile"
                          className="w-5 h-auto"
                        />
                        <span className="font-mona font-semibold text-base-content">
                          Profil
                        </span>
                      </button>
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
                        onClick={handleLogout}
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
                <>
                  {/* Belum Login - Desktop Mode */}
                  <div className="hidden md:flex items-center gap-2">
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

                  {/* Belum Login - Mobile Mode */}
                  <div className="flex md:hidden items-center gap-1">
                    <button
                      className="btn btn-circle btn-ghost transition"
                      onClick={() => setIsLoginOpen(true)}
                    >
                      <img
                        src={loginOutline}
                        alt="login icon"
                        className="w-5 h-auto"
                      />
                    </button>
                    <button
                      className="btn btn-circle btn-ghost transition"
                      onClick={() => setIsRegisterOpen(true)}
                    >
                      <img
                        src={registerOutline}
                        alt="register icon"
                        className="w-5 h-auto"
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar Link */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-x-0 bottom-0 z-40 bg-base-100 rounded-t-4xl md:hidden"
            >
              <div className="container mx-auto px-4 pb-4 pt-6 space-y-3">
                <div className="space-y-1">
                  <div className="divider font-bold text-secondary text-sm">
                    Jelajahi
                  </div>
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;

                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-1.5 border-l-3 rounded-r-lg transition ${
                          isActive
                            ? "bg-base-300 border-base-content rounded-l-none"
                            : "bg-transparent hover:bg-base-300 rounded-l-lg border-base-content/0"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-3 ${isActive ? "text-base-content" : "text-base-content/70 hover:text-base-content"}`}
                        >
                          <img
                            src={isActive ? link.iconFill : link.iconOutline}
                            alt={link.label}
                            className="w-4 h-auto"
                          />
                          <span className="font-mona font-semibold text-sm">
                            {link.label}
                          </span>
                        </div>

                        {(link.count ?? 0) > 0 && (
                          <span className="p-2 bg-error/10 text-error font-bold text-xs rounded-full flex items-center justify-center">
                            {(link.count ?? 0) > 9 ? "9+" : link.count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="divider font-bold text-secondary text-sm">
                      Akun
                    </div>

                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="bg-transparent w-full hover:bg-base-300 flex items-center gap-3 text-base-content/70 hover:text-base-content px-3 py-1.5 border-l-3 border-base-content/0 rounded-lg transition cursor-pointer"
                    >
                      <img
                        src={userProfileIcon}
                        alt="edit profile"
                        className="w-4 h-auto"
                      />
                      <span className="font-mona font-semibold text-sm">
                        Profil
                      </span>
                    </button>
                    <Link
                      to="/setelan"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-transparent hover:bg-base-300 flex items-center gap-3 text-base-content/70 hover:text-base-content px-3 py-1.5 border-l-3 border-base-content/0 rounded-lg transition"
                    >
                      <img
                        src={settingIcon}
                        alt="settings"
                        className="w-4 h-auto"
                      />
                      <span className="font-mona font-semibold text-sm">
                        Setelan
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-transparent w-full hover:bg-error/10 flex items-center gap-3 text-error px-3 py-1.5 border-l-3 border-base-content/0 rounded-lg transition cursor-pointer"
                    >
                      <img
                        src={logoutIcon}
                        alt="logout"
                        className="w-4 h-auto"
                      />
                      <span className="font-mona font-semibold text-sm">
                        Logout
                      </span>
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default Navbar;
