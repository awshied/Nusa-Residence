import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { X } from "lucide-react";
import z from "zod";

import type { TipeAdmin } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { buatAdmin } from "@/services/admin.service";
import FloatingInput from "./FloatingInput";

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

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AdminBaruModal = ({ isOpen, onClose }: Props) => {
  const [adminList, setAdminList] = useState<TipeAdmin[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
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

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: TipeForm) => {
    setIsSubmitting(true);
    try {
      const response = await buatAdmin(data);
      if (response.sukses && response.data) {
        toast.success(
          response.pesan || "Anda baru saja menambahkan Admin baru.",
        );
        setAdminList([response.data, ...adminList]);
        onClose();
        reset();
      } else {
        toast.error(response.pesan || "Gagal menambahkan Admin baru.");
      }
    } catch (error) {
      toast.error(
        "Sistem telah mengalami gangguan sementara, mohon untuk mencobanya sekali lagi dalam beberapa waktu ke depan.",
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

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
          <motion.div
            className="w-300 p-6 rounded-2xl bg-base-100 border-3 border-base-300 shadow-2xl overflow-hidden"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            onClick={(e) => e.stopPropagation()}
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
                onClick={onClose}
                className="btn btn-circle btn-ghost"
              >
                <X className="w-6 h-6 text-base-content" aria-label="Tutup" />
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
                      type="text"
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
              </div>

              <div className="md:col-span-2 mb-6">
                <button
                  type="submit"
                  className="btn bg-base-content py-6 font-poppins hover:bg-neutral w-full rounded-lg text-base-100 font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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
  );
};

export default AdminBaruModal;
