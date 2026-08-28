import { toast } from "sonner";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { DataBuatAdmin } from "@/types";
import {
  buatAdmin,
  getAdminOwner,
  hapusAdminPermanen,
  updateStatusAdmin,
} from "@/services/admin.service";
import { queryKeys } from "./useQueryKeys";

interface ErrorResponse {
  sukses: boolean;
  pesan: string;
}

export const useAdminManagement = () => {
  return useQuery({
    queryKey: queryKeys.admin.lists(),
    queryFn: async () => {
      const response = await getAdminOwner();
      if (!response.sukses) {
        throw new Error(response.pesan || "Gagal memuat admin.");
      }
      return response.data || [];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useAdminDetail = (adminId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.detail(adminId),
    queryFn: async () => {
      const response = await getAdminOwner();
      if (!response.sukses) {
        throw new Error(response.pesan || "Gagal memuat Admin.");
      }
      const admin = response.data?.find((a) => a.id === adminId);
      if (!admin) {
        throw new Error("Admin tidak ditemukan.");
      }
      return admin;
    },
    enabled: !!adminId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateNewAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DataBuatAdmin) => {
      const response = await buatAdmin(data);
      if (!response.sukses) {
        throw new Error(response.pesan || "Gagal membuat Admin.");
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.sukses) {
        toast.success(response.pesan || "Admin berhasil dibuat!");
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.lists() });
      } else {
        toast.error(response.pesan || "Gagal membuat Admin.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.pesan || "Terjadi kesalahan. Silakan coba lagi.",
      );
    },
  });
};

export const useUpdateStatusAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "AKTIF" | "NONAKTIF" | "DIBLOKIR";
    }) => {
      const response = await updateStatusAdmin(id, status);
      if (!response.sukses) {
        throw new Error(response.pesan || "Gagal mengubah status Admin.");
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.sukses) {
        toast.success(response.pesan || "Status Admin berhasil diperbarui!");
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.lists() });
        if (response.data?.id) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.admin.detail(response.data.id),
          });
        }
        queryClient.invalidateQueries({ queryKey: queryKeys.properti.lists() });
      } else {
        toast.error(response.pesan || "Gagal mengubah status Admin.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.pesan || "Terjadi kesalahan. Silakan coba lagi.",
      );
    },
  });
};

export const useAdminFired = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await updateStatusAdmin(id, "DIBLOKIR");
      if (!response.sukses) {
        throw new Error(response.pesan || "Gagal memecat Admin.");
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.sukses) {
        toast.success(response.pesan || "Admin berhasil dipecat!");
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.properti.lists() });
      } else {
        toast.error(response.pesan || "Gagal memecat Admin.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.pesan || "Terjadi kesalahan. Silakan coba lagi.",
      );
    },
  });
};

export const useAdminDeletePermanently = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await hapusAdminPermanen(id);
      if (!response.sukses) {
        throw new Error(response.pesan || "Gagal menghapus Admin.");
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.sukses) {
        toast.success(response.pesan || "Admin berhasil dihapus!");
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.properti.lists() });
      } else {
        toast.error(response.pesan || "Gagal menghapus Admin.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.pesan || "Terjadi kesalahan. Silakan coba lagi.",
      );
    },
  });
};
