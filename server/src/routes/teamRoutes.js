import { Router } from "express";
import { addMember, create, getById } from "../controllers/teamController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.post("/", create);
router.get("/:id", getById);
router.post("/:id/members", addMember);

export default router;
