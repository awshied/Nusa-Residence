import { z } from "zod";

export const skemaRegistrasi = z
  .object({
    email: z
      .string()
      .email("Format email tidak valid.")
      .min(5, "Email minimal 5 karakter.")
      .max(100, "Email maksimal 100 karakter."),

    kataSandi: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .max(50, "Password maksimal 50 karakter.")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar.")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil.")
      .regex(/[0-9]/, "Password harus mengandung angka."),

    konfirmasiKataSandi: z.string(),

    namaLengkap: z
      .string()
      .min(4, "Nama lengkap minimal 4 karakter.")
      .max(100, "Nama lengkap maksimal 100 karakter.")
      .optional(),

    nomorTelepon: z
      .string()
      .regex(/^[0-9+]{10,15}$/, "Nomor telepon tidak valid.")
      .optional(),
  })
  .refine((data) => data.kataSandi === data.konfirmasiKataSandi, {
    message: "Password dan konfirmasi password tidak cocok.",
    path: ["konfirmasiKataSandi"],
  });

export type TipeDataRegistrasi = z.infer<typeof skemaRegistrasi>;

export const skemaLogin = z.object({
  email: z.string().email("Format email tidak valid."),
  kataSandi: z.string().min(1, "Password wajib diisi."),
});

export type TipeDataLogin = z.infer<typeof skemaLogin>;
