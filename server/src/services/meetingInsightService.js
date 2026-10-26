import { getMeetingInsightProvider } from "../ai/intelligence/providerFactory.js";
import { ActionItem } from "../models/ActionItem.js";
import { Meeting } from "../models/Meeting.js";
import { MeetingInsight } from "../models/MeetingInsight.js";
import { Transcript } from "../models/Transcript.js";
import { HttpError } from "../utils/httpError.js";
import { requireMeetingParticipant } from "./meetingAccessService.js";

async function requireHost(meetingId, userId) {
  const meeting = await Meeting.findOne({ _id: meetingId, host: userId });
  if (!meeting) throw new HttpError(403, "Only the meeting host can generate meeting intelligence");
  return meeting;
}

export async function generateMeetingInsight(userId, meetingId) {
  const meeting = await requireHost(meetingId, userId);
  const transcript = await Transcript.findOne({ meeting: meetingId, status: "COMPLETED" })
    .sort({ completedAt: -1 });

  if (!transcript) throw new HttpError(409, "A completed transcript is required");

  let insight = await MeetingInsight.findOne({ meeting: meetingId });
  if (insight?.status === "COMPLETED" && String(insight.transcript) === String(transcript._id)) {
    return insight.populate("actionItems.actionItem");
  }
  if (insight?.status === "PROCESSING") throw new HttpError(409, "Meeting intelligence is already processing");

  const provider = getMeetingInsightProvider();

  if (!insight) {
    insight = await MeetingInsight.create({
      meeting: meetingId,
      transcript: transcript._id,
      requestedBy: userId,
      provider: provider.name,
      model: provider.model,
      status: "PROCESSING",
    });
  } else {
    insight.transcript = transcript._id;
    insight.requestedBy = userId;
    insight.provider = provider.name;
    insight.model = provider.model;
    insight.status = "PROCESSING";
    insight.failureReason = "";
    await insight.save();
  }

  try {
    const result = await provider.generate({
      transcript: transcript.text,
      meetingTitle: meeting.title,
    });

    const createdActionItems = [];
    for (const generated of result.actionItems) {
      const item = await ActionItem.create({
        meeting: meetingId,
        text: generated.text,
        assignee: null,
        dueAt: null,
        source: "AI",
      });
      createdActionItems.push({
        text: generated.text,
        ownerHint: generated.ownerHint || "",
        dueDateHint: generated.dueDateHint || "",
        actionItem: item._id,
      });
    }

    insight.provider = result.provider;
    insight.model = result.model;
    insight.providerRequestId = result.providerRequestId;
    insight.summary = result.summary;
    insight.decisions = result.decisions;
    insight.actionItems = createdActionItems;
    insight.status = "COMPLETED";
    insight.failureReason = "";
    insight.completedAt = new Date();
    await insight.save();

    meeting.summary = result.summary;
    await meeting.save();

    return insight.populate("actionItems.actionItem");
  } catch (error) {
    insight.status = "FAILED";
    insight.failureReason = String(error?.message || "Meeting intelligence failed").slice(0, 500);
    await insight.save();
    throw new HttpError(502, "Meeting intelligence generation failed", insight.failureReason);
  }
}

export async function getMeetingInsight(userId, meetingId) {
  await requireMeetingParticipant(meetingId, userId);
  const insight = await MeetingInsight.findOne({ meeting: meetingId })
    .populate("actionItems.actionItem")
    .populate("requestedBy", "name email");
  if (!insight) throw new HttpError(404, "Meeting intelligence has not been generated");
  return insight;
}
