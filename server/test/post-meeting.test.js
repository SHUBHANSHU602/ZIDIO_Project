import test from "node:test";
import assert from "node:assert/strict";
import { calculateMeetingDurationSeconds } from "../src/services/postMeetingService.js";

test("meeting duration is derived from actual start and end timestamps",()=>{
  assert.equal(calculateMeetingDurationSeconds({
    startedAt:new Date("2026-10-26T10:00:00Z"),
    endedAt:new Date("2026-10-26T10:42:30Z"),
  }),2550);
});

test("meeting duration remains unknown without a valid completed interval",()=>{
  assert.equal(calculateMeetingDurationSeconds({startedAt:null,endedAt:null}),null);
  assert.equal(calculateMeetingDurationSeconds({
    startedAt:new Date("2026-10-26T11:00:00Z"),
    endedAt:new Date("2026-10-26T10:00:00Z"),
  }),null);
});
