import test from "node:test";
import assert from "node:assert/strict";
import { parseMeetingInsight } from "../src/ai/intelligence/meetingInsightSchema.js";

test("meeting intelligence parser accepts grounded structured output", () => {
  const result = parseMeetingInsight(JSON.stringify({
    summary: "The team reviewed onboarding friction and agreed to ship the revised flow after final design review.",
    decisions: ["Ship the revised onboarding flow after design review."],
    actionItems: [
      { text: "Complete the final design review", ownerHint: "Alex", dueDateHint: "Friday" },
    ],
  }));

  assert.equal(result.decisions.length, 1);
  assert.equal(result.actionItems[0].ownerHint, "Alex");
});

test("meeting intelligence parser rejects extra or malformed fields", () => {
  assert.throws(() => parseMeetingInsight({
    summary: "too short",
    decisions: [],
    actionItems: [],
    admin: true,
  }));

  assert.throws(() => parseMeetingInsight("not-json"));
});
