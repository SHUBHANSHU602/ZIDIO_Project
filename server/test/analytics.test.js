import test from "node:test";
import assert from "node:assert/strict";
import { buildWeeklySeries } from "../src/services/analyticsService.js";

test("weekly analytics buckets meeting counts and measured minutes",()=>{
  const series=buildWeeklySeries([
    {
      status:"ENDED",
      startedAt:new Date("2026-10-25T10:00:00Z"),
      endedAt:new Date("2026-10-25T10:30:00Z"),
      createdAt:new Date("2026-10-25T09:00:00Z"),
    },
  ],new Date("2026-10-26T12:00:00Z"),2);

  assert.equal(series.reduce((sum,item)=>sum+item.meetingCount,0),1);
  assert.equal(series.reduce((sum,item)=>sum+item.meetingMinutes,0),30);
});
