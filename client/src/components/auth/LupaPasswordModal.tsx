import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";

import FloatingInput from "../layout/FloatingInput";
import emailAddressIcon from "@/assets/icons/email-address.png";

const skemaLupaPassword = z.object({
  email: z.string().email("Alamat email yang Anda masukkan tidak valid."),
});

type TipeForm = z.infer<typeof skemaLupaPassword>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const LupaPasswordModal = ({ isOpen, onClose, onLoginClick }: Props) => {
  const { lupaPassword, isLoading } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TipeForm>({
    resolver: zodResolver(skemaLupaPassword),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: TipeForm) => {
    const sukses = await lupaPassword(data);
    if (sukses) {
      setIsSuccess(true);
    }
  };

  const handleClose = () => {
    reset();
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog
      className="modal modal-open"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="modal-box max-w-xl px-8 md:px-10 bg-base-100">
        <div className="flex flex-col items-center justify-center mt-4 mb-4 md:mb-8 gap-3 md:gap-6">
          <h3 className="font-bold text-2xl md:text-4xl font-lobster text-center text-base-content">
            {isSuccess ? "Sukses" : "Lupa Password"}
          </h3>
          <p className="font-semibold text-xs md:text-base font-mona text-center text-base-content/70">
            {isSuccess
              ? "Mohon cek email Anda untuk mengidentifikasi token yang telah kami berikan"
              : "Silahkan masukkan alamat email Anda yang terdaftar agar kami dapat mengidentifikasi dan mengirimkan token untuk mereset password Anda"}
          </p>
        </div>

        <div className="divider text-xs md:text-base font-semibold font-mona text-secondary">
          {isSuccess
            ? "link hanya berlaku 1 jam"
            : "tuliskan alamat email Anda"}
        </div>

        {isSuccess ? (
          <button
            onClick={() => {
              handleClose();
              onLoginClick();
            }}
            className="btn bg-neutral font-poppins hover:bg-neutral/90 w-full rounded-lg text-base-100 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-bars" />
            ) : (
              "Kembali ke Login"
            )}
          </button>
        ) : (
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

            <button
              type="submit"
              className="btn bg-neutral font-poppins hover:bg-neutral/90 w-full rounded-lg text-base-100 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-bars" />
              ) : (
                "Kirim Link Reset"
              )}
            </button>

            <p className="text-center text-xs md:text-sm font-mona font-semibold text-base-content">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onLoginClick();
                }}
                className="font-semibold hover:underline cursor-pointer"
              >
                Kembali ke Login
              </button>
            </p>
          </form>
        )}

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-circle btn-ghost absolute right-4 top-2 md:right-6 md:top-4"
            onClick={handleClose}
            aria-label="Tutup"
          >
            <X className="w-4 md:w-6 text-base-content" />
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default LupaPasswordModal;
