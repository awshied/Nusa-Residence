import { z } from "zod";
import { Amenities, KategoriProperti } from "@prisma/client";

export const skemaBuatProperti = z.object({
  nama: z.string().min(3, "Nama properti minimal 3 karakter.").max(100),
  kategori: z.nativeEnum(KategoriProperti),
  namaJalan: z.string().min(3, "Nama jalan minimal 3 karakter"),
  kelurahan: z.string().min(3, "Kelurahan minimal 3 karakter"),
  kecamatan: z.string().min(3, "Kecamatan minimal 3 karakter"),
  kabupatenKota: z.string().min(3, "Kabupaten/Kota minimal 3 karakter"),
  provinsi: z.string().min(3, "Provinsi minimal 3 karakter"),
  kodePos: z.string().optional(),

  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  nomorTelepon: z
    .string()
    .min(9, "Nomor telepon minimal 9 karakter.")
    .max(15, "Nomor telepon maksimal 15 karakter.")
    .regex(/^[0-9+]{10,15}$/, "Nomor telepon tidak valid.")
    .optional(),
  luasBangunan: z
    .number()
    .positive("Luas bangunan tidak boleh negatif.")
    .optional(),
  deskripsi: z.string().optional(),
  amenities: z.array(z.nativeEnum(Amenities)).default([]),
  adminId: z.string().uuid("ID Admin tidak valid."),
});

export type TipeBuatProperti = z.infer<typeof skemaBuatProperti>;

export const skemaEditProperti = z.object({
  nama: z.string().min(3, "Nama properti minimal 3 karakter.").optional(),
  kategori: z
    .enum(["HOTEL", "VILLA", "APARTEMEN", "KOSAN", "KONTRAKAN"])
    .optional(),
  namaJalan: z.string().min(3, "Nama jalan minimal 3 karakter").optional(),
  kelurahan: z.string().min(3, "Kelurahan minimal 3 karakter").optional(),
  kecamatan: z.string().min(3, "Kecamatan minimal 3 karakter").optional(),
  kabupatenKota: z
    .string()
    .min(3, "Kabupaten/Kota minimal 3 karakter")
    .optional(),
  provinsi: z.string().min(3, "Provinsi minimal 3 karakter").optional(),
  kodePos: z.string().optional(),

  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  nomorTelepon: z
    .string()
    .min(9, "Nomor telepon minimal 9 karakter.")
    .max(15, "Nomor telepon maksimal 15 karakter.")
    .regex(/^[0-9+]{10,15}$/, "Nomor telepon tidak valid.")
    .optional(),
  luasBangunan: z
    .number()
    .positive("Luas bangunan tidak boleh negatif.")
    .optional(),
  deskripsi: z.string().optional(),
  amenities: z.array(z.nativeEnum(Amenities)).default([]).optional(),
});

export type TipeUbahProperti = z.infer<typeof skemaEditProperti>;
