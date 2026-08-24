import { z } from "zod";
import { Amenities, KategoriProperti } from "@prisma/client";

const AMENITIES_VALUES = Object.values(Amenities);

export const skemaBuatProperti = z
  .object({
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
    luasBangunan: z
      .number()
      .positive("Luas bangunan tidak boleh negatif.")
      .optional(),
    deskripsi: z.string().optional(),
    adminId: z.string().uuid("ID Admin tidak valid."),
  })
  .extend({
    amenities: z
      .union([
        z.array(z.enum(AMENITIES_VALUES as [string, ...string[]])),
        z.string().transform((val) => {
          try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }),
      ])
      .default([])
      .transform((val) => {
        if (typeof val === "string") {
          try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return val;
      }),
  });

export type TipeBuatProperti = z.infer<typeof skemaBuatProperti>;

export const skemaEditProperti = z.object({
  nama: z.string().min(3, "Nama properti minimal 3 karakter.").optional(),
  kategori: z.nativeEnum(KategoriProperti).optional(),
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
  luasBangunan: z
    .number()
    .positive("Luas bangunan tidak boleh negatif.")
    .optional(),
  deskripsi: z.string().optional(),
  amenities: z
    .union([
      z.array(z.enum(AMENITIES_VALUES as [string, ...string[]])),
      z.string().transform((val) => {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            return parsed;
          }
          return [];
        } catch {
          return [];
        }
      }),
    ])
    .optional()
    .transform((val) => {
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return val;
    }),
});

export type TipeUbahProperti = z.infer<typeof skemaEditProperti>;
