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

    const validasi = skemaBuatProperti.safeParse(req.body);

    if (!validasi.success) {
      return res.status(400).json({
        sukses: false,
        pesan: validasi.error.issues[0].message,
        detail: validasi.error.issues,
      });
    }

    const hasil = await buatProperti(userId, validasi.data);

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(201).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat menambah properti baru:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Upload gambar properti (Owner Only)
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

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({
        sukses: false,
        pesan: "Tidak ada file yang diupload.",
      });
    }

    const files = req.files as Express.Multer.File[];
    const urls = files.map((file) => file.path);

    const isUtama = req.query.utama === "true";

    if (Array.isArray(id)) {
      return res.status(400).json({
        sukses: false,
        pesan: "Parameter id tidak valid.",
      });
    }

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

export const uploadGambarSementara = async (req: Request, res: Response) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({
        sukses: false,
        pesan: "Tidak ada file yang diupload.",
      });
    }

    const files = req.files as Express.Multer.File[];
    const hasil = files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    return res.status(200).json({
      sukses: true,
      data: hasil,
    });
  } catch (error) {
    console.error("Upload gambar sementara error:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};
