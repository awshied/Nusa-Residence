import dotenv from "dotenv";

dotenv.config();

import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";

import { prisma } from "./configs/database";

import authRoutes from "./routes/auth.route";
import adminRoutes from "./routes/admin.route";
import propertiRoutes from "./routes/properti.route";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/properti", propertiRoutes);

app.get("/api/nusa", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server berjalan dengan TypeScript.",
    timestamp: new Date().toISOString(),
  });
});

const startServer = async () => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(
        `Yeay, server Nusa Residence dapat beroperasi pada port: ${PORT}.`,
      );
      console.log("Database berhasil terhubung.");
    });

    process.on("SIGINT", () => {
      console.log("Mematikan server...");
      server.close(() => {
        console.log("Server ditutup!");
        prisma
          .$disconnect()
          .then(() => {
            console.log("Koneksi database terputus.");
            process.exit(0);
          })
          .catch((err) => {
            console.error("Gagal memutuskan koneksi database:", err);
            process.exit(1);
          });
      });
    });
  } catch (error) {
    console.error("Gagal menjalankan server:", error);
    process.exit(1);
  }
};

startServer();
