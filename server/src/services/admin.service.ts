import bcrypt from "bcrypt";
import { PeranPengguna, StatusAkun } from "@prisma/client";
import prisma from "../configs/database";

export type DataBuatAdmin = {
  email: string;
  kataSandi: string;
  namaLengkap?: string;
  nomorTelepon?: string;
};

// Owner membuat Admin baru untuk memikul tanggung jawab sebuah properti (Owner Only)
export const buatAdmin = async (ownerId: string, data: DataBuatAdmin) => {
  try {
    const owner = await prisma.pengguna.findUnique({
      where: { id: ownerId },
      select: { peran: true },
    });

    if (!owner || owner.peran !== "PEMILIK") {
      return {
        sukses: false,
        pesan: "Hanya Owner yang dapat membuat Admin.",
      };
    }

    const penggunaExist = await prisma.pengguna.findUnique({
      where: { email: data.email },
    });

    if (penggunaExist) {
      return {
        sukses: false,
        pesan:
          "Alamat email yang Anda masukkan sudah terdaftar. Mohon untuk menggunakan alamat email lain agar tidak bertabrakan dengan yang sudah ada.",
      };
    }

    const hashedPassword = await bcrypt.hash(data.kataSandi, 10);
    const adminBaru = await prisma.pengguna.create({
      data: {
        email: data.email,
        kataSandi: hashedPassword,
        namaLengkap: data.namaLengkap || null,
        nomorTelepon: data.nomorTelepon || null,
        peran: PeranPengguna.ADMIN,
        statusAkun: StatusAkun.AKTIF,
        dibuatOlehId: ownerId,
      },
      select: {
        id: true,
        email: true,
        namaLengkap: true,
        nomorTelepon: true,
        peran: true,
        statusAkun: true,
        dibuatPada: true,
      },
    });

    return {
      sukses: true,
      pesan: "Admin baru berhasil ditambahkan.",
      data: adminBaru,
    };
  } catch (error) {
    console.error("Membuat admin baru error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};

// Memuat semua Admin milik Owner (Owner Only)
export const getAdminByOwner = async (ownerId: string) => {
  try {
    const adminList = await prisma.pengguna.findMany({
      where: {
        peran: "ADMIN",
        dibuatOlehId: ownerId,
      },
      select: {
        id: true,
        email: true,
        namaLengkap: true,
        nomorTelepon: true,
        fotoProfil: true,
        peran: true,
        statusAkun: true,
        dibuatPada: true,
        propertiDikelola: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
      orderBy: { dibuatPada: "desc" },
    });

    return {
      sukses: true,
      data: adminList,
    };
  } catch (error) {
    console.error("Memuat admin milik owner error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};

// Update status keaktifan Admin (Owner Only)
export const updateStatusKeaktifan = async (
  adminId: string,
  ownerId: string,
  statusBaru: StatusAkun,
) => {
  try {
    const owner = await prisma.pengguna.findUnique({
      where: { id: ownerId },
      select: { peran: true },
    });

    if (!owner || owner.peran !== "PEMILIK") {
      return {
        sukses: false,
        pesan: "Hanya Owner yang dapat mengubah status Admin.",
      };
    }

    const admin = await prisma.pengguna.findFirst({
      where: {
        id: adminId,
        peran: "ADMIN",
        dibuatOlehId: ownerId,
      },
      include: {
        propertiDikelola: true,
      },
    });

    if (!admin) {
      return {
        sukses: false,
        pesan: "Admin tidak ditemukan.",
      };
    }

    if (admin.propertiDikelola) {
      return {
        sukses: false,
        pesan: `Admin ini sedang mengelola properti "${admin.propertiDikelola.nama}" sehingga status keaktifannya tidak dapat diubah.`,
      };
    }

    if (admin.statusAkun === "DIBLOKIR" && statusBaru === "AKTIF") {
      return {
        sukses: false,
        pesan: "Admin dengan status DIBLOKIR tidak dapat diaktifkan kembali.",
      };
    }

    const adminUpdated = await prisma.pengguna.update({
      where: { id: adminId },
      data: {
        statusAkun: statusBaru,
      },
      select: {
        id: true,
        email: true,
        namaLengkap: true,
        nomorTelepon: true,
        fotoProfil: true,
        peran: true,
        statusAkun: true,
        dibuatPada: true,
        propertiDikelola: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });

    const statusLabels = {
      AKTIF: "Aktif",
      NONAKTIF: "Nonaktif (Cuti)",
      DIBLOKIR: "Diblokir",
    };

    return {
      sukses: true,
      pesan: `Status Admin berhasil diubah menjadi ${statusLabels[statusBaru]}.`,
      data: adminUpdated,
    };
  } catch (error) {
    console.error("Update status keaktifan admin error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};

// Pecat Admin yang tidak bertanggung jawab atas properti (Owner Only)
export const pecatAdmin = async (adminId: string, ownerId: string) => {
  try {
    const admin = await prisma.pengguna.findFirst({
      where: {
        id: adminId,
        peran: "ADMIN",
        dibuatOlehId: ownerId,
      },
      include: {
        propertiDikelola: true,
      },
    });

    if (!admin) {
      return {
        sukses: false,
        pesan: "Admin tidak ditemukan.",
      };
    }

    if (admin.propertiDikelola) {
      return {
        sukses: false,
        pesan: `Admin ini sedang sibuk mengelola properti "${admin.propertiDikelola.nama}". Hapus properti terlebih dahulu agar Anda dapat memecat anomali ini.`,
      };
    }

    await prisma.pengguna.delete({
      where: { id: adminId },
    });

    return {
      sukses: true,
      pesan: "Admin baru saja dipecat.",
    };
  } catch (error) {
    console.error("Pecat admin error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};
