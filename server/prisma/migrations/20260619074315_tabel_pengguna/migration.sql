-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAINNYA', 'PRIA', 'WANITA');

-- AlterTable
ALTER TABLE "pengguna" ADD COLUMN     "jenisKelamin" "JenisKelamin" NOT NULL DEFAULT 'LAINNYA';
