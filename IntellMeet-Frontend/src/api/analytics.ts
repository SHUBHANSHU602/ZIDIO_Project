import { apiRequest } from './client'

export type AnalyticsData = {
  totals: {
    meetings: number
    completedMeetings: number
    avgMeetingMinutes: number
    actionItems: number
    completedActionItems: number
    actionCompletionRate: number
    meetingsWithAI: number
  }
  statusBreakdown: Record<'SCHEDULED'|'LIVE'|'ENDED'|'CANCELLED',number>
  weekly: Array<{weekStart:string;meetingCount:number;meetingMinutes:number}>
}

export async function getAnalytics(){
  const response=await apiRequest<{success:true;data:AnalyticsData}>('/analytics')
  return response.data
}
