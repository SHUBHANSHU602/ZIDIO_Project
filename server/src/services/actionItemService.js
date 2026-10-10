import mongoose from "mongoose";
import { ActionItem } from "../models/ActionItem.js";
import { Meeting } from "../models/Meeting.js";
import { HttpError } from "../utils/httpError.js";

function assertId(id, label = "id") {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, `Invalid ${label}`);
}

async function requireMeetingAccess(meetingId, userId) {
  assertId(meetingId, "meeting id");
  const meeting = await Meeting.exists({
    _id: meetingId,
    $or: [{ host: userId }, { participants: userId }],
  });
  if (!meeting) throw new HttpError(404, "Meeting not found");
}

export async function createActionItem(userId, meetingId, payload) {
  await requireMeetingAccess(meetingId, userId);
  if (typeof payload.text !== "string" || payload.text.trim().length < 2) {
    throw new HttpError(400, "text must contain at least 2 characters");
  }

  return ActionItem.create({
    meeting: meetingId,
    text: payload.text.trim(),
    assignee: payload.assignee ?? null,
    dueAt: payload.dueAt ?? null,
    source: "MANUAL",
  });
}

export async function listActionItems(userId, meetingId) {
  await requireMeetingAccess(meetingId, userId);
  return ActionItem.find({ meeting: meetingId })
    .sort({ createdAt: 1 })
    .populate("assignee", "name email");
}

export async function updateActionItem(userId, actionItemId, payload) {
  assertId(actionItemId, "action item id");
  const item = await ActionItem.findById(actionItemId);
  if (!item) throw new HttpError(404, "Action item not found");

  await requireMeetingAccess(item.meeting, userId);

  const allowed = ["text", "assignee", "dueAt", "status"];
  for (const key of allowed) {
    if (payload[key] !== undefined) item[key] = payload[key];
  }

  await item.save();
  return item.populate("assignee", "name email");
}
