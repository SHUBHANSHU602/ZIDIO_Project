import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, refresh, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { validateLogin, validateRegister } from "../middleware/validateAuth.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", requireAuth, logout);

export default router;
