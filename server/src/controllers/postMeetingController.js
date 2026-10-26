import { getPostMeetingDashboard } from "../services/postMeetingService.js";

export async function get(req, res, next) {
  try {
    const dashboard = await getPostMeetingDashboard(req.auth.userId, req.params.meetingId);
    res.json({ success: true, data: dashboard });
  } catch (error) {
    next(error);
  }
}
