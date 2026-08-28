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

    if (!admin) {
      return {
        sukses: false,
        pesan: "Admin tidak ditemukan.",
      };
    }

    if (admin.statusAkun === "DIBLOKIR") {
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
      NONAKTIF: "Cuti",
      DIBLOKIR: "Dipecat",
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

// Hapus Admin yang tidak memiliki tanggung jawab secara permanen (Owner Only)
export const hapusAdminPermanen = async (adminId: string, ownerId: string) => {
  try {
    const owner = await prisma.pengguna.findUnique({
      where: { id: ownerId },
      select: { peran: true },
    });

    if (!owner || owner.peran !== "PEMILIK") {
      return {
        sukses: false,
        pesan: "Hanya Owner yang dapat menghapus Admin.",
      };
    }

    const admin = await prisma.pengguna.findFirst({
      where: {
        id: adminId,
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
        pesan: `Admin ini masih bertanggung jawab atas properti "${admin.propertiDikelola.nama}". Hapus tanggung jawab properti terlebih dahulu sebelum menghapus Admin.`,
      };
    }

    await prisma.pengguna.delete({
      where: { id: adminId },
    });

    return {
      sukses: true,
      pesan: "Admin berhasil dihapus dari sistem.",
    };
  } catch (error) {
    console.error("Hapus admin permanen error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};
