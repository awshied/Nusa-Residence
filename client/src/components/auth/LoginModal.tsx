import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeClosed, X } from "lucide-react";
import { Link } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";

import FloatingInput from "../layout/FloatingInput";
import emailAddressIcon from "@/assets/icons/email-address.png";
import passwordIcon from "@/assets/icons/password.png";

const skemaLogin = z.object({
  email: z.string().email("Alamat email yang Anda masukkan tidak valid."),
  kataSandi: z.string().min(1, "Password tidak boleh kosong."),
});

type TipeForm = z.infer<typeof skemaLogin>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

const LoginModal = ({ isOpen, onClose, onRegisterClick }: Props) => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TipeForm>({
    resolver: zodResolver(skemaLogin),
    defaultValues: {
      email: "",
      kataSandi: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setShowPassword(false);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: TipeForm) => {
    const sukses = await login(data);
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
      <div className="modal-box max-w-xl px-8 md:px-10 bg-base-100">
        <div className="flex flex-col items-center justify-center mt-4 mb-4 md:mb-8 gap-3 md:gap-6">
          <h3 className="font-bold text-2xl md:text-4xl font-lobster text-center text-base-content">
            Login
          </h3>
          <p className="font-semibold text-xs md:text-base font-mona text-center text-base-content/70">
            Silahkan masukkan alamat email dan password Anda agar dapat
            mengakses website kami
          </p>
        </div>

        <div className="divider text-xs md:text-base font-semibold font-mona text-secondary">
          masuk dengan akun Anda
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="form-control mt-2">
            <Controller
              name="kataSandi"
              control={control}
              render={({ field }) => (
                <FloatingInput
                  label="Password"
                  name={field.name}
                  type={showPassword ? "text" : "password"}
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
          <div className="flex items-center justify-end">
            <Link
              to="/"
              className="text-sm md:text-base font-semibold text-base-content hover:underline"
            >
              Lupa Password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn bg-neutral font-poppins hover:bg-neutral/90 w-full rounded-lg text-base-100 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? <span className="loading loading-bars" /> : "Masuk"}
          </button>

          <p className="text-center text-xs md:text-sm font-mona font-semibold text-base-content">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                onRegisterClick();
              }}
              className="font-extrabold hover:underline cursor-pointer"
            >
              Daftar
            </button>
          </p>
        </form>

        <div className="modal-action">
          <div className="absolute right-4 top-2 md:right-6 md:top-4 flex flex-col items-center gap-0 md:gap-1">
            <button
              type="button"
              className="btn btn-circle btn-ghost"
              onClick={onClose}
              aria-label="Tutup"
            >
              <X className="w-4 md:w-6 text-base-content" />
            </button>
            <button
              type="button"
              className="btn btn-circle btn-ghost"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? (
                <Eye className="w-4 md:w-6 text-base-content" />
              ) : (
                <EyeClosed className="w-4 md:w-6 text-base-content" />
              )}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default LoginModal;
