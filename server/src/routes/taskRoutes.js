import { Router } from "express";
import { create, list, remove, update } from "../controllers/taskController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.post("/", create);
router.get("/", list);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;
