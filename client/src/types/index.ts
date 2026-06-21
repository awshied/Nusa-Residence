export type JenisKelamin = "LAINNYA" | "PRIA" | "WANITA";

export type TipeDataRegistrasi = {
  email: string;
  kataSandi: string;
  konfirmasiKataSandi: string;
  namaLengkap?: string;
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
    nomorTelepon?: string | null;
    jenisKelamin?: JenisKelamin;
    fotoProfil?: string | null;
    peran: string;
    token: string;
  };
};

export type TipeProfil = {
  id: string;
  email: string;
  namaLengkap?: string | null;
  nomorTelepon?: string | null;
  jenisKelamin?: JenisKelamin;
  peran: string;
  statusAkun: string;
  fotoProfil?: string | null;
  dibuatPada: string;
  terakhirLogin?: string | null;
};

export type TipeUser = {
  id: string;
  email: string;
  namaLengkap?: string | null;
  nomorTelepon?: string | null;
  jenisKelamin?: JenisKelamin;
  fotoProfil?: string | null;
  peran: string;
} | null;

export type TipeResponseUpdateProfil = {
  sukses: boolean;
  pesan: string;
  data?: {
    id: string;
    email: string;
    namaLengkap?: string | null;
    nomorTelepon?: string | null;
    jenisKelamin?: JenisKelamin;
    fotoProfil?: string | null;
    peran: string;
  };
};

export interface UpdateProfilePayload {
  namaLengkap?: string;
  nomorTelepon?: string;
  jenisKelamin?: JenisKelamin;
  fotoProfil?: File;
}
