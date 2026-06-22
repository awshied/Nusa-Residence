/*
  Warnings:

  - A unique constraint covering the columns `[resetToken]` on the table `pengguna` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pengguna" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_resetToken_key" ON "pengguna"("resetToken");
