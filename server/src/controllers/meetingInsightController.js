import {
  generateMeetingInsight,
  getMeetingInsight,
} from "../services/meetingInsightService.js";

export async function generate(req, res, next) {
  try {
    const insight = await generateMeetingInsight(req.auth.userId, req.params.meetingId);
    res.json({ success: true, data: insight });
  } catch (error) {
    next(error);
  }
}

export async function get(req, res, next) {
  try {
    const insight = await getMeetingInsight(req.auth.userId, req.params.meetingId);
    res.json({ success: true, data: insight });
  } catch (error) {
    next(error);
  }
}
