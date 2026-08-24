import { Amenities, KategoriProperti } from "@prisma/client";
import prisma from "../configs/database";

export type DataBuatProperti = {
  nama: string;
  kategori: KategoriProperti;
  namaJalan: string;
  kelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos?: string;
  latitude: number;
  longitude: number;
  luasBangunan?: number;
  deskripsi?: string;
  amenities?: Amenities[];
  adminId: string;
  gambarUrls?: string[];
};

export type DataUbahProperti = Partial<
  Omit<DataBuatProperti, "adminId" | "gambarUrls">
>;

// Owner membuat properti baru dengan Admin sebagai pengelola lebih lanjut (Owner Only)
export const buatProperti = async (ownerId: string, data: DataBuatProperti) => {
  try {
    console.log(
      "🏨 Creating property with data:",
      JSON.stringify(data, null, 2),
    );

    const owner = await prisma.pengguna.findUnique({
      where: { id: ownerId },
      select: { peran: true },
    });

    if (!owner || owner.peran !== "PEMILIK") {
      return {
        sukses: false,
        pesan: "Hanya Owner yang dapat membuat properti.",
      };
    }

    if (!data.adminId) {
      return {
        sukses: false,
        pesan: "Admin wajib dipilih untuk mengelola properti.",
      };
    }

    console.log("🔍 Checking admin with ID:", data.adminId);

    const admin = await prisma.pengguna.findUnique({
      where: { id: data.adminId },
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

    if (admin.peran !== "ADMIN") {
      return {
        sukses: false,
        pesan: "Pengguna ini bukan Admin.",
      };
    }

    if (admin.propertiDikelola) {
      return {
        sukses: false,
        pesan: "Admin ini sudah mengelola properti lain.",
      };
    }

    const propertiBaru = await prisma.$transaction(async (tx) => {
      const properti = await tx.properti.create({
        data: {
          nama: data.nama,
          kategori: data.kategori,
          namaJalan: data.namaJalan,
          kelurahan: data.kelurahan,
          kecamatan: data.kecamatan,
          kabupatenKota: data.kabupatenKota,
          provinsi: data.provinsi,
          kodePos: data.kodePos,
          latitude: data.latitude,
          longitude: data.longitude,
          lokasi: `POINT(${data.longitude} ${data.latitude})`,
          luasBangunan: data.luasBangunan,
          deskripsi: data.deskripsi,
          amenities: data.amenities || [],
          pemilikId: ownerId,
          adminId: data.adminId,
        },
      });

      if (data.gambarUrls && data.gambarUrls.length > 0) {
        await tx.propertiGambar.createMany({
          data: data.gambarUrls.map((url, index) => ({
            propertiId: properti.id,
            url,
            isUtama: index === 0,
            urutan: index,
          })),
        });
      }

      return properti;
    });

    const propertiWithRelations = await prisma.properti.findUnique({
      where: { id: propertiBaru.id },
      include: {
        pemilik: {
          select: { id: true, email: true, namaLengkap: true },
        },
        admin: {
          select: { id: true, email: true, namaLengkap: true },
        },
        gambar: {
          orderBy: { urutan: "asc" },
        },
        tipeKamar: true,
      },
    });

    return {
      sukses: true,
      pesan: `Properti ${data.nama} berhasil dibuat.`,
      data: propertiWithRelations,
    };
  } catch (error: any) {
    console.error("Buat properti error:", error);
    console.error("❌ Stack trace:", error.stack);

    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};

// Memuat semua data Admin yang belum bertanggung jawab atas properti (Owner Only)
export const getAdminTersedia = async (ownerId: string) => {
  try {
    const owner = await prisma.pengguna.findUnique({
      where: { id: ownerId },
      select: { peran: true },
    });

    if (!owner || owner.peran !== "PEMILIK") {
      return {
        sukses: false,
        pesan: "Hanya Owner yang dapat mengakses data Admin.",
      };
    }

    const admins = await prisma.pengguna.findMany({
      where: {
        peran: "ADMIN",
        dibuatOlehId: ownerId,
        propertiDikelola: null,
      },
      select: {
        id: true,
        email: true,
        namaLengkap: true,
        nomorTelepon: true,
        dibuatPada: true,
      },
      orderBy: { dibuatPada: "desc" },
    });

    return {
      sukses: true,
      data: admins,
    };
  } catch (error) {
    console.error("Memuat semua admin yang tersedia error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};

// Upload gambar properti (Owner Only)
export const unggahGambarProperti = async (
  propertiId: string,
  ownerId: string,
  urls: string[],
  isUtama: boolean = false,
) => {
  try {
    const properti = await prisma.properti.findFirst({
      where: {
        id: propertiId,
        pemilikId: ownerId,
      },
    });

    if (!properti) {
      return {
        sukses: false,
        pesan: "Properti tidak ditemukan.",
      };
    }

    if (isUtama) {
      await prisma.propertiGambar.updateMany({
        where: { propertiId },
        data: { isUtama: false },
      });
    }

    const lastImage = await prisma.propertiGambar.findFirst({
      where: { propertiId },
      orderBy: { urutan: "desc" },
      select: { urutan: true },
    });

    const startOrder = lastImage ? lastImage.urutan + 1 : 0;

    const gambar = await prisma.$transaction(
      urls.map((url, index) =>
        prisma.propertiGambar.create({
          data: {
            propertiId,
            url,
            isUtama: isUtama && index === 0,
            urutan: startOrder + index,
          },
        }),
      ),
    );

    return {
      sukses: true,
      pesan: `${gambar.length} gambar berhasil diunggah.`,
      data: gambar,
    };
  } catch (error) {
    console.error("Unggah gambar properti error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};

// Menghapus gambar properti (Owner Only)
export const hilangkanGambarProperti = async (
  gambarId: string,
  ownerId: string,
) => {
  try {
    const gambar = await prisma.propertiGambar.findFirst({
      where: {
        id: gambarId,
        properti: {
          pemilikId: ownerId,
        },
      },
    });

    if (!gambar) {
      return {
        sukses: false,
        pesan: "Gambar tidak ditemukan.",
      };
    }

    if (gambar.isUtama) {
      const firstImage = await prisma.propertiGambar.findFirst({
        where: {
          propertiId: gambar.propertiId,
          id: { not: gambarId },
        },
        orderBy: { urutan: "asc" },
      });

      if (firstImage) {
        await prisma.propertiGambar.update({
          where: { id: firstImage.id },
          data: { isUtama: true },
        });
      }
    }

    await prisma.propertiGambar.delete({
      where: { id: gambarId },
    });

    return {
      sukses: true,
      pesan: "Gambar berhasil dihapus.",
    };
  } catch (error) {
    console.error("Hapus gambar properti error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};

// Set gambar properti yang utama
export const setGambarUtama = async (gambarId: string, ownerId: string) => {
  try {
    const gambar = await prisma.propertiGambar.findFirst({
      where: {
        id: gambarId,
        properti: {
          pemilikId: ownerId,
        },
      },
    });

    if (!gambar) {
      return {
        sukses: false,
        pesan: "Gambar tidak ditemukan.",
      };
    }

    await prisma.propertiGambar.updateMany({
      where: { propertiId: gambar.propertiId },
      data: { isUtama: false },
    });

    await prisma.propertiGambar.update({
      where: { id: gambarId },
      data: { isUtama: true },
    });

    return {
      sukses: true,
      pesan: "Gambar utama berhasil diubah.",
    };
  } catch (error) {
    console.error("Set gambar utama error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};

// Memuat semua properti milik Owner
export const getPropertiByOwner = async (ownerId: string) => {
  try {
    const owner = await prisma.pengguna.findUnique({
      where: { id: ownerId },
      select: { peran: true },
    });

    if (!owner) {
      return {
        sukses: false,
        pesan: "Pengguna tidak ditemukan.",
      };
    }

    if (owner.peran !== "PEMILIK") {
      return {
        sukses: false,
        pesan: "Pengguna bukan Owner.",
      };
    }

    const properti = await prisma.properti.findMany({
      where: { pemilikId: ownerId },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            namaLengkap: true,
          },
        },
        gambar: {
          where: { isUtama: true },
          take: 1,
        },
        tipeKamar: {
          select: {
            id: true,
            nama: true,
            hargaPerMalam: true,
            hargaPerBulan: true,
            jumlahUnit: true,
            tersedia: true,
          },
        },
      },
      orderBy: { dibuatPada: "desc" },
    });

    return {
      sukses: true,
      data: properti,
    };
  } catch (error) {
    console.error("Memuat properti owner error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};

// Memuat properti yang dikelola Admin
export const getPropertiByAdmin = async (adminId: string) => {
  try {
    const properti = await prisma.properti.findUnique({
      where: { adminId },
      include: {
        pemilik: {
          select: {
            id: true,
            email: true,
            namaLengkap: true,
          },
        },
        gambar: true,
        tipeKamar: {
          select: {
            id: true,
            nama: true,
            hargaPerMalam: true,
            hargaPerBulan: true,
            jumlahUnit: true,
            tersedia: true,
          },
        },
        menu: true,
        fasilitas: true,
      },
    });

    if (!properti) {
      return {
        sukses: false,
        pesan: "Admin tidak mengelola properti apapun.",
      };
    }

    return {
      sukses: true,
      data: properti,
    };
  } catch (error) {
    console.error("Memuat properti yang dikelola admin error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};

// Perbarui data properti (Owner Only)
export const ubahProperti = async (
  propertiId: string,
  ownerId: string,
  data: {
    nama?: string;
    kategori?: KategoriProperti;
    namaJalan?: string;
    kelurahan?: string;
    kecamatan?: string;
    kabupatenKota?: string;
    provinsi?: string;
    kodePos?: string;
    latitude?: number;
    longitude?: number;
    luasBangunan?: number;
    deskripsi?: string;
    amenities?: Amenities[];
  },
) => {
  try {
    const properti = await prisma.properti.findFirst({
      where: {
        id: propertiId,
        pemilikId: ownerId,
      },
    });

    if (!properti) {
      return {
        sukses: false,
        pesan: "Properti tidak ditemukan.",
      };
    }

    const updateData: {
      nama?: string;
      kategori?: KategoriProperti;
      namaJalan?: string;
      kelurahan?: string;
      kecamatan?: string;
      kabupatenKota?: string;
      provinsi?: string;
      kodePos?: string;
      latitude?: number;
      longitude?: number;
      lokasi?: string;
      luasBangunan?: number;
      deskripsi?: string;
      amenities?: Amenities[];
    } = {};

    if (data.nama !== undefined) updateData.nama = data.nama;
    if (data.kategori !== undefined) updateData.kategori = data.kategori;
    if (data.namaJalan !== undefined) updateData.namaJalan = data.namaJalan;
    if (data.kelurahan !== undefined) updateData.kelurahan = data.kelurahan;
    if (data.kecamatan !== undefined) updateData.kecamatan = data.kecamatan;
    if (data.kabupatenKota !== undefined)
      updateData.kabupatenKota = data.kabupatenKota;
    if (data.provinsi !== undefined) updateData.provinsi = data.provinsi;
    if (data.kodePos !== undefined) updateData.kodePos = data.kodePos;
    if (data.luasBangunan !== undefined)
      updateData.luasBangunan = data.luasBangunan;
    if (data.deskripsi !== undefined) updateData.deskripsi = data.deskripsi;
    if (data.amenities !== undefined) updateData.amenities = data.amenities;

    if (data.latitude !== undefined && data.longitude !== undefined) {
      updateData.latitude = data.latitude;
      updateData.longitude = data.longitude;
      updateData.lokasi = `POINT(${data.longitude} ${data.latitude})`;
    } else if (data.latitude !== undefined) {
      updateData.latitude = data.latitude;
      updateData.lokasi = `POINT(${properti.longitude} ${data.latitude})`;
    } else if (data.longitude !== undefined) {
      updateData.longitude = data.longitude;
      updateData.lokasi = `POINT(${data.longitude} ${properti.latitude})`;
    }

    const propertiUpdated = await prisma.properti.update({
      where: { id: propertiId },
      data: updateData,
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            namaLengkap: true,
            fotoProfil: true,
          },
        },
        gambar: {
          where: { isUtama: true },
          take: 1,
        },
        tipeKamar: {
          select: {
            id: true,
            nama: true,
            hargaPerMalam: true,
            hargaPerBulan: true,
            jumlahUnit: true,
            tersedia: true,
          },
        },
      },
    });

    return {
      sukses: true,
      pesan: "Properti berhasil diperbarui.",
      data: propertiUpdated,
    };
  } catch (error) {
    console.error("Pembaruan properti error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};

// Hapus properti yang tidak layak huni (Owner Only)
export const hapusProperti = async (propertiId: string, ownerId: string) => {
  try {
    const properti = await prisma.properti.findFirst({
      where: {
        id: propertiId,
        pemilikId: ownerId,
      },
      include: {
        admin: true,
      },
    });

    if (!properti) {
      return {
        sukses: false,
        pesan: "Properti tidak ditemukan.",
      };
    }

    await prisma.properti.delete({
      where: { id: propertiId },
    });

    return {
      sukses: true,
      pesan: `Properti "${properti.nama}" berhasil dihapus.`,
    };
  } catch (error) {
    console.error("Hapus properti error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};

// Memuat informasi detail sebuah properti
export const getDetailProperti = async (
  propertiId: string,
  ownerId: string,
) => {
  try {
    const properti = await prisma.properti.findFirst({
      where: {
        id: propertiId,
        pemilikId: ownerId,
      },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            namaLengkap: true,
            nomorTelepon: true,
          },
        },
        gambar: {
          orderBy: { urutan: "asc" },
        },
        tipeKamar: {
          select: {
            id: true,
            nama: true,
            deskripsi: true,
            kapasitas: true,
            jumlahTempatTidur: true,
            jumlahKamarMandi: true,
            luas: true,
            hargaPerMalam: true,
            hargaPerBulan: true,
            jumlahUnit: true,
            tersedia: true,
          },
        },
        fasilitas: true,
        menu: true,
      },
    });

    if (!properti) {
      return {
        sukses: false,
        pesan: "Properti tidak ditemukan.",
      };
    }

    return {
      sukses: true,
      data: properti,
    };
  } catch (error) {
    console.error("Memuat detail properti error:", error);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan pada server.",
    };
  }
};
