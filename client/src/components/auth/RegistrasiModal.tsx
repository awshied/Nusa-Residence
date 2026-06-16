import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";

import FloatingInput from "../layout/FloatingInput";
import usernameIcon from "@/assets/icons/username.png";
import emailAddressIcon from "@/assets/icons/email-address.png";
import passwordIcon from "@/assets/icons/password.png";
import confirmPasswordIcon from "@/assets/icons/confirm-password.png";

const skemaRegistrasi = z
  .object({
    namaLengkap: z.string(),
    email: z
      .string()
      .email(
        "Alamat email yang Anda masukkan telah digunakan oleh pengguna lain.",
      ),
    kataSandi: z
      .string()
      .min(8, "Password minimal harus memiliki setidaknya 8 karakter."),
    konfirmasiKataSandi: z.string(),
  })
  .refine((data) => data.kataSandi === data.konfirmasiKataSandi, {
    message: "Password tidak cocok.",
    path: ["konfirmasiKataSandi"],
  });

type TipeForm = z.infer<typeof skemaRegistrasi>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const RegistrasiModal = ({ isOpen, onClose, onLoginClick }: Props) => {
  const { registrasi, isLoading } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TipeForm>({
    resolver: zodResolver(skemaRegistrasi),
    defaultValues: {
      namaLengkap: "",
      email: "",
      kataSandi: "",
      konfirmasiKataSandi: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: TipeForm) => {
    const sukses = await registrasi(data);
    if (sukses) {
      onClose();
      reset();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      className="modal modal-open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box max-w-xl px-10 bg-base-300">
        <div className="flex flex-col items-center justify-center mt-4 mb-8 gap-6">
          <h3 className="font-bold text-4xl font-lobster text-center text-base-content">
            Registrasi
          </h3>
          <p className="font-semibold font-mona text-center text-base-content/70">
            Mohon untuk segera daftarkan akun Anda agar dapat menjadi salah satu
            member di{" "}
            <span className="font-bold text-base-content">Nusa Residence</span>
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    if ("target" in e && typeof e.target.value === "string") {
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
                    if ("target" in e && typeof e.target.value === "string") {
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
                    if ("target" in e && typeof e.target.value === "string") {
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
              name="konfirmasiKataSandi"
              control={control}
              render={({ field }) => (
                <FloatingInput
                  label="Konfirmasi Password"
                  name={field.name}
                  type="password"
                  icon={confirmPasswordIcon}
                  value={field.value}
                  onChange={(e) => {
                    if ("target" in e && typeof e.target.value === "string") {
                      field.onChange(e.target.value);
                    }
                  }}
                />
              )}
            />
            {errors.konfirmasiKataSandi && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.konfirmasiKataSandi.message}
                </span>
              </label>
            )}
          </div>

          <button
            type="submit"
            className="btn bg-neutral font-poppins hover:bg-neutral/90 w-full rounded-lg text-base-100 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? <span className="loading loading-bars" /> : "Daftar"}
          </button>

          <p className="text-center text-sm font-mona font-semibold text-base-content">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                onLoginClick();
              }}
              className="font-extrabold hover:underline cursor-pointer"
            >
              Masuk
            </button>
          </p>
        </form>

        <div className="modal-action">
          <button
            className="btn btn-circle btn-ghost absolute right-6 top-4"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default RegistrasiModal;
