-- CreateEnum
CREATE TYPE "PeranPengguna" AS ENUM ('KLIEN', 'ADMIN', 'PEMILIK');

-- CreateEnum
CREATE TYPE "StatusAkun" AS ENUM ('AKTIF', 'NONAKTIF', 'DIBLOKIR');

-- CreateTable
CREATE TABLE "pengguna" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "kataSandi" TEXT NOT NULL,
    "namaLengkap" TEXT,
    "nomorTelepon" TEXT,
    "peran" "PeranPengguna" NOT NULL DEFAULT 'KLIEN',
    "statusAkun" "StatusAkun" NOT NULL DEFAULT 'AKTIF',
    "fotoProfil" TEXT,
    "terakhirLogin" TIMESTAMP(3),
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbaruiPada" TIMESTAMP(3) NOT NULL,
    "dibuat_oleh_id" TEXT,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_email_key" ON "pengguna"("email");

-- AddForeignKey
ALTER TABLE "pengguna" ADD CONSTRAINT "pengguna_dibuat_oleh_id_fkey" FOREIGN KEY ("dibuat_oleh_id") REFERENCES "pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;
