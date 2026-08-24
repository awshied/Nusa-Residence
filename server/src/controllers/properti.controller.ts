import { Request, Response } from "express";
import {
  skemaBuatProperti,
  skemaEditProperti,
} from "../validators/properti.validator";
import {
  buatProperti,
  getAdminTersedia,
  getDetailProperti,
  getPropertiByAdmin,
  getPropertiByOwner,
  hapusProperti,
  hilangkanGambarProperti,
  setGambarUtama,
  ubahProperti,
  unggahGambarProperti,
} from "../services/properti.service";

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  version: number;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  url: string;
  error?: {
    message: string;
  };
};

type UploadedFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

// Tambah properti baru (Owner Only)
export const tambahPropertiBaru = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "Pengguna tidak ditemukan.",
      });
    }

    const body = req.body;

    const latitude = parseFloat(body.latitude) || 0;
    const longitude = parseFloat(body.longitude) || 0;
    const luasBangunan = body.luasBangunan
      ? parseFloat(body.luasBangunan)
      : undefined;

    let amenities = body.amenities || [];
    if (typeof amenities === "string") {
      try {
        amenities = JSON.parse(amenities);
      } catch (e) {
        amenities = [];
      }
    }
    if (!Array.isArray(amenities)) {
      amenities = [];
    }

    const dataToValidate = {
      nama: body.nama || "",
      kategori: body.kategori || "",
      namaJalan: body.namaJalan || "",
      kelurahan: body.kelurahan || "",
      kecamatan: body.kecamatan || "",
      kabupatenKota: body.kabupatenKota || "",
      provinsi: body.provinsi || "",
      kodePos: body.kodePos || undefined,
      latitude: latitude,
      longitude: longitude,
      luasBangunan: luasBangunan,
      deskripsi: body.deskripsi || undefined,
      amenities: amenities,
      adminId: body.adminId || "",
    };

    const validasi = skemaBuatProperti.safeParse(dataToValidate);
    if (!validasi.success) {
      return res.status(400).json({
        sukses: false,
        pesan: validasi.error.issues[0].message,
        detail: validasi.error.issues,
      });
    }

    let gambarUrls: string[] = [];
    const files = req.files as UploadedFile[] | undefined;

    if (files && files.length > 0) {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const uploadPreset = "nusa-residence";

      if (!cloudName || !apiKey) {
        return res.status(500).json({
          sukses: false,
          pesan: "Konfigurasi Cloudinary tidak lengkap.",
        });
      }

      const uploadPromises = files.map(async (file, index) => {
        const base64 = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64}`;

        const formData = new FormData();
        formData.append("file", dataUri);
        formData.append("upload_preset", uploadPreset);
        formData.append("api_key", apiKey);
        formData.append("folder", "nusa-residence/properti");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const result = (await response.json()) as CloudinaryUploadResult;
        if (!response.ok) {
          throw new Error(
            result.error?.message || "Gagal upload ke Cloudinary.",
          );
        }

        return result.secure_url;
      });

      gambarUrls = await Promise.all(uploadPromises);
      console.log(
        `${gambarUrls.length} gambar berhasil diupload ke Cloudinary.`,
      );
    }

    const hasil = await buatProperti(userId, {
      ...validasi.data,
      gambarUrls,
    });

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(201).json(hasil);
  } catch (error: any) {
    console.error("Anda tidak dapat menambah properti baru:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Upload gambar tambahan untuk properti yang sudah ada (Owner Only)
export const uploadGambarProperti = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "User tidak ditemukan.",
      });
    }

    if (!req.files || (req.files as UploadedFile[]).length === 0) {
      return res.status(400).json({
        sukses: false,
        pesan: "Tidak ada file yang diupload.",
      });
    }

    if (Array.isArray(id)) {
      return res.status(400).json({
        sukses: false,
        pesan: "Parameter id tidak valid.",
      });
    }

    const files = req.files as UploadedFile[];

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const uploadPreset = "nusa-residence";

    const uploadPromises = files.map(async (file) => {
      const base64 = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64}`;

      const formData = new FormData();
      formData.append("file", dataUri);
      formData.append("upload_preset", uploadPreset);
      formData.append("api_key", apiKey || "");
      formData.append("folder", `nusa-residence/properti/${id}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = (await response.json()) as CloudinaryUploadResult;
      if (!response.ok) {
        throw new Error(result.error?.message || "Gagal upload ke Cloudinary.");
      }

      return result.secure_url;
    });

    const urls = await Promise.all(uploadPromises);
    const isUtama = req.query.utama === "true";

    const hasil = await unggahGambarProperti(id, userId, urls, isUtama);

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(201).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat upload gambar properti:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Menghapus gambar properti (Owner Only)
export const hapusGambarProperti = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { gambarId } = req.params;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "User tidak ditemukan dalam token.",
      });
    }

    if (Array.isArray(gambarId)) {
      return res.status(400).json({
        sukses: false,
        pesan: "Parameter id tidak valid.",
      });
    }

    const hasil = await hilangkanGambarProperti(gambarId, userId);

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat menghapus gambar properti:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Set gambar properti yang utama
export const setGambarUtamaProperti = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { gambarId } = req.params;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "User tidak ditemukan dalam token.",
      });
    }

    if (Array.isArray(gambarId)) {
      return res.status(400).json({
        sukses: false,
        pesan: "Parameter id tidak valid.",
      });
    }

    const hasil = await setGambarUtama(gambarId, userId);

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat mengatur gambar properti utama:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Memuat semua properti milik Owner
export const getSemuaPropertiOwner = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "Pengguna tidak ditemukan.",
      });
    }

    const hasil = await getPropertiByOwner(userId);

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat memuat semua properti:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Memuat properti yang dikelola oleh Admin tertentu
export const getPropertiAdmin = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "Pengguna tidak ditemukan.",
      });
    }

    const hasil = await getPropertiByAdmin(userId);

    if (!hasil.sukses) {
      return res.status(404).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error(
      "Anda tidak dapat memuat properti yang dikelola Admin:",
      error,
    );
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Perbarui data properti (Owner Only)
export const editProperti = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "Pengguna tidak ditemukan.",
      });
    }

    if (Array.isArray(id)) {
      return res.status(400).json({
        sukses: false,
        pesan: "Parameter id tidak valid.",
      });
    }

    const validasi = skemaEditProperti.safeParse(req.body);

    if (!validasi.success) {
      return res.status(400).json({
        sukses: false,
        pesan: validasi.error.issues[0].message,
        detail: validasi.error.issues,
      });
    }

    const hasil = await ubahProperti(id, userId, validasi.data);

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat memperbarui data properti:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Hapus properti yang tidak layak huni (Owner Only)
export const hilangkanProperti = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "Pengguna tidak ditemukan.",
      });
    }

    if (Array.isArray(id)) {
      return res.status(400).json({
        sukses: false,
        pesan: "Parameter id tidak valid.",
      });
    }

    const hasil = await hapusProperti(id, userId);

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat menghapus properti:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Memuat informasi detail sebuah properti
export const getDataProperti = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "Pengguna tidak ditemukan.",
      });
    }

    if (Array.isArray(id)) {
      return res.status(400).json({
        sukses: false,
        pesan: "Parameter id tidak valid.",
      });
    }

    const hasil = await getDetailProperti(id, userId);

    if (!hasil.sukses) {
      return res.status(404).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat memuat detail properti:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Memuat semua data Admin yang belum bertanggung jawab atas properti (Owner Only)
export const getKetersediaanAdmin = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "Pengguna tidak ditemukan.",
      });
    }

    const hasil = await getAdminTersedia(userId);

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat memuat ketersediaan admin:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};
