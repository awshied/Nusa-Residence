import { StatusAkun } from "@prisma/client";
import { z } from "zod";

export const skemaBuatAdmin = z.object({
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

export type TipeBuatAdmin = z.infer<typeof skemaBuatAdmin>;

export const skemaPerbaruiStatusAdmin = z.object({
  status: z.nativeEnum(StatusAkun),
});

export type TipePerbaruiStatusAdmin = z.infer<typeof skemaPerbaruiStatusAdmin>;
