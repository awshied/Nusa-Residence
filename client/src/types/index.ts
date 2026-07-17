// Autentikasi, Profil, Akun

export type JenisKelamin = "LAINNYA" | "PRIA" | "WANITA";
export type StatusAkun = "AKTIF" | "NONAKTIF" | "DIBLOKIR";

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

export type TipeDataLupaPassword = {
  email: string;
};

export type TipeDataResetPassword = {
  token: string;
  kataSandi: string;
  konfirmasiKataSandi: string;
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
  statusAkun: StatusAkun;
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

export type TipeAdmin = {
  id: string;
  email: string;
  namaLengkap?: string;
  nomorTelepon?: string;
  jenisKelamin?: JenisKelamin;
  peran: string;
  statusAkun: StatusAkun;
  fotoProfil?: string | null;
  dibuatPada: string;
  propertiDikelola?: {
    id: string;
    nama: string;
  } | null;
};

export type DataBuatAdmin = {
  email: string;
  kataSandi: string;
  namaLengkap?: string;
  nomorTelepon?: string;
};

export interface UpdateProfilePayload {
  namaLengkap?: string;
  nomorTelepon?: string;
  jenisKelamin?: JenisKelamin;
  fotoProfil?: File;
}

// Properti atau Tempat Penginapan

export type KategoriProperti =
  | "HOTEL"
  | "VILLA"
  | "APARTEMEN"
  | "KOSAN"
  | "KONTRAKAN";

export type TipeAdminTersedia = {
  id: string;
  email: string;
  namaLengkap?: string;
  nomorTelepon?: string;
};

export type TipeProperti = {
  id: string;
  nama: string;
  kategori: KategoriProperti;
  namaJalan: string;
  kelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos?: string;
  latitude: number;
  longitude: number;
  nomorTelepon?: string;
  luasBangunan?: number;
  deskripsi?: string;
  amenities: string[];
  ratingRataRata: number;
  jumlahRating: number;
  dibuatPada: string;
  admin?: {
    id: string;
    email: string;
    namaLengkap: string;
    fotoProfil?: string | null;
  };
  gambar?: {
    id: string;
    url: string;
    isUtama: boolean;
  }[];
  tipeKamar?: {
    id: string;
    nama: string;
    hargaPerMalam?: number;
    hargaPerBulan?: number;
    jumlahUnit: number;
    tersedia: number;
  }[];
};

export type DataBuatProperti = {
  nama: string;
  kategori: KategoriProperti;
  namaJalan: string;
  kelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos?: string;
  latitude: number;
  longitude: number;
  nomorTelepon?: string;
  luasBangunan?: number;
  deskripsi?: string;
  amenities: string[];
  adminId?: string;
  gambar?: File[];
};
