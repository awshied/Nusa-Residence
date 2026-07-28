import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";

import type { JenisKelamin, TipeAdmin } from "@/types";
import {
  useAdminFired,
  useAdminManagement,
  useUpdateStatusAdmin,
} from "@/hooks/useAdmin";
import { formatTanggal } from "@/lib/formatTanggal";

import Loading from "@/components/layout/Loading";
import AdminBaruModal from "@/components/layout/AdminBaruModal";
import profileBanner from "@/assets/profile-background.webp";
import emptyAdmin from "@/assets/empty-admin.png";
import emptyProfile from "@/assets/empty-profile.png";

const ManajemenAdmin = () => {
  const [isNewAdminOpen, setIsNewAdminOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<TipeAdmin | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    "AKTIF" | "NONAKTIF" | "DIBLOKIR"
  >("AKTIF");

  const { data: adminList = [], isLoading } = useAdminManagement();
  const updateStatus = useUpdateStatusAdmin();
  const hapusAdmin = useAdminFired();

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

  const getStatusBadge = (status: string) => {
    const config = {
      AKTIF: {
        color: "border border-success bg-success/10 text-success",
        label: "Aktif",
      },
      NONAKTIF: {
        color: "border border-warning bg-warning/10 text-warning",
        label: "Nonaktif",
      },
      DIBLOKIR: {
        color: "border border-error bg-error/10 text-error",
        label: "Diblokir",
      },
    };
    const { color, label } = config[status as keyof typeof config] || {
      color: "border-none bg-transparent",
      label: status,
    };
    return (
      <span
        className={`py-1.5 px-3 text-center rounded-lg font-semibold ${color}`}
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
    if (!gender) {
      return (
        <p className="text-sm font-semibold text-base-content font-mona mt-1">
          Tidak Diketahui
        </p>
      );
    }
    return (
      <p className="text-sm font-semibold text-base-content font-mona mt-1">
        {config[gender]}
      </p>
    );
  };

  const handleRowClick = (admin: TipeAdmin) => {
    setSelectedAdmin(admin);
    setSelectedStatus(admin.statusAkun); // Added
    setShowProfileModal(true);
  };

  if (isLoading) {
    return <Loading isLoading={isLoading} />;
  }

  return (
    <>
      <div className="space-y-6 mt-6">
        <div className="flex items-center justify-end">
          <button
            onClick={() => setIsNewAdminOpen(true)}
            className="flex items-center justify-center gap-2 shrink-0 flex-nowrap rounded-lg py-2.5 px-5 bg-base-content hover:bg-neutral text-neutral-content font-semibold font-mona shadow-md cursor-pointer"
          >
            <Plus size={18} /> Tambah
          </button>
        </div>

        {/* Tabel Admin */}
        {adminList.length === 0 ? (
          <div className="card bg-base-100 rounded-lg shadow-xl">
            <div className="card-body items-center justify-center py-24 mx-24">
              <img
                src={emptyAdmin}
                alt="admin not found"
                className="w-30 h-30 mb-6"
              />
              <h3 className="text-2xl font-bold text-base-content font-poppins text-center mb-2">
                Admin Kosong
              </h3>
              <p className="text-base-content/70 text-base font-semibold font-mona text-center mb-4">
                Anda belum menambahkan satu pun Admin ke dalam sistem untuk
                mengelola properti
              </p>
              <button
                onClick={() => setIsNewAdminOpen(true)}
                className="flex items-center justify-center gap-2 shrink-0 rounded-lg py-3 px-6 bg-base-content hover:bg-neutral text-neutral-content font-semibold font-mona cursor-pointer"
              >
                Buat Admin Baru
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-base-100 rounded-lg border border-base-content/10 p-6">
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
                ({adminList.length}) Tersedia
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
                          <span className="py-1.5 px-3 text-center border-2 border-info bg-info/10 text-info font-semibold rounded-full">
                            Tersedia
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center font-semibold">
                        {formatTanggal(admin.dibuatPada) || "Tidak DIketahui"}
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
        )}

        {/* Modal Profil Admin */}
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
                          <p>{getAdminGender(selectedAdmin.jenisKelamin)}</p>
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

        {/* Modal Hapus Admin */}
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

      <AdminBaruModal
        isOpen={isNewAdminOpen}
        onClose={() => setIsNewAdminOpen(false)}
      />
    </>
  );
};

export default ManajemenAdmin;
