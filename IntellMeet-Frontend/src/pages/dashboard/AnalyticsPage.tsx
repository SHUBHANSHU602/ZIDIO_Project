import { useEffect, useMemo, useState } from 'react'
import { BrainCircuit } from 'lucide-react'
import { ApiError } from '../../api/client'
import { getAnalytics } from '../../api/analytics'
import type { AnalyticsData } from '../../api/analytics'

export default function AnalyticsPage() {
  const [data,setData]=useState<AnalyticsData|null>(null)
  const [error,setError]=useState('')

  useEffect(()=>{
    let active=true
    getAnalytics()
      .then(value=>active&&setData(value))
      .catch(err=>active&&setError(err instanceof ApiError?err.message:'Could not load analytics'))
    return()=>{active=false}
  },[])

  const maxMinutes=useMemo(()=>Math.max(1,...(data?.weekly.map(item=>item.meetingMinutes)||[1])),[data])

  if(error)return <div className="panel empty-state">{error}</div>
  if(!data)return <div className="panel empty-state">Loading analytics…</div>

  const statusTotal=Math.max(1,Object.values(data.statusBreakdown).reduce((sum,value)=>sum+value,0))

  return <>
    <div className="stats-grid analytics-stats">
      <div className="stat-card"><span className="stat-label">Total meetings</span><div className="stat-value">{data.totals.meetings}</div><small className="stat-foot">{data.totals.completedMeetings} completed</small></div>
      <div className="stat-card"><span className="stat-label">Avg. measured length</span><div className="stat-value">{data.totals.avgMeetingMinutes} <small>min</small></div><small className="stat-foot">Completed meetings with start/end timestamps</small></div>
      <div className="stat-card"><span className="stat-label">AI processed meetings</span><div className="stat-value">{data.totals.meetingsWithAI}</div><small className="stat-foot">Completed structured meeting insights</small></div>
      <div className="stat-card"><span className="stat-label">Action completion</span><div className="stat-value">{data.totals.actionCompletionRate}<span className="percent">%</span></div><small className="stat-foot">{data.totals.completedActionItems}/{data.totals.actionItems} non-dismissed actions done</small></div>
    </div>

    <div className="analytics-grid">
      <section className="panel chart-panel">
        <div className="panel-heading"><div><h3>Meeting activity</h3><p>Measured meeting minutes over the last 12 weeks</p></div></div>
        <div className="chart-legend"><span/><small>Meeting minutes</small></div>
        <div className="bar-chart">{data.weekly.map((item,index)=><div className="bar-column" key={item.weekStart}><div className="bar-value" style={{height:`${Math.round((item.meetingMinutes/maxMinutes)*100)}%`}}/><small>W{index+1}</small></div>)}</div>
      </section>
      <section className="panel">
        <div className="panel-heading"><div><h3>Meeting status</h3><p>Current persisted meeting lifecycle</p></div></div>
        <div className="donut-wrap"><div className="donut"><div><b>{data.totals.meetings}</b><small>meetings</small></div></div></div>
        <div className="legend-list">
          {Object.entries(data.statusBreakdown).map(([status,count],index)=><div key={status}><i className={['legend-purple','legend-green','legend-orange','legend-blue'][index]}/><span>{status}</span><b>{Math.round((count/statusTotal)*100)}%</b></div>)}
        </div>
      </section>
    </div>

    <div className="panel analytics-insight"><span className="ai-emblem"><BrainCircuit size={20}/></span><div><b>Evidence-based analytics</b><p>These metrics are calculated from persisted meeting timestamps, lifecycle states, AI insight records and action-item completion. IntellMeet does not display invented productivity or “time saved” estimates.</p></div></div>
  </>
}
