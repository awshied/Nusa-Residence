import { Router } from "express";
import {
  verifikasiAutentikasi,
  VerifikasiRole,
} from "../middlewares/auth.middleware";
import {
  editProperti,
  getDataProperti,
  getKetersediaanAdmin,
  getPropertiAdmin,
  getSemuaPropertiOwner,
  hapusGambarProperti,
  hilangkanProperti,
  setGambarUtamaProperti,
  tambahPropertiBaru,
  uploadGambarProperti,
  uploadGambarSementara,
} from "../controllers/properti.controller";
import {
  handleUploadError,
  uploadFotoProfil,
} from "../middlewares/upload.middleware";

const router = Router();

router.use(verifikasiAutentikasi);

router.post("/", VerifikasiRole("PEMILIK"), tambahPropertiBaru);
router.get("/admin-tersedia", VerifikasiRole("PEMILIK"), getKetersediaanAdmin);
router.post(
  "/:id/gambar",
  VerifikasiRole("PEMILIK"),
  uploadFotoProfil.array("gambar", 10),
  handleUploadError,
  uploadGambarProperti,
);
router.delete(
  "/gambar/:gambarId",
  VerifikasiRole("PEMILIK"),
  hapusGambarProperti,
);
router.patch(
  "/gambar/:gambarId/utama",
  VerifikasiRole("PEMILIK"),
  setGambarUtamaProperti,
);
router.get("/owner", VerifikasiRole("PEMILIK"), getSemuaPropertiOwner);
router.put("/:id", VerifikasiRole("PEMILIK"), editProperti);
router.delete("/:id", VerifikasiRole("PEMILIK"), hilangkanProperti);
router.get("/admin", VerifikasiRole("ADMIN"), getPropertiAdmin);
router.get("/:id", VerifikasiRole("PEMILIK"), getDataProperti);
router.post(
  "/upload",
  uploadFotoProfil.array("gambar", 10),
  handleUploadError,
  uploadGambarSementara,
);

export default router;
