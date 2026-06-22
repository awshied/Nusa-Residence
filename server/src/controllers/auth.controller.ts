import { Request, Response } from "express";
import {
  skemaLogin,
  skemaLupaPassword,
  skemaRegistrasi,
  skemaResetPassword,
  skemaUpdateProfil,
} from "../validators/auth.validator";
import {
  buatUlangPassword,
  loginPengguna,
  lupaPassword,
  profilPengguna,
  registrasiPengguna,
  updateProfilPengguna,
} from "../services/auth.service";

// Daftar atau buat akun baru
export const registrasi = async (req: Request, res: Response) => {
  try {
    const validasi = skemaRegistrasi.safeParse(req.body);

    if (!validasi.success) {
      const errorPertama = validasi.error.issues[0].message;
      return res.status(400).json({
        sukses: false,
        pesan: errorPertama,
        detail: validasi.error.issues,
      });
    }

    const { email, kataSandi, namaLengkap } = validasi.data;

    const hasil = await registrasiPengguna({
      email,
      kataSandi,
      namaLengkap,
    });

    const statusKode = hasil.sukses ? 201 : 400;
    return res.status(statusKode).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat melakukan registrasi:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Login untuk mengakses website
export const login = async (req: Request, res: Response) => {
  try {
    const validasi = skemaLogin.safeParse(req.body);

    if (!validasi.success) {
      return res.status(400).json({
        sukses: false,
        pesan: validasi.error.issues[0].message,
      });
    }

    const { email, kataSandi } = validasi.data;
    const hasil = await loginPengguna({ email, kataSandi });

    const statusKode = hasil.sukses ? 200 : 401;
    return res.status(statusKode).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat melakukan login:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Generate reset token untuk pengguna yang lupa password
export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const validasi = skemaLupaPassword.safeParse(req.body);

    if (!validasi.success) {
      return res.status(400).json({
        sukses: false,
        pesan: validasi.error.issues[0].message,
      });
    }

    const { email } = validasi.data;
    const hasil = await lupaPassword(email);

    return res.status(hasil.sukses ? 200 : 400).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat melupakan password Anda:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Verifikasi token dan buat password baru
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const validasi = skemaResetPassword.safeParse(req.body);

    if (!validasi.success) {
      return res.status(400).json({
        sukses: false,
        pesan: validasi.error.issues[0].message,
      });
    }

    const { token, kataSandi } = validasi.data;
    const hasil = await buatUlangPassword(token, kataSandi);

    return res.status(hasil.sukses ? 200 : 400).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat membuat ulang password Anda:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Data dan informasi profil pengguna
export const getProfil = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "User tidak ditemukan dalam token.",
      });
    }

    const hasil = await profilPengguna(userId);

    if (!hasil.sukses) {
      if (hasil.pesan === "Pengguna tidak ditemukan.") {
        return res.status(404).json(hasil);
      }
      return res.status(500).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat melihat informasi profil Anda:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Perbarui data dan informasi profil pengguna
export const pembaruanProfil = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        sukses: false,
        pesan: "Pengguna tidak ditemukan.",
      });
    }

    const validasi = skemaUpdateProfil.safeParse(req.body);

    if (!validasi.success) {
      return res.status(400).json({
        sukses: false,
        pesan: validasi.error.issues[0].message,
      });
    }

    const {
      namaLengkap: nama,
      nomorTelepon: kontak,
      jenisKelamin: gender,
    } = validasi.data;

    const fotoUrl = req.file?.path;

    const hasil = await updateProfilPengguna({
      userId,
      nama,
      kontak,
      gender,
      fotoUrl,
    });

    if (!hasil.sukses) {
      return res.status(400).json(hasil);
    }

    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Anda tidak dapat memperbarui informasi profil Anda:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};
