import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { Sparkles, ChevronDown, Zap, ArrowRight, CircleHelp, ArrowUpRight, MoreHorizontal, Menu, ChevronRight, Search, Bell, Share2, Plus, CalendarPlus, CalendarDays, CheckCheck, X } from 'lucide-react'

// import { Sparkles, ChevronDown, Zap, ArrowRight, CircleHelp, ArrowUpRight, MoreHorizontal, Menu, ChevronRight, Search, Bell, Share2, Plus, CalendarPlus, CalendarDays, CheckCheck } from 'lucide-react'
import { initialMeetings, navItems } from './data/initialData'
import type { Page, Meeting } from './types'
import Avatar from './components/common/Avatar'
import Badge from './components/common/Badge'
import Overview from './pages/dashboard/Overview'
import MeetingsPage from './pages/meetings/MeetingsPage'
import NotesPage from './pages/meetings/NotesPage'
import TasksPage from './pages/dashboard/TasksPage'
import TeamPage from './pages/dashboard/TeamPage'
import AnalyticsPage from './pages/dashboard/AnalyticsPage'
import SettingsPage from './pages/settings/SettingsPage'

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

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }
  const filteredMeetings = useMemo(() => meetings.filter(m => m.title.toLowerCase().includes(search.toLowerCase())), [meetings, search])

  function createMeeting(e: FormEvent) {
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
