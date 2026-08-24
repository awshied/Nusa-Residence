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
} from "../controllers/properti.controller";
import { handleMultipartForm } from "../middlewares/upload.middleware";

const router = Router();

router.use(verifikasiAutentikasi);

router.post(
  "/",
  VerifikasiRole("PEMILIK"),
  handleMultipartForm("gambar", 5),
  tambahPropertiBaru,
);

router.get("/owner", VerifikasiRole("PEMILIK"), getSemuaPropertiOwner);
router.get("/admin", VerifikasiRole("ADMIN"), getPropertiAdmin);
router.get("/:id", VerifikasiRole("PEMILIK"), getDataProperti);
router.put("/:id", VerifikasiRole("PEMILIK"), editProperti);
router.delete("/:id", VerifikasiRole("PEMILIK"), hilangkanProperti);

router.get("/admin-tersedia", VerifikasiRole("PEMILIK"), getKetersediaanAdmin);
router.post(
  "/:id/gambar",
  VerifikasiRole("PEMILIK"),
  handleMultipartForm("gambar", 5),
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

export default router;
