export type Page = 'Overview' | 'Meetings' | 'AI Notes' | 'Tasks' | 'Team' | 'Analytics' | 'Settings'
export type Meeting = { title: string; time: string; duration: string; people: string[]; color: string; status: string }
