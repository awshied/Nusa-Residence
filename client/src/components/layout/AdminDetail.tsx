import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Calendar, Mail, MapPin, Phone, X } from "lucide-react";

import { useAdminDetail } from "@/hooks/useAdmin";
import { formatTanggal } from "@/lib/formatTanggal";

import emptyProfile from "@/assets/empty-profile.png";

type AdminDetailProps = {
  isOpen: boolean;
  adminId: string | null;
  onClose: () => void;
};

const AdminDetail = ({ isOpen, adminId, onClose }: AdminDetailProps) => {
  const { data: admin, isLoading, error } = useAdminDetail(adminId || "");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [adminId]);

  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800,
  );

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

  if (!isOpen || !adminId) return null;

  const getStatusBadge = (status: string) => {
    const config = {
      AKTIF: {
        color: "text-success border-success bg-success/10",
        label: "Aktif",
      },
      NONAKTIF: {
        color: "text-warning border-warning bg-warning/10",
        label: "Cuti",
      },
      DIBLOKIR: {
        color: "text-error border-error bg-error/10",
        label: "Dipecat",
      },
    };
    const { color, label } = config[status as keyof typeof config] || {
      color: "border border-base-content/30",
      label: status,
    };

    return { color, label };
  };

  const statusConfig = admin
    ? getStatusBadge(admin.statusAkun)
    : { color: "", label: "" };

  return (
    <>
      {/* Desktop - Large Size */}
      <AnimatePresence>
        <dialog
          className="modal hidden lg:grid modal-open"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="modal-box max-w-3xl p-10">
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <span className="loading loading-bars loading-lg" />
                  <p className="mt-4 text-lg font-medium text-base-content/60">
                    Memuat data...
                  </p>
                </div>
              ) : error || !admin ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-24 h-24 text-error" />
                  <span className="mt-4 font-medium text-xl text-base-content">
                    Gagal memuat data {admin?.namaLengkap}
                  </span>
                  <p className="mt-2 text-base text-base-content/60">
                    {error instanceof Error
                      ? error.message
                      : "Terjadi kesalahan"}
                  </p>
                  <button onClick={onClose} className="btn btn-primary mt-6">
                    Tutup
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center gap-3 mb-4 shrink-0">
                    <div className="flex flex-col justify-center">
                      <h4 className="font-poppins font-bold text-xl">
                        Detail Admin
                      </h4>
                      <span className="text-sm font-medium text-secondary/80">
                        Informasi lengkap {admin.namaLengkap || admin.id}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn btn-circle btn-ghost"
                    >
                      <X
                        className="w-6 h-6 text-base-content"
                        aria-label="Tutup"
                      />
                    </button>
                  </div>

                  <div className="flex items-center py-2 gap-4">
                    <div className="avatar">
                      <div className="mask mask-squircle h-32 w-32 rounded-full shrink-0">
                        <img
                          src={
                            imageError || !admin.fotoProfil
                              ? emptyProfile
                              : admin.fotoProfil
                          }
                          alt={admin.namaLengkap || admin.email}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <span className="font-bold font-poppins text-xl truncate">
                        {admin.namaLengkap}
                      </span>
                      <div className="mb-2">
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-semibold border ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-12 min-w-0">
                        <div className="flex flex-col justify-center gap-0.5">
                          <p className="text-sm font-medium text-base-content/60">
                            ID Admin
                          </p>
                          <span className="text-base font-semibold truncate">
                            {admin.id.substring(0, 17)}...
                          </span>
                        </div>
                        <div className="flex flex-col justify-center gap-0.5">
                          <p className="text-sm font-medium text-base-content/60">
                            Jenis Kelamin
                          </p>
                          <span className="text-base font-semibold truncate">
                            {admin.jenisKelamin || "Belum Diatur"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="divider font-medium text-secondary/80 text-sm">
                    Informasi Pribadi
                  </div>

                  <div className="grid grid-cols-2 items-start gap-4 my-4 min-w-0">
                    <div className="flex flex-col items-start  justify-center gap-3 min-w-0">
                      <div className="flex items-center gap-3 min-w-0 w-full">
                        <Mail className="w-6 h-6 text-base-content/60 shrink-0" />
                        <div className="flex flex-col justify-center min-w-0 flex-1 overflow-hidden">
                          <p className="text-sm font-medium text-base-content/60">
                            Email
                          </p>
                          <span className="text-base font-semibold truncate block w-full">
                            {admin.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 min-w-0 w-full">
                        <Calendar className="w-6 h-6 text-base-content/60 shrink-0" />
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <p className="text-sm font-medium text-base-content/60">
                            Tanggal Bergabung
                          </p>
                          <span className="text-base font-semibold truncate">
                            {formatTanggal(admin.dibuatPada) ||
                              "Tidak Diketahui"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-center gap-3 min-w-0">
                      <div className="flex items-center gap-3 min-w-0 w-full">
                        <Phone className="w-6 h-6 text-base-content/60 shrink-0" />
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <p className="text-sm font-medium text-base-content/60">
                            Kontak
                          </p>
                          <span className="text-base font-semibold break-all">
                            {admin.nomorTelepon || "Tidak Tersedia"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 min-w-0 w-full">
                        <MapPin className="w-6 h-6 text-base-content/60 shrink-0" />
                        <div className="flex flex-col justify-center min-w-0 flex-1 overflow-hidden">
                          <p className="text-sm font-medium text-base-content/60">
                            Tanggung Jawab
                          </p>
                          <span className="text-base font-semibold truncate block w-full">
                            {admin.propertiDikelola
                              ? admin.propertiDikelola.nama
                              : "Belum ada tanggung jawab"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn w-full rounded-lg font-semibold text-base-100 bg-base-content hover:bg-neutral shrink-0"
                    onClick={onClose}
                  >
                    Tutup
                  </button>
                </>
              )}
            </div>
          </div>
        </dialog>
      </AnimatePresence>

      {/* Mobile - Small Size */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed flex lg:hidden inset-0 z-100 bg-black/60 backdrop-blur-sm"
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
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <span className="loading loading-bars loading-lg" />
                    <p className="mt-4 font-medium text-base-content/60">
                      Memuat data...
                    </p>
                  </div>
                ) : error || !admin ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="w-16 h-16 text-error" />
                    <span className="mt-4 font-medium text-base-content">
                      Gagal memuat data {admin?.namaLengkap}
                    </span>
                    <p className="mt-2 text-sm text-base-content/60">
                      {error instanceof Error
                        ? error.message
                        : "Terjadi kesalahan"}
                    </p>
                    <button onClick={onClose} className="btn btn-primary mt-6">
                      Tutup
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center gap-3 mb-4 shrink-0">
                      <div className="flex flex-col justify-center">
                        <h4 className="font-poppins font-bold text-lg">
                          Detail Admin
                        </h4>
                        <span className="text-sm font-medium text-secondary/80">
                          Informasi lengkap {admin.namaLengkap || admin.id}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-circle btn-ghost"
                      >
                        <X
                          className="w-6 h-6 text-base-content"
                          aria-label="Tutup"
                        />
                      </button>
                    </div>

                    <div className="flex items-center py-2 gap-4">
                      <div className="avatar">
                        <div className="mask mask-squircle h-26 w-26 rounded-full shrink-0">
                          <img
                            src={
                              imageError || !admin.fotoProfil
                                ? emptyProfile
                                : admin.fotoProfil
                            }
                            alt={admin.namaLengkap || admin.email}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <span className="font-bold font-poppins text-lg truncate">
                          {admin.namaLengkap}
                        </span>
                        <div className="mb-1">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusConfig.color}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 min-w-0">
                          <div className="flex flex-col justify-center gap-0.5">
                            <p className="text-xs font-medium text-base-content/60">
                              ID Admin
                            </p>
                            <span className="text-sm font-medium truncate">
                              {admin.id.substring(0, 8)}...
                            </span>
                          </div>
                          <div className="flex flex-col justify-center gap-0.5">
                            <p className="text-xs font-medium text-base-content/60">
                              Jenis Kelamin
                            </p>
                            <span className="text-sm font-medium truncate">
                              {admin.jenisKelamin || "Belum Diatur"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="divider font-medium text-secondary/80 text-sm">
                      Informasi Pribadi
                    </div>

                    <div className="grid grid-cols-2 items-start gap-4 mb-4 min-w-0">
                      <div className="flex flex-col items-start  justify-center gap-3 min-w-0">
                        <div className="flex items-center gap-3 min-w-0 w-full">
                          <Mail className="w-5 h-5 text-base-content/60 shrink-0" />
                          <div className="flex flex-col justify-center min-w-0 flex-1 overflow-hidden">
                            <p className="text-xs font-medium text-base-content/60">
                              Email
                            </p>
                            <span className="text-sm font-semibold truncate block w-full">
                              {admin.email}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 min-w-0 w-full">
                          <Calendar className="w-5 h-5 text-base-content/60 shrink-0" />
                          <div className="flex flex-col justify-center min-w-0 flex-1">
                            <p className="text-xs font-medium text-base-content/60">
                              Tanggal Bergabung
                            </p>
                            <span className="text-sm font-semibold truncate">
                              {formatTanggal(admin.dibuatPada) ||
                                "Tidak Diketahui"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-center gap-3 min-w-0">
                        <div className="flex items-center gap-3 min-w-0 w-full">
                          <Phone className="w-5 h-5 text-base-content/60 shrink-0" />
                          <div className="flex flex-col justify-center min-w-0 flex-1">
                            <p className="text-xs font-medium text-base-content/60">
                              Kontak
                            </p>
                            <span className="text-sm font-semibold break-all">
                              {admin.nomorTelepon || "Tidak Tersedia"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 min-w-0 w-full">
                          <MapPin className="w-5 h-5 text-base-content/60 shrink-0" />
                          <div className="flex flex-col justify-center min-w-0 flex-1 overflow-hidden">
                            <p className="text-xs font-medium text-base-content/60">
                              Tanggung Jawab
                            </p>
                            <span className="text-sm font-semibold truncate block w-full">
                              {admin.propertiDikelola
                                ? admin.propertiDikelola.nama
                                : "Belum ada tanggung jawab"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn w-full mt-2 mb-4 rounded-lg font-semibold text-base-100 bg-base-content hover:bg-neutral shrink-0"
                      onClick={onClose}
                    >
                      Tutup
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AdminDetail;
