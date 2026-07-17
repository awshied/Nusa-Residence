import { Router } from "express";
import {
  verifikasiAutentikasi,
  VerifikasiRole,
} from "../middlewares/auth.middleware";
import {
  getSemuaAdminOwner,
  hapusAdmin,
  perbaruiStatusKeaktifan,
  tambahAdminBaru,
} from "../controllers/admin.controller";

const router = Router();

router.use(verifikasiAutentikasi);

router.post("/", VerifikasiRole("PEMILIK"), tambahAdminBaru);
router.get("/owner", VerifikasiRole("PEMILIK"), getSemuaAdminOwner);
router.patch("/:id/status", VerifikasiRole("PEMILIK"), perbaruiStatusKeaktifan);
router.delete("/:id", VerifikasiRole("PEMILIK"), hapusAdmin);

export default router;
