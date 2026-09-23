import { z } from "zod";
import { Amenities, KategoriProperti } from "@prisma/client";

const AMENITIES_VALUES = Object.values(Amenities);

export const skemaBuatProperti = z.object({
  nama: z
    .string()
    .min(3, "Nama properti minimal 3 karakter.")
    .max(100, "Nama properti maksimal 100 karakter."),
  kategori: z.nativeEnum(KategoriProperti),
  namaJalan: z
    .string()
    .min(3, "Nama jalan minimal 3 karakter.")
    .max(100, "Nama jalan maksimal 100 karakter."),
  kelurahan: z
    .string()
    .min(3, "Kelurahan minimal 3 karakter.")
    .max(100, "Kelurahan maksimal 100 karakter."),
  kecamatan: z
    .string()
    .min(3, "Kecamatan minimal 3 karakter.")
    .max(100, "Kecamatan maksimal 100 karakter."),
  kabupatenKota: z
    .string()
    .min(3, "Kabupaten/Kota minimal 3 karakter.")
    .max(100, "Kabupaten/Kota maksimal 100 karakter."),
  provinsi: z
    .string()
    .min(3, "Provinsi minimal 3 karakter.")
    .max(100, "Provinsi maksimal 100 karakter."),
  kodePos: z
    .string()
    .regex(/^[0-9]{5}$/, "Kode pos harus 5 digit angka.")
    .optional()
    .or(z.literal("")),

  latitude: z
    .number()
    .min(-90, "Latitude minimal harus -90.")
    .max(90, "Latitude maksimal harus 90."),
  longitude: z
    .number()
    .min(-180, "Longitude minimal harus -180.")
    .max(180, "Longitude maksimal harus 180."),
  luasBangunan: z
    .number()
    .positive("Luas bangunan tidak boleh negatif.")
    .optional(),
  deskripsi: z.string().optional(),
  amenities: z.array(z.enum(AMENITIES_VALUES)).default([]),
  adminId: z
    .string()
    .uuid("ID Admin tidak valid.")
    .min(1, "Admin wajib dipilih."),
});
// .extend({
//   amenities: z
//     .union([
//       z.array(z.enum(AMENITIES_VALUES as [string, ...string[]])),
//       z.string().transform((val) => {
//         try {
//           const parsed = JSON.parse(val);
//           return Array.isArray(parsed) ? parsed : [];
//         } catch {
//           return [];
//         }
//       }),
//     ])
//     .default([])
//     .transform((val) => {
//       if (typeof val === "string") {
//         try {
//           const parsed = JSON.parse(val);
//           return Array.isArray(parsed) ? parsed : [];
//         } catch {
//           return [];
//         }
//       }
//       return val;
//     }),
// });

export type TipeBuatProperti = z.infer<typeof skemaBuatProperti>;

export const skemaEditProperti = z.object({
  nama: z
    .string()
    .min(3, "Nama properti minimal 3 karakter.")
    .max(100, "Nama properti maksimal 100 karakter.")
    .optional(),
  kategori: z.nativeEnum(KategoriProperti).optional(),
  namaJalan: z
    .string()
    .min(3, "Nama jalan minimal 3 karakter.")
    .max(100, "Nama jalan maksimal 100 karakter.")
    .optional(),
  kelurahan: z
    .string()
    .min(3, "Kelurahan minimal 3 karakter.")
    .max(100, "Kelurahan maksimal 100 karakter.")
    .optional(),
  kecamatan: z
    .string()
    .min(3, "Kecamatan minimal 3 karakter.")
    .max(100, "Kecamatan maksimal 100 karakter.")
    .optional(),
  kabupatenKota: z
    .string()
    .min(3, "Kabupaten/Kota minimal 3 karakter.")
    .max(100, "Kabupaten/Kota maksimal 100 karakter.")
    .optional(),
  provinsi: z
    .string()
    .min(3, "Provinsi minimal 3 karakter.")
    .max(100, "Provinsi maksimal 100 karakter.")
    .optional(),
  kodePos: z
    .string()
    .regex(/^[0-9]{5}$/, "Kode pos harus 5 digit angka.")
    .optional()
    .or(z.literal("")),

  latitude: z
    .number()
    .min(-90, "Latitude minimal harus -90.")
    .max(90, "Latitude maksimal harus 90.")
    .optional(),
  longitude: z
    .number()
    .min(-180, "Longitude minimal harus -180.")
    .max(180, "Longitude maksimal harus 180.")
    .optional(),
  luasBangunan: z
    .number()
    .positive("Luas bangunan tidak boleh negatif.")
    .optional(),
  deskripsi: z.string().optional(),
  amenities: z.array(z.enum(AMENITIES_VALUES)).default([]),

  // amenities: z
  //   .union([
  //     z.array(z.enum(AMENITIES_VALUES as [string, ...string[]])),
  //     z.string().transform((val) => {
  //       try {
  //         const parsed = JSON.parse(val);
  //         if (Array.isArray(parsed)) {
  //           return parsed;
  //         }
  //         return [];
  //       } catch {
  //         return [];
  //       }
  //     }),
  //   ])
  //   .optional()
  //   .transform((val) => {
  //     if (typeof val === "string") {
  //       try {
  //         const parsed = JSON.parse(val);
  //         return Array.isArray(parsed) ? parsed : [];
  //       } catch {
  //         return [];
  //       }
  //     }
  //     return val;
  //   }),
});

export type TipeUbahProperti = z.infer<typeof skemaEditProperti>;
