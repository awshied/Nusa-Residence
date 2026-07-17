import { Request, Response } from "express";
import {
  skemaBuatAdmin,
  skemaPerbaruiStatusAdmin,
} from "../validators/admin.validator";
import {
  buatAdmin,
  getAdminByOwner,
  pecatAdmin,
  updateStatusKeaktifan,
} from "../services/admin.service";
import { StatusAkun } from "@prisma/client";

// Owner membuat Admin baru untuk memikul tanggung jawab sebuah properti (Owner Only)
export const tambahAdminBaru = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "Pengguna tidak ditemukan.",
      });
    }

    const validasi = skemaBuatAdmin.safeParse(req.body);

    if (!validasi.success) {
      return res.status(400).json({
        sukses: false,
        pesan: validasi.error.issues[0].message,
        detail: validasi.error.issues,
      });
    }

    const hasil = await buatAdmin(userId, validasi.data);

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(201).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat menambah admin baru:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Memuat semua Admin milik Owner (Owner Only)
export const getSemuaAdminOwner = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "Pengguna tidak ditemukan.",
      });
    }

    const hasil = await getAdminByOwner(userId);

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat memuat semua admin milik owner:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Update status keaktifan Admin (Owner Only)
export const perbaruiStatusKeaktifan = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "User tidak ditemukan dalam token.",
      });
    }

    const validasi = skemaPerbaruiStatusAdmin.safeParse(req.body);

    if (!validasi.success) {
      return res.status(400).json({
        sukses: false,
        pesan: validasi.error.issues[0].message,
      });
    }

    if (Array.isArray(id)) {
      return res.status(400).json({
        sukses: false,
        pesan: "Parameter id tidak valid.",
      });
    }

    const hasil = await updateStatusKeaktifan(
      id,
      userId,
      validasi.data.status as StatusAkun,
    );

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat memperbarui status admin:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Pecat Admin yang tidak bertanggung jawab atas properti (Owner Only)
export const hapusAdmin = async (req: Request, res: Response) => {
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

    const hasil = await pecatAdmin(id, userId);

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat memecat admin:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};
