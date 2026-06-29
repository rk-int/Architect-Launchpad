import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../lib/useProgress'
import { getUser } from '../lib/storage'
import { getDefaultExamDate } from '../lib/constants'
import { DOMAINS } from '../lib/data'
import ProgressRing from '../components/ProgressRing'
import Canvas3D from '../components/3d/Canvas3D'
import ParticleField from '../components/3d/ParticleField'
import ClaudeOrb from '../components/3d/ClaudeOrb'
import { ChevronRight, BookOpen, Brain, Flame, Target, Trophy, Calendar, Map, X } from 'lucide-react'

export default function Home() {
  const { pct, done, total, weekProgress, domainProgress, weeksComplete, streak, activeWeeks } = useProgress()
  const user = getUser()
  const navigate = useNavigate()
  const [showPoster, setShowPoster] = useState(false)

  const examDate = user?.examDate ? new Date(user.examDate) : new Date(getDefaultExamDate())
  const daysLeft = Math.max(0, Math.ceil((examDate - new Date()) / 86400000))

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'SYSTEM.INIT // Morning' : hour < 17 ? 'SYSTEM.INIT // Afternoon' : 'SYSTEM.INIT // Evening'

  const currentWeek = activeWeeks.find(w => {
    const wp = weekProgress.find(p => p.weekId === w.id)
    return wp && wp.pct < 100
  }) || activeWeeks[activeWeeks.length - 1]
  const cwp = weekProgress.find(p => p.weekId === currentWeek.id)

  return (
    <div className="relative min-h-screen pb-12">
      {/* 3D Moving Particle Background */}
      <div className="canvas-bg opacity-30">
        <Canvas3D camera={{ position: [0, 0, 14], fov: 55 }}>
          <ParticleField count={1200} />
        </Canvas3D>
      </div>

      <div className="relative z-10 space-y-6">
        
        {/* ── HERO BANNER // CLAUDE PROFESSIONAL CONSOLE ── */}
        <div className="neo-glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden glowing-border-orange">
          <div className="space-y-2 text-center md:text-left flex-1 min-w-0">
            <span className="text-[10px] font-mono text-orange-400 tracking-widest uppercase bg-orange-950/30 border border-orange-500/25 px-2.5 py-1 rounded-md">
              Claude Professional
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-100 tracking-tight mt-3">
              Name: <span className="text-glow-coral font-black text-orange-400">{user?.name || 'Learner'}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-md">
              Your preparation status is compiled below. Launch the next module to maintain schedule integrity.
            </p>
            {streak > 0 && (
              <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-xl mt-1">
                <Flame size={13} className="text-orange-400 fill-orange-500/10" />
                <span className="text-xs text-orange-400 font-bold font-mono">{streak} Day Study Streak</span>
              </div>
            )}
          </div>

          {/* Interactive 3D Canvas Orb */}
          <div className="flex-shrink-0 relative w-36 h-36 bg-slate-950/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-radial-gradient from-orange-600/5 to-transparent pointer-events-none" />
            <Canvas3D camera={{ position: [0, 0, 3.8], fov: 50 }}>
              <ClaudeOrb scale={0.85} />
            </Canvas3D>
          </div>
        </div>

        {/* ── HOLOGRAPHIC STATS GRID ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Overall Completion', value: `${pct}%`, sub: `${done}/${total} tasks done`, color: 'text-orange-400', icon: Trophy },
            { label: 'Activity Streak', value: streak > 0 ? `${streak} Days` : 'Inactive', sub: 'Consecutive log days', color: 'text-amber-400', icon: Flame },
            { label: 'Target Exam Date', value: `${daysLeft}d`, sub: 'Remaining buffer', color: daysLeft < 7 ? 'text-red-400' : 'text-slate-100', icon: Calendar },
          ].map(s => (
            <div key={s.label} className="neo-glass rounded-2xl p-4 md:p-5 relative group overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium">{s.label}</span>
                <s.icon size={14} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
              </div>
              <div className={`text-2xl md:text-3xl font-black font-mono ${s.color} tracking-tight`}>{s.value}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── CORE DASHBOARD GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Progress Breakdown & Domain Matrices */}
          <div className="neo-glass rounded-2xl p-5 md:p-6 space-y-6">
            <div className="flex items-center gap-5 pb-4 border-b border-white/5">
              <ProgressRing pct={pct} size={84} stroke={6} color="#ff6b00" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">Study Engine Progression</h3>
                <p className="text-xs text-slate-400 mt-0.5">5 Core Domains weighted blueprint</p>
                <div className="text-[10px] font-mono text-slate-500 mt-1">{weeksComplete} of {activeWeeks.length} study phases locked</div>
              </div>
            </div>
            <div className="space-y-3">
              {DOMAINS.map(d => {
                const dp = domainProgress[d.id] || { pct: 0 }
                return (
                  <div key={d.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-300 font-medium">{d.id} · {d.label}</span>
                      <span className="font-mono text-slate-400">{dp.pct}% <span className="text-[10px] text-slate-600">/ {d.weight}%</span></span>
                    </div>
                    <div className="h-2 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${dp.pct}%`,
                          background: `linear-gradient(90deg, ${d.color}cc, ${d.color})`,
                          boxShadow: dp.pct > 0 ? `0 0 10px ${d.color}60` : 'none',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active Phase Card & Quick Command Center */}
          <div className="space-y-4">
            <button
              onClick={() => navigate(`/plan/week/${currentWeek.id}`)}
              className="w-full text-left neo-glass rounded-2xl p-5 md:p-6 neo-glass-hover group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full filter blur-xl group-hover:bg-orange-500/10 transition-colors" />
              <span className="text-[10px] font-mono tracking-widest uppercase font-semibold px-2 py-0.5 rounded bg-orange-950/40 text-orange-400 border border-orange-900/30">
                ACTIVE PHASE
              </span>
              <h3 className="font-bold text-lg text-slate-100 mt-3 group-hover:text-orange-400 transition-colors leading-tight flex items-center justify-between">
                <span>Week {currentWeek.id}: {currentWeek.title}</span>
                <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 group-hover:text-orange-400 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4 font-mono">{currentWeek.dates}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Phase completion</span>
                  <span>{cwp?.pct || 0}%</span>
                </div>
                <div className="h-2.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${cwp?.pct || 0}%`,
                      background: `linear-gradient(90deg, ${currentWeek.color}cc, ${currentWeek.color})`,
                      boxShadow: `0 0 10px ${currentWeek.color}60`,
                    }}
                  />
                </div>
              </div>
            </button>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/plan')}
                className="neo-glass rounded-2xl p-4 text-left neo-glass-hover group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,107,0,0.1)]">
                  <BookOpen size={16} className="text-orange-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-100">Learning Roadmap</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Explore all {activeWeeks.length} weeks</p>
              </button>

              <button
                onClick={() => navigate('/quiz')}
                className="neo-glass rounded-2xl p-4 text-left neo-glass-hover group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-lime-600/10 border border-lime-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(173,255,0,0.1)]">
                  <Brain size={16} className="text-lime-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-100">Exam Simulator</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Test design scenarios</p>
              </button>

              <button
                onClick={() => setShowPoster(true)}
                className="neo-glass rounded-2xl p-4 text-left neo-glass-hover group cursor-pointer border border-orange-500/30 shadow-[0_0_15px_rgba(255,107,0,0.1)] relative overflow-hidden"
              >
                {/* Pulsing Eye-catching Notification Dot */}
                <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                </span>
                
                <div className="w-9 h-9 rounded-xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(255,107,0,0.15)] animate-pulse">
                  <Map size={16} className="text-orange-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  Roadmap Poster
                </h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">View {activeWeeks.length} Weeks infographic</p>
              </button>
            </div>
          </div>
        </div>

        {/* ── SYLLABUS ROADMAP READOUT ── */}
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
            <h2 className="text-xs font-mono text-slate-400 tracking-widest uppercase">SYLLABUS PHASES // CHRONOLOGICAL MAP</h2>
            <span className="text-[10px] font-mono text-slate-500">{activeWeeks.length} Weeks total</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeWeeks.map(w => {
              const wp = weekProgress.find(p => p.weekId === w.id)
              const isDone = wp?.pct === 100
              const isActive = w.id === currentWeek.id
              
              const outlineColor = isDone 
                ? 'border-green-500/30 bg-green-950/10 hover:border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.03)]' 
                : isActive 
                ? 'border-orange-500/30 bg-orange-950/10 hover:border-orange-500/50' 
                : 'neo-glass neo-glass-hover';

              return (
                <button
                  key={w.id}
                  onClick={() => navigate(`/plan/week/${w.id}`)}
                  className={`text-left rounded-2xl p-4 transition-all duration-300 relative group cursor-pointer border ${outlineColor}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold font-mono transition-all group-hover:scale-110 flex-shrink-0"
                      style={{
                        background: isDone ? 'rgba(34,197,94,0.15)' : `${w.color}15`,
                        color: isDone ? '#22c55e' : w.color,
                        border: `1px solid ${isDone ? 'rgba(34,197,94,0.3)' : w.color + '30'}`,
                        boxShadow: isDone ? '0 0 10px rgba(34,197,94,0.2)' : `0 0 8px ${w.color}20`,
                      }}
                    >
                      {isDone ? '✓' : w.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-200 truncate group-hover:text-orange-400 transition-colors leading-snug">{w.title}</div>
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{w.dates}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${wp?.pct || 0}%`,
                          background: isDone ? '#22c55e' : w.color,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{wp?.done}/{wp?.total}</span>
                  </div>
                </button>
              )
            })}
        </div>
      </div>
    </div>

      {/* ── ROADMAP POSTER FULLSCREEN MODAL ── */}
      {showPoster && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-center items-center p-4 animate-fade-in">
          {/* Header & Controls */}
          <div className="w-full max-w-5xl flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                {activeWeeks.length} Weeks Roadmap Poster
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                • Perfect fit for your selected timeline
              </span>
            </div>
            
            <button
              onClick={() => setShowPoster(false)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-100 transition-all cursor-pointer flex items-center justify-center"
              title="Close Poster"
            >
              <X size={16} />
            </button>
          </div>

          {/* Image Canvas */}
          <div 
            onClick={() => setShowPoster(false)}
            className="w-full max-w-5xl flex-1 flex items-center justify-center overflow-hidden cursor-zoom-out"
          >
            <img
              src={`/assets/roadmap-${activeWeeks.length}w.png`}
              alt={`${activeWeeks.length} Weeks Roadmap`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
            />
          </div>

          {/* Footer close helper */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowPoster(false)}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 text-xs font-mono text-slate-300 hover:text-slate-100 rounded-full transition-all cursor-pointer"
            >
              Click anywhere to close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
