import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../lib/useProgress'
import { ArrowLeft, ExternalLink, HelpCircle, Check, Play, BookOpen, AlertTriangle } from 'lucide-react'

const BADGE = {
  read: 'bg-blue-950/40 text-blue-400 border border-blue-900/30 font-mono',
  build: 'bg-yellow-950/40 text-yellow-500 border border-yellow-900/30 font-mono',
  test: 'bg-red-950/40 text-red-400 border border-red-900/30 font-mono',
  review: 'bg-green-950/40 text-green-400 border border-green-900/30 font-mono',
  rest: 'bg-slate-900/60 text-slate-400 border border-white/5 font-mono',
}

export default function WeekDetail() {
  const { weekId } = useParams()
  const { completions, toggle, activeWeeks } = useProgress()
  const week = activeWeeks.find(w => w.id === parseInt(weekId))
  const navigate = useNavigate()
  const [tab, setTab] = useState('tasks')
  const [burst, setBurst] = useState(null)

  if (!week) return <div className="p-8 text-slate-500 font-mono">Week not found</div>

  const done = week.tasks.filter(t => completions.has(t.id)).length
  const pct = Math.round((done / week.tasks.length) * 100)

  const byDay = week.tasks.reduce((acc, t) => {
    const key = `Day ${t.day} · ${t.date} — ${t.label}`
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {})

  const handleToggle = (id) => {
    toggle(id)
    if (!completions.has(id)) {
      setBurst(id)
      setTimeout(() => setBurst(null), 300)
    }
  }

  const matGroups = week.materials.reduce((acc, m) => {
    const g = { read: 'Primary Reading', course: 'Courses', practice: 'Practice & Labs', supplementary: 'Supplementary' }[m.type] || 'Primary Reading'
    if (!acc[g]) acc[g] = []
    acc[g].push(m)
    return acc
  }, {})

  return (
    <div className="space-y-6 pb-12 relative z-10">
      
      {/* Sticky Header Telemetry HUD */}
      <div className="neo-glass rounded-3xl p-5 md:p-6 sticky top-16 lg:top-4 z-25 shadow-2xl glowing-border-orange">
        <button 
          onClick={() => navigate('/plan')} 
          className="flex items-center gap-1.5 text-slate-400 hover:text-orange-400 text-xs font-mono mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft size={13}/> BACK TO ROADMAP
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase font-semibold px-2 py-0.5 rounded bg-slate-900 border border-white/5" style={{ color: week.color }}>
              WEEK {week.id} · {week.phaseLabel}
            </span>
            <h2 className="text-xl font-black text-slate-100 mt-2 leading-tight">{week.title}</h2>
            <p className="text-xs text-slate-500 font-mono mt-1">{week.dates} · {week.domain}</p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0 bg-slate-900/60 border border-white/5 px-4 py-2.5 rounded-2xl">
            <div className="text-right">
              <div className="text-2xl font-black font-mono leading-none" style={{ color: week.color }}>{pct}%</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">{done} / {week.tasks.length} LOCKED</div>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="h-2 w-24 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: week.color }} />
            </div>
          </div>
        </div>

        {/* Dynamic Selector Tabs */}
        <div className="flex gap-2 mt-5 border-t border-white/5 pt-4">
          {['tasks', 'materials', 'concepts'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                tab === t
                  ? 'bg-orange-600/15 border-orange-500/30 text-orange-400 font-bold shadow-[0_0_12px_rgba(255,107,0,0.08)]'
                  : 'bg-slate-950/40 border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {t === 'tasks' ? 'Tasks checklist' : t === 'materials' ? 'Study Materials' : 'Core Concepts'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* TASKS CHECKLIST */}
        {tab === 'tasks' && (
          <div className="space-y-6">
            {pct === 100 && (
              <div className="bg-green-950/20 border border-green-500/20 rounded-2xl px-5 py-4 text-xs font-mono text-green-400 flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.04)]">
                <Check size={14} className="bg-green-500/20 rounded-full p-0.5" /> 
                WEEK STATUS // MILESTONE LOCKED SUCCESSFULLY. EXCELLENCE SECURED.
              </div>
            )}
            
            {Object.entries(byDay).map(([dayLabel, tasks]) => (
              <div key={dayLabel} className="space-y-2">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pb-1.5 border-b border-white/5">
                  {dayLabel}
                </div>
                <div className="space-y-2">
                  {tasks.map(task => {
                    const isDone = completions.has(task.id)
                    return (
                      <button
                        key={task.id}
                        onClick={() => handleToggle(task.id)}
                        className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl text-left transition-all border cursor-pointer ${
                          burst === task.id ? 'scale-97' : 'scale-100'
                        } ${
                          isDone 
                            ? 'bg-slate-950/30 border-white/5 hover:bg-slate-950/40' 
                            : 'neo-glass neo-glass-hover'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg flex-shrink-0 mt-0.5 flex items-center justify-center transition-all border ${
                          isDone 
                            ? 'bg-green-500 border-green-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]' 
                            : 'border-slate-700 bg-slate-950/60 hover:border-orange-500/50'
                        }`}>
                          {isDone && <Check size={12} className="text-slate-950 stroke-[3]" />}
                        </div>
                        <div className={`flex-1 text-sm leading-relaxed ${isDone ? 'text-slate-500 line-through decoration-slate-800' : 'text-slate-200'}`}>
                          {task.text}
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold flex-shrink-0 uppercase ${BADGE[task.type]}`}>
                          {task.type}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STUDY MATERIALS */}
        {tab === 'materials' && (
          <div className="space-y-6">
            {Object.entries(matGroups).map(([group, items]) => (
              <div key={group} className="space-y-2">
                <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1">{group}</h3>
                <div className="space-y-2.5">
                  {items.map((m, i) => {
                    const isExamSim = m.url && m.url.includes('OlivierAlter');

                    if (isExamSim) {
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            sessionStorage.setItem('cca_quiz_config', JSON.stringify({
                              type: 'exam_simulation',
                              domain: null,
                              startedAt: Date.now()
                            }))
                            navigate('/quiz/active')
                          }}
                          className="w-full flex gap-3.5 bg-orange-600/10 border border-orange-500/30 hover:border-orange-400 rounded-2xl p-4 group text-left transition-all cursor-pointer shadow-[0_0_20px_rgba(255,107,0,0.04)]"
                        >
                          <span className="text-lg flex-shrink-0 mt-0.5">{m.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-200 group-hover:text-orange-400 transition-colors leading-tight">{m.title}</h4>
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-orange-500 text-slate-950 font-bold flex-shrink-0">Simulator Console</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                          </div>
                          <span className="text-orange-400 text-xs font-mono self-center font-bold group-hover:translate-x-0.5 transition-transform flex-shrink-0">Launch Engine →</span>
                        </button>
                      )
                    }

                    const isLocal = m.url && m.url.startsWith('/');

                    if (isLocal) {
                      return (
                        <button
                          key={i}
                          onClick={() => navigate(m.url)}
                          className="w-full flex gap-3.5 bg-lime-600/10 border border-lime-500/20 hover:border-lime-400 rounded-2xl p-4 group text-left transition-all cursor-pointer shadow-[0_0_20px_rgba(173,255,0,0.03)]"
                        >
                          <span className="text-lg flex-shrink-0 mt-0.5">{m.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-200 group-hover:text-lime-400 transition-colors leading-tight">{m.title}</h4>
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-lime-500 text-slate-950 font-bold flex-shrink-0">Interactive Cheatsheet</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                          </div>
                          <span className="text-lime-400 text-xs font-mono self-center font-bold group-hover:translate-x-0.5 transition-transform flex-shrink-0">Open Guide →</span>
                        </button>
                      )
                    }

                    return (
                      <a
                        key={i}
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex gap-3.5 neo-glass rounded-2xl p-4 group transition-all border hover:border-orange-500/20"
                      >
                        <span className="text-lg flex-shrink-0 mt-0.5">{m.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-200 group-hover:text-orange-400 transition-colors leading-tight">{m.title}</h4>
                            {m.paid && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-amber-500/20 text-amber-500 border border-amber-500/30 flex-shrink-0 font-bold">UDEMY COURSE</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                        </div>
                        <ExternalLink size={13} className="text-slate-600 flex-shrink-0 mt-0.5 group-hover:text-orange-400 transition-colors" />
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CORE CONCEPTS */}
        {tab === 'concepts' && (
          <div className="space-y-5">
            {week.concepts.map((c, i) => {
              if (c.type === 'compare') {
                return (
                  <div key={i} className="neo-glass rounded-2xl overflow-hidden border border-white/5">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-5 pt-4 pb-2 flex items-center gap-1.5">
                      <HelpCircle size={12}/> {c.title}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
                      <div className="p-5 bg-red-950/10">
                        <div className="text-xs font-mono text-red-400 font-bold mb-1.5">{c.bad.label}</div>
                        <p className="text-xs text-slate-400 leading-relaxed">{c.bad.text}</p>
                      </div>
                      <div className="p-5 bg-green-950/10">
                        <div className="text-xs font-mono text-green-400 font-bold mb-1.5">{c.good.label}</div>
                        <p className="text-xs text-slate-300 leading-relaxed">{c.good.text}</p>
                      </div>
                    </div>
                  </div>
                )
              }
              
              if (c.type === 'tip') {
                return (
                  <div key={i} className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-orange-600/5 rounded-full filter blur-lg" />
                    <div className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={12}/> {c.title}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{c.body}</p>
                  </div>
                )
              }

              return (
                <div key={i} className="neo-glass rounded-2xl p-5 space-y-3">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen size={12}/> {c.title}
                  </div>
                  <pre className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 border border-white/5 rounded-xl p-4 whitespace-pre-wrap">
                    {c.body}
                  </pre>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
