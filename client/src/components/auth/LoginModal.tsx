import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { X } from "lucide-react";
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
      <div className="modal-box max-w-xl px-10 bg-base-300">
        <div className="flex flex-col items-center justify-center mt-4 mb-8 gap-6">
          <h3 className="font-bold text-4xl font-lobster text-center text-base-content">
            Login
          </h3>
          <p className="font-semibold font-mona text-center text-base-content/70">
            Silahkan masukkan alamat email dan password Anda agar dapat
            mengakses website kami
          </p>
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
          <div className="flex items-center justify-end">
            <Link
              to="/"
              className="font-semibold text-base-content hover:underline"
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

          <p className="text-center text-sm font-mona font-semibold text-base-content">
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

export default LoginModal;
