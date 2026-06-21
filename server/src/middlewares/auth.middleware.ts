import { Request, Response, NextFunction } from "express";
import {
  ambilTokenDariHeader,
  TipePayloadJWT,
  verifikasiToken,
} from "../utils/jwt";
import prisma from "../configs/database";

declare global {
  namespace Express {
    interface Request {
      user?: TipePayloadJWT;
    }
  }
}

// Verifikasi token untuk autentikasi
export const verifikasiAutentikasi = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = ambilTokenDariHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        sukses: false,
        pesan: "Akses ditolak. Token tidak ditemukan.",
      });
    }

    const decoded = verifikasiToken(token);

    if (!decoded) {
      return res.status(401).json({
        sukses: false,
        pesan: "Token tidak valid atau sudah kadaluarsa.",
      });
    }

    // Cek apakah user masih aktif di database
    const pengguna = await prisma.pengguna.findUnique({
      where: { id: decoded.id },
      select: { statusAkun: true },
    });

    if (!pengguna || pengguna.statusAkun !== "AKTIF") {
      return res.status(401).json({
        sukses: false,
        pesan: "Akun tidak aktif atau tidak ditemukan.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Verifikasi autentikasi error:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Verifikasi peran yang dipanggil setelah verifikasi autentikasi
export const VerifikasiRole = (...roleYangDiizinkan: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        sukses: false,
        pesan: "Akses ditolak. Silakan login terlebih dahulu.",
      });
    }

    if (!roleYangDiizinkan.includes(req.user.peran)) {
      return res.status(403).json({
        sukses: false,
        pesan: `Akses ditolak. Role '${req.user.peran}' tidak memiliki izin untuk mengakses.`,
      });
    }

    next();
  };
};
