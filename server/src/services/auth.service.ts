import bcrypt from "bcrypt";
import crypto from "crypto";
import { JenisKelamin, PeranPengguna, StatusAkun } from "@prisma/client";
import prisma from "../configs/database";
import { buatToken, TipePayloadJWT } from "../utils/jwt";
import { kirimEmailResetPassword } from "../configs/email";

const SALT_ROUNDS = 10;

export type HasilRegistrasi = {
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

export type HasilLogin = {
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

// Daftar atau buat akun baru
export const registrasiPengguna = async (data: {
  email: string;
  kataSandi: string;
  namaLengkap?: string;
}): Promise<HasilRegistrasi> => {
  try {
    const penggunaExist = await prisma.pengguna.findUnique({
      where: { email: data.email },
    });

    if (penggunaExist) {
      return {
        sukses: false,
        pesan:
          "Alamat email telah terdaftar. Silakan gunakan email lain untuk menjadi salah satu bagian dari kami.",
      };
    }

    const hashedPassword = await bcrypt.hash(data.kataSandi, SALT_ROUNDS);

    const penggunaBaru = await prisma.pengguna.create({
      data: {
        email: data.email,
        kataSandi: hashedPassword,
        namaLengkap: data.namaLengkap || null,
        peran: PeranPengguna.KLIEN,
        statusAkun: StatusAkun.AKTIF,
      },
      select: {
        id: true,
        email: true,
        namaLengkap: true,
        peran: true,
      },
    });

    const payloadJWT: TipePayloadJWT = {
      id: penggunaBaru.id,
      email: penggunaBaru.email,
      peran: penggunaBaru.peran,
    };
    const token = buatToken(payloadJWT);

    return {
      sukses: true,
      pesan:
        "Registrasi berhasil! Anda telah menjadi salah satu member di Nusa Residence.",
      data: {
        id: penggunaBaru.id,
        email: penggunaBaru.email,
        namaLengkap: penggunaBaru.namaLengkap,
        peran: penggunaBaru.peran,
        token,
      },
    };
  } catch (error) {
    console.error("Registrasi error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    };
  }
};

// Login untuk mengakses website
export const loginPengguna = async (data: {
  email: string;
  kataSandi: string;
}): Promise<HasilLogin> => {
  try {
    const pengguna = await prisma.pengguna.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        kataSandi: true,
        namaLengkap: true,
        peran: true,
        statusAkun: true,
      },
    });

    if (!pengguna) {
      return {
        sukses: false,
        pesan: "Email atau password salah.",
      };
    }

    if (pengguna.statusAkun !== StatusAkun.AKTIF) {
      return {
        sukses: false,
        pesan:
          "Akun Anda tidak aktif. Silakan hubungi admin untuk konfirmasi lebih lanjut.",
      };
    }

    const passwordValid = await bcrypt.compare(
      data.kataSandi,
      pengguna.kataSandi,
    );
    if (!passwordValid) {
      return {
        sukses: false,
        pesan: "Email atau password salah.",
      };
    }

    await prisma.pengguna.update({
      where: { id: pengguna.id },
      data: { terakhirLogin: new Date() },
    });

    const payloadJWT: TipePayloadJWT = {
      id: pengguna.id,
      email: pengguna.email,
      peran: pengguna.peran,
    };
    const token = buatToken(payloadJWT);

    return {
      sukses: true,
      pesan: "Login berhasil!",
      data: {
        id: pengguna.id,
        email: pengguna.email,
        namaLengkap: pengguna.namaLengkap,
        peran: pengguna.peran,
        token,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    };
  }
};

// Generate reset token untuk pengguna yang lupa password
export const lupaPassword = async (email: string) => {
  try {
    if (!process.env.CLIENT_URL) {
      console.error("Variabel CLIENT_URL tidak diatur.");
      return {
        sukses: false,
        pesan: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
      };
    }

    const pengguna = await prisma.pengguna.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        namaLengkap: true,
        statusAkun: true,
      },
    });

    if (!pengguna) {
      return {
        sukses: true,
        pesan:
          "Jika email terdaftar, link reset password akan dikirim ke email Anda.",
      };
    }

    if (pengguna.statusAkun !== StatusAkun.AKTIF) {
      return {
        sukses: false,
        pesan: "Akun Anda tidak aktif. Silakan hubungi admin.",
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.pengguna.update({
      where: { id: pengguna.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiresAt,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const emailResult = await kirimEmailResetPassword(
      pengguna.email,
      pengguna.namaLengkap,
      resetLink,
    );

    if (!emailResult.sukses) {
      console.error("Email gagal dikirim untuk:", email);
      return {
        sukses: true,
        pesan: "Link reset password gagal dikirim. Silakan coba lagi nanti.",
        emailError: true,
      };
    }

    return {
      sukses: true,
      pesan:
        "Link reset password hanya berlaku 1 jam saja dan telah kami kirimkan ke email Anda.",
    };
  } catch (error) {
    console.error("Lupa password error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    };
  }
};

// Verifikasi token dan buat password baru
export const buatUlangPassword = async (
  token: string,
  passwordBaru: string,
) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const pengguna = await prisma.pengguna.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
        resetToken: true,
        resetTokenExpiresAt: true,
      },
    });

    if (!pengguna) {
      return {
        sukses: false,
        pesan: "Token reset password tidak valid atau sudah kadaluarsa.",
      };
    }

    const hashedPassword = await bcrypt.hash(passwordBaru, 10);

    await prisma.pengguna.update({
      where: { id: pengguna.id },
      data: {
        kataSandi: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    return {
      sukses: true,
      pesan:
        "Password berhasil direset. Silakan login dengan password baru Anda.",
    };
  } catch (error) {
    console.error("Buat ulang password error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    };
  }
};

// Data dan informasi profil pengguna
export const profilPengguna = async (userId: string) => {
  try {
    const pengguna = await prisma.pengguna.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        namaLengkap: true,
        nomorTelepon: true,
        jenisKelamin: true,
        peran: true,
        statusAkun: true,
        fotoProfil: true,
        dibuatPada: true,
        terakhirLogin: true,
      },
    });

    if (!pengguna) {
      return {
        sukses: false,
        pesan: "Pengguna tidak ditemukan.",
      };
    }

    return {
      sukses: true,
      data: pengguna,
    };
  } catch (error) {
    console.error("Profil error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    };
  }
};

// Perbarui data dan informasi profil pengguna
export const updateProfilPengguna = async ({
  userId,
  nama,
  kontak,
  gender,
  fotoUrl,
}: {
  userId: string;
  nama?: string;
  kontak?: string;
  gender?: JenisKelamin;
  fotoUrl?: string;
}) => {
  try {
    const pengguna = await prisma.pengguna.update({
      where: { id: userId },
      data: {
        ...(nama && { namaLengkap: nama }),
        ...(kontak && { nomorTelepon: kontak }),
        ...(gender && { jenisKelamin: gender }),
        ...(fotoUrl && { fotoProfil: fotoUrl }),
      },
      select: {
        id: true,
        email: true,
        namaLengkap: true,
        nomorTelepon: true,
        jenisKelamin: true,
        fotoProfil: true,
        peran: true,
      },
    });

    return {
      sukses: true,
      data: pengguna,
    };
  } catch (error) {
    console.error("Update profil error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    };
  }
};
