import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  EllipsisVertical,
  Eye,
  Filter,
  Locate,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import type { JenisKelamin, TipeAdmin } from "@/types";
import {
  useAdminFired,
  useAdminManagement,
  useCreateNewAdmin,
  useUpdateStatusAdmin,
} from "@/hooks/useAdmin";
import { formatTanggal } from "@/lib/formatTanggal";

import Loading from "@/components/layout/Loading";
import AdminBaruModal from "@/components/layout/AdminBaruModal";
import StatisticCard from "@/components/layout/StatisticCard";
import profileBanner from "@/assets/profile-background.webp";
import emptyAdmin from "@/assets/empty-admin.png";
import emptyProfile from "@/assets/empty-profile.png";
import adminManagementIcon from "@/assets/icons/admin-management-outline.png";
import adminHolidayIcon from "@/assets/icons/admin-holiday-outline.png";
import adminFiredIcon from "@/assets/icons/admin-fired-outline.png";
import addNewAdminMobileIcon from "@/assets/icons/add-new-admin.png";
import usernameIcon from "@/assets/icons/username.png";
import emailAddressIcon from "@/assets/icons/email-address.png";
import passwordIcon from "@/assets/icons/password.png";
import phoneNumberIcon from "@/assets/icons/phone.png";

const skemaBuatAdminMobile = z.object({
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

type TipeForm = z.infer<typeof skemaBuatAdminMobile>;

const ManajemenAdmin = () => {
  const buatAdminMobile = useCreateNewAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TipeForm>({
    resolver: zodResolver(skemaBuatAdminMobile),
    defaultValues: {
      namaLengkap: "",
      email: "",
      kataSandi: "",
      nomorTelepon: "",
    },
  });

  const [isNewAdminOpen, setIsNewAdminOpen] = useState(false);
  const [mobileNewAdminVisible, setMobileNewAdminVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<TipeAdmin | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    "AKTIF" | "NONAKTIF" | "DIBLOKIR"
  >("AKTIF");

  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800,
  );

  const { data: adminList = [], isLoading } = useAdminManagement();
  const updateStatus = useUpdateStatusAdmin();
  const hapusAdmin = useAdminFired();

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

  const handleOpenAdminMenu = (admin: TipeAdmin) => {
    setSelectedAdmin(admin);
  };

  const handleCloseAdminMenu = () => {
    setSelectedAdmin(null);
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    await hapusAdmin.mutateAsync(selectedAdmin.id);
    setShowDeleteModal(false);
    setSelectedAdmin(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedAdmin) return;
    await updateStatus.mutateAsync({
      id: selectedAdmin.id,
      status: selectedStatus,
    });
    setShowProfileModal(false);
    setSelectedAdmin(null);
  };

  const onSubmit = async (data: TipeForm) => {
    await buatAdminMobile.mutateAsync(data);
    reset();
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

  const getStatusOptions = (currentStatus: string) => {
    if (currentStatus === "DIBLOKIR") {
      return [{ value: "DIBLOKIR", label: "Diblokir (Tidak dapat diubah)" }];
    }

    const options = [
      { value: "AKTIF", label: "Aktif" },
      { value: "NONAKTIF", label: "Nonaktif (Cuti)" },
    ];

    if (currentStatus !== "DIBLOKIR") {
      options.push({ value: "DIBLOKIR", label: "Diblokir (Pecat)" });
    }

    return options;
  };

  const getAdminGender = (gender?: JenisKelamin) => {
    const config = {
      LAINNYA: "Lainnya",
      PRIA: "Pria",
      WANITA: "Wanita",
    };
    return gender ? config[gender] : "Tidak Diketahui";
  };

  const handleRowClick = (admin: TipeAdmin) => {
    setSelectedAdmin(admin);
    setSelectedStatus(admin.statusAkun);
    setShowProfileModal(true);
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
                  </tr>
                </thead>
                <tbody>
                  {adminList.map((admin) => (
                    <tr
                      key={admin.id}
                      onClick={() => handleRowClick(admin)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRowClick(admin);
                        }
                      }}
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
                      <td className="rounded-r-lg">
                        <div className="flex items-center justify-center">
                          <span>{getStatusBadge(admin.statusAkun)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Admin List - Mobile */}
            <div className="flex lg:hidden flex-col bg-base-100 rounded-lg border border-base-content/10 p-4">
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
                        onClick={() => handleOpenAdminMenu(admin)}
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
            {selectedAdmin && (
              <div
                className="fixed inset-0 z-50 bg-black/30"
                onClick={handleCloseAdminMenu}
              >
                <div className="absolute right-11 top-1/2 translate-y-16 w-4 h-4 bg-base-100 rotate-45 duration-200" />
                <div
                  className="absolute right-4 top-1/2 translate-y-18 w-46 bg-base-100 rounded-lg shadow-xl overflow-hidden duration-200"
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
                        console.log("Ubah Status:", selectedAdmin);

                        handleCloseAdminMenu();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-base-content hover:bg-base-content/10 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 shrink-0 text-base-content/70" />

                      <span>Ubah Status</span>
                    </button>
                  </div>

                  <div className="border-t border-base-content/10" />

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        console.log("Hapus Admin:", selectedAdmin);

                        handleCloseAdminMenu();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-error hover:bg-error/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" />

                      <span>Hapus Admin</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Admin Selected Profile Modal - Desktop */}
        {showProfileModal && selectedAdmin && (
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
            >
              <motion.div
                className="w-full max-w-3xl p-3 rounded-3xl bg-base-100 shadow-2xl overflow-hidden"
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <div className="h-32 md:h-40 rounded-2xl bg-base-200 w-full">
                    <img
                      src={profileBanner}
                      alt="profile banner"
                      className="w-full h-full rounded-2xl object-cover opacity-85"
                    />
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(false)}
                      className="absolute top-3 right-3 btn btn-circle bg-base-100/10 border-none outline-none backdrop-blur-xs hover:opacity-80"
                      aria-label="Tutup"
                    >
                      <X className="w-4 md:w-6 text-white" />
                    </button>
                  </div>
                  <div className="absolute -bottom-15 left-5">
                    <div className="flex items-end justify-center gap-4">
                      <div className="w-30 h-30 rounded-full border-4 border-base-100 overflow-hidden">
                        <img
                          src={selectedAdmin.fotoProfil || emptyProfile}
                          alt={selectedAdmin.namaLengkap || "Admin"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-x-3 mb-2">
                        <span className="py-1.5 px-3 text-center rounded-lg font-semibold border border-neutral bg-neutral/10 text-neutral">
                          Admin
                        </span>
                        <span>{getStatusBadge(selectedAdmin.statusAkun)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-14 py-4 px-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold font-poppins text-base-content">
                      {selectedAdmin.namaLengkap}
                    </h3>
                    <p className="text-sm font-semibold text-base-content/70 font-mona">
                      {selectedAdmin.email}
                    </p>
                  </div>

                  <div className="grid grid-cols-[2fr_1fr] gap-4">
                    <div className="flex flex-col justify-center gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-base-content/60 font-mona">
                            Bergabung Pada
                          </p>
                          <p className="text-sm font-semibold text-base-content font-mona mt-1">
                            {formatTanggal(selectedAdmin.dibuatPada) ||
                              "Tidak Diketahui"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-base-content/60 font-mona">
                            Nomor Telepon
                          </p>
                          <p className="text-sm font-semibold text-base-content font-mona mt-1">
                            {selectedAdmin.nomorTelepon}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-base-content/60 font-mona">
                            Jenis Kelamin
                          </p>
                          <p className="text-sm font-semibold text-base-content font-mona mt-1">
                            {getAdminGender(selectedAdmin.jenisKelamin)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-base-content/60 font-mona">
                            Tanggung Jawab
                          </p>
                          {selectedAdmin.propertiDikelola ? (
                            <p className="text-sm font-semibold text-base-content font-mona mt-1">
                              {selectedAdmin.propertiDikelola.nama}
                            </p>
                          ) : (
                            <p className="text-sm font-semibold text-base-content font-mona mt-1">
                              Tersedia
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-control">
                      <span className="text-xs font-semibold text-base-content/60 font-mona">
                        Status Akun
                      </span>
                      <select
                        defaultValue="Small"
                        className="select font-semibold text-base-content/60 font-mona select-sm border-none mt-2 cursor-pointer"
                        value={selectedStatus}
                        onChange={(e) =>
                          setSelectedStatus(
                            e.target.value as "AKTIF" | "NONAKTIF" | "DIBLOKIR",
                          )
                        }
                      >
                        {getStatusOptions(selectedAdmin.statusAkun).map(
                          (opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className="font-semibold text-base-content/60 font-mona"
                            >
                              {opt.label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3 pt-4 border-t border-base-content/20">
                    <button
                      onClick={() => {
                        setShowProfileModal(false);
                        setSelectedAdmin(selectedAdmin);
                        setShowDeleteModal(true);
                      }}
                      className="flex-1 btn border border-error bg-error/10 text-error rounded-lg font-semibold font-mona hover:bg-error/30"
                      disabled={!!selectedAdmin.propertiDikelola}
                      title={
                        selectedAdmin.propertiDikelola
                          ? "Admin Sibuk"
                          : "Hapus Admin"
                      }
                    >
                      {selectedAdmin.propertiDikelola
                        ? "Tidak Dapat Dihapus"
                        : "Hapus Admin"}
                    </button>
                    <button
                      className="flex-1 btn border border-neutral/0 bg-neutral text-base-100 rounded-lg font-semibold font-mona hover:bg-base-content"
                      onClick={handleUpdateStatus}
                      disabled={
                        updateStatus.isPending ||
                        !!selectedAdmin.propertiDikelola
                      }
                    >
                      {updateStatus.isPending ? (
                        <span className="loading loading-bars" />
                      ) : (
                        "Simpan"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Add New Admin - Mobile */}
        {mobileNewAdminVisible && (
          <AnimatePresence mode="wait">
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut", type: "tween" }}
              onClick={() => setMobileNewAdminVisible(false)}
              className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
              style={{
                willChange: "opacity",
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden",
              }}
            >
              <motion.div
                key="content"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{
                  duration: 0.4,
                  ease: [0.32, 0.72, 0, 1],
                  type: "tween",
                }}
                className="fixed flex h-auto flex-col inset-x-0 bottom-0 z-40 bg-base-100 rounded-t-4xl"
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
                            src={addNewAdminMobileIcon}
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
                                disabled={buatAdminMobile.isPending}
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
                                disabled={buatAdminMobile.isPending}
                              />
                              {errors.email && (
                                <label className="label">
                                  <span className="label-text-alt text-error">
                                    {errors.email.message}
                                  </span>
                                </label>
                              )}
                            </div>
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
                                disabled={buatAdminMobile.isPending}
                              />
                              {errors.kataSandi && (
                                <label className="label">
                                  <span className="label-text-alt text-error">
                                    {errors.kataSandi.message}
                                  </span>
                                </label>
                              )}
                            </div>
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
                                disabled={buatAdminMobile.isPending}
                              />
                              {errors.nomorTelepon && (
                                <label className="label">
                                  <span className="label-text-alt text-error">
                                    {errors.nomorTelepon.message}
                                  </span>
                                </label>
                              )}
                            </div>
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
                          disabled={buatAdminMobile.isPending}
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="btn bg-base-content text-base-100 rounded-lg"
                          disabled={buatAdminMobile.isPending}
                        >
                          {buatAdminMobile.isPending ? (
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
          </AnimatePresence>
        )}

        {/* Selected Admin Delete Modal - Desktop */}
        {showDeleteModal && selectedAdmin && (
          <dialog
            className="modal modal-open"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowDeleteModal(false);
            }}
          >
            <div className="modal-box">
              <h3 className="font-bold font-poppins text-lg text-error">
                Hapus Admin
              </h3>
              <p className="py-4 font-medium">
                Apakah Anda yakin ingin menghapus Admin{" "}
                <strong>
                  "{selectedAdmin.namaLengkap || selectedAdmin.email}"
                </strong>
                dari <strong>Nusa Residence</strong>?
              </p>
              <div className="modal-action">
                <button
                  className="btn rounded-lg font-semibold"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={hapusAdmin.isPending}
                >
                  Batal
                </button>
                <button
                  className="btn btn-error rounded-lg font-semibold text-base-100"
                  onClick={handleDelete}
                  disabled={hapusAdmin.isPending}
                >
                  {hapusAdmin.isPending ? (
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

      {/* Add New Admin Modal - Desktop */}
      <AdminBaruModal
        isOpen={isNewAdminOpen}
        onClose={() => setIsNewAdminOpen(false)}
      />
    </>
  );
};

export default ManajemenAdmin;
