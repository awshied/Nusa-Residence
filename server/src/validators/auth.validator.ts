import { JenisKelamin } from "@prisma/client";
import { z } from "zod";

export const skemaRegistrasi = z
  .object({
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

    konfirmasiKataSandi: z.string(),

    namaLengkap: z
      .string()
      .min(4, "Nama lengkap minimal 4 karakter.")
      .max(100, "Nama lengkap maksimal 100 karakter.")
      .optional(),
  })
  .refine((data) => data.kataSandi === data.konfirmasiKataSandi, {
    message: "Password dan konfirmasi password tidak cocok.",
    path: ["konfirmasiKataSandi"],
  });

export type TipeDataRegistrasi = z.infer<typeof skemaRegistrasi>;

export const skemaLogin = z.object({
  email: z.string().email("Alamat email yang Anda masukkan tidak valid."),
  kataSandi: z.string().min(1, "Password tidak boleh kosong."),
});

export type TipeDataLogin = z.infer<typeof skemaLogin>;

export const skemaUpdateProfil = z.object({
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

  jenisKelamin: z.nativeEnum(JenisKelamin).optional(),

  fotoProfil: z.string().optional(),
});

export type TipeDataProfil = z.infer<typeof skemaUpdateProfil>;

export const skemaLupaPassword = z.object({
  email: z.string().email("Format email Anda tidak valid."),
});

export type TipeDataLupaPassword = z.infer<typeof skemaLupaPassword>;

export const skemaResetPassword = z
  .object({
    token: z.string().min(1, "Token wajib diisi"),
    kataSandi: z
      .string()
      .min(8, "Password minimal harus memiliki setidaknya 8 karakter.")
      .max(50, "Password maksimal 50 karakter.")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar.")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil.")
      .regex(/[0-9]/, "Password harus mengandung angka."),
    konfirmasiKataSandi: z.string(),
  })
  .refine((data) => data.kataSandi === data.konfirmasiKataSandi, {
    message: "Password dan konfirmasi password tidak cocok.",
    path: ["konfirmasiKataSandi"],
  });

export type TipeDataResetPassword = z.infer<typeof skemaResetPassword>;
