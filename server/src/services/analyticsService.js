import { ActionItem } from "../models/ActionItem.js";
import { Meeting } from "../models/Meeting.js";
import { MeetingInsight } from "../models/MeetingInsight.js";

export function buildWeeklySeries(meetings, now = new Date(), weeks = 12) {
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const current = new Date(now);
  current.setUTCHours(0,0,0,0);
  const currentDay = current.getUTCDay();
  const weekStart = new Date(current.getTime() - currentDay * 24 * 60 * 60 * 1000);

  const buckets = Array.from({length:weeks},(_,index)=>{
    const start = new Date(weekStart.getTime() - (weeks - 1 - index) * weekMs);
    const end = new Date(start.getTime() + weekMs);
    return { start, end, meetingCount:0, meetingMinutes:0 };
  });

  for (const meeting of meetings) {
    const date = meeting.endedAt || meeting.startedAt || meeting.scheduledAt || meeting.createdAt;
    if (!date) continue;
    const timestamp = new Date(date).getTime();
    const bucket = buckets.find((item)=>timestamp>=item.start.getTime()&&timestamp<item.end.getTime());
    if (!bucket) continue;
    bucket.meetingCount += 1;
    if (meeting.startedAt && meeting.endedAt) {
      const durationMs = new Date(meeting.endedAt).getTime() - new Date(meeting.startedAt).getTime();
      if (durationMs > 0) bucket.meetingMinutes += Math.round(durationMs / 60000);
    }
  }

  return buckets.map((bucket)=>({
    weekStart:bucket.start.toISOString(),
    meetingCount:bucket.meetingCount,
    meetingMinutes:bucket.meetingMinutes,
  }));
}

export async function getUserAnalytics(userId) {
  const meetings = await Meeting.find({
    $or:[{host:userId},{participants:userId}],
  }).select("status scheduledAt startedAt endedAt createdAt participants");

  const meetingIds = meetings.map((meeting)=>meeting._id);
  const [actionItems, completedInsights] = await Promise.all([
    ActionItem.find({meeting:{$in:meetingIds}}).select("status meeting"),
    MeetingInsight.countDocuments({meeting:{$in:meetingIds},status:"COMPLETED"}),
  ]);

  const completedMeetings = meetings.filter((meeting)=>meeting.status==="ENDED");
  const measuredDurations = completedMeetings
    .filter((meeting)=>meeting.startedAt&&meeting.endedAt)
    .map((meeting)=>(new Date(meeting.endedAt).getTime()-new Date(meeting.startedAt).getTime())/60000)
    .filter((minutes)=>minutes>=0);

  const totalActionItems = actionItems.filter((item)=>item.status!=="DISMISSED").length;
  const completedActionItems = actionItems.filter((item)=>item.status==="DONE").length;

  const statusBreakdown = Object.fromEntries(["SCHEDULED","LIVE","ENDED","CANCELLED"].map((status)=>[
    status,
    meetings.filter((meeting)=>meeting.status===status).length,
  ]));

  return {
    totals:{
      meetings:meetings.length,
      completedMeetings:completedMeetings.length,
      avgMeetingMinutes:measuredDurations.length
        ? Math.round(measuredDurations.reduce((sum,value)=>sum+value,0)/measuredDurations.length)
        : 0,
      actionItems:totalActionItems,
      completedActionItems,
      actionCompletionRate:totalActionItems?Math.round((completedActionItems/totalActionItems)*100):0,
      meetingsWithAI:completedInsights,
    },
    statusBreakdown,
    weekly:buildWeeklySeries(meetings),
  };
}
