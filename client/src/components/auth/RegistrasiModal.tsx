import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Check, Eye, EyeClosed, X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";

import FloatingInput from "../layout/FloatingInput";
import usernameIcon from "@/assets/icons/username.png";
import emailAddressIcon from "@/assets/icons/email-address.png";
import passwordIcon from "@/assets/icons/password.png";
import confirmPasswordIcon from "@/assets/icons/confirm-password.png";

const skemaRegistrasi = z
  .object({
    namaLengkap: z
      .string()
      .min(4, "Nama lengkap minimal 4 karakter.")
      .max(100, "Nama lengkap maksimal 100 karakter."),
    email: z
      .string()
      .email("Format alamat email yang Anda masukkan tidak valid.")
      .min(5, "Email minimal 5 karakter.")
      .max(100, "Email maksimal 100 karakter."),
    kataSandi: z
      .string()
      .min(8, "Password minimal harus memiliki setidaknya 8 karakter.")
      .max(50, "Password maksimal harus memiliki setidaknya 50 karakter.")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar.")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil.")
      .regex(/[0-9]/, "Password harus mengandung angka."),
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

interface RequirementDef {
  label: string;
  regex: RegExp;
}

const setRequirementDefs: RequirementDef[] = [
  {
    label: "Password minimal harus memiliki setidaknya 8 karakter",
    regex: /.{8,}/,
  },
  {
    label: "Password harus memiliki paling tidak 1 huruf besar (A-Z)",
    regex: /[A-Z]/,
  },
  {
    label: "Password harus memiliki paling tidak 1 huruf kecil (a-z)",
    regex: /[a-z]/,
  },
  {
    label: "Password harus memiliki paling tidak 1 angka (0-9)",
    regex: /[0-9]/,
  },
];

const RegistrasiModal = ({ isOpen, onClose, onLoginClick }: Props) => {
  const { registrasi, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
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

  const password = watch("kataSandi");

  useEffect(() => {
    if (!isOpen) {
      reset();
      setShowPassword(false);
    }
  }, [isOpen, reset]);

  const requirements = useMemo(
    () =>
      setRequirementDefs.map((req) => ({
        ...req,
        met: req.regex.test(password),
      })),
    [password],
  );

  const metCount = requirements.filter((r) => r.met).length;
  const strength = (metCount / requirements.length) * 100;

  const getStrengthColor = () => {
    if (strength <= 25) return "bg-error";
    if (strength <= 50) return "bg-warning";
    if (strength <= 75) return "bg-info";
    return "bg-success";
  };

  const getStrengthText = () => {
    if (strength <= 25) return "Lemah";
    if (strength <= 50) return "Sedang";
    if (strength <= 75) return "Kuat";
    return "Sakit Jiwa";
  };

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
      <div className="modal-box max-w-5xl px-8 md:px-10 bg-base-100">
        <div className="flex flex-col items-center justify-center mt-4 mb-4 md:mb-8 gap-3 md:gap-6">
          <h3 className="font-bold text-2xl md:text-4xl font-lobster text-center text-base-content">
            Registrasi
          </h3>
          <p className="font-semibold text-xs md:text-base font-mona text-center text-base-content/70">
            Mohon untuk segera daftarkan akun Anda agar dapat menjadi salah satu
            member di{" "}
            <span className="font-bold text-base-content">Nusa Residence</span>
          </p>
        </div>

        <div className="divider text-xs md:text-base font-semibold font-mona text-secondary">
          registrasikan akun Anda
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
            <div className="form-control">
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

            {password && (
              <div className="flex md:hidden flex-col gap-2 mt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-base-content font-mona font-semibold">
                      Kekuatan Password
                    </span>
                    <span
                      className={`font-semibold font-mona ${getStrengthColor().replace("bg-", "text-")}`}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-base-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-1 text-xs">
                  {requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center font-semibold gap-1.5 ${
                        req.met ? "text-success" : "text-error"
                      }`}
                    >
                      {req.met ? <Check size={12} /> : <X size={12} />}
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-control">
              <Controller
                name="konfirmasiKataSandi"
                control={control}
                render={({ field }) => (
                  <FloatingInput
                    label="Konfirmasi Password"
                    name={field.name}
                    type={showPassword ? "text" : "password"}
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
          </div>

          {password && (
            <div className="hidden md:flex flex-col gap-2 mt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-base-content font-mona font-semibold">
                    Kekuatan Password
                  </span>
                  <span
                    className={`font-semibold font-mona ${getStrengthColor().replace("bg-", "text-")}`}
                  >
                    {getStrengthText()}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-base-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 text-xs">
                {requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center font-semibold gap-1.5 ${
                      req.met ? "text-success" : "text-error"
                    }`}
                  >
                    {req.met ? <Check size={12} /> : <X size={12} />}
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn bg-neutral font-poppins hover:bg-neutral/90 w-full rounded-lg text-base-100 font-semibold mt-3"
            disabled={isLoading}
          >
            {isLoading ? <span className="loading loading-bars" /> : "Daftar"}
          </button>

          <p className="text-center text-xs md:text-sm font-mona font-semibold text-base-content">
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

export default RegistrasiModal;
