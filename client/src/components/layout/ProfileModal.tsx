import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Pencil, X } from "lucide-react";
import z from "zod";

import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";

import profileBanner from "@/assets/profile-background.webp";
import emptyProfile from "@/assets/empty-profile.png";
import emailIcon from "@/assets/icons/email-address.png";

const skemaUpdateProfil = z.object({
  namaLengkap: z
    .string()
    .min(4, "Nama lengkap minimal 4 karakter.")
    .max(100, "Nama lengkap maksimal 100 karakter."),
  nomorTelepon: z
    .string()
    .min(9, "Nomor telepon minimal 9 karakter.")
    .max(15, "Nomor telepon maksimal 15 karakter.")
    .regex(/^[0-9+]{10,15}$/, "Nomor telepon tidak valid."),
  jenisKelamin: z.enum(["LAINNYA", "PRIA", "WANITA"]),
});

type TipeDataProfil = z.infer<typeof skemaUpdateProfil>;

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: ProfileProps) => {
  const { user, isAuthenticated, isLoading, isError, updateProfil } = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TipeDataProfil>({
    resolver: zodResolver(skemaUpdateProfil),
    defaultValues: {
      namaLengkap: "",
      nomorTelepon: "",
      jenisKelamin: "LAINNYA",
    },
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      reset({
        namaLengkap: user.namaLengkap || "",
        nomorTelepon: user.nomorTelepon || "",
        jenisKelamin: user.jenisKelamin || "LAINNYA",
      });
    }
  }, [user, reset]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleUpload = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Gunakan format JPG, PNG, WEBP, atau GIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 5MB.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));

    const sukses = await updateProfil({ fotoProfil: file });
    if (sukses) {
      toast.success("Foto profil berhasil diperbarui!");
    }
  };

  const onSubmit = async (data: TipeDataProfil) => {
    const sukses = await updateProfil(data);
    if (sukses) {
      toast.success("Data dan informasi profil Anda berhasil diperbarui.");
      onClose();
    }
  };

  if (!isAuthenticated || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {isLoading ? (
            <motion.div
              className="w-90 md:w-120 p-8 rounded-3xl bg-base-100 shadow-2xl space-y-5 overflow-hidden"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="skeleton h-32 w-full" />
              <div className="flex items-center gap-4">
                <div className="skeleton h-24 w-24 shrink-0 rounded-full" />
                <div className="flex flex-col gap-4">
                  <div className="skeleton h-8 w-72" />
                  <div className="skeleton h-8 w-72" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="skeleton h-12 w-full" />
                <div className="skeleton h-12 w-full" />
                <div className="skeleton h-12 w-full" />
              </div>
            </motion.div>
          ) : isError ? (
            <div className="flex flex-col gap-0 md:gap-3 items-center justify-center py-12 px-6">
              <div className="text-white mb-4">
                <svg
                  className="w-16 md:w-24 h-16 md:h-24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-center font-poppins font-extrabold text-base md:text-xl text-white mb-2">
                Profil Tidak Ditemukan
              </span>
              <p className="text-center font-mona text-xs md:text-base font-medium text-white/70">
                Mohon untuk periksa kembali koneksi internet Anda agar kami
                dapat memuat data dan informasi profil Anda
              </p>
            </div>
          ) : (
            <motion.div
              className="w-90 md:w-120 p-2 rounded-3xl bg-base-100 shadow-2xl overflow-hidden"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="h-30 md:h-42 rounded-2xl bg-base-200 w-full">
                  <img
                    src={profileBanner}
                    alt="profile banner"
                    className="w-full h-full rounded-2xl object-cover opacity-85"
                  />
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 btn btn-circle bg-base-100/10 border-none outline-none backdrop-blur-xs hover:opacity-80"
                    aria-label="Tutup"
                  >
                    <X className="w-4 md:w-6 text-white" />
                  </button>
                </div>

                <motion.div
                  className="absolute -bottom-12 md:-bottom-16 left-5 md:left-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <div className="flex items-end justify-center md:w-100 gap-3 md:gap-4">
                    <div className="relative">
                      <div className="w-26 md:w-32 h-26 md:h-32 rounded-full border-5 md:border-6 border-base-100 overflow-hidden">
                        <img
                          src={preview || user?.fotoProfil || emptyProfile}
                          alt="foto profil"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <button
                        onClick={() => fileRef.current?.click()}
                        className="absolute bottom-0 right-0 btn btn-circle bg-base-300 border-4 border-base-100"
                      >
                        <Pencil className="fill-base-content/70 w-4 md:w-5 text-base-content/70" />
                      </button>

                      <input
                        ref={fileRef}
                        type="file"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file);
                        }}
                      />
                    </div>

                    <label className="input validator gap-1 mr-7 md:mr-0">
                      <img src={emailIcon} alt="email icon" className="w-4" />
                      <input
                        type="email"
                        value={user?.email}
                        className="input w-full rounded-xl bg-base-200 font-mona font-semibold text-base-content/50 text-xs"
                        disabled
                      />
                    </label>
                  </div>
                </motion.div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="px-8 mt-15 md:mt-20 space-y-2"
              >
                <Controller
                  name="namaLengkap"
                  control={control}
                  render={({ field }) => (
                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="font-mona font-medium text-xs">
                          Nama Lengkap
                        </span>
                      </label>
                      <input
                        {...field}
                        placeholder="Masukkan nama lengkap baru Anda"
                        className="input w-full rounded-xl font-mona font-semibold text-base-content/70"
                      />
                    </div>
                  )}
                />
                {errors.namaLengkap && (
                  <p className="text-error text-sm">
                    {errors.namaLengkap.message}
                  </p>
                )}
                <Controller
                  name="nomorTelepon"
                  control={control}
                  render={({ field }) => (
                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="font-mona font-medium text-xs">
                          Nomor Telepon
                        </span>
                      </label>
                      <input
                        {...field}
                        placeholder="Masukkan nomor telepon baru Anda"
                        className="input w-full rounded-xl font-mona font-semibold text-base-content/70"
                      />
                    </div>
                  )}
                />
                {errors.nomorTelepon && (
                  <p className="text-error text-sm">
                    {errors.nomorTelepon.message}
                  </p>
                )}

                <Controller
                  name="jenisKelamin"
                  control={control}
                  render={({ field }) => (
                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="font-mona font-medium text-xs">
                          Jenis Kelamin
                        </span>
                      </label>
                      <select
                        {...field}
                        className="select select-bordered w-full rounded-xl font-mona font-semibold text-base-content/70"
                      >
                        <option value="LAINNYA">Lainnya</option>
                        <option value="PRIA">Pria</option>
                        <option value="WANITA">Wanita</option>
                      </select>
                    </div>
                  )}
                />

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-base-200 rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold">724</p>
                    <p className="text-xs font-medium">Wishlist</p>
                  </div>
                  <div className="bg-base-200 rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold">86</p>
                    <p className="text-xs font-medium">Pesanan</p>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn mt-2 mb-4 bg-neutral font-poppins hover:bg-neutral/90 w-full rounded-lg text-base-100 font-semibold"
                >
                  {isLoading ? (
                    <span className="loading loading-bars" />
                  ) : (
                    "Simpan Profil"
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
