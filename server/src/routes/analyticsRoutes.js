import { Router } from "express";
import { get } from "../controllers/analyticsController.js";
import { requireAuth } from "../middleware/auth.js";

const router=Router();
router.get("/",requireAuth,get);
export default router;
