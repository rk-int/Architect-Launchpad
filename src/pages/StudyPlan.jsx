import { useNavigate } from 'react-router-dom'
import { useProgress } from '../lib/useProgress'
import { getUser } from '../lib/storage'
import { getDefaultExamDate } from '../lib/constants'
import { ChevronRight, CheckCircle2, Calendar, Target, Award } from 'lucide-react'

const PHASE_LABELS = { 
  0: 'Phase 0 · Prerequisites & Orientation', 
  1: 'Phase 1 · Foundations & Core Mechanics', 
  2: 'Phase 2 · Applied Knowledge & Lab Scenarios', 
  3: 'Phase 3 · Timed Mock Exams & Preparation' 
}

export default function StudyPlan() {
  const { weekProgress, activeWeeks } = useProgress()
  const user = getUser() || {}
  const navigate = useNavigate()
  
  const start = user.startedAt ? new Date(user.startedAt) : new Date()
  const end = user.examDate ? new Date(user.examDate) : new Date(getDefaultExamDate())
  
  const formatDateShort = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const formatDateLong = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  
  let lastPhase = null

  return (
    <div className="px-4 lg:px-8 pt-6 pb-12 relative z-10 space-y-6">
      
      {/* Roadmap Header Banner */}
      <div className="border-b border-white/5 pb-5">
        <p className="text-xs font-mono text-orange-400 tracking-widest uppercase mb-1 flex items-center gap-1.5">
          <Target size={12} /> {activeWeeks.length}-Week Certification Program
        </p>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          Curriculum Learning Roadmap
        </h1>
        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono mt-2">
          <span className="flex items-center gap-1"><Calendar size={12}/> {formatDateShort(start)} – {formatDateShort(end)}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Award size={12}/> Target Exam: {formatDateLong(end)}</span>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="max-w-2xl space-y-6 relative before:absolute before:inset-y-0 before:left-6 before:w-px before:bg-slate-850">
        
        {activeWeeks.map(w => {
          const wp = weekProgress.find(p => p.weekId === w.id) || { done: 0, total: w.tasks.length, pct: 0 }
          const isDone = wp.pct === 100
          const showPhase = w.phase !== lastPhase
          lastPhase = w.phase

          return (
            <div key={w.id} className="space-y-4">
              {/* Phase Separation Banner */}
              {showPhase && (
                <div className="flex items-center gap-3 pl-2 py-3 first:mt-0">
                  <div className="w-9 h-9 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center relative z-10 shadow-lg">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_8px_var(--orange-accent)]" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">
                    {PHASE_LABELS[w.phase]}
                  </span>
                </div>
              )}

              {/* Week Roadmap Card */}
              <div className="relative pl-12 group">
                {/* Timeline node */}
                <div className="absolute left-[19px] top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                  {isDone ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-green-950/60 shadow-[0_0_10px_#22c55e]" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ring-4 ring-slate-950 group-hover:bg-orange-500 group-hover:shadow-[0_0_8px_var(--orange-accent)] transition-all duration-300" />
                  )}
                </div>

                <button
                  onClick={() => navigate(`/plan/week/${w.id}`)}
                  className={`w-full text-left rounded-2xl p-4.5 transition-all duration-300 relative group cursor-pointer border ${
                    isDone 
                      ? 'bg-green-950/10 border-green-500/20 hover:border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.02)]' 
                      : 'neo-glass neo-glass-hover'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Week numeric block */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        background: isDone ? 'rgba(34,197,94,0.15)' : `${w.color}15`,
                        color: isDone ? '#22c55e' : w.color,
                        border: `1px solid ${isDone ? 'rgba(34,197,94,0.3)' : w.color + '25'}`,
                        boxShadow: isDone ? '0 0 10px rgba(34,197,94,0.15)' : 'none'
                      }}
                    >
                      {isDone ? <CheckCircle2 size={16} className="text-green-500" /> : `W0${w.id}`}
                    </div>

                    {/* Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-sm text-slate-200 group-hover:text-orange-400 transition-colors leading-tight">
                            {w.title}
                          </h3>
                          <div className="text-[10px] text-slate-500 font-mono mt-1">
                            {w.dates} <span className="text-slate-700 font-sans">•</span> {w.domain}
                          </div>
                        </div>
                        <ChevronRight size={15} className="text-slate-600 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                      </div>

                      {/* Progress Line */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 h-1.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${wp.pct}%`,
                              background: isDone ? '#22c55e' : w.color,
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{wp.done}/{wp.total}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
