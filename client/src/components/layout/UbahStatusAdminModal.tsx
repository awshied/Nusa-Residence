import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

import type { TipeAdmin } from "@/types";
import { useUpdateStatusAdmin } from "@/hooks/useAdmin";

import statusUpdate from "@/assets/icons/status-update.png";
import emptyProfile from "@/assets/empty-profile.png";
import adminActive from "@/assets/icons/admin-active.png";
import adminVacation from "@/assets/icons/admin-vacation.png";
import adminBlock from "@/assets/icons/admin-block.png";

type UbahStatusAdminProps = {
  isOpen: boolean;
  admin: TipeAdmin | null;
  onClose: () => void;
  onSuccess?: () => void;
};

type StatusOption = {
  label: string;
  value: "AKTIF" | "NONAKTIF" | "DIBLOKIR";
  color: string;
  description: string;
  icon: string;
  iconBg: string;
};

const UbahStatusAdminModal = ({
  isOpen,
  admin,
  onClose,
  onSuccess,
}: UbahStatusAdminProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    "AKTIF" | "NONAKTIF" | "DIBLOKIR" | null
  >(null);

  const updateStatus = useUpdateStatusAdmin();

  if (!isOpen || !admin) return null;

  const getStatusOptions = (currentStatus: string): StatusOption[] => {
    switch (currentStatus) {
      case "AKTIF":
        return [
          {
            label: "Cuti",
            value: "NONAKTIF",
            color: "text-warning border-warning/60",
            description:
              "Admin akan berstatus Cuti dan tidak dapat mengelola properti untuk sementara waktu",
            icon: adminVacation,
            iconBg: "bg-warning/20",
          },
          {
            label: "Dipecat",
            value: "DIBLOKIR",
            color: "text-error border-error/60",
            description:
              "Admin akan dipecat dan tidak dapat diaktifkan kembali",
            icon: adminBlock,
            iconBg: "bg-error/20",
          },
        ];
      case "NONAKTIF":
        return [
          {
            label: "Aktif",
            value: "AKTIF",
            color: "text-success border-success/60",
            description:
              "Admin akan aktif kembali sehingga memiliki tanggung jawab untuk mengelola properti",
            icon: adminActive,
            iconBg: "bg-success/20",
          },
          {
            label: "Dipecat",
            value: "DIBLOKIR",
            color: "text-error border-error/60",
            description:
              "Admin akan dipecat dan tidak dapat diaktifkan kembali",
            icon: adminBlock,
            iconBg: "bg-error/20",
          },
        ];
      default:
        return [];
    }
  };

  const statusOptions = getStatusOptions(admin.statusAkun);
  const currentStatusLabel =
    {
      AKTIF: "Aktif",
      NONAKTIF: "Cuti",
      DIBLOKIR: "Dipecat",
    }[admin.statusAkun] || admin.statusAkun;

  const statusColors = {
    AKTIF: "text-success border-success bg-success/10",
    NONAKTIF: "text-warning border-warning bg-warning/10",
    DIBLOKIR: "text-error border-error bg-error/10",
  };

  const handleStatusSelect = (status: "AKTIF" | "NONAKTIF" | "DIBLOKIR") => {
    setSelectedStatus(status);
    setTimeout(() => {
      setShowConfirmModal(true);
    }, 50);
  };

  const handleConfirmStatusChange = async () => {
    if (!admin || !selectedStatus) return;

    try {
      await updateStatus.mutateAsync({
        id: admin.id,
        status: selectedStatus,
      });

      setShowConfirmModal(false);
      setSelectedStatus(null);
      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Gagal mengubah status:", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setSelectedStatus(null);
  };

  return (
    <>
      {/* Modal Utama */}
      <dialog
        className={`modal ${isOpen && !showConfirmModal ? "modal-open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget && !showConfirmModal) {
            onClose();
          }
        }}
      >
        <div className="modal-box p-8 lg:p-10 max-w-md space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-neutral/15 p-3 flex items-center justify-center rounded-full mb-2">
              <img
                src={statusUpdate}
                alt="Update Status"
                className="w-10 lg:w-12 h-10 lg:h-12"
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5 lg:gap-1">
              <h3 className="font-bold font-poppins text-base lg:text-lg">
                Ubah Status Admin
              </h3>
              <p className="font-medium text-center text-base-content/60 text-sm">
                Silahkan pilih status baru untuk {admin.namaLengkap}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-1 lg:gap-2">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="mask mask-squircle h-12 lg:h-14 w-12 lg:w-14 rounded-full shrink-0">
                  <img
                    src={admin?.fotoProfil || emptyProfile}
                    alt={admin.namaLengkap || admin.email}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-0 lg:gap-0.5">
                <span className="font-bold text-base">{admin.namaLengkap}</span>
                <span className="font-medium text-sm text-base-content/60">
                  {admin.email}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-xs lg:text-sm text-base-content/60">
                Status Saat Ini
              </span>
              <span
                className={`px-2 lg:px-3 py-1 rounded-md lg:rounded-lg font-medium lg:font-semibold text-xs lg:text-sm ${statusColors[admin.statusAkun as keyof typeof statusColors] || "border border-base-content/30"}`}
              >
                {currentStatusLabel}
              </span>
            </div>
          </div>

          {/* Pilihan Status */}
          <div className="space-y-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusSelect(option.value)}
                className={`w-full p-4 border rounded-lg transition-all hover:opacity-80 cursor-pointer ${option.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr] items-center">
                    <div
                      className={`w-10 lg:w-12 h-10 lg:h-12 p-2 flex items-center justify-center border rounded-md ${option.iconBg}`}
                    >
                      <img
                        src={option.icon}
                        alt="Option Image"
                        className="w-5 lg:w-6 h-5 lg:h-6 object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-bold text-sm lg:text-base">
                        {option.label}
                      </span>
                      <p className="font-medium text-start text-[10px] lg:text-xs text-secondary">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ChevronRight className="w-4 lg:w-5 h-4 lg:h-5 text-secondary" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </dialog>

      {/* Modal Konfirmasi */}
      <AnimatePresence>
        {showConfirmModal && selectedStatus && (
          <dialog
            className="modal modal-open"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCancel();
              }
            }}
          >
            <div className="modal-box max-w-md p-8 lg:p-10">
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`p-3 flex items-center justify-center rounded-full mb-2 ${
                    selectedStatus === "AKTIF"
                      ? "bg-success/20"
                      : selectedStatus === "NONAKTIF"
                        ? "bg-warning/20"
                        : "bg-error/20"
                  }`}
                >
                  <img
                    src={
                      selectedStatus === "AKTIF"
                        ? adminActive
                        : selectedStatus === "NONAKTIF"
                          ? adminVacation
                          : adminBlock
                    }
                    alt="Logo Status"
                    className="w-12 h-12"
                  />
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                  <h5 className="font-bold font-poppins text-xl">
                    {selectedStatus === "AKTIF"
                      ? "Aktifkan Admin"
                      : selectedStatus === "NONAKTIF"
                        ? "Admin Cuti"
                        : "Pecat Admin"}
                  </h5>
                  <p className="font-medium text-center text-base-content/60 text-sm">
                    {admin.namaLengkap}{" "}
                    {selectedStatus === "AKTIF"
                      ? "akan diaktifkan kembali dan dapat bekerja seperti biasa"
                      : selectedStatus === "NONAKTIF"
                        ? "akan dinonaktifkan sementara untuk mengambil waktu cuti dalam kurun waktu tertentu"
                        : "akan dibebas tugaskan sehingga statusnya tidak dapat diubah kembali"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_3fr] gap-2 mt-8">
                <button
                  className="btn rounded-lg font-semibold border border-neutral/15"
                  onClick={handleCancel}
                  disabled={updateStatus.isPending}
                >
                  Batal
                </button>
                <button
                  className="btn rounded-lg font-semibold text-base-100 bg-base-content hover:bg-neutral"
                  onClick={handleConfirmStatusChange}
                  disabled={updateStatus.isPending}
                >
                  {updateStatus.isPending ? (
                    <span className="loading loading-bars" />
                  ) : (
                    <span>
                      {selectedStatus === "AKTIF"
                        ? "Aktifkan Kembali"
                        : selectedStatus === "NONAKTIF"
                          ? "Beri Waktu Cuti"
                          : "Ya, Pecat Admin"}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default UbahStatusAdminModal;
