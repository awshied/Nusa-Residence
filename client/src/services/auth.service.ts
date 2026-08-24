import api from "@/lib/api";
import type {
  TipeDataLupaPassword,
  TipeDataMasuk,
  TipeDataRegistrasi,
  TipeDataResetPassword,
  TipeProfil,
  TipeResponseAuth,
  TipeResponseUpdateProfil,
  TipeUser,
  UpdateProfilePayload,
} from "@/types";

export const registrasi = async (
  data: TipeDataRegistrasi,
): Promise<TipeResponseAuth> => {
  const response = await api.post("/auth/registrasi", data);
  return response.data;
};

export const login = async (data: TipeDataMasuk): Promise<TipeResponseAuth> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const lupaPassword = async (
  data: TipeDataLupaPassword,
): Promise<TipeResponseAuth> => {
  const response = await api.post("/auth/lupa-password", data);
  return response.data;
};

export const resetPassword = async (
  data: TipeDataResetPassword,
): Promise<TipeResponseAuth> => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const simpanSession = (data: TipeResponseAuth["data"]): void => {
  if (data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.id,
        email: data.email,
        namaLengkap: data.namaLengkap,
        nomorTelepon: data.nomorTelepon || null,
        jenisKelamin: data.jenisKelamin,
        fotoProfil: data.fotoProfil || null,
        peran: data.peran,
      }),
    );
  }
};

export const getCurrentUser = (): TipeUser | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const cekOwner = async (): Promise<{
  sukses: boolean;
  exists: boolean;
  data?: TipeProfil;
}> => {
  const response = await api.get("/auth/cek-owner");
  return response.data;
};

export const buatOwner = async (data: {
  data: TipeDataRegistrasi;
}): Promise<TipeResponseAuth> => {
  const response = await api.post("/auth/buat-owner", data);
  return response.data;
};

export const getProfilPengguna = async (): Promise<{
  sukses: boolean;
  data?: TipeProfil;
  pesan?: string;
}> => {
  const response = await api.get("/auth/profil");
  return response.data;
};

export const pembaruanProfil = async (
  payload: UpdateProfilePayload,
): Promise<TipeResponseUpdateProfil> => {
  const formData = new FormData();

  if (payload.namaLengkap) {
    formData.append("namaLengkap", payload.namaLengkap);
  }

  if (payload.nomorTelepon) {
    formData.append("nomorTelepon", payload.nomorTelepon);
  }

  if (payload.jenisKelamin) {
    formData.append("jenisKelamin", payload.jenisKelamin);
  }

  if (payload.fotoProfil) {
    formData.append("fotoProfil", payload.fotoProfil);
  }

  try {
    const response = await api.post("/auth/profil/ubah", formData);
    return response.data;
  } catch (error: any) {
    console.error("Upload error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};
