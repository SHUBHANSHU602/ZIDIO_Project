import { Router } from "express";
import { create, list, update } from "../controllers/actionItemController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.post("/meetings/:meetingId/action-items", create);
router.get("/meetings/:meetingId/action-items", list);
router.patch("/action-items/:id", update);

export default router;
