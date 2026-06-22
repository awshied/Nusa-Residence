import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import { Check, Eye, EyeClosed, X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";

import FloatingInput from "@/components/layout/FloatingInput";
import passwordIcon from "@/assets/icons/password.png";
import confirmPasswordIcon from "@/assets/icons/confirm-password.png";

const skemaResetPassword = z
  .object({
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

type TipeForm = z.infer<typeof skemaResetPassword>;

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

const ResetPassword = () => {
  const { resetPassword, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TipeForm>({
    resolver: zodResolver(skemaResetPassword),
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const password = watch("kataSandi");

  useEffect(() => {
    if (!token) {
      toast.error("Token reset password tidak ditemukan.");
      navigate("/");
    }
  }, [token, navigate]);

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
    if (!token) return;

    const sukses = await resetPassword({
      ...data,
      token,
    });

    if (sukses) {
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    }
  };

  if (!token) {
    return null;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 max-w-xl w-full shadow-lg">
        <div className="relative card-body">
          <div className="flex flex-col items-center justify-center mt-4 mb-4 gap-3 md:gap-6">
            <h3 className="font-bold text-2xl md:text-4xl font-lobster text-center text-base-content">
              Password Baru
            </h3>
            <p className="font-semibold text-xs md:text-base font-mona text-center text-base-content/70">
              Silahkah daftarkan password baru Anda agar dapat segera mengakses{" "}
              <span className="font-bold text-base-content">
                Nusa Residence
              </span>
            </p>
          </div>

          <div className="divider text-xs md:text-base font-semibold font-mona text-secondary">
            jangan lupakan password baru Anda
          </div>

          {isSuccess ? (
            <div className="flex items-center justify-center">
              {isLoading && (
                <span className="loading loading-bars loading-xl" />
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
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
                  {errors.konfirmasiKataSandi && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.konfirmasiKataSandi.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn bg-neutral font-poppins hover:bg-neutral/90 w-full rounded-lg text-base-100 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-bars" />
                ) : (
                  "Buat Ulang Password"
                )}
              </button>
            </form>
          )}

          <div className="flex flex-end">
            <button
              type="button"
              className="btn btn-circle btn-ghost absolute right-4 top-2 md:right-6 md:top-4"
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
    </div>
  );
};

export default ResetPassword;
