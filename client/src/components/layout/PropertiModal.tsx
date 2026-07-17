import z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { KategoriProperti, TipeProperti } from "@/types";
import {
  useAdminAvailable,
  useCreateProperty,
  useEditProperty,
} from "@/hooks/useProperti";
import addNewPropertyIcon from "@/assets/icons/add-new-property.png";
import DropzoneGambar from "../shared/DropzoneGambar";

const AMENITIES_LIST = [
  { value: "AIR_CONDITIONER", label: "Air Conditioner" },
  { value: "TELEVISI", label: "Televisi" },
  { value: "WIFI", label: "Wifi" },
  { value: "KOLAM_RENANG", label: "Kolam Renang" },
  { value: "PARKIR", label: "Parkir" },
  { value: "BATHUB", label: "Bathub" },
  { value: "RESTORAN", label: "Restoran" },
  { value: "GYM", label: "Gymnasium" },
  { value: "SPA", label: "Perawatan Relaksasi" },
  { value: "MUSHOLA", label: "Mushola" },
  { value: "MINI_BAR", label: "Mini Bar" },
  { value: "KITCHENETTE", label: "Dapur Kecil" },
  { value: "MESIN_CUCI", label: "Mesin Cuci" },
  { value: "KIPAS_ANGIN", label: "Kipas Angin" },
  { value: "AIR_PANAS", label: "Air Panas" },
  { value: "BREAKFAST", label: "Sarapan" },
  { value: "ROOM_SERVICE", label: "Pelayanan Kamar" },
  { value: "RESEPSIONIS_24JAM", label: "Resepsionis 24 Jam" },
  { value: "KEAMANAN_24JAM", label: "Keamanan 24 Jam" },
  { value: "AREA_BERMAIN_ANAK", label: "Area Bermain Anak" },
  { value: "TAMAN", label: "Taman" },
  { value: "BALKON", label: "Balkon" },
  { value: "DAPUR_UMUM", label: "Dapur Umum" },
  { value: "RUANG_TAMU", label: "Ruang Tamu" },
  { value: "AIR_ISI_ULANG", label: "Air Isi Ulang" },
  { value: "LISTRIK", label: "Listrik" },
  { value: "GAS_ALAM", label: "Gas Alam" },
  { value: "KAMAR_MANDI_DALAM", label: "Kamar Mandi Dalam" },
  { value: "KAMAR_MANDI_LUAR", label: "Kamar Mandi Luar" },
];

const KATEGORI_PROPERTI: { value: KategoriProperti; label: string }[] = [
  { value: "HOTEL", label: "Hotel" },
  { value: "VILLA", label: "Villa" },
  { value: "APARTEMEN", label: "Apartemen" },
  { value: "KOSAN", label: "Kosan" },
  { value: "KONTRAKAN", label: "Kontrakan" },
];

const skemaTambahProperti = z.object({
  nama: z.string().min(3, "Nama properti minimal 3 karakter.").max(100),
  kategori: z.enum(["HOTEL", "VILLA", "APARTEMEN", "KOSAN", "KONTRAKAN"]),

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
  amenities: z.array(z.string()).default([]),
  adminId: z.string().uuid("Tentukan Admin yang tersedia."),
});

type TipeForm = z.input<typeof skemaTambahProperti>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  properti?: TipeProperti | null;
}

const PropertiModal = ({ isOpen, onClose, properti }: Props) => {
  const isEditMode = !!properti;

  const { data: adminList = [], isLoading: loadingAdmin } = useAdminAvailable();
  const buatProperti = useCreateProperty();
  const editProperti = useEditProperty();

  const [gambarFiles, setGambarFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TipeForm>({
    resolver: zodResolver(skemaTambahProperti),
    defaultValues: {
      amenities: [],
      latitude: -6.2088,
      longitude: 106.8456,
      kategori: "HOTEL",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setGambarFiles([]);
    }
  }, [isOpen, reset]);

  const selectedAmenities = watch("amenities") || [];

  useEffect(() => {
    if (isEditMode && properti) {
      reset({
        nama: properti.nama,
        kategori: properti.kategori,
        namaJalan: properti.namaJalan,
        kelurahan: properti.kelurahan,
        kecamatan: properti.kecamatan,
        kabupatenKota: properti.kabupatenKota,
        provinsi: properti.provinsi,
        kodePos: properti.kodePos || "",
        latitude: properti.latitude,
        longitude: properti.longitude,
        nomorTelepon: properti.nomorTelepon || "",
        luasBangunan: properti.luasBangunan || undefined,
        deskripsi: properti.deskripsi || "",
        amenities: properti.amenities || [],
        adminId: properti.admin?.id || "",
      });
    } else {
      reset({
        amenities: [],
        latitude: -6.2088,
        longitude: 106.8456,
        kategori: "HOTEL",
        adminId: "",
      });
      setGambarFiles([]);
    }
  }, [properti, isEditMode, reset]);

  const toggleAmenity = (amenity: string) => {
    const current = selectedAmenities;
    if (current.includes(amenity)) {
      setValue(
        "amenities",
        current.filter((a) => a !== amenity),
      );
    } else {
      setValue("amenities", [...current, amenity]);
    }
  };

  const onSubmit = async (data: TipeForm) => {
    const payload = {
      ...data,
      amenities: data.amenities ?? [],
      gambar: gambarFiles,
    };

    if (isEditMode && properti) {
      await editProperti.mutateAsync({
        id: properti.id,
        data: {
          nama: data.nama,
          kategori: data.kategori,
          namaJalan: data.namaJalan,
          kelurahan: data.kelurahan,
          kecamatan: data.kecamatan,
          kabupatenKota: data.kabupatenKota,
          provinsi: data.provinsi,
          kodePos: data.kodePos,
          latitude: data.latitude,
          longitude: data.longitude,
          nomorTelepon: data.nomorTelepon,
          luasBangunan: data.luasBangunan,
          deskripsi: data.deskripsi,
          amenities: data.amenities,
        },
      });
      onClose();
    } else {
      await buatProperti.mutateAsync(payload);
      onClose();
    }
  };

  const isSubmitting = buatProperti.isPending || editProperti.isPending;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) onClose();
          }}
        >
          <motion.div
            className="w-[95vw] max-w-7xl max-h-[90vh] rounded-2xl bg-base-100 border-3 border-base-300 shadow-2xl flex flex-col overflow-hidden"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-5 bg-base-100 shrink-0">
              <div className="flex items-center gap-6">
                <img
                  src={addNewPropertyIcon}
                  alt="add property"
                  className="w-7 h-7"
                />
                <h4 className="font-lobster text-base-content font-bold text-2xl">
                  {isEditMode ? "Edit Properti" : "Tambah Properti"}
                </h4>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-circle btn-ghost"
                disabled={isSubmitting}
              >
                <X className="w-6 h-6 text-base-content" aria-label="Tutup" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Informasi Properti */}
                <div className="card bg-base-100 shadow-sm border">
                  <div className="card-body space-y-4">
                    <h4 className="font-semibold text-base">
                      📋 Informasi Properti
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">
                            Nama Properti *
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Kerapu Hotel"
                          className={`input input-bordered w-full ${errors.nama ? "input-error" : ""}`}
                          {...register("nama")}
                          disabled={isSubmitting}
                        />
                        {errors.nama && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.nama.message}
                            </span>
                          </label>
                        )}
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">
                            Kategori *
                          </span>
                        </label>
                        <select
                          className={`select select-bordered w-full ${errors.kategori ? "select-error" : ""}`}
                          {...register("kategori")}
                          disabled={isSubmitting}
                        >
                          {KATEGORI_PROPERTI.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {errors.kategori && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.kategori.message}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Alamat */}
                    <div className="border-t pt-4">
                      <h5 className="font-medium text-sm mb-3">
                        📍 Alamat Lengkap
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control md:col-span-2">
                          <label className="label">
                            <span className="label-text font-medium">
                              Nama Jalan *
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Jl. Contoh No. 123"
                            className={`input input-bordered w-full ${errors.namaJalan ? "input-error" : ""}`}
                            {...register("namaJalan")}
                            disabled={isSubmitting}
                          />
                          {errors.namaJalan && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.namaJalan.message}
                              </span>
                            </label>
                          )}
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Kelurahan *
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Kelurahan"
                            className={`input input-bordered w-full ${errors.kelurahan ? "input-error" : ""}`}
                            {...register("kelurahan")}
                            disabled={isSubmitting}
                          />
                          {errors.kelurahan && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.kelurahan.message}
                              </span>
                            </label>
                          )}
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Kecamatan *
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Kecamatan"
                            className={`input input-bordered w-full ${errors.kecamatan ? "input-error" : ""}`}
                            {...register("kecamatan")}
                            disabled={isSubmitting}
                          />
                          {errors.kecamatan && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.kecamatan.message}
                              </span>
                            </label>
                          )}
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Kabupaten/Kota *
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Kabupaten/Kota"
                            className={`input input-bordered w-full ${errors.kabupatenKota ? "input-error" : ""}`}
                            {...register("kabupatenKota")}
                            disabled={isSubmitting}
                          />
                          {errors.kabupatenKota && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.kabupatenKota.message}
                              </span>
                            </label>
                          )}
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Provinsi *
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Provinsi"
                            className={`input input-bordered w-full ${errors.provinsi ? "input-error" : ""}`}
                            {...register("provinsi")}
                            disabled={isSubmitting}
                          />
                          {errors.provinsi && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.provinsi.message}
                              </span>
                            </label>
                          )}
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Kode Pos
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Kode Pos"
                            className="input input-bordered w-full"
                            {...register("kodePos")}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Koordinat */}
                    <div className="border-t pt-4">
                      <h5 className="font-medium text-sm mb-3">
                        🗺️ Koordinat Lokasi
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Latitude *
                            </span>
                          </label>
                          <input
                            type="number"
                            step="any"
                            placeholder="-6.2088"
                            className={`input input-bordered w-full ${errors.latitude ? "input-error" : ""}`}
                            {...register("latitude", { valueAsNumber: true })}
                            disabled={isSubmitting}
                          />
                          {errors.latitude && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.latitude.message}
                              </span>
                            </label>
                          )}
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Longitude *
                            </span>
                          </label>
                          <input
                            type="number"
                            step="any"
                            placeholder="106.8456"
                            className={`input input-bordered w-full ${errors.longitude ? "input-error" : ""}`}
                            {...register("longitude", { valueAsNumber: true })}
                            disabled={isSubmitting}
                          />
                          {errors.longitude && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.longitude.message}
                              </span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Telepon & Luas */}
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Nomor Telepon
                            </span>
                          </label>
                          <input
                            type="tel"
                            placeholder="08123456789"
                            className="input input-bordered w-full"
                            {...register("nomorTelepon")}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Luas Bangunan (m²)
                            </span>
                          </label>
                          <input
                            type="number"
                            step="any"
                            placeholder="500"
                            className="input input-bordered w-full"
                            {...register("luasBangunan", {
                              valueAsNumber: true,
                            })}
                            disabled={isSubmitting}
                          />
                          {errors.luasBangunan && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.luasBangunan.message}
                              </span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Deskripsi
                        </span>
                      </label>
                      <textarea
                        placeholder="Deskripsikan properti Anda..."
                        className="textarea textarea-bordered w-full"
                        rows={3}
                        {...register("deskripsi")}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="card bg-base-100 shadow-sm border">
                  <div className="card-body">
                    <h4 className="font-semibold text-base">
                      🛋️ Fasilitas (Amenities)
                    </h4>
                    <p className="text-sm text-gray-500">
                      Klik untuk menambah/menghapus fasilitas.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {AMENITIES_LIST.map((amenity) => {
                        const isSelected = selectedAmenities.includes(
                          amenity.value,
                        );
                        return (
                          <button
                            key={amenity.value}
                            type="button"
                            className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-ghost"}`}
                            onClick={() => toggleAmenity(amenity.value)}
                            disabled={isSubmitting}
                          >
                            {isSelected ? "✓ " : ""} {amenity.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2 text-xs text-gray-400">
                      Terpilih:{" "}
                      <span className="font-semibold">
                        {selectedAmenities.length}
                      </span>{" "}
                      fasilitas
                      {selectedAmenities.length > 0 && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs text-error ml-2"
                          onClick={() => setValue("amenities", [])}
                          disabled={isSubmitting}
                        >
                          Hapus Semua
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pilih Admin (hanya untuk mode Tambah) */}
                {!isEditMode && (
                  <div className="card bg-base-100 shadow-sm border">
                    <div className="card-body">
                      <h4 className="font-semibold text-base">
                        👤 Pilih Admin
                      </h4>
                      <p className="text-sm text-gray-500">
                        Pilih Admin yang akan mengelola properti ini.
                      </p>

                      <div className="form-control mt-2">
                        <label className="label">
                          <span className="label-text font-medium">
                            Admin *
                          </span>
                        </label>
                        <select
                          className={`select select-bordered w-full ${errors.adminId ? "select-error" : ""}`}
                          {...register("adminId")}
                          disabled={
                            loadingAdmin ||
                            isSubmitting ||
                            adminList.length === 0
                          }
                        >
                          <option value="">-- Pilih Admin --</option>
                          {adminList.map((admin) => (
                            <option key={admin.id} value={admin.id}>
                              {admin.namaLengkap || admin.email}{" "}
                              {admin.nomorTelepon
                                ? `(${admin.nomorTelepon})`
                                : ""}
                            </option>
                          ))}
                        </select>
                        {errors.adminId && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.adminId.message}
                            </span>
                          </label>
                        )}
                        {adminList.length === 0 && !loadingAdmin && (
                          <label className="label">
                            <span className="label-text-alt text-warning">
                              ⚠️ Tidak ada Admin tersedia. Buat Admin di halaman
                              Kelola Admin.
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Gambar Properti */}
                <div className="card bg-base-100 shadow-sm border">
                  <div className="card-body">
                    <h4 className="font-semibold text-base">
                      📷 Gambar Properti
                    </h4>
                    <p className="text-sm text-gray-500">
                      {isEditMode
                        ? "Tambah gambar tambahan untuk properti ini."
                        : "Upload gambar properti. Gambar pertama akan menjadi utama."}
                    </p>

                    {isEditMode &&
                      properti?.gambar &&
                      properti.gambar.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">
                            Gambar yang sudah ada:
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {properti.gambar.map((img) => (
                              <div
                                key={img.id}
                                className="relative aspect-square"
                              >
                                <img
                                  src={img.url}
                                  alt="Gambar properti"
                                  className="w-full h-full object-cover rounded-lg border-2 border-base-200"
                                />
                                {img.isUtama && (
                                  <span className="absolute top-1 left-1 bg-primary text-primary-content text-xs px-2 py-0.5 rounded">
                                    Utama
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    <DropzoneGambar
                      files={gambarFiles}
                      setFiles={setGambarFiles}
                      maxFiles={10 - (properti?.gambar?.length || 0)}
                    />

                    {gambarFiles.length > 0 && (
                      <p className="text-xs text-gray-400 mt-2">
                        💡 {gambarFiles.length} gambar baru akan ditambahkan
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="sticky bottom-0 z-20 flex justify-end gap-4 px-6 py-5 bg-base-100 border-t border-secondary/60 shrink-0">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    isSubmitting || (!isEditMode && adminList.length === 0)
                  }
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      {isEditMode ? "Menyimpan..." : "Menyimpan..."}
                    </>
                  ) : isEditMode ? (
                    "Update Properti"
                  ) : (
                    "Simpan Properti"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PropertiModal;
