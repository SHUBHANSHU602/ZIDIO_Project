import { useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, CalendarDays,
  Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  Clock3, Command, FileText, Filter, LayoutDashboard, ListTodo, LogOut,
  MessageSquare, Mic, MoreHorizontal, Plus, Search, Settings, Share2,
  Sparkles, Users, Video, X, Zap, Menu, Play, Download, PanelLeftClose,
  BarChart3, BrainCircuit, CalendarPlus, Send, ClipboardList
} from 'lucide-react'

type Page = 'Overview' | 'Meetings' | 'AI Notes' | 'Tasks' | 'Team' | 'Analytics' | 'Settings'
type Meeting = { title: string; time: string; duration: string; people: string[]; color: string; status: string }

const initialMeetings: Meeting[] = [
  { title: 'Product design sync', time: '09:30 AM', duration: '30 min', people: ['AM', 'JL', 'SK'], color: 'lavender', status: 'Starting soon' },
  { title: 'Sprint planning', time: '11:00 AM', duration: '45 min', people: ['SK', 'RK', 'AM', 'JL'], color: 'mint', status: 'In 1 hour' },
  { title: 'Marketing weekly review', time: '02:30 PM', duration: '30 min', people: ['JL', 'RK'], color: 'peach', status: 'Today' },
]
const navItems: { label: Page; icon: typeof LayoutDashboard; group: string }[] = [
  { label: 'Overview', icon: LayoutDashboard, group: 'WORKSPACE' },
  { label: 'Meetings', icon: Video, group: 'WORKSPACE' },
  { label: 'AI Notes', icon: Sparkles, group: 'WORKSPACE' },
  { label: 'Tasks', icon: ListTodo, group: 'WORKSPACE' },
  { label: 'Team', icon: Users, group: 'MANAGE' },
  { label: 'Analytics', icon: BarChart3, group: 'MANAGE' },
  { label: 'Settings', icon: Settings, group: 'MANAGE' },
]
const notes = [
  { title: 'Q3 product roadmap', date: 'Today · 10:42 AM', tag: 'Product', summary: 'The team agreed to prioritize onboarding improvements and the new workspace experience. Design review is scheduled for Thursday.', tasks: 4, initials: 'PR', tone: 'violet' },
  { title: 'Customer success check-in', date: 'Yesterday · 3:18 PM', tag: 'Customer success', summary: 'Top customer requests include clearer reporting, faster exports, and more flexible team permissions.', tasks: 3, initials: 'CS', tone: 'green' },
  { title: 'Engineering stand-up', date: 'Yesterday · 9:30 AM', tag: 'Engineering', summary: 'API pagination is ready for review. The team will resolve two UI bugs before the next release candidate.', tasks: 2, initials: 'EN', tone: 'orange' },
]
const tasks = [
  { title: 'Finalize onboarding wireframes', owner: 'Alex Morgan', due: 'Today', status: 'In progress', tone: 'violet' },
  { title: 'Review API pagination PR', owner: 'Jordan Lee', due: 'Today', status: 'To do', tone: 'blue' },
  { title: 'Share Q3 roadmap with team', owner: 'Sam Kim', due: 'Tomorrow', status: 'Done', tone: 'green' },
  { title: 'Prepare customer feedback report', owner: 'Riya Kapoor', due: 'Oct 16', status: 'To do', tone: 'orange' },
]
const people = [
  { name: 'Alex Morgan', role: 'Product Designer', initials: 'AM', color: 'lavender', online: true },
  { name: 'Jordan Lee', role: 'Engineering Lead', initials: 'JL', color: 'mint', online: true },
  { name: 'Sam Kim', role: 'Product Manager', initials: 'SK', color: 'peach', online: false },
  { name: 'Riya Kapoor', role: 'Marketing Lead', initials: 'RK', color: 'blue', online: true },
]

function Avatar({ initials, color = 'lavender', small = false }: { initials: string; color?: string; small?: boolean }) {
  return <span className={`avatar ${color} ${small ? 'avatar-sm' : ''}`}>{initials}</span>
}
function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge ${tone}`}>{children}</span>
}
function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className="section-title"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>
}

export default function App() {
  const [page, setPage] = useState<Page>('Overview')
  const [search, setSearch] = useState('')
  const [showSchedule, setShowSchedule] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState('')
  const [meetings, setMeetings] = useState(initialMeetings)
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDate, setMeetingDate] = useState('2026-10-14')
  const [meetingTime, setMeetingTime] = useState('10:00')
  const [completedTasks, setCompletedTasks] = useState<string[]>(['Share Q3 roadmap with team'])
  const [activeFilter, setActiveFilter] = useState('All meetings')
  const [chatMessage, setChatMessage] = useState('')

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }
  const filteredMeetings = useMemo(() => meetings.filter(m => m.title.toLowerCase().includes(search.toLowerCase())), [meetings, search])

  function createMeeting(e: React.FormEvent) {
    e.preventDefault()
    if (!meetingTitle.trim()) return
    setMeetings([{ title: meetingTitle.trim(), time: new Date(`${meetingDate}T${meetingTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), duration: '30 min', people: ['AM', 'JL'], color: 'blue', status: 'Scheduled' }, ...meetings])
    setMeetingTitle('')
    setShowSchedule(false)
    notify('Meeting scheduled successfully')
    setPage('Meetings')
  }

  const pageHeader = {
    Overview: ['Good morning, Alex 👋', 'Here’s what’s happening with your team today.'],
    Meetings: ['Meetings', 'Plan, join, and revisit your team conversations.'],
    'AI Notes': ['AI meeting notes', 'Every conversation, turned into clear next steps.'],
    Tasks: ['Tasks & action items', 'Keep decisions moving after every meeting.'],
    Team: ['Your team', 'Meet the people making work happen.'],
    Analytics: ['Meeting analytics', 'Understand your team’s collaboration patterns.'],
    Settings: ['Settings', 'Manage your workspace preferences.'],
  }[page]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand-row"><div className="brand-mark"><Sparkles size={20} strokeWidth={2.5}/></div><span>intell<span className="brand-light">meet</span></span><button className="icon-button mobile-close" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
        <button className="workspace-switch"><span className="workspace-logo">N</span><span className="workspace-text"><b>Northstar Studio</b><small>Free workspace</small></span><ChevronDown size={16}/></button>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navItems.filter(i => i.group === 'WORKSPACE').map(item => {
            const Icon = item.icon
            return <button key={item.label} className={`nav-item ${page === item.label ? 'active' : ''}`} onClick={() => { setPage(item.label); setMobileNav(false) }}><Icon size={18}/><span>{item.label}</span>{item.label === 'Tasks' && <span className="nav-count">8</span>}</button>
          })}
          <div className="nav-label manage-label">MANAGE</div>
          {navItems.filter(i => i.group === 'MANAGE').map(item => {
            const Icon = item.icon
            return <button key={item.label} className={`nav-item ${page === item.label ? 'active' : ''}`} onClick={() => { setPage(item.label); setMobileNav(false) }}><Icon size={18}/><span>{item.label}</span></button>
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><div className="upgrade-icon"><Zap size={16}/></div><b>Make meetings count</b><p>Unlock more AI minutes and team insights.</p><button onClick={() => notify('Plan options will be available soon')}>Explore plans <ArrowRight size={14}/></button><div className="upgrade-orb orb-one"/><div className="upgrade-orb orb-two"/></div>
          <button className="help-link" onClick={() => notify('Help center opened in demo mode')}><CircleHelp size={17}/> Help & support <ArrowUpRight size={14}/></button>
          <div className="profile-row"><Avatar initials="AM" color="lavender"/><div className="profile-info"><b>Alex Morgan</b><small>alex@northstar.io</small></div><MoreHorizontal size={19} className="muted-icon"/></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNav(true)}><Menu size={20}/></button>
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/><b>{page}</b></div>
          <div className="top-actions">
            <label className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search anything..." /><kbd>⌘ K</kbd></label>
            <button className={`icon-button notification-button ${showNotifications ? 'selected' : ''}`} onClick={() => setShowNotifications(!showNotifications)} aria-label="Notifications"><Bell size={19}/><i/></button>
            <Avatar initials="AM" color="lavender" small/>
          </div>
          {showNotifications && <div className="notification-popover"><div className="popover-heading"><b>Notifications</b><button onClick={() => setShowNotifications(false)}><X size={16}/></button></div><div className="notification-item"><span className="notification-dot"/><div><b>AI notes are ready</b><p>Q3 product roadmap summary is available.</p><small>8 min ago</small></div></div><div className="notification-item"><span className="notification-dot mint-dot"/><div><b>Meeting starts soon</b><p>Product design sync begins at 9:30 AM.</p><small>20 min ago</small></div></div><button className="view-all" onClick={() => {setShowNotifications(false); setPage('AI Notes')}}>View all activity <ArrowRight size={14}/></button></div>}
        </header>

        <div className="page-content">
          <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/>{page === 'Overview' ? 'TUESDAY, OCTOBER 13, 2026' : 'NORTHSTAR STUDIO'}</div><h1>{pageHeader[0]}</h1><p>{pageHeader[1]}</p></div><div className="heading-actions"><button className="button button-secondary" onClick={() => notify('Invite link copied to clipboard')}><Share2 size={16}/> Invite team</button><button className="button button-primary" onClick={() => setShowSchedule(true)}><Plus size={17}/> Schedule meeting</button></div></div>

          {page === 'Overview' && <Overview meetings={filteredMeetings} onSchedule={() => setShowSchedule(true)} onNavigate={setPage} onToast={notify} />}
          {page === 'Meetings' && <MeetingsPage meetings={filteredMeetings} filter={activeFilter} setFilter={setActiveFilter} onSchedule={() => setShowSchedule(true)} onToast={notify}/>}
          {page === 'AI Notes' && <NotesPage onToast={notify} search={search}/>}
          {page === 'Tasks' && <TasksPage completed={completedTasks} setCompleted={setCompletedTasks}/>}
          {page === 'Team' && <TeamPage onToast={notify}/>}
          {page === 'Analytics' && <AnalyticsPage/>}
          {page === 'Settings' && <SettingsPage onToast={notify}/>}
        </div>
      </main>

      {showSchedule && <div className="modal-backdrop" onClick={() => setShowSchedule(false)}><form className="modal-card" onSubmit={createMeeting} onClick={e => e.stopPropagation()}><div className="modal-head"><div><span className="modal-icon"><CalendarPlus size={20}/></span><h2>Schedule a meeting</h2><p>Bring your team together and capture every decision.</p></div><button type="button" className="icon-button" onClick={() => setShowSchedule(false)}><X size={18}/></button></div><label className="field-label">Meeting title<input autoFocus required value={meetingTitle} onChange={e => setMeetingTitle(e.target.value)} placeholder="e.g. Product roadmap review"/></label><div className="field-grid"><label className="field-label">Date<input type="date" required value={meetingDate} onChange={e => setMeetingDate(e.target.value)}/></label><label className="field-label">Start time<input type="time" required value={meetingTime} onChange={e => setMeetingTime(e.target.value)}/></label></div><div className="meeting-option"><div className="option-icon"><Sparkles size={17}/></div><div><b>AI meeting assistant</b><small>Transcription, summary and action items</small></div><span className="toggle on"><i/></span></div><div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setShowSchedule(false)}>Cancel</button><button className="button button-primary" type="submit"><CalendarDays size={16}/> Create meeting</button></div></form></div>}
      {toast && <div className="toast"><CheckCheck size={18}/>{toast}<button onClick={() => setToast('')}><X size={15}/></button></div>}
    </div>
  )
}

function Overview({ meetings, onSchedule, onNavigate, onToast }: { meetings: Meeting[]; onSchedule: () => void; onNavigate: (p: Page) => void; onToast: (s: string) => void }) {
  return <>
    <div className="stats-grid">
      <div className="stat-card"><div className="stat-top"><span className="stat-icon purple"><Video size={18}/></span><span className="stat-period">This week <ChevronDown size={13}/></span></div><div className="stat-value">24 <span className="stat-trend"><ArrowUpRight size={14}/> 12.8%</span></div><div className="stat-label">Meetings held</div><div className="mini-bars"><i style={{height:'36%'}}/><i style={{height:'52%'}}/><i style={{height:'44%'}}/><i style={{height:'72%'}}/><i style={{height:'55%'}}/><i style={{height:'88%'}}/><i style={{height:'68%'}}/></div><div className="stat-foot">vs. 21 last week</div></div>
      <div className="stat-card"><div className="stat-top"><span className="stat-icon green"><Clock3 size={18}/></span><span className="stat-period">This week <ChevronDown size={13}/></span></div><div className="stat-value">18.5 <small>hrs</small><span className="stat-trend"><ArrowDownRight size={14}/> 8.2%</span></div><div className="stat-label">Time in meetings</div><div className="progress-track"><span style={{width:'67%'}}/></div><div className="stat-foot">67% of your weekly target</div></div>
      <div className="stat-card"><div className="stat-top"><span className="stat-icon orange"><Sparkles size={18}/></span><span className="stat-period">AI assistant</span></div><div className="stat-value">16 <span className="stat-trend"><ArrowUpRight size={14}/> 24%</span></div><div className="stat-label">AI summaries created</div><div className="stat-highlight"><Sparkles size={13}/> 4h 20m saved this week</div><div className="stat-foot">Less note-taking, more doing</div></div>
      <div className="stat-card"><div className="stat-top"><span className="stat-icon blue"><ListTodo size={18}/></span><span className="stat-period">Action items</span></div><div className="stat-value">32 <span className="stat-trend"><ArrowUpRight size={14}/> 6.4%</span></div><div className="stat-label">Tasks from meetings</div><div className="task-progress"><span style={{width:'72%'}}/><span style={{width:'28%'}}/></div><div className="stat-foot"><b>23 completed</b> · 9 remaining</div></div>
    </div>
    <div className="content-grid">
      <section className="panel meetings-panel"><div className="panel-heading"><div><h3>Upcoming meetings <span className="count-pill">{meetings.length}</span></h3><p>Your schedule for today</p></div><button className="text-button" onClick={() => onNavigate('Meetings')}>View calendar <ArrowRight size={15}/></button></div>
        <div className="meeting-list">{meetings.slice(0,4).map((m,i)=><div className="meeting-row" key={m.title}><div className={`meeting-date ${m.color}`}><b>{i===0?'13':i===1?'13':'13'}</b><small>OCT</small></div><div className="meeting-details"><b>{m.title}</b><span><Clock3 size={13}/>{m.time} <i/> {m.duration}</span><div className="avatar-stack">{m.people.map((p,j)=><Avatar key={j} initials={p} small color={['lavender','mint','peach','blue'][j%4]}/>)}</div></div><div className="meeting-row-actions"><Badge tone={i===0?'violet':'neutral'}>{m.status}</Badge><button className="icon-button" onClick={() => onToast(`Meeting options for ${m.title}`)}><MoreHorizontal size={18}/></button></div></div>)}
          {meetings.length===0 && <div className="empty-state">No meetings match your search.</div>}
        </div><button className="add-meeting" onClick={onSchedule}><Plus size={16}/> Add a meeting to your day</button>
      </section>
      <section className="panel ai-panel"><div className="ai-card-top"><div className="ai-emblem"><Sparkles size={21}/></div><Badge tone="ai">AI INSIGHTS</Badge><button className="icon-button" onClick={() => onNavigate('AI Notes')}><ArrowUpRight size={18}/></button></div><h3>Your meetings, made actionable.</h3><p>IntellMeet turns conversations into clear summaries and next steps, so your team can focus on the work that matters.</p><div className="ai-metric-row"><div><span>Time saved this month</span><b>12h 40m</b></div><div><span>Action items found</span><b>86</b></div></div><div className="ai-sparkline"><svg viewBox="0 0 360 56" preserveAspectRatio="none"><path d="M0 45 C25 43 26 28 50 35 S75 43 95 25 S125 34 145 17 S180 28 205 16 S235 25 260 8 S300 23 325 5 S345 14 360 2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M0 45 C25 43 26 28 50 35 S75 43 95 25 S125 34 145 17 S180 28 205 16 S235 25 260 8 S300 23 325 5 S345 14 360 2 L360 56 L0 56Z" fill="currentColor" opacity=".08"/></svg></div><button className="ai-cta" onClick={() => onNavigate('AI Notes')}>Explore AI notes <ArrowRight size={15}/></button></section>
    </div>
    <div className="bottom-grid">
      <section className="panel"><div className="panel-heading"><div><h3>Recent AI notes</h3><p>Key takeaways from your conversations</p></div><button className="icon-button" onClick={() => onNavigate('AI Notes')}><ArrowUpRight size={17}/></button></div>{notes.slice(0,2).map(n=><div className="note-row" key={n.title}><div className={`note-icon ${n.tone}`}><FileText size={18}/></div><div className="note-content"><b>{n.title}</b><small>{n.date}</small><p>{n.summary}</p><span className="note-tasks"><Check size={13}/>{n.tasks} action items</span></div><button className="icon-button" onClick={() => onNavigate('AI Notes')}><ChevronRight size={17}/></button></div>)}</section>
      <section className="panel activity-panel"><div className="panel-heading"><div><h3>Team activity</h3><p>What your team has been up to</p></div><button className="icon-button" onClick={() => onNavigate('Team')}><ArrowUpRight size={17}/></button></div><div className="activity-item"><Avatar initials="JL" color="mint" small/><div><p><b>Jordan Lee</b> completed <b>API pagination PR</b></p><small>12 minutes ago</small></div><span className="activity-check"><Check size={13}/></span></div><div className="activity-item"><Avatar initials="SK" color="peach" small/><div><p><b>Sam Kim</b> shared meeting notes</p><small>38 minutes ago</small></div><span className="activity-file"><FileText size={14}/></span></div><div className="activity-item"><Avatar initials="AM" color="lavender" small/><div><p><b>You</b> scheduled Product design sync</p><small>1 hour ago</small></div><span className="activity-cal"><CalendarDays size={14}/></span></div><button className="text-button activity-link" onClick={() => onNavigate('Team')}>See all activity <ArrowRight size={14}/></button></section>
    </div>
  </>
}

function MeetingsPage({ meetings, filter, setFilter, onSchedule, onToast }: { meetings: Meeting[]; filter: string; setFilter: (s:string)=>void; onSchedule:()=>void; onToast:(s:string)=>void }) {
  const visible = filter === 'All meetings' ? meetings : meetings.filter(m => filter === 'Upcoming' ? m.status !== 'Completed' : m.status === 'Completed')
  return <><div className="filter-toolbar"><div className="segmented">{['All meetings','Upcoming','Completed'].map(f=><button key={f} className={filter===f?'selected':''} onClick={()=>setFilter(f)}>{f}</button>)}</div><button className="button button-secondary" onClick={() => onToast('Calendar filter options opened')}><Filter size={15}/> Filter</button></div><div className="meeting-cards">{visible.map((m,i)=><div className="meeting-card" key={m.title}><div className={`meeting-card-banner ${m.color}`}><div className="banner-date"><CalendarDays size={16}/><span>OCT 13, 2026</span></div><button className="icon-button" onClick={() => onToast('Meeting menu opened')}><MoreHorizontal size={18}/></button><div className="banner-illustration"><Video size={48}/></div></div><div className="meeting-card-body"><Badge tone={i===0?'violet':'neutral'}>{m.status}</Badge><h3>{m.title}</h3><p><Clock3 size={14}/>{m.time} · {m.duration}</p><div className="card-footer"><div className="avatar-stack">{m.people.map((p,j)=><Avatar key={j} initials={p} small color={['lavender','mint','peach','blue'][j%4]}/>)}</div><span className="muted-text">{m.people.length} participants</span><button className="button button-primary button-small" onClick={() => onToast(`Joining "${m.title}" — connect your meeting API to enable live rooms`)}><Video size={14}/> Join</button></div></div></div>)}</div>{visible.length===0&&<div className="panel empty-state">No meetings found for this filter.</div>}<div className="panel meeting-tip"><span className="tip-icon"><Sparkles size={18}/></span><div><b>Make every meeting count</b><p>Enable AI meeting assistant to get transcripts, summaries, and assigned action items automatically.</p></div><button className="text-button" onClick={() => onToast('AI assistant settings opened')}>Configure AI <ArrowRight size={14}/></button></div><button className="floating-add" onClick={onSchedule}><Plus size={18}/></button></>
}
function NotesPage({ onToast, search }: { onToast:(s:string)=>void; search:string }) {
  const [selected, setSelected] = useState(notes[0].title)
  const [tab, setTab] = useState('Summary')
  const filtered = notes.filter(n => `${n.title} ${n.summary} ${n.tag}`.toLowerCase().includes(search.toLowerCase()))
  const current = notes.find(n => n.title === selected) || filtered[0] || notes[0]
  return <div className="notes-layout"><section className="panel notes-list-panel"><div className="panel-heading"><div><h3>Meeting library</h3><p>AI-generated notes and transcripts</p></div><Badge>{filtered.length} notes</Badge></div><div className="notes-list">{filtered.map(n=><button key={n.title} className={`notes-list-item ${current.title===n.title?'active':''}`} onClick={()=>{setSelected(n.title);setTab('Summary')}}><div className={`note-icon ${n.tone}`}><FileText size={17}/></div><div><b>{n.title}</b><small>{n.date}</small><span>{n.tag}</span></div><ChevronRight size={16}/></button>)}</div>{filtered.length===0&&<p className="empty-state">No notes match your search.</p>}</section><section className="panel note-detail"><div className="note-detail-top"><div><Badge tone="ai"><Sparkles size={12}/> AI GENERATED</Badge><h2>{current.title}</h2><p><CalendarDays size={14}/> {current.date} <span>·</span> <Users size={14}/> 6 participants <span>·</span> <Clock3 size={14}/> 42 min</p></div><button className="button button-secondary button-small" onClick={()=>onToast('Export prepared in demo mode')}><Download size={14}/> Export</button></div><div className="note-tabs">{['Summary','Transcript','Action items'].map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}{t==='Action items'&&<span className="tab-count">{current.tasks}</span>}</button>)}</div>{tab==='Summary'&&<div className="note-body"><div className="ai-summary-banner"><Sparkles size={18}/><div><b>AI summary</b><p>{current.summary}</p></div></div><h3>Key discussion points</h3><ul className="key-points"><li>Align on priorities and define clear ownership for the next milestone.</li><li>Review open feedback and agree on follow-up actions with the team.</li><li>Share the updated plan before the next scheduled check-in.</li></ul><h3>Meeting highlights</h3><div className="highlight-row"><span className="highlight-time">04:12</span><p><b>Project priorities</b><br/>The team aligned on the most important outcomes for the upcoming sprint.</p></div><div className="highlight-row"><span className="highlight-time">18:36</span><p><b>Next steps</b><br/>Owners and due dates were identified for all open follow-up items.</p></div></div>}{tab==='Transcript'&&<div className="transcript"><div><span>09:31:04</span><p><b>Alex Morgan</b><br/>Let's start with the main priorities for this week and make sure every action has an owner.</p></div><div><span>09:32:18</span><p><b>Jordan Lee</b><br/>The API work is nearly ready. I'll share the pull request for review this afternoon.</p></div><div><span>09:34:02</span><p><b>Sam Kim</b><br/>I'll update the roadmap and send the revised version to everyone by Thursday.</p></div><div className="demo-note">Sample transcript preview — connect your transcription service for live meeting data.</div></div>}{tab==='Action items'&&<div className="action-list">{['Share the revised roadmap','Review API pagination pull request','Finalize onboarding wireframes','Schedule the next stakeholder review'].slice(0,current.tasks).map((t,i)=><div className="action-item" key={t}><span className="unchecked"/><div><b>{t}</b><small>Assigned to {['Sam Kim','Jordan Lee','Alex Morgan','Riya Kapoor'][i]}</small></div><Badge tone={i===0?'orange':'neutral'}>{i===0?'Today':'Tomorrow'}</Badge></div>)}</div>}</section></div>
}
function TasksPage({ completed, setCompleted }: { completed:string[]; setCompleted:(s:string[])=>void }) {
  const [filter, setFilter] = useState('All tasks')
  const all = tasks.filter(t => t.title.toLowerCase().includes('') && (filter==='All tasks'||(filter==='Completed'?completed.includes(t.title):!completed.includes(t.title))))
  return <><div className="task-summary-grid"><div className="task-summary"><span className="stat-icon purple"><ClipboardList size={18}/></span><div><b>{tasks.length-completed.length}</b><small>Open tasks</small></div></div><div className="task-summary"><span className="stat-icon green"><CheckCheck size={18}/></span><div><b>{completed.length}</b><small>Completed</small></div></div><div className="task-summary"><span className="stat-icon orange"><Clock3 size={18}/></span><div><b>2</b><small>Due today</small></div></div></div><section className="panel tasks-panel"><div className="panel-heading"><div><h3>Action items</h3><p>Tasks collected from your meetings</p></div><div className="segmented">{['All tasks','Open','Completed'].map(f=><button key={f} className={filter===f?'selected':''} onClick={()=>setFilter(f==='Open'?'Open':f)}>{f}</button>)}</div></div><div className="task-table"><div className="task-table-head"><span>Task</span><span>Assignee</span><span>Due date</span><span>Status</span></div>{all.map(t=>{const done=completed.includes(t.title);return <div className="task-table-row" key={t.title}><button className={`task-check ${done?'checked':''}`} onClick={()=>setCompleted(done?completed.filter(x=>x!==t.title):[...completed,t.title])}>{done&&<Check size={13}/>}</button><div className={`task-name ${done?'done':''}`}><b>{t.title}</b><small><Sparkles size={12}/> From meeting notes</small></div><div className="task-assignee"><Avatar initials={t.owner.split(' ').map(x=>x[0]).join('')} color={t.tone} small/><span>{t.owner}</span></div><span className="due-date">{t.due}</span><Badge tone={done?'green':t.status==='In progress'?'violet':'neutral'}>{done?'Done':t.status}</Badge></div>})}</div></section></>
}
function TeamPage({ onToast }:{onToast:(s:string)=>void}) {
  return <><div className="team-summary"><div className="team-summary-left"><div className="team-avatars"><Avatar initials="AM"/><Avatar initials="JL" color="mint"/><Avatar initials="SK" color="peach"/><Avatar initials="RK" color="blue"/></div><div><b>4 teammates</b><p>Working together at Northstar Studio</p></div></div><button className="button button-primary" onClick={()=>onToast('Invite link copied to clipboard')}><Plus size={16}/> Invite member</button></div><div className="team-grid">{people.map(p=><div className="panel team-card" key={p.name}><div className="team-card-menu"><button className="icon-button" onClick={()=>onToast(`Options for ${p.name}`)}><MoreHorizontal size={18}/></button></div><div className="team-avatar-large"><Avatar initials={p.initials} color={p.color}/><span className={`online-indicator ${p.online?'online':''}`}/></div><h3>{p.name}</h3><p>{p.role}</p><Badge tone={p.online?'green':'neutral'}>{p.online?'Online':'Away'}</Badge><div className="team-card-stats"><div><b>{p.name==='Alex Morgan'?'18':p.name==='Jordan Lee'?'24':'12'}</b><small>Meetings</small></div><div><b>{p.name==='Sam Kim'?'9':'14'}</b><small>Tasks</small></div></div><button className="button button-secondary full-button" onClick={()=>onToast(`Opening chat with ${p.name}`)}><MessageSquare size={15}/> Message</button></div>)}</div></>
}
function AnalyticsPage() {
  const bars=[42,58,46,76,61,89,68,54,79,65,94,73]
  return <><div className="stats-grid analytics-stats"><div className="stat-card"><span className="stat-label">Total meetings</span><div className="stat-value">108 <span className="stat-trend"><ArrowUpRight size={14}/> 18.2%</span></div><small className="stat-foot">Compared to last month</small></div><div className="stat-card"><span className="stat-label">Avg. meeting length</span><div className="stat-value">34 <small>min</small></div><small className="stat-foot">↓ 6 min from last month</small></div><div className="stat-card"><span className="stat-label">AI time saved</span><div className="stat-value">21.4 <small>hrs</small></div><small className="stat-foot">Across your workspace</small></div><div className="stat-card"><span className="stat-label">Action completion</span><div className="stat-value">82<span className="percent">%</span></div><small className="stat-foot">↑ 9% completion rate</small></div></div><div className="analytics-grid"><section className="panel chart-panel"><div className="panel-heading"><div><h3>Meeting activity</h3><p>Meeting hours over the last 12 weeks</p></div><button className="button button-secondary button-small">Last 12 weeks <ChevronDown size={14}/></button></div><div className="chart-legend"><span/><small>Meeting hours</small></div><div className="bar-chart">{bars.map((v,i)=><div className="bar-column" key={i}><div className="bar-value" style={{height:`${v}%`}}/><small>{['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'][i]}</small></div>)}</div></section><section className="panel"><div className="panel-heading"><div><h3>Meeting types</h3><p>Breakdown by category</p></div></div><div className="donut-wrap"><div className="donut"><div><b>108</b><small>meetings</small></div></div></div><div className="legend-list"><div><i className="legend-purple"/><span>Team sync</span><b>42%</b></div><div><i className="legend-green"/><span>Project review</span><b>28%</b></div><div><i className="legend-orange"/><span>Planning</span><b>18%</b></div><div><i className="legend-blue"/><span>Other</span><b>12%</b></div></div></section></div><div className="panel analytics-insight"><span className="ai-emblem"><BrainCircuit size={20}/></span><div><b>Insight from IntellMeet AI</b><p>Your team has shortened average meeting time by 15% while increasing action-item completion. Consider protecting two focus blocks each week to maintain momentum.</p></div></div></>
}
function SettingsPage({onToast}:{onToast:(s:string)=>void}) {
  const [ai, setAi] = useState(true)
  const [transcript, setTranscript] = useState(true)
  const [reminders, setReminders] = useState(false)
  return <div className="settings-layout"><div className="settings-nav panel"><button className="active"><Users size={16}/> Workspace profile</button><button><Bell size={16}/> Notifications</button><button><Sparkles size={16}/> AI preferences</button><button><ShieldIcon/> Security & access</button></div><section className="panel settings-panel"><div className="panel-heading"><div><h3>Workspace profile</h3><p>Update your workspace details and preferences.</p></div></div><div className="workspace-profile"><span className="workspace-logo big">N</span><div><b>Northstar Studio</b><small>Workspace avatar</small></div><button className="button button-secondary button-small" onClick={()=>onToast('Avatar upload is not connected in this demo')}>Change avatar</button></div><label className="field-label">Workspace name<input defaultValue="Northstar Studio"/></label><label className="field-label">Workspace URL<div className="url-input"><span>intellmeet.app/</span><input defaultValue="northstar-studio"/></div></label><div className="settings-divider"/><h3 className="settings-subtitle">AI & meeting preferences</h3><SettingToggle title="AI meeting assistant" description="Automatically generate summaries and action items." value={ai} onChange={setAi}/><SettingToggle title="Meeting transcription" description="Create a searchable transcript for recorded meetings." value={transcript} onChange={setTranscript}/><SettingToggle title="Meeting reminders" description="Get notified 10 minutes before a meeting starts." value={reminders} onChange={setReminders}/><div className="settings-save"><span>Changes are saved locally in this demo.</span><button className="button button-primary" onClick={()=>onToast('Preferences saved')}>Save changes</button></div></section></div>
}
function ShieldIcon(){return <Settings size={16}/>}
function SettingToggle({title,description,value,onChange}:{title:string;description:string;value:boolean;onChange:(v:boolean)=>void}) {
  return <div className="setting-toggle-row"><div><b>{title}</b><p>{description}</p></div><button className={`toggle ${value?'on':''}`} onClick={()=>onChange(!value)} aria-label={`Toggle ${title}`}><i/></button></div>
}