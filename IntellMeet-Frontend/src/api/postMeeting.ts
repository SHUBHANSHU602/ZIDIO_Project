import { apiRequest } from './client'
import type { PostMeetingDashboard } from '../types'

type DashboardResponse = { success: true; data: PostMeetingDashboard }

export async function getPostMeetingDashboard(meetingId: string) {
  const response = await apiRequest<DashboardResponse>(`/meetings/${meetingId}/post-meeting`)
  return response.data
}
