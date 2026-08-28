import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  EllipsisVertical,
  Eye,
  Filter,
  Locate,
  Lock,
  Phone,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import type { TipeAdmin } from "@/types";
import {
  useAdminDeletePermanently,
  useAdminManagement,
  useCreateNewAdmin,
} from "@/hooks/useAdmin";
import { formatTanggal } from "@/lib/formatTanggal";

import Loading from "@/components/layout/Loading";
import StatisticCard from "@/components/layout/StatisticCard";
import FloatingInput from "@/components/layout/FloatingInput";
import UbahStatusAdminModal from "@/components/layout/UbahStatusAdminModal";
import emptyAdmin from "@/assets/empty-admin.png";
import emptyProfile from "@/assets/empty-profile.png";
import adminManagementIcon from "@/assets/icons/admin-management-outline.png";
import adminHolidayIcon from "@/assets/icons/admin-holiday-outline.png";
import adminFiredIcon from "@/assets/icons/admin-fired-outline.png";
import addNewAdminIcon from "@/assets/icons/add-new-admin.png";
import usernameIcon from "@/assets/icons/username.png";
import emailAddressIcon from "@/assets/icons/email-address.png";
import passwordIcon from "@/assets/icons/password.png";
import phoneNumberIcon from "@/assets/icons/phone.png";

const skemaBuatAdmin = z.object({
  email: z
    .string()
    .email("Format alamat email yang Anda masukkan tidak valid.")
    .min(5, "Email minimal 5 karakter.")
    .max(100, "Email maksimal 100 karakter."),
  kataSandi: z
    .string()
    .min(8, "Password minimal harus memiliki setidaknya 8 karakter.")
    .max(50, "Password maksimal 50 karakter.")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar.")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil.")
    .regex(/[0-9]/, "Password harus mengandung angka."),
  namaLengkap: z
    .string()
    .min(4, "Nama lengkap minimal 4 karakter.")
    .max(100, "Nama lengkap maksimal 100 karakter.")
    .optional(),
  nomorTelepon: z
    .string()
    .min(9, "Nomor telepon minimal 9 karakter.")
    .max(15, "Nomor telepon maksimal 15 karakter.")
    .regex(/^[0-9+]{10,15}$/, "Nomor telepon tidak valid.")
    .optional(),
});

type TipeForm = z.infer<typeof skemaBuatAdmin>;

const ManajemenAdmin = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TipeForm>({
    resolver: zodResolver(skemaBuatAdmin),
    defaultValues: {
      namaLengkap: "",
      email: "",
      kataSandi: "",
      nomorTelepon: "",
    },
  });

  const [isNewAdminOpen, setIsNewAdminOpen] = useState(false);
  const [mobileNewAdminVisible, setMobileNewAdminVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<TipeAdmin | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileMenuPosition, setMobileMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const [selectedAdminForMenu, setSelectedAdminForMenu] =
    useState<TipeAdmin | null>(null);

  const [showUbahStatusModal, setShowUbahStatusModal] = useState(false);
  const [selectedAdminForStatus, setSelectedAdminForStatus] =
    useState<TipeAdmin | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800,
  );

  const { data: adminList = [], isLoading } = useAdminManagement();
  const buatAdminBaru = useCreateNewAdmin();
  const hapusAdminPermanen = useAdminDeletePermanently();

  const adminAktif = adminList.filter(
    (admin) => admin.statusAkun === "AKTIF",
  ).length;
  const adminCuti = adminList.filter(
    (admin) => admin.statusAkun === "NONAKTIF",
  ).length;
  const adminDipecat = adminList.filter(
    (admin) => admin.statusAkun === "DIBLOKIR",
  ).length;
  const totalAdmin = adminList.length;

  const handleOpenAdminMenu = (
    admin: TipeAdmin,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMobileMenuPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
    setSelectedAdminForMenu(admin);
    setShowMobileMenu(true);
  };

  const handleCloseAdminMenu = () => {
    setShowMobileMenu(false);
  };

  const handleOpenUbahStatus = (admin: TipeAdmin) => {
    setSelectedAdminForStatus(admin);
    setShowUbahStatusModal(true);
    handleCloseAdminMenu();
  };

  const handleCloseUbahStatus = () => {
    setShowUbahStatusModal(false);
    setSelectedAdminForStatus(null);
  };

  const handleAdminDeletePermanently = async () => {
    if (!selectedAdmin) return;

    try {
      await hapusAdminPermanen.mutateAsync(selectedAdmin.id);
      setShowDeleteModal(false);
      setSelectedAdmin(null);
      setSelectedAdminForMenu(null);
      setShowMobileMenu(false);
    } catch (error) {
      console.error("Gagal menghapus Admin:", error);
    }
  };

  const onSubmit = async (data: TipeForm) => {
    await buatAdminBaru.mutateAsync(data);
    reset();
    setIsNewAdminOpen(false);
    setMobileNewAdminVisible(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    const handleFocus = () => setTimeout(handleResize, 300);
    window.addEventListener("focusin", handleFocus);
    window.addEventListener("focusout", handleFocus);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.removeEventListener("focusin", handleFocus);
      window.removeEventListener("focusout", handleFocus);
    };
  }, []);

  const getStatusBadge = (status: string) => {
    const config = {
      AKTIF: {
        color: "border border-success bg-success/10 text-success",
        label: "Aktif",
      },
      NONAKTIF: {
        color: "border border-warning bg-warning/10 text-warning",
        label: "Cuti",
      },
      DIBLOKIR: {
        color: "border border-error bg-error/10 text-error",
        label: "Dipecat",
      },
    };
    const { color, label } = config[status as keyof typeof config] || {
      color: "border-none bg-transparent",
      label: status,
    };
    return (
      <span
        className={`py-1 lg:py-1.5 px-2 lg:px-3 text-center rounded-lg font-semibold ${color}`}
      >
        {label}
      </span>
    );
  };

  if (isLoading) {
    return <Loading isLoading={isLoading} />;
  }

  return (
    <>
      <div className="space-y-6 mt-6 px-4 lg:px-0">
        {/* Statistic Card - All Device */}
        <div className="mx-auto grid grid-cols-3 gap-2 lg:gap-4">
          <StatisticCard
            title="Admin Aktif"
            value={adminAktif}
            icon={adminManagementIcon}
            trend={{
              value:
                adminList.length > 0
                  ? Math.round((adminAktif / totalAdmin) * 100)
                  : 0,
              label: "dari total Admin",
              isPositive: true,
            }}
          />
          <StatisticCard
            title="Admin Cuti"
            value={adminCuti}
            icon={adminHolidayIcon}
            trend={{
              value:
                adminList.length > 0
                  ? Math.round((adminCuti / totalAdmin) * 100)
                  : 0,
              label: "dari total Admin",
              isPositive: false,
            }}
          />
          <StatisticCard
            title="Admin Dipecat"
            value={adminDipecat}
            icon={adminFiredIcon}
            trend={{
              value:
                adminList.length > 0
                  ? Math.round((adminDipecat / totalAdmin) * 100)
                  : 0,
              label: "dari total Admin",
              isPositive: false,
            }}
          />
        </div>

        {/* Desktop - Large Size */}
        <div className="hidden lg:flex items-center justify-end gap-2">
          <button className="flex items-center justify-center gap-2 shrink-0 flex-nowrap rounded-lg py-2.5 px-5 bg-base-100 hover:opacity-80 border border-base-content/30 text-base-content font-semibold font-mona shadow-md cursor-pointer">
            <Filter size={18} /> Filter
          </button>
          <button
            onClick={() => setIsNewAdminOpen(true)}
            className="flex items-center justify-center gap-2 shrink-0 flex-nowrap rounded-lg py-2.5 px-5 bg-base-content hover:bg-neutral text-neutral-content font-semibold font-mona shadow-md cursor-pointer"
          >
            <Plus size={18} /> Tambah
          </button>
        </div>

        {/* Mobile - Small Size */}
        <div className="flex lg:hidden flex-col justify-center gap-3">
          <div className="flex breadcrumbs items-center ml-1">
            <ul>
              <li>
                <img
                  src={adminManagementIcon}
                  alt="page icon"
                  className="w-4 h-4"
                />
              </li>
              <li>
                <p className="text-sm font-medium text-base-content font-mona">
                  Kelola
                </p>
              </li>
              <li>
                <p className="text-sm font-medium text-base-content font-mona">
                  Admin
                </p>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="flex-1 bg-base-100 flex items-center rounded-full px-5 shadow-md">
              <Search size={20} />
              <input
                type="text"
                placeholder="Cari Admin..."
                className="flex-1 ml-3 py-2 font-medium font-mona bg-transparent outline-none text-neutral/70 placeholder:text-neutral/40"
              />
            </div>
            <button className="btn btn-circle bg-base-100 shadow-md hover:opacity-80">
              <Filter size={20} />
            </button>
            <button
              onClick={() => setMobileNewAdminVisible(true)}
              className="btn btn-circle bg-base-content text-base-100 shadow-md hover:opacity-80"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Empty Admin List - All Device */}
        {adminList.length === 0 ? (
          <div className="card bg-transparent lg:bg-base-100 rounded-lg shadow-none lg:shadow-xl">
            <div className="card-body items-center justify-center py-24 mx-0 lg:mx-24">
              <img
                src={emptyAdmin}
                alt="admin not found"
                className="w-30 h-30 mb-6"
              />
              <h3 className="text-xl lg:text-2xl font-bold text-base-content font-poppins text-center">
                Admin Kosong
              </h3>
              <p className="text-base-content/70 text-sm lg:text-base font-semibold font-mona text-center mb-4">
                Anda belum menambahkan satu pun Admin ke dalam sistem untuk
                mengelola properti
              </p>
              <button
                onClick={() => setIsNewAdminOpen(true)}
                className="hidden lg:flex items-center justify-center gap-2 shrink-0 rounded-lg py-3 px-6 bg-base-content hover:bg-neutral text-neutral-content font-semibold font-mona cursor-pointer"
              >
                Buat Admin Baru
              </button>
              <button
                onClick={() => setMobileNewAdminVisible(true)}
                className="flex lg:hidden items-center justify-center gap-2 shrink-0 rounded-lg py-3 px-6 bg-base-content hover:bg-neutral text-neutral-content font-semibold font-mona cursor-pointer"
              >
                Buat Admin Baru
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Admin Table - Desktop */}
            <div className="hidden lg:flex flex-col overflow-x-auto bg-base-100 rounded-lg border border-base-content/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col justify-center gap-2">
                  <h3 className="text-xl font-poppins font-extrabold text-base-content">
                    Jumlah Admin
                  </h3>
                  <span className="text-sm font-mona font-semibold text-base-content/60">
                    Ketersediaan staff Admin di berbagai wilayah dalam mengelola
                    properti Nusa Residence untuk kebutuhan para tamu
                  </span>
                </div>
                <h6 className="text-sm font-mona font-semibold text-base-content/60">
                  ({totalAdmin}) Tersedia
                </h6>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center font-mona text-base-content">
                      Identitas
                    </th>
                    <th className="text-center font-mona text-base-content">
                      Tanggung Jawab
                    </th>
                    <th className="text-center font-mona text-base-content">
                      Bergabung Pada
                    </th>
                    <th className="text-center font-mona text-base-content">
                      Status Keaktifan
                    </th>
                    <th className="text-center font-mona text-base-content">
                      Opsi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adminList.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-neutral/5 transition cursor-pointer rounded-lg"
                    >
                      <td className="rounded-l-lg">
                        <div className="flex items-center gap-3">
                          {admin.fotoProfil ? (
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12 rounded-full">
                                <img
                                  src={admin.fotoProfil}
                                  alt={admin.namaLengkap || admin.email}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12 rounded-full">
                                <img
                                  src={emptyProfile}
                                  alt="Default Image"
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-base text-base-content">
                              {admin.namaLengkap}
                            </span>
                            <span className="font-medium text-sm text-base-content/60">
                              {admin.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-center">
                          {admin.propertiDikelola ? (
                            <div className="flex flex-col items-center justify-center gap-1">
                              <span className="font-bold text-base text-base-content">
                                {admin.propertiDikelola.nama}
                              </span>
                              <span className="font-semibold text-sm text-base-content/60">
                                {admin.nomorTelepon}
                              </span>
                            </div>
                          ) : (
                            <span className="text-center font-semibold text-base-content/60 truncate">
                              Belum ada tanggung jawab
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-center font-semibold text-base-content/60">
                          {formatTanggal(admin.dibuatPada) || "Tidak Diketahui"}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-center">
                          <span>{getStatusBadge(admin.statusAkun)}</span>
                        </div>
                      </td>
                      <td className="rounded-r-lg">
                        <div className="flex items-center justify-center shrink-0">
                          <button
                            type="button"
                            className="bg-transparent p-2 flex items-center justify-center rounded-full cursor-pointer hover:bg-neutral/10 transition-color"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {admin.statusAkun !== "DIBLOKIR" && (
                            <button
                              type="button"
                              onClick={() => {
                                if (!admin.propertiDikelola) {
                                  handleOpenUbahStatus(admin);
                                }
                              }}
                              disabled={!!admin.propertiDikelola}
                              className={`bg-transparent p-2 flex items-center justify-center rounded-full transition-color ${admin.propertiDikelola ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-neutral/10"}`}
                            >
                              <Activity className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (!admin.propertiDikelola) {
                                setSelectedAdmin(admin);
                                setShowDeleteModal(true);
                              }
                            }}
                            disabled={!!admin.propertiDikelola}
                            className={`bg-transparent p-2 flex items-center justify-center rounded-full transition-color ${admin.propertiDikelola ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-neutral/10"}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Admin List - Mobile */}
            <div className="flex lg:hidden flex-col bg-base-100 rounded-lg border border-base-content/10 p-4 mb-20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-poppins font-extrabold text-base-content">
                  Semua Admin
                </h3>
                <span className="text-xs font-mona font-semibold text-base-content/60">
                  ({totalAdmin}) Tersedia
                </span>
              </div>

              <div className="space-y-4">
                {adminList.map((admin) => (
                  <div
                    key={admin.id}
                    className="w-full flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden">
                        <img
                          src={admin?.fotoProfil || emptyProfile}
                          alt={admin.namaLengkap || admin.email}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
                        <h6 className="font-bold text-start text-sm text-base-content truncate">
                          {admin.namaLengkap}
                        </h6>
                        <div className="flex items-center gap-1 text-secondary/70 min-w-0">
                          <Phone className="w-3 h-3 shrink-0" />
                          <span className="text-xs font-medium truncate">
                            {admin.nomorTelepon}
                          </span>
                        </div>
                        {admin.propertiDikelola ? (
                          <div className="flex items-center gap-1 text-secondary/70 min-w-0">
                            <Locate className="w-3 h-3 shrink-0" />
                            <span className="text-xs font-medium truncate">
                              {admin.propertiDikelola.nama}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-secondary/70 truncate">
                            Belum ada tanggung jawab
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-center shrink-0">
                      <span className="text-xs">
                        {getStatusBadge(admin.statusAkun)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleOpenAdminMenu(admin, e)}
                        className="bg-transparent p-2 flex items-center justify-center outline-none border-none rounded-full cursor-pointer shrink-0"
                      >
                        <EllipsisVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Menu - Mobile */}
            <div className="flex lg:hidden">
              {showMobileMenu && selectedAdminForMenu && mobileMenuPosition && (
                <div
                  className="fixed inset-0 z-60 bg-black/30"
                  onClick={handleCloseAdminMenu}
                >
                  <div
                    className="absolute w-4 h-4 bg-base-100 rotate-45 duration-200"
                    style={{
                      top: mobileMenuPosition.top - 8,
                      right: mobileMenuPosition.right + 12,
                    }}
                  />
                  <div
                    className="absolute w-46 bg-base-100 rounded-lg shadow-xl overflow-hidden duration-200"
                    style={{
                      top: mobileMenuPosition.top,
                      right: mobileMenuPosition.right,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={() => {
                          console.log("Lihat Detail:", selectedAdmin);

                          handleCloseAdminMenu();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-base-content hover:bg-base-content/10 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4 shrink-0 text-base-content/70" />
                        <span>Lihat Detail</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            selectedAdminForMenu.statusAkun !== "DIBLOKIR" &&
                            !selectedAdminForMenu.propertiDikelola
                          ) {
                            handleOpenUbahStatus(selectedAdminForMenu);
                          }
                        }}
                        disabled={
                          selectedAdminForMenu.statusAkun === "DIBLOKIR" ||
                          !!selectedAdminForMenu.propertiDikelola
                        }
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedAdminForMenu.statusAkun === "DIBLOKIR" || selectedAdminForMenu.propertiDikelola ? "text-base-content/40 cursor-not-allowed" : "text-base-content hover:bg-base-content/10 cursor-pointer"}`}
                      >
                        <div className="flex items-center gap-3">
                          <Activity className="w-4 h-4 shrink-0 text-base-content/70" />
                          <span>Ubah Status</span>
                        </div>
                        {(selectedAdminForMenu.statusAkun === "DIBLOKIR" ||
                          selectedAdminForMenu.propertiDikelola) && (
                          <Lock className="w-3 h-3 shrink-0 text-secondary/60" />
                        )}
                      </button>
                    </div>

                    <div className="border-t border-base-content/10" />

                    <div className="p-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedAdminForMenu.propertiDikelola) {
                            setSelectedAdmin(selectedAdminForMenu);
                            setShowDeleteModal(true);
                            setShowMobileMenu(false);
                          }
                        }}
                        disabled={!!selectedAdminForMenu.propertiDikelola}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedAdminForMenu.propertiDikelola ? "text-error/40 cursor-not-allowed" : "text-error hover:bg-error/10 cursor-pointer"}`}
                      >
                        <div className="flex items-center gap-3">
                          <Trash2 className="w-4 h-4 shrink-0 text-error/70" />
                          <span>Hapus Admin</span>
                        </div>
                        {selectedAdminForMenu.propertiDikelola && (
                          <Lock className="w-3 h-3 shrink-0 text-secondary/60" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Add New Admin - Desktop */}
        <AnimatePresence>
          {isNewAdminOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewAdminOpen(false)}
              className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120 }}
                onClick={(e) => e.stopPropagation()}
                className="w-220 p-6 rounded-2xl bg-base-100 border-3 border-base-content/40 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between pb-6 border-b border-secondary/60">
                  <div className="flex items-center gap-6">
                    <img
                      src={addNewAdminIcon}
                      alt="add admin"
                      className="w-7 h-7"
                    />
                    <h4 className="font-lobster text-base-content font-bold text-2xl">
                      Tambah Admin
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNewAdminOpen(false)}
                    className="btn btn-circle btn-ghost"
                  >
                    <X
                      className="w-6 h-6 text-base-content"
                      aria-label="Tutup"
                    />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"
                >
                  <div className="form-control">
                    <Controller
                      name="namaLengkap"
                      control={control}
                      render={({ field }) => (
                        <FloatingInput
                          label="Nama Lengkap"
                          name={field.name}
                          type="text"
                          icon={usernameIcon}
                          value={field.value}
                          onChange={(e) => {
                            if (
                              "target" in e &&
                              typeof e.target.value === "string"
                            ) {
                              field.onChange(e.target.value);
                            }
                          }}
                        />
                      )}
                    />
                    {errors.namaLengkap && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.namaLengkap.message}
                        </span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <FloatingInput
                          label="Email"
                          name={field.name}
                          type="email"
                          icon={emailAddressIcon}
                          value={field.value}
                          onChange={(e) => {
                            if (
                              "target" in e &&
                              typeof e.target.value === "string"
                            ) {
                              field.onChange(e.target.value);
                            }
                          }}
                        />
                      )}
                    />
                    {errors.email && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.email.message}
                        </span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <Controller
                      name="kataSandi"
                      control={control}
                      render={({ field }) => (
                        <FloatingInput
                          label="Password"
                          name={field.name}
                          type="password"
                          icon={passwordIcon}
                          value={field.value}
                          onChange={(e) => {
                            if (
                              "target" in e &&
                              typeof e.target.value === "string"
                            ) {
                              field.onChange(e.target.value);
                            }
                          }}
                        />
                      )}
                    />
                    {errors.kataSandi && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.kataSandi.message}
                        </span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <Controller
                      name="nomorTelepon"
                      control={control}
                      render={({ field }) => (
                        <FloatingInput
                          label="Nomor Telepon"
                          name={field.name}
                          type="tel"
                          icon={phoneNumberIcon}
                          value={field.value}
                          onChange={(e) => {
                            if (
                              "target" in e &&
                              typeof e.target.value === "string"
                            ) {
                              field.onChange(e.target.value);
                            }
                          }}
                        />
                      )}
                    />
                    {errors.nomorTelepon && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.nomorTelepon.message}
                        </span>
                      </label>
                    )}
                  </div>
                  <div className="md:col-span-2 mb-6">
                    <button
                      type="submit"
                      className="btn bg-base-content py-6 font-poppins hover:bg-neutral w-full rounded-lg text-base-100 font-semibold"
                      disabled={buatAdminBaru.isPending}
                    >
                      {buatAdminBaru.isPending ? (
                        <span className="loading loading-bars" />
                      ) : (
                        "Tambah"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add New Admin - Mobile */}
        <AnimatePresence>
          {mobileNewAdminVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setMobileNewAdminVisible(false)}
              className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{
                  duration: 0.45,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="fixed inset-x-0 bottom-0 z-120 h-auto bg-base-100 rounded-t-4xl"
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxHeight: Math.min(viewportHeight * 0.9, 800),
                  willChange: "transform, opacity",
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                  WebkitTransform: "translateZ(0)",
                  transform: "translateZ(0)",
                }}
              >
                <div
                  className="container mx-auto py-2 px-6 flex flex-col h-auto overflow-hidden"
                  style={{
                    maxHeight: Math.min(viewportHeight * 0.9, 800),
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="space-y-3 flex flex-col h-full">
                    <div className="flex items-center justify-center shrink-0">
                      <span className="bg-base-300 h-1.5 w-10 rounded-full" />
                    </div>
                    {/* Header */}
                    <div className="flex flex-col gap-1 justify-center mb-4 shrink-0">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img
                            src={addNewAdminIcon}
                            alt="add admin"
                            className="w-7 h-7 object-cover"
                          />
                          <h4 className="font-poppins font-bold text-lg">
                            Tambah Admin
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMobileNewAdminVisible(false)}
                          className="btn btn-circle btn-ghost"
                        >
                          <X
                            className="w-6 h-6 text-base-content"
                            aria-label="Tutup"
                          />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-secondary">
                        Lengkapi informasi di bawah ini untuk menambah Admin
                        baru
                      </span>
                    </div>

                    {/* Main Content */}
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col flex-1 overflow-hidden"
                    >
                      <div
                        className="flex-1 overflow-y-auto overflow-x-hidden"
                        style={{
                          WebkitOverflowScrolling: "touch",
                          paddingBottom: "env(safe-area-inset-bottom)",
                          WebkitBackfaceVisibility: "hidden",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <div className="flex flex-col gap-2 pb-4">
                          <div className="form-control">
                            <label className="label items-start text-sm mb-2">
                              <span className="font-mona font-bold">
                                Nama Lengkap{" "}
                                <span className="text-xs text-error">*</span>
                              </span>
                            </label>
                            <div className="bg-base-200 flex items-center rounded-lg px-4">
                              <img
                                src={usernameIcon}
                                alt="username"
                                className="w-5 h-5"
                              />
                              <input
                                type="text"
                                placeholder="Masukkan nama"
                                className="flex-1 ml-3 py-3 font-medium text-sm placeholder:text-sm font-mona bg-transparent outline-none text-neutral/70 placeholder:text-neutral/40"
                                {...register("namaLengkap")}
                                disabled={buatAdminBaru.isPending}
                              />
                            </div>
                            {errors.namaLengkap && (
                              <span className="label-text-alt text-error mt-1">
                                {errors.namaLengkap.message}
                              </span>
                            )}
                          </div>
                          <div className="form-control">
                            <label className="label items-start text-sm mb-2">
                              <span className="font-mona font-bold">
                                Email{" "}
                                <span className="text-xs text-error">*</span>
                              </span>
                            </label>
                            <div className="bg-base-200 flex items-center rounded-lg px-4">
                              <img
                                src={emailAddressIcon}
                                alt="email"
                                className="w-5 h-5"
                              />
                              <input
                                type="email"
                                placeholder="Masukkan alamat email"
                                className="flex-1 ml-3 py-3 font-medium text-sm placeholder:text-sm font-mona bg-transparent outline-none text-neutral/70 placeholder:text-neutral/40"
                                {...register("email")}
                                disabled={buatAdminBaru.isPending}
                              />
                            </div>
                            {errors.email && (
                              <span className="label-text-alt text-error mt-1">
                                {errors.email.message}
                              </span>
                            )}
                          </div>
                          <div className="form-control">
                            <label className="label items-start text-sm mb-2">
                              <span className="font-mona font-bold">
                                Password{" "}
                                <span className="text-xs text-error">*</span>
                              </span>
                            </label>
                            <div className="bg-base-200 flex items-center rounded-lg px-4">
                              <img
                                src={passwordIcon}
                                alt="password"
                                className="w-5 h-5"
                              />
                              <input
                                type="password"
                                placeholder="Masukkan kata sandi"
                                className="flex-1 ml-3 py-3 font-medium text-sm placeholder:text-sm font-mona bg-transparent outline-none text-neutral/70 placeholder:text-neutral/40"
                                {...register("kataSandi")}
                                disabled={buatAdminBaru.isPending}
                              />
                            </div>
                            {errors.kataSandi && (
                              <span className="label-text-alt text-error mt-1">
                                {errors.kataSandi.message}
                              </span>
                            )}
                          </div>
                          <div className="form-control">
                            <label className="label items-start text-sm mb-2">
                              <span className="font-mona font-bold">
                                Kontak{" "}
                                <span className="text-xs text-error">*</span>
                              </span>
                            </label>
                            <div className="bg-base-200 flex items-center rounded-lg px-4">
                              <img
                                src={phoneNumberIcon}
                                alt="phone number"
                                className="w-5 h-5"
                              />
                              <input
                                type="tel"
                                placeholder="Masukkan nomor telepon"
                                className="flex-1 ml-3 py-3 font-medium text-sm placeholder:text-sm font-mona bg-transparent outline-none text-neutral/70 placeholder:text-neutral/40"
                                {...register("nomorTelepon")}
                                disabled={buatAdminBaru.isPending}
                              />
                            </div>
                            {errors.nomorTelepon && (
                              <span className="label-text-alt text-error mt-1">
                                {errors.nomorTelepon.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div
                        className="shrink-0 grid grid-cols-2 gap-3 pt-4 pb-2"
                        style={{
                          paddingBottom:
                            "calc(env(safe-area-inset-bottom) + 0.5rem)",
                        }}
                      >
                        <button
                          type="button"
                          className="btn border border-base-content rounded-lg"
                          onClick={() => setMobileNewAdminVisible(false)}
                          disabled={buatAdminBaru.isPending}
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="btn bg-base-content text-base-100 rounded-lg"
                          disabled={buatAdminBaru.isPending}
                        >
                          {buatAdminBaru.isPending ? (
                            <span className="loading loading-bars" />
                          ) : (
                            "Tambah"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Admin Delete Modal - All Device */}
        {showDeleteModal && selectedAdmin && (
          <dialog
            className="modal modal-open"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowDeleteModal(false);
                setSelectedAdmin(null);
              }
            }}
          >
            <div className="modal-box flex flex-col items-center gap-3">
              <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden">
                <img
                  src={selectedAdmin?.fotoProfil || emptyProfile}
                  alt="Foto Admin"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold font-poppins text-lg mt-2">
                {selectedAdmin.namaLengkap}
              </h3>
              <p className="font-medium text-center text-base-content/60 text-sm lg:text-base">
                Apakah Anda yakin ingin menghapus {selectedAdmin.namaLengkap}{" "}
                dari daftar Admin Nusa Residence?
              </p>
              <div className="w-full mt-4 lg:mt-5 grid grid-cols-2 justify-center gap-3">
                <button
                  className="btn rounded-lg font-semibold"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedAdmin(null);
                  }}
                  disabled={hapusAdminPermanen.isPending}
                >
                  Batal
                </button>
                <button
                  className="btn btn-neutral rounded-lg font-semibold text-base-100"
                  onClick={handleAdminDeletePermanently}
                  disabled={hapusAdminPermanen.isPending}
                >
                  {hapusAdminPermanen.isPending ? (
                    <span className="loading loading-bars text-base-content" />
                  ) : (
                    "Hapus"
                  )}
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>

      <UbahStatusAdminModal
        isOpen={showUbahStatusModal}
        admin={selectedAdminForStatus}
        onClose={handleCloseUbahStatus}
      />
    </>
  );
};

export default ManajemenAdmin;
