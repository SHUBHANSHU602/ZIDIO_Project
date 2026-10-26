import { Router } from "express";
import { get, update } from "../controllers/meetingNoteController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { noteParams, updateNoteBody } from "../validation/workspaceSchemas.js";

const router = Router();
router.use(requireAuth);
router.get("/meetings/:meetingId/notes", validate({ params:noteParams }), get);
router.put("/meetings/:meetingId/notes", validate({ params:noteParams, body:updateNoteBody }), update);

export default router;
