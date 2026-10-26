import { useEffect, useMemo, useState } from 'react'
import { FileText, ChevronRight, Sparkles, CalendarDays, Users, Clock3, Download } from 'lucide-react'
import Badge from '../../components/common/Badge'
import { listMeetings } from '../../api/meetings'
import { getPostMeetingDashboard } from '../../api/postMeeting'
import { ApiError } from '../../api/client'
import type { BackendMeeting, PostMeetingDashboard } from '../../types'

function formatDate(value?: string | null) {
  if (!value) return 'Date not set'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date not set' : date.toLocaleString()
}

function formatDuration(seconds?: number | null) {
  if (!seconds) return 'Duration unavailable'
  return `${Math.max(1, Math.round(seconds / 60))} min`
}

function formatTimestamp(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`
}

export default function NotesPage({ onToast, search }: { onToast:(s:string)=>void; search:string }) {
  const [meetings,setMeetings]=useState<BackendMeeting[]>([])
  const [selected,setSelected]=useState('')
  const [dashboard,setDashboard]=useState<PostMeetingDashboard|null>(null)
  const [tab,setTab]=useState('Summary')
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')

  useEffect(()=>{
    let active=true
    listMeetings()
      .then(items=>{
        if(!active)return
        const relevant=items.filter(item=>item.status==='ENDED'||Boolean(item.endedAt))
        setMeetings(relevant)
        if(relevant.length)setSelected(current=>current||relevant[0]._id)
      })
      .catch(err=>active&&setError(err instanceof ApiError?err.message:'Could not load meetings'))
      .finally(()=>active&&setLoading(false))
    return()=>{active=false}
  },[])

  useEffect(()=>{
    if(!selected){setDashboard(null);return}
    let active=true
    setError('')
    getPostMeetingDashboard(selected)
      .then(data=>active&&setDashboard(data))
      .catch(err=>active&&setError(err instanceof ApiError?err.message:'Could not load meeting notes'))
    return()=>{active=false}
  },[selected])

  const filtered=useMemo(()=>meetings.filter(m=>`${m.title} ${m.description||''}`.toLowerCase().includes(search.toLowerCase())),[meetings,search])

  if(loading)return <div className="panel empty-state">Loading completed meetings…</div>
  if(error&&!dashboard)return <div className="panel empty-state">{error}</div>
  if(filtered.length===0)return <div className="panel empty-state">No completed meetings with post-meeting data yet.</div>

  const current=dashboard
  return <div className="notes-layout">
    <section className="panel notes-list-panel">
      <div className="panel-heading"><div><h3>Meeting library</h3><p>Persisted transcripts and AI results</p></div><Badge>{filtered.length} meetings</Badge></div>
      <div className="notes-list">{filtered.map(m=><button key={m._id} className={`notes-list-item ${selected===m._id?'active':''}`} onClick={()=>{setSelected(m._id);setTab('Summary')}}><div className="note-icon violet"><FileText size={17}/></div><div><b>{m.title}</b><small>{formatDate(m.endedAt||m.scheduledAt)}</small><span>{m.status}</span></div><ChevronRight size={16}/></button>)}</div>
    </section>
    <section className="panel note-detail">
      {!current?<div className="empty-state">Select a meeting to view its post-meeting dashboard.</div>:<>
        <div className="note-detail-top"><div>{current.intelligence?.status==='COMPLETED'&&<Badge tone="ai"><Sparkles size={12}/> AI GENERATED</Badge>}<h2>{current.meeting.title}</h2><p><CalendarDays size={14}/> {formatDate(current.meeting.endedAt||current.meeting.scheduledAt)} <span>·</span> <Users size={14}/> {current.activity.participantCount} participants <span>·</span> <Clock3 size={14}/> {formatDuration(current.meeting.durationSeconds)}</p></div><button className="button button-secondary button-small" onClick={()=>onToast('Export will be added in the evaluator polish phase')}><Download size={14}/> Export</button></div>
        <div className="note-tabs">{['Summary','Transcript','Action items'].map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}{t==='Action items'&&<span className="tab-count">{current.actionItems.length}</span>}</button>)}</div>
        {tab==='Summary'&&<div className="note-body">
          <div className="ai-summary-banner"><Sparkles size={18}/><div><b>AI summary</b><p>{current.intelligence?.summary||current.meeting.description||'No AI summary has been generated for this meeting yet.'}</p></div></div>
          <h3>Decisions</h3>
          {current.intelligence?.decisions?.length?<ul className="key-points">{current.intelligence.decisions.map(d=><li key={d}>{d}</li>)}</ul>:<p className="muted-text">No explicit decisions were extracted.</p>}
          <h3>Activity</h3>
          <p className="muted-text">{current.activity.chatMessageCount} chat messages · {current.activity.recordingCount} recordings · {current.activity.completedActionItemCount}/{current.activity.actionItemCount} action items completed</p>
          {current.notes?.content&&<><h3>Shared notes</h3><p>{current.notes.content}</p></>}
        </div>}
        {tab==='Transcript'&&<div className="transcript">{current.transcript?.segments?.length?current.transcript.segments.map((segment,index)=><div key={index}><span>{formatTimestamp(segment.startMs)}</span><p>{segment.text}</p></div>):<div className="demo-note">No completed timestamped transcript is available.</div>}</div>}
        {tab==='Action items'&&<div className="action-list">{current.actionItems.length?current.actionItems.map(item=><div className="action-item" key={item._id}><span className={item.status==='DONE'?'task-check checked':'unchecked'}/><div><b>{item.text}</b><small>{item.assignee?.name ? 'Assigned to '+item.assignee.name : item.source==='AI' ? 'AI-generated · assignment pending' : 'Unassigned'}</small></div><Badge tone={item.status==='DONE'?'green':'neutral'}>{item.status}</Badge></div>):<div className="empty-state">No action items recorded.</div>}</div>}
      </>}
    </section>
  </div>
}
