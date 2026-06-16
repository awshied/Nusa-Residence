import api from "@/lib/api";

export type TipeDataRegistrasi = {
  email: string;
  kataSandi: string;
  konfirmasiKataSandi: string;
  namaLengkap?: string;
  nomorTelepon?: string;
};

export type TipeDataMasuk = {
  email: string;
  kataSandi: string;
};

export type TipeResponseAuth = {
  sukses: boolean;
  pesan: string;
  data?: {
    id: string;
    email: string;
    namaLengkap?: string | null;
    peran: string;
    token: string;
  };
};

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
        peran: data.peran,
      }),
    );
  }
};

export const getCurrentUser = (): {
  id: string;
  email: string;
  namaLengkap?: string | null;
  peran: string;
} | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};
