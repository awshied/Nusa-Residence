import { Router } from "express";
import {
  getProfil,
  login,
  registrasi,
  pembaruanProfil,
  forgetPassword,
  resetPassword,
  ketersediaanOwner,
  bikinOwner,
} from "../controllers/auth.controller";
import { verifikasiAutentikasi } from "../middlewares/auth.middleware";
import { uploadSingleFile } from "../middlewares/upload.middleware";

const router = Router();

router.post("/registrasi", registrasi);
router.post("/login", login);
router.post("/lupa-password", forgetPassword);
router.post("/reset-password", resetPassword);

router.get("/cek-owner", ketersediaanOwner);
router.post("/buat-owner", bikinOwner);

router.get("/profil", verifikasiAutentikasi, getProfil);
router.post(
  "/profil/ubah",
  verifikasiAutentikasi,
  uploadSingleFile("fotoProfil"),
  pembaruanProfil,
);

export default router;
