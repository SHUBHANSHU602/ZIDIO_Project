export type Page = 'Overview' | 'Meetings' | 'AI Notes' | 'Tasks' | 'Team' | 'Analytics' | 'Settings'

export type User = {
  _id: string
  name: string
  email: string
  role: 'ADMIN' | 'MEMBER'
  authProvider?: 'LOCAL' | 'GOOGLE'
}

export type BackendMeeting = {
  _id: string
  title: string
  description?: string
  host: User | string
  team?: { _id: string; name: string } | string | null
  participants?: Array<User | string>
  scheduledAt?: string | null
  startedAt?: string | null
  endedAt?: string | null
  status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED'
}

export type Meeting = {
  id?: string
  title: string
  time: string
  duration: string
  people: string[]
  color: string
  status: string
}

export type TranscriptSegment = {
  startMs: number
  endMs: number
  text: string
  speaker?: string
}

export type PostMeetingDashboard = {
  meeting: BackendMeeting & { durationSeconds?: number | null }
  intelligence: null | {
    status: 'PROCESSING' | 'COMPLETED' | 'FAILED'
    summary: string
    decisions: string[]
    provider: string
    model: string
    completedAt?: string | null
  }
  transcript: null | {
    text: string
    language: string
    durationSeconds: number
    segments: TranscriptSegment[]
  }
  actionItems: Array<{
    _id: string
    text: string
    status: 'OPEN' | 'DONE' | 'DISMISSED'
    source: 'AI' | 'MANUAL'
    assignee?: User | null
    dueAt?: string | null
  }>
  recordings: Array<{
    _id: string
    secureUrl: string
    format: string
    bytes: number
    durationSeconds: number
    createdAt: string
  }>
  notes: null | {
    content: string
    revision: number
    updatedAt: string
    lastEditedBy?: User
  }
  activity: {
    chatMessageCount: number
    participantCount: number
    actionItemCount: number
    completedActionItemCount: number
    recordingCount: number
  }
}
