import { Request, Response } from "express";
import {
  skemaBuatOwner,
  skemaLogin,
  skemaLupaPassword,
  skemaRegistrasi,
  skemaResetPassword,
  skemaUpdateProfil,
} from "../validators/auth.validator";
import {
  buatOwnerPertama,
  buatUlangPassword,
  cekOwner,
  loginPengguna,
  lupaPassword,
  profilPengguna,
  registrasiPengguna,
  updateProfilPengguna,
} from "../services/auth.service";

interface CloudinaryUploadResponse {
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
}

// Daftar atau buat akun baru (Klien Only)
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

// Cek Owner apakah suaah ada (System Only)
export const ketersediaanOwner = async (req: Request, res: Response) => {
  try {
    const hasil = await cekOwner();
    return res.status(200).json(hasil);
  } catch (error) {
    console.error("Cek Owner error:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    });
  }
};

// Buat Owner Pertama (System Only)
export const bikinOwner = async (req: Request, res: Response) => {
  try {
    const validasi = skemaBuatOwner.safeParse(req.body);

    if (!validasi.success) {
      return res.status(400).json({
        sukses: false,
        pesan: validasi.error.issues[0].message,
        detail: validasi.error.issues,
      });
    }

    const { email, kataSandi, namaLengkap, nomorTelepon } = validasi.data;
    const hasil = await buatOwnerPertama({
      email,
      kataSandi,
      namaLengkap,
      nomorTelepon,
    });

    const statusKode = hasil.sukses ? 201 : 400;
    return res.status(statusKode).json(hasil);
  } catch (error) {
    console.error("Buat Owner error:", error);
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

    let fotoUrl = "";

    if (req.file) {
      try {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const uploadPreset = "nusa-residence";

        const base64 = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype};base64,${base64}`;

        const formData = new FormData();
        formData.append("file", dataUri);
        formData.append("upload_preset", uploadPreset);
        formData.append("api_key", apiKey || "");
        formData.append("folder", "nusa-residence/profil");
        formData.append("public_id", `${userId}_${Date.now()}`);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const result = (await response.json()) as CloudinaryUploadResponse;

        if (response.ok) {
          fotoUrl = result.secure_url;
        } else {
          throw new Error(
            result.error?.message || "Gagal upload ke dalam Cloudinary.",
          );
        }
      } catch (cloudinaryError: any) {
        console.error(
          "Cloudinary sedang mengalami gangguan:",
          cloudinaryError.message,
        );
      }
    }

    const hasil = await updateProfilPengguna({
      userId,
      nama,
      kontak,
      gender,
      fotoUrl: fotoUrl || undefined,
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
