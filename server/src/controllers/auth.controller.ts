import { Request, Response } from "express";
import { skemaLogin, skemaRegistrasi } from "../validators/auth.validator";
import { loginPengguna, registrasiPengguna } from "../services/auth.service";

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

    const { email, kataSandi, namaLengkap, nomorTelepon } = validasi.data;

    const hasil = await registrasiPengguna({
      email,
      kataSandi,
      namaLengkap,
      nomorTelepon,
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
