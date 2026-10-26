import { z } from "zod";

const actionSchema = z.object({
  text: z.string().trim().min(2).max(500),
  ownerHint: z.string().trim().max(120).optional().default(""),
  dueDateHint: z.string().trim().max(64).optional().default(""),
}).strict();

export const meetingInsightOutputSchema = z.object({
  summary: z.string().trim().min(20).max(12000),
  decisions: z.array(z.string().trim().min(2).max(500)).max(30).default([]),
  actionItems: z.array(actionSchema).max(30).default([]),
}).strict();

export function parseMeetingInsight(raw) {
  let value = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw);
    } catch {
      throw new Error("AI provider returned invalid JSON");
    }
  }

  const parsed = meetingInsightOutputSchema.safeParse(value);
  if (!parsed.success) {
    throw new Error("AI provider returned an invalid meeting-insight structure");
  }
  return parsed.data;
}
