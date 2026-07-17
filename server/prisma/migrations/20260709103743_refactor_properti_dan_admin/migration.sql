/*
  Warnings:

  - The `kategori` column on the `menu` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `alamat` on the `properti` table. All the data in the column will be lost.
  - The `amenities` column on the `properti` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `kabupaten_kota` to the `properti` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kecamatan` to the `properti` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kelurahan` to the `properti` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_jalan` to the `properti` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinsi` to the `properti` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Amenities" AS ENUM ('AIR_CONDITIONER', 'TELEVISI', 'WIFI', 'KOLAM_RENANG', 'PARKIR', 'BATHUB', 'RESTORAN', 'GYM', 'SPA', 'MUSHOLA', 'MINI_BAR', 'KITCHENETTE', 'MESIN_CUCI', 'KIPAS_ANGIN', 'AIR_PANAS', 'BREAKFAST', 'ROOM_SERVICE', 'RESEPSIONIS_24JAM', 'KEAMANAN_24JAM', 'AREA_BERMAIN_ANAK', 'TAMAN', 'BALKON', 'DAPUR_UMUM', 'RUANG_TAMU', 'AIR_ISI_ULANG', 'LISTRIK', 'GAS_ALAM', 'KAMAR_MANDI_DALAM', 'KAMAR_MANDI_LUAR');

-- CreateEnum
CREATE TYPE "KategoriMenuHotel" AS ENUM ('MAKANAN', 'MINUMAN');

-- AlterTable
ALTER TABLE "menu" DROP COLUMN "kategori",
ADD COLUMN     "kategori" "KategoriMenuHotel" NOT NULL DEFAULT 'MAKANAN';

-- AlterTable
ALTER TABLE "properti" DROP COLUMN "alamat",
ADD COLUMN     "kabupaten_kota" TEXT NOT NULL,
ADD COLUMN     "kecamatan" TEXT NOT NULL,
ADD COLUMN     "kelurahan" TEXT NOT NULL,
ADD COLUMN     "kode_pos" TEXT,
ADD COLUMN     "nama_jalan" TEXT NOT NULL,
ADD COLUMN     "provinsi" TEXT NOT NULL,
DROP COLUMN "amenities",
ADD COLUMN     "amenities" "Amenities"[] DEFAULT ARRAY[]::"Amenities"[];
