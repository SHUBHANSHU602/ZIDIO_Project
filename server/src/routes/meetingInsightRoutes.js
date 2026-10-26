import { Router } from "express";
import { generate, get } from "../controllers/meetingInsightController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { meetingIdParams } from "../validation/common.js";

const router = Router();
router.use(requireAuth);

router.post(
  "/meetings/:meetingId/intelligence",
  validate({ params: meetingIdParams }),
  generate
);

router.get(
  "/meetings/:meetingId/intelligence",
  validate({ params: meetingIdParams }),
  get
);

export default router;
