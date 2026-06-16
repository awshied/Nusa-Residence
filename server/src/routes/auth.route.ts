import { Router } from "express";
import { login, registrasi } from "../controllers/auth.controller";

const router = Router();

router.post("/registrasi", registrasi);
router.post("/login", login);

export default router;
