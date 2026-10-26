import { ActionItem } from "../models/ActionItem.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { Meeting } from "../models/Meeting.js";
import { MeetingInsight } from "../models/MeetingInsight.js";
import { MeetingNote } from "../models/MeetingNote.js";
import { Recording } from "../models/Recording.js";
import { Transcript } from "../models/Transcript.js";
import { requireMeetingParticipant } from "./meetingAccessService.js";

export function calculateMeetingDurationSeconds(meeting) {
  if (!meeting?.startedAt || !meeting?.endedAt) return null;
  const start = new Date(meeting.startedAt).getTime();
  const end = new Date(meeting.endedAt).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
  return Math.round((end - start) / 1000);
}

export async function getPostMeetingDashboard(userId, meetingId) {
  await requireMeetingParticipant(meetingId, userId);

  const [meeting, insight, transcript, actionItems, recordings, note, chatMessageCount] = await Promise.all([
    Meeting.findById(meetingId)
      .populate("host", "name email")
      .populate("participants", "name email")
      .populate("team", "name"),
    MeetingInsight.findOne({ meeting: meetingId }).populate("requestedBy", "name email"),
    Transcript.findOne({ meeting: meetingId, status: "COMPLETED" })
      .sort({ completedAt: -1 })
      .select("text language durationSeconds segments provider model completedAt"),
    ActionItem.find({ meeting: meetingId })
      .sort({ createdAt: 1 })
      .populate("assignee", "name email"),
    Recording.find({ meeting: meetingId, status: "READY" })
      .sort({ createdAt: -1 })
      .select("secureUrl format bytes durationSeconds createdAt"),
    MeetingNote.findOne({ meeting: meetingId })
      .populate("lastEditedBy", "name email"),
    ChatMessage.countDocuments({ meeting: meetingId }),
  ]);

  return {
    meeting: {
      ...meeting.toJSON(),
      durationSeconds: calculateMeetingDurationSeconds(meeting),
    },
    intelligence: insight ? {
      status: insight.status,
      summary: insight.summary,
      decisions: insight.decisions,
      provider: insight.provider,
      model: insight.model,
      completedAt: insight.completedAt,
    } : null,
    transcript: transcript ?? null,
    actionItems,
    recordings,
    notes: note ?? null,
    activity: {
      chatMessageCount,
      participantCount: meeting.participants?.length ?? 0,
      actionItemCount: actionItems.length,
      completedActionItemCount: actionItems.filter((item) => item.status === "DONE").length,
      recordingCount: recordings.length,
    },
  };
}
