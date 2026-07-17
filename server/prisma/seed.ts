import bcrypt from "bcrypt";
import dotenv from "dotenv";
import prisma from "../src/configs/database";

dotenv.config();

const main = async () => {
  const ownerEmail =
    process.env.OWNER_EMAIL || "pemiliknusaresidence@gmail.co.id";
  const ownerPassword = process.env.OWNER_PASSWORD || "OwnerProperti629";
  const ownerName = process.env.OWNER_NAME || "Anonymous";

  const hashedPassword = await bcrypt.hash(ownerPassword, 10);

  const owner = await prisma.pengguna.create({
    data: {
      email: ownerEmail,
      kataSandi: hashedPassword,
      namaLengkap: ownerName,
      peran: "PEMILIK",
      statusAkun: "AKTIF",
    },
  });

  console.log("Yeay, Owner berhasil dibuat!");
  console.log(`Email: ${owner.email}`);
  console.log(`Password: ${ownerPassword}`);
};

main()
  .catch((e) => {
    console.error("Gagal memuat:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
