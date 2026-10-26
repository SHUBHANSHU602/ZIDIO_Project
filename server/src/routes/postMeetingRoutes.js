import { Router } from "express";
import { get } from "../controllers/postMeetingController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { meetingIdParams } from "../validation/common.js";

const router = Router();
router.get("/meetings/:meetingId/post-meeting", requireAuth, validate({ params: meetingIdParams }), get);
export default router;
