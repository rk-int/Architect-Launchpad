import { useProgress } from '../lib/useProgress'
import { getUser } from '../lib/storage'
import { getDefaultExamDate } from '../lib/constants'
import { DOMAINS } from '../lib/data'
import ProgressRing from '../components/ProgressRing'
import Canvas3D from '../components/3d/Canvas3D'
import NeuralNetwork from '../components/3d/NeuralNetwork'
import { Target, Clock, Flame, Award, Shield } from 'lucide-react'

export default function Progress() {
  const { pct, done, total, weekProgress, domainProgress, weeksComplete, streak, activeWeeks } = useProgress()
  const user = getUser()
  const examDate = user?.examDate ? new Date(user.examDate) : new Date(getDefaultExamDate())
  const daysLeft = Math.max(0, Math.ceil((examDate - new Date()) / 86400000))

  return (
    <div className="px-4 lg:px-8 pt-6 pb-12 max-w-2xl mx-auto space-y-6 relative z-10">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <p className="text-xs font-mono text-orange-400 tracking-widest uppercase mb-1">Pillar 9 · Analysis</p>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          Diagnostics &amp; Insights
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-1">Real-time compilation of curriculum progress and target readiness</p>
      </div>

      {/* Progress Overview Card */}
      <div className="neo-glass rounded-3xl p-6 shadow-2xl glowing-border-orange relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full filter blur-xl" />
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <ProgressRing pct={pct} size={90} stroke={6} color="#ff6b00" />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 flex-1 w-full text-center sm:text-left">
            {[
              { label: 'Tasks Locked', value: `${done}/${total}`, icon: Shield },
              { label: 'Milestones Complete', value: `${weeksComplete}/${activeWeeks.length}`, icon: Award },
              { label: 'Activity Streak', value: `${streak} 🔥`, color: 'text-orange-400', icon: Flame },
              { label: 'Countdown', value: `${daysLeft}d`, color: daysLeft < 7 ? 'text-red-400' : 'text-slate-100', icon: Clock },
            ].map(s => (
              <div key={s.label} className="space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-medium block">
                  {s.label}
                </span>
                <div className={`text-lg font-black font-mono ${s.color || 'text-slate-100'}`}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Domain Neural Map */}
      <div className="neo-glass rounded-3xl overflow-hidden border-slate-800">
        <div className="px-5 pt-5 pb-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            3D DOMAIN TOPOGRAPHY VIEW
          </span>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Real-time interactive matrix. Node scale corresponds to completion levels.
          </p>
        </div>
        <div className="relative w-full bg-slate-950/20" style={{ height: 260 }}>
          <Canvas3D camera={{ position: [0, 0, 7.5], fov: 55 }}>
            <NeuralNetwork domainProgress={domainProgress} />
          </Canvas3D>
        </div>
      </div>

      {/* Domain Breakdown Coverage */}
      <div className="neo-glass rounded-3xl p-5 md:p-6 space-y-4">
        <h2 className="text-xs font-mono text-slate-400 tracking-widest uppercase border-b border-white/5 pb-2">
          Domain Blueprints Coverage
        </h2>
        <div className="space-y-4">
          {DOMAINS.map(d => {
            const dp = domainProgress[d.id] || { pct: 0, done: 0, total: 0 }
            return (
              <div key={d.id} className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-200 font-sans">{d.label}</span>
                    {d.weight > 0 && (
                      <span className="text-[10px] text-slate-500 font-mono ml-2">({d.weight}% of Exam)</span>
                    )}
                  </div>
                  <span className="font-mono font-bold" style={{ color: d.color }}>{dp.pct}%</span>
                </div>
                
                <div className="h-2 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${dp.pct}%`,
                      background: `linear-gradient(90deg, ${d.color}cc, ${d.color})`,
                      boxShadow: dp.pct > 0 ? `0 0 8px ${d.color}50` : 'none',
                    }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 font-mono block">
                  {dp.done} of {dp.total} tasks completed
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chronological Milestone Progress */}
      <div className="neo-glass rounded-3xl p-5 md:p-6 space-y-4">
        <h2 className="text-xs font-mono text-slate-400 tracking-widest uppercase border-b border-white/5 pb-2">
          Milestone Progression Logs
        </h2>
        <div className="space-y-3">
          {activeWeeks.map(w => {
            const wp = weekProgress.find(p => p.weekId === w.id) || { done: 0, total: w.tasks.length, pct: 0 }
            const isDone = wp.pct === 100
            
            return (
              <div key={w.id} className="flex items-center gap-3.5">
                <div
                  className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold font-mono border"
                  style={{
                    background: isDone ? 'rgba(34,197,94,0.15)' : `${w.color}15`,
                    color: isDone ? '#adff00' : w.color,
                    borderColor: isDone ? 'rgba(34,197,94,0.3)' : w.color + '25',
                  }}
                >
                  {isDone ? '✓' : w.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300 font-sans truncate pr-2">{w.title}</span>
                    <span className="text-slate-500">{wp.done}/{wp.total}</span>
                  </div>
                  <div className="h-1 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${wp.pct}%`,
                        background: isDone ? '#adff00' : w.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
