import { Router } from "express";
import {
  getProfil,
  login,
  registrasi,
  pembaruanProfil,
} from "../controllers/auth.controller";
import { verifikasiAutentikasi } from "../middlewares/auth.middleware";
import {
  handleUploadError,
  uploadFotoProfil,
} from "../middlewares/upload.middleware";

const router = Router();

router.post("/registrasi", registrasi);
router.post("/login", login);
router.get("/profil", verifikasiAutentikasi, getProfil);

router.post(
  "/profil/ubah",
  verifikasiAutentikasi,
  uploadFotoProfil.single("foto"),
  handleUploadError,
  pembaruanProfil,
);

export default router;
