import mongoose from "mongoose";

const generatedActionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 500 },
    ownerHint: { type: String, default: "", trim: true, maxlength: 120 },
    dueDateHint: { type: String, default: "", trim: true, maxlength: 64 },
    actionItem: { type: mongoose.Schema.Types.ObjectId, ref: "ActionItem", default: null },
  },
  { _id: false }
);

const meetingInsightSchema = new mongoose.Schema(
  {
    meeting: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true, unique: true, index: true },
    transcript: { type: mongoose.Schema.Types.ObjectId, ref: "Transcript", required: true, index: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["PROCESSING", "COMPLETED", "FAILED"],
      default: "PROCESSING",
      index: true,
    },
    summary: { type: String, default: "", maxlength: 12000 },
    decisions: { type: [String], default: [] },
    actionItems: { type: [generatedActionSchema], default: [] },
    providerRequestId: { type: String, default: "", maxlength: 256 },
    failureReason: { type: String, default: "", maxlength: 500 },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const MeetingInsight = mongoose.model("MeetingInsight", meetingInsightSchema);
