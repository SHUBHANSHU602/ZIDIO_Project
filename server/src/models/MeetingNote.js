import mongoose from "mongoose";

const meetingNoteSchema = new mongoose.Schema(
  {
    meeting: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true, unique: true, index: true },
    content: { type: String, default: "", maxlength: 100000 },
    revision: { type: Number, min: 0, default: 0 },
    lastEditedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const MeetingNote = mongoose.model("MeetingNote", meetingNoteSchema);
