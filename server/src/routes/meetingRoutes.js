import { Router } from "express";
import { create, getById, list, remove, update } from "../controllers/meetingController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.post("/", create);
router.get("/", list);
router.get("/:id", getById);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;
