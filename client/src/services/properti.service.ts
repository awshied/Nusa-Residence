import api from "@/lib/api";
import type { DataBuatProperti, TipeProperti } from "@/types";

export const getPropertiOwner = async (): Promise<{
  sukses: boolean;
  data?: TipeProperti[];
  pesan?: string;
}> => {
  const response = await api.get("/properti/owner");
  return response.data;
};

export const getDetailProperti = async (
  id: string,
): Promise<{ sukses: boolean; data?: TipeProperti; pesan?: string }> => {
  const response = await api.get(`/properti/${id}`);
  return response.data;
};

export const getAdminTersedia = async (): Promise<{
  sukses: boolean;
  data?: {
    id: string;
    email: string;
    namaLengkap?: string;
    nomorTelepon?: string;
  }[];
  pesan?: string;
}> => {
  const response = await api.get("/properti/admin-tersedia");
  return response.data;
};

export const tambahProperti = async (
  data: DataBuatProperti,
): Promise<{ sukses: boolean; data?: TipeProperti; pesan?: string }> => {
  const formData = new FormData();

  formData.append("nama", data.nama);
  formData.append("kategori", data.kategori);
  formData.append("namaJalan", data.namaJalan);
  formData.append("kelurahan", data.kelurahan);
  formData.append("kecamatan", data.kecamatan);
  formData.append("kabupatenKota", data.kabupatenKota);
  formData.append("provinsi", data.provinsi);
  formData.append("latitude", String(data.latitude));
  formData.append("longitude", String(data.longitude));
  formData.append("adminId", data.adminId);

  if (data.kodePos) formData.append("kodePos", data.kodePos);
  if (data.luasBangunan)
    formData.append("luasBangunan", String(data.luasBangunan));
  if (data.deskripsi) formData.append("deskripsi", data.deskripsi);

  if (data.amenities && data.amenities.length > 0) {
    formData.append("amenities", JSON.stringify(data.amenities));
  }

  if (data.gambar && data.gambar.length > 0) {
    data.gambar.forEach((file: File) => {
      formData.append("gambar", file);
    });
  }

  console.log("📤 FormData yang dikirim:");
  for (const [key, value] of formData.entries()) {
    if (key === "gambar") {
      console.log(`  ${key}: [File] ${(value as File).name}`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  }

  const response = await api.post("/properti", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const uploadGambarProperti = async (
  propertiId: string,
  files: File[],
  isUtama: boolean = false,
): Promise<{ sukses: boolean; data?: any; pesan?: string }> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("gambar", file);
  });

  const response = await api.post(
    `/properti/${propertiId}/gambar?utama=${isUtama}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const hapusGambarProperti = async (
  gambarId: string,
): Promise<{ sukses: boolean; pesan?: string }> => {
  const response = await api.delete(`/properti/gambar/${gambarId}`);
  return response.data;
};

export const setGambarUtama = async (
  gambarId: string,
): Promise<{ sukses: boolean; pesan?: string }> => {
  const response = await api.patch(`/properti/gambar/${gambarId}/utama`);
  return response.data;
};

export const ubahProperti = async (
  id: string,
  data: Partial<Omit<DataBuatProperti, "adminId" | "gambar">>,
): Promise<{ sukses: boolean; data?: TipeProperti; pesan?: string }> => {
  const payload: Record<string, any> = {};

  const fields: (keyof typeof data)[] = [
    "nama",
    "kategori",
    "namaJalan",
    "kelurahan",
    "kecamatan",
    "kabupatenKota",
    "provinsi",
    "kodePos",
    "luasBangunan",
    "deskripsi",
    "latitude",
    "longitude",
    "amenities",
  ];

  fields.forEach((key) => {
    const value = data[key];
    if (value !== undefined && value !== null) {
      payload[key] = value;
    }
  });

  const response = await api.put(`/properti/${id}`, payload);
  return response.data;
};

export const hapusProperti = async (
  id: string,
): Promise<{ sukses: boolean; pesan?: string }> => {
  const response = await api.delete(`/properti/${id}`);
  return response.data;
};
