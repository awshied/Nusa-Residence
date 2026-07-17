import { toast } from "sonner";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { DataBuatProperti } from "@/types";
import {
  getAdminTersedia,
  getPropertiOwner,
  hapusGambarProperti,
  hapusProperti,
  setGambarUtama,
  tambahProperti,
  ubahProperti,
  uploadGambarProperti,
} from "@/services/properti.service";
import { queryKeys } from "./useQueryKeys";

interface ErrorResponse {
  sukses: boolean;
  pesan: string;
}

export const useOwnerProperty = () => {
  return useQuery({
    queryKey: queryKeys.properti.lists(),
    queryFn: async () => {
      const response = await getPropertiOwner();
      if (!response.sukses) {
        throw new Error(response.pesan || "Gagal memuat properti.");
      }
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminAvailable = () => {
  return useQuery({
    queryKey: queryKeys.admin.lists(),
    queryFn: async () => {
      const response = await getAdminTersedia();
      if (!response.sukses) {
        throw new Error(response.pesan || "Gagal memuat daftar Admin.");
      }
      return response.data || [];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DataBuatProperti) => tambahProperti(data),
    onSuccess: (response) => {
      if (response.sukses) {
        toast.success(response.pesan || "Properti berhasil dibuat!");
        queryClient.invalidateQueries({ queryKey: queryKeys.properti.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.lists() });
      } else {
        toast.error(response.pesan || "Gagal membuat properti.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.pesan || "Terjadi kesalahan. Silakan coba lagi.",
      );
    },
  });
};

export const useUploadPropertyPicture = (propertiId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ files, isUtama }: { files: File[]; isUtama?: boolean }) =>
      uploadGambarProperti(propertiId, files, isUtama || false),
    onSuccess: (response) => {
      if (response.sukses) {
        toast.success(response.pesan || "Gambar berhasil diupload!");
        queryClient.invalidateQueries({
          queryKey: queryKeys.properti.detail(propertiId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.properti.lists(),
        });
      } else {
        toast.error(response.pesan || "Gagal upload gambar.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.pesan || "Terjadi kesalahan. Silakan coba lagi.",
      );
    },
  });
};

export const useDeletePropertyPicture = (propertiId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gambarId: string) => hapusGambarProperti(gambarId),
    onSuccess: (response) => {
      if (response.sukses) {
        toast.success(response.pesan || "Gambar berhasil dihapus!");
        queryClient.invalidateQueries({
          queryKey: queryKeys.properti.detail(propertiId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.properti.lists(),
        });
      } else {
        toast.error(response.pesan || "Gagal hapus gambar.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.pesan || "Terjadi kesalahan. Silakan coba lagi.",
      );
    },
  });
};

export const useMainPropertyPicture = (propertiId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gambarId: string) => setGambarUtama(gambarId),
    onSuccess: (response) => {
      if (response.sukses) {
        toast.success(response.pesan || "Gambar utama berhasil diubah!");
        queryClient.invalidateQueries({
          queryKey: queryKeys.properti.detail(propertiId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.properti.lists(),
        });
      } else {
        toast.error(response.pesan || "Gagal mengubah gambar utama.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.pesan || "Terjadi kesalahan. Silakan coba lagi.",
      );
    },
  });
};

export const useEditProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<DataBuatProperti>;
    }) => ubahProperti(id, data),
    onSuccess: (response) => {
      if (response.sukses) {
        toast.success(response.pesan || "Properti berhasil diperbarui!");
        queryClient.invalidateQueries({ queryKey: queryKeys.properti.lists() });
        if (response.data?.id) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.properti.detail(response.data.id),
          });
        }
      } else {
        toast.error(response.pesan || "Gagal memperbarui properti.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.pesan || "Terjadi kesalahan. Silakan coba lagi.",
      );
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hapusProperti(id),
    onSuccess: (response) => {
      if (response.sukses) {
        toast.success(response.pesan || "Properti berhasil dihapus!");
        queryClient.invalidateQueries({ queryKey: queryKeys.properti.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.lists() });
      } else {
        toast.error(response.pesan || "Gagal menghapus properti.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.pesan || "Terjadi kesalahan. Silakan coba lagi.",
      );
    },
  });
};
