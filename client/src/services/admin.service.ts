import api from "@/lib/api";
import type { DataBuatAdmin, TipeAdmin } from "@/types";

export const buatAdmin = async (
  data: DataBuatAdmin,
): Promise<{ sukses: boolean; data?: TipeAdmin; pesan?: string }> => {
  const response = await api.post("/admin", data);
  return response.data;
};

export const getAdminOwner = async (): Promise<{
  sukses: boolean;
  data?: TipeAdmin[];
  pesan?: string;
}> => {
  const response = await api.get("/admin/owner");
  return response.data;
};

export const updateStatusAdmin = async (
  id: string,
  status: "AKTIF" | "NONAKTIF" | "DIBLOKIR",
): Promise<{ sukses: boolean; data?: TipeAdmin; pesan?: string }> => {
  const response = await api.patch(`/admin/${id}/status`, { status });
  return response.data;
};

export const hapusAdminPermanen = async (
  id: string,
): Promise<{ sukses: boolean; pesan?: string }> => {
  const response = await api.delete(`/admin/${id}`);
  return response.data;
};
