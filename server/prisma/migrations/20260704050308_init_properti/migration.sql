-- CreateEnum
CREATE TYPE "PeranPengguna" AS ENUM ('KLIEN', 'ADMIN', 'PEMILIK');

-- CreateEnum
CREATE TYPE "StatusAkun" AS ENUM ('AKTIF', 'NONAKTIF', 'DIBLOKIR');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAINNYA', 'PRIA', 'WANITA');

-- CreateEnum
CREATE TYPE "KategoriProperti" AS ENUM ('HOTEL', 'VILLA', 'APARTEMEN', 'KOSAN', 'KONTRAKAN');

-- CreateTable
CREATE TABLE "pengguna" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "kataSandi" TEXT NOT NULL,
    "namaLengkap" TEXT,
    "nomorTelepon" TEXT,
    "jenisKelamin" "JenisKelamin" DEFAULT 'LAINNYA',
    "peran" "PeranPengguna" NOT NULL DEFAULT 'KLIEN',
    "statusAkun" "StatusAkun" NOT NULL DEFAULT 'AKTIF',
    "fotoProfil" TEXT,
    "terakhirLogin" TIMESTAMP(3),
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbaruiPada" TIMESTAMP(3) NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "dibuat_oleh_id" TEXT,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properti" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" "KategoriProperti" NOT NULL,
    "alamat" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "lokasi" TEXT,
    "nomor_telepon" TEXT,
    "luas_bangunan" DOUBLE PRECISION,
    "deskripsi" TEXT,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rating_rata_rata" DOUBLE PRECISION DEFAULT 0,
    "jumlah_rating" INTEGER DEFAULT 0,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,
    "pemilik_id" TEXT NOT NULL,
    "admin_id" TEXT,

    CONSTRAINT "properti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properti_gambar" (
    "id" TEXT NOT NULL,
    "properti_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "is_utama" BOOLEAN NOT NULL DEFAULT false,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "properti_gambar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipe_kamar" (
    "id" TEXT NOT NULL,
    "properti_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "kapasitas" INTEGER NOT NULL,
    "jumlah_tempat_tidur" INTEGER NOT NULL,
    "jumlah_kamar_mandi" INTEGER NOT NULL,
    "luas" DOUBLE PRECISION,
    "harga_per_malam" DOUBLE PRECISION,
    "harga_per_bulan" DOUBLE PRECISION,
    "jumlah_unit" INTEGER NOT NULL DEFAULT 1,
    "tersedia" INTEGER NOT NULL DEFAULT 1,
    "gambar" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipe_kamar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properti_fasilitas" (
    "id" TEXT NOT NULL,
    "properti_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "icon" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "properti_fasilitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu" (
    "id" TEXT NOT NULL,
    "properti_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "deskripsi" TEXT,
    "harga" DOUBLE PRECISION,
    "is_gratis" BOOLEAN NOT NULL DEFAULT true,
    "gambar" TEXT,
    "tersedia" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "kode_booking" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "properti_id" TEXT NOT NULL,
    "check_in_date" TIMESTAMP(3) NOT NULL,
    "check_out_date" TIMESTAMP(3) NOT NULL,
    "total_harga" DOUBLE PRECISION NOT NULL,
    "status_pembayaran" TEXT NOT NULL DEFAULT 'PENDING',
    "status_booking" TEXT NOT NULL DEFAULT 'MENUNGGU',
    "midtrans_order_id" TEXT,
    "snap_token" TEXT,
    "snap_redirect_url" TEXT,
    "catatan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_item" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "tipe_kamar_id" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL DEFAULT 1,
    "harga_per_unit" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "booking_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_email_key" ON "pengguna"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_resetToken_key" ON "pengguna"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "properti_admin_id_key" ON "properti"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "booking_kode_booking_key" ON "booking"("kode_booking");

-- CreateIndex
CREATE UNIQUE INDEX "booking_midtrans_order_id_key" ON "booking"("midtrans_order_id");

-- AddForeignKey
ALTER TABLE "pengguna" ADD CONSTRAINT "pengguna_dibuat_oleh_id_fkey" FOREIGN KEY ("dibuat_oleh_id") REFERENCES "pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properti" ADD CONSTRAINT "properti_pemilik_id_fkey" FOREIGN KEY ("pemilik_id") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properti" ADD CONSTRAINT "properti_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properti_gambar" ADD CONSTRAINT "properti_gambar_properti_id_fkey" FOREIGN KEY ("properti_id") REFERENCES "properti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipe_kamar" ADD CONSTRAINT "tipe_kamar_properti_id_fkey" FOREIGN KEY ("properti_id") REFERENCES "properti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properti_fasilitas" ADD CONSTRAINT "properti_fasilitas_properti_id_fkey" FOREIGN KEY ("properti_id") REFERENCES "properti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_properti_id_fkey" FOREIGN KEY ("properti_id") REFERENCES "properti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_properti_id_fkey" FOREIGN KEY ("properti_id") REFERENCES "properti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_item" ADD CONSTRAINT "booking_item_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_item" ADD CONSTRAINT "booking_item_tipe_kamar_id_fkey" FOREIGN KEY ("tipe_kamar_id") REFERENCES "tipe_kamar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
