import { MeetingNote } from "../models/MeetingNote.js";
import { HttpError } from "../utils/httpError.js";
import { requireMeetingParticipant } from "./meetingAccessService.js";

export async function getMeetingNote(userId, meetingId) {
  await requireMeetingParticipant(meetingId, userId);
  let note = await MeetingNote.findOne({ meeting: meetingId }).populate("lastEditedBy", "name email");
  if (!note) {
    note = await MeetingNote.create({
      meeting: meetingId,
      content: "",
      revision: 0,
      lastEditedBy: userId,
    });
    await note.populate("lastEditedBy", "name email");
  }
  return note;
}

export async function updateMeetingNote(userId, meetingId, { content, revision }) {
  await requireMeetingParticipant(meetingId, userId);

  const note = await MeetingNote.findOneAndUpdate(
    { meeting: meetingId, revision },
    {
      $set: { content, lastEditedBy: userId },
      $inc: { revision: 1 },
    },
    { new: true }
  ).populate("lastEditedBy", "name email");

  if (!note) {
    const current = await MeetingNote.findOne({ meeting: meetingId }).select("revision");
    if (!current) {
      throw new HttpError(409, "Meeting notes are not initialized; load them before editing");
    }
    throw new HttpError(409, "Meeting notes changed elsewhere", { currentRevision: current.revision });
  }

  return note;
}
