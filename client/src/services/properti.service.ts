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
  let gambarUrls: string[] = [];

  if (data.gambar && data.gambar.length > 0) {
    const formData = new FormData();
    data.gambar.forEach((file) => {
      formData.append("gambar", file);
    });

    const uploadResponse = await api.post("/properti/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (uploadResponse.data.sukses) {
      gambarUrls = uploadResponse.data.data.map((img: any) => img.url);
    }
  }

  const response = await api.post("/properti", {
    ...data,
    gambarUrls,
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
  data: Partial<Omit<DataBuatProperti, "adminId">>,
): Promise<{ sukses: boolean; data?: TipeProperti; pesan?: string }> => {
  const response = await api.put(`/properti/${id}`, data);
  return response.data;
};

export const hapusProperti = async (
  id: string,
): Promise<{ sukses: boolean; pesan?: string }> => {
  const response = await api.delete(`/properti/${id}`);
  return response.data;
};
