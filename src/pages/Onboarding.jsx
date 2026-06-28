import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveUser, markSetupComplete } from '../lib/storage'
import { getDefaultExamDate, getWeeksDurationSafe } from '../lib/constants'
import { WEEKS, QUIZ_QUESTIONS } from '../lib/data'
import { Target, ChevronRight, ChevronLeft, Brain, BookOpen, Zap, Sun, Moon, Volume2, VolumeX, Film, Map, Box } from 'lucide-react'
import { useTheme } from '../lib/ThemeContext'
import Canvas3D from '../components/3d/Canvas3D'
import ParticleField from '../components/3d/ParticleField'
import ClaudeOrb from '../components/3d/ClaudeOrb'
import InteractiveRoadmap from '../components/InteractiveRoadmap'
import DatePicker from '../components/DatePicker'

const totalTasks = WEEKS.flatMap(w => w.tasks).length
const totalQuiz = QUIZ_QUESTIONS.length

const FEATURES = [
  { icon: BookOpen, value: totalTasks, label: 'Tasks Loaded' },
  { icon: Brain,    value: 5,          label: 'Core Domains' },
  { icon: Zap,      value: totalQuiz,  label: 'Quiz Nodes' },
]

const STYLES = ['video', 'roadmap', 'classic']
const STYLE_LABELS = { video: 'ROADMAP VIEW', roadmap: '3D ORB VIEW', classic: 'VIDEO VIEW' }
const STYLE_ICONS  = { video: Map, roadmap: Box, classic: Film }

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [examDate, setExamDate] = useState(getDefaultExamDate())
  const [mounted, setMounted] = useState(false)
  const [landingStyle, setLandingStyle] = useState(
    () => localStorage.getItem('cca_landing_style') || 'video'
  )
  const [muted, setMuted] = useState(true)
  const [introPlayed, setIntroPlayed] = useState(false)
  const videoRef = useRef(null)
  const fadeTimerRef = useRef(null)
  const { theme, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => { setMounted(true) }, [])

  // ── First-visit sound intro ──────────────────────────────────────────────
  // Browsers require a user gesture before playing with sound.
  // On first interaction: unmute → play at full volume → fade out over 6s.
  // On subsequent visits (localStorage flag set): stay muted.
  useEffect(() => {
    const alreadyPlayed = localStorage.getItem('cca_intro_played')
    if (alreadyPlayed || landingStyle !== 'video') return

    const handleFirstInteraction = () => {
      // Remove listener immediately — one-shot
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)

      const vid = videoRef.current
      if (!vid) return

      // Unmute and start at full volume
      vid.muted = false
      vid.volume = 1
      setMuted(false)
      setIntroPlayed(true)

      // Fade volume to 0 over 6 seconds, then re-mute
      const FADE_DURATION = 6000
      const STEPS = 60
      const interval = FADE_DURATION / STEPS
      let step = 0

      fadeTimerRef.current = setInterval(() => {
        step++
        const vol = Math.max(0, 1 - step / STEPS)
        if (vid) vid.volume = vol
        if (step >= STEPS) {
          clearInterval(fadeTimerRef.current)
          if (vid) { vid.muted = true; vid.volume = 1 }
          setMuted(true)
          localStorage.setItem('cca_intro_played', '1')
        }
      }, interval)
    }

    window.addEventListener('click', handleFirstInteraction, { once: false })
    window.addEventListener('touchstart', handleFirstInteraction, { once: false })

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
      clearInterval(fadeTimerRef.current)
    }
  }, [landingStyle])

  // Sync manual mute toggle with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted
    }
  }, [muted])

  const cycleStyle = () => {
    const idx = STYLES.indexOf(landingStyle)
    const next = STYLES[(idx + 1) % STYLES.length]
    setLandingStyle(next)
    localStorage.setItem('cca_landing_style', next)
  }

  const finish = () => {
    saveUser({ name: name.trim() || 'Learner', examDate, startedAt: new Date().toISOString() })
    markSetupComplete()
    navigate('/', { replace: true })
  }

  const NextIcon = STYLE_ICONS[landingStyle]

  // Shared brand overlay content for floating panels
  const BrandPanel = ({ compact = false }) => (
    <div className={`neo-glass rounded-2xl border-white/5 text-left space-y-2 pointer-events-auto ${compact ? 'p-4' : 'p-5'}`}>
      <h1 className={`text-glow-white font-black tracking-tight leading-none bg-gradient-to-r from-slate-100 via-orange-400 to-slate-100 bg-clip-text text-transparent ${compact ? 'text-lg' : 'text-xl'}`}>
        Anthropic Claude
      </h1>
      <p className={`text-glow-coral font-bold tracking-widest text-orange-400 font-mono uppercase ${compact ? 'text-[10px]' : 'text-xs'}`}>
        LAUNCHPAD
      </p>
      <p className="text-[10px] text-slate-400 leading-relaxed">
        Interactive Claude Learning Resources
      </p>
    </div>
  )

  const StatsPanel = () => (
    <div className="neo-glass px-4 py-3 rounded-2xl border-white/5 flex gap-4 pointer-events-auto">
      {FEATURES.map(({ icon: Icon, value, label }) => (
        <div key={label} className="text-center min-w-[60px]">
          <Icon size={11} className="text-orange-400 mx-auto mb-0.5" />
          <div className="text-xs font-black text-slate-100 font-mono">{value}</div>
          <span className="text-[7px] text-slate-500 uppercase tracking-wider font-mono block">{label}</span>
        </div>
      ))}
    </div>
  )

  const InitButton = ({ fullWidth = false }) => (
    <button
      onClick={() => setStep(1)}
      className={`bg-orange-600 hover:bg-orange-500 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-1.5 uppercase tracking-wider text-xs cursor-pointer shadow-[0_0_20px_rgba(255,107,0,0.35)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] ${fullWidth ? 'w-full' : ''}`}
    >
      Initialize Your Profile <ChevronRight size={14} className="stroke-[3]" />
    </button>
  )

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden text-slate-100">

      {/* ══════════════════════════════
          FULLSCREEN VIDEO BACKGROUND
          Always rendered to preload; hidden when not in video mode
         ══════════════════════════════ */}
      <video
        ref={videoRef}
        src="/assets/landing_video.mp4"
        autoPlay
        loop
        playsInline
        muted={muted}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
          landingStyle === 'video' && step === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Dark overlay for video mode readability */}
      {landingStyle === 'video' && step === 0 && (
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/60 pointer-events-none" />
      )}

      {/* Particle background (non-video modes) */}
      {(landingStyle !== 'video' || step !== 0) && (
        <div className="canvas-bg opacity-40 z-0">
          <Canvas3D camera={{ position: [0, 0, 12], fov: 60 }}>
            <ParticleField count={1000} />
          </Canvas3D>
        </div>
      )}

      {/* Dark bg for non-video steps */}
      {(landingStyle !== 'video' || step !== 0) && (
        <div className="absolute inset-0 bg-animated grid-matrix z-0" />
      )}

      {/* ══════════════════════════════
          TOP-RIGHT HUD TOOLBAR
         ══════════════════════════════ */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-2">

        {/* Mute/Unmute — only in video mode step 0 */}
        {step === 0 && landingStyle === 'video' && (
          <button
            onClick={() => setMuted(m => !m)}
            title={muted ? 'Unmute video audio' : 'Mute video audio'}
            className="p-2.5 rounded-2xl bg-slate-950/70 border border-white/10 text-slate-400 hover:text-orange-400 hover:border-orange-500/30 transition-all cursor-pointer backdrop-blur-xl"
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        )}

        {/* View cycle button — only on step 0 */}
        {step === 0 && (
          <button
            onClick={cycleStyle}
            title="Switch landing view"
            className="px-3.5 py-2.5 rounded-2xl bg-slate-950/70 border border-white/10 text-slate-400 hover:text-orange-400 hover:border-orange-500/30 transition-all cursor-pointer backdrop-blur-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <NextIcon size={12} />
            {STYLE_LABELS[landingStyle]}
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-slate-950/70 border border-white/10 text-slate-400 hover:text-orange-400 hover:border-orange-500/30 transition-all cursor-pointer backdrop-blur-xl"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {/* ══════════════════════════════
          STEP 0 — VIDEO MODE (fullscreen)
         ══════════════════════════════ */}
      {step === 0 && landingStyle === 'video' && (
        <div className={`relative z-10 w-full h-screen ${mounted ? 'slide-up' : ''}`}>

          {/* ── CENTER-LEFT brand text (no background) ── */}
          <div className="absolute z-20 space-y-3"
               style={{ top: '28%', left: '12%', transform: 'translateY(-50%)', maxWidth: '420px' }}>
            {/* Badge */}
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] whitespace-nowrap"
               style={{ color: 'rgba(251,146,60,0.9)', textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>
              ◆ CERTIFICATION PLATFORM ◆
            </p>
            {/* Title — single line */}
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none whitespace-nowrap"
                style={{ color: '#f8fafc', textShadow: '0 2px 20px rgba(0,0,0,0.95), 0 0 40px rgba(255,107,0,0.35)' }}>
              Anthropic Claude
            </h1>
            {/* Sub-brand */}
            <p className="text-2xl font-black tracking-[0.3em] font-mono uppercase text-center"
               style={{ color: '#f97316', textShadow: '0 0 18px rgba(255,107,0,0.75), 0 2px 10px rgba(0,0,0,0.9)' }}>
              LAUNCHPAD
            </p>
            {/* Thin accent line — centred */}
            <div className="flex items-center justify-center gap-2 pt-0.5">
              <div className="h-px w-12 bg-gradient-to-l from-orange-500/60 to-transparent" />
              <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" style={{ boxShadow: '0 0 6px #f97316' }} />
              <div className="h-px w-12 bg-gradient-to-r from-orange-500/60 to-transparent" />
            </div>
            {/* Caption */}
            <p className="text-sm leading-relaxed text-center"
               style={{ color: 'rgba(226,232,240,0.92)', fontStyle: 'italic', textShadow: '0 1px 10px rgba(0,0,0,0.98)' }}>
              Interactive Claude Learning Resources
            </p>
          </div>

          {/* ── AUDIO intro hint (vanishes after first click) ── */}
          {!introPlayed && !localStorage.getItem('cca_intro_played') && (
            <div className="absolute bottom-28 left-0 right-0 flex justify-center z-20 pointer-events-none">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                   style={{ background: 'rgba(2,6,23,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(249,115,22,0.25)' }}>
                <Volume2 size={12} style={{ color: '#f97316' }} className="animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest"
                      style={{ color: 'rgba(249,115,22,0.85)' }}>
                  Click anywhere to play audio
                </span>
              </div>
            </div>
          )}

          {/* ── Audio wave bars (visible while sound plays) ── */}
          {introPlayed && (
            <div className="absolute bottom-28 left-0 right-0 flex justify-center z-20 pointer-events-none">
              <div className="flex items-end gap-[3px]" style={{ height: 20 }}>
                {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.4, 0.7, 1, 0.6].map((h, i) => (
                  <div key={i}
                       className="w-[3px] rounded-full animate-pulse"
                       style={{ height: `${h * 100}%`, background: '#f97316', animationDelay: `${i * 80}ms`, opacity: 0.75 }} />
                ))}
              </div>
            </div>
          )}

          {/* ── BOTTOM HUD strip ── */}
          <div className="absolute bottom-10 left-0 right-0 px-8 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
            <StatsPanel />
            <InitButton />
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          STEP 0 — ROADMAP MODE
         ══════════════════════════════ */}
      {step === 0 && landingStyle === 'roadmap' && (
        <div className={`relative z-10 w-full max-w-5xl px-4 space-y-6 ${mounted ? 'slide-up' : ''}`}>

          {/* Desktop: floating panels on top of roadmap */}
          <div className="hidden md:block relative w-full aspect-[3/2] max-h-[80vh] rounded-3xl border border-white/5 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)] bg-slate-950">
            <InteractiveRoadmap />
            <div className="absolute top-5 left-5 z-30 max-w-[220px]"><BrandPanel compact /></div>
            <div className="absolute bottom-5 left-5 z-30"><StatsPanel /></div>
            <div className="absolute bottom-5 right-5 z-30"><InitButton /></div>
          </div>

          {/* Mobile: stacked */}
          <div className="md:hidden space-y-5 text-center">
            <BrandPanel />
            <InteractiveRoadmap />
            <div className="grid grid-cols-3 gap-2.5">
              {FEATURES.map(({ icon: Icon, value, label }) => (
                <div key={label} className="neo-glass rounded-2xl p-3 text-center">
                  <Icon size={12} className="text-orange-400 mx-auto mb-1" />
                  <div className="text-sm font-black text-slate-100 font-mono">{value}</div>
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider font-mono block mt-0.5">{label}</span>
                </div>
              ))}
            </div>
            <InitButton fullWidth />
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          STEP 0 — CLASSIC 3D ORB MODE
         ══════════════════════════════ */}
      {step === 0 && landingStyle === 'classic' && (
        <div className={`relative z-10 w-full max-w-md px-4 text-center space-y-6 ${mounted ? 'slide-up' : ''}`}>
          <div className="mx-auto" style={{ width: 170, height: 170 }}>
            <Canvas3D camera={{ position: [0, 0, 3.8], fov: 50 }}>
              <ClaudeOrb scale={1.05} />
            </Canvas3D>
          </div>
          <div className="space-y-3">
            <h1 className="text-glow-white text-3xl font-black tracking-tight leading-none bg-gradient-to-r from-slate-100 via-orange-400 to-slate-100 bg-clip-text text-transparent">
              Anthropic Claude
            </h1>
            <p className="text-glow-coral text-xl font-bold tracking-widest text-orange-400 font-mono uppercase">
              LAUNCHPAD
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-orange-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_var(--orange-accent)]" />
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-orange-500/40" />
            </div>
            <p className="text-xs text-slate-400 italic">
              Interactive Claude Learning Resources
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {FEATURES.map(({ icon: Icon, value, label }) => (
              <div key={label} className="neo-glass rounded-2xl p-3.5 text-center">
                <Icon size={14} className="text-orange-400 mx-auto mb-1.5" />
                <div className="text-lg font-black text-slate-100 font-mono">{value}</div>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono block mt-0.5">{label}</span>
              </div>
            ))}
          </div>
          <InitButton fullWidth />
        </div>
      )}

      {/* ══════════════════════════════
          STEP 1 — NAME INPUT
         ══════════════════════════════ */}
      {step === 1 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <div className={`w-full max-w-md space-y-6 ${mounted ? 'slide-up' : ''}`}>
          {/* Step dots */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-10 bg-orange-500 shadow-[0_0_8px_var(--orange-accent)]' : i < step ? 'w-4 bg-orange-600/30' : 'w-4 bg-slate-800/80'}`} />
            ))}
          </div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/20">
            <Target size={20} className="text-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Aspiring Claude Architect Name</h2>
            <p className="text-xs text-slate-400 mt-1">Your name will personalize your certification dashboard and study telemetry.</p>
          </div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter Name / Professional (Ex: Ravi Kiran)"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && name.trim().length >= 2 && setStep(2)}
            className="w-full bg-slate-950 border border-white/5 focus:border-orange-500 focus:shadow-[0_0_15px_rgba(255,107,0,0.06)] rounded-2xl px-5 py-4 text-slate-200 text-sm outline-none transition-all duration-300 placeholder:text-slate-600 backdrop-blur-xl"
          />
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex items-center gap-1 bg-slate-950 hover:bg-slate-900 border border-white/5 text-slate-400 hover:text-slate-200 px-5 py-3 rounded-2xl text-xs font-bold uppercase transition-colors cursor-pointer">
              <ChevronLeft size={14} /> Back
            </button>
            <button onClick={() => setStep(2)} disabled={name.trim().length < 2} className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-black py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-1 text-xs uppercase tracking-wider cursor-pointer">
              Continue <ChevronRight size={14} className="stroke-[3]" />
            </button>
          </div>
        </div>
        </div>
      )}

      {/* ══════════════════════════════
          STEP 2 — DATE CONFIG
         ══════════════════════════════ */}
      {step === 2 && (() => {
        const durationWeeks = getWeeksDurationSafe(null, examDate)
        const isValid = durationWeeks >= 3 && durationWeeks <= 9
        return (
          <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
          <div className={`w-full max-w-md space-y-6 ${mounted ? 'slide-up' : ''}` }>
            {/* Step dots */}
            <div className="flex items-center justify-center gap-2.5 mb-8">
              {[0, 1, 2].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-10 bg-orange-500 shadow-[0_0_8px_var(--orange-accent)]' : i < step ? 'w-4 bg-orange-600/30' : 'w-4 bg-slate-800/80'}`} />
              ))}
            </div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/20">
              <Zap size={20} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">Configure Exam Target</h2>
              <p className="text-xs text-slate-400 mt-1">We will construct a dynamic countdown timer for exam preparation.</p>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">TARGET DATE</label>
              <DatePicker
                value={examDate}
                onChange={setExamDate}
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>
            {!isValid ? (
              <div className="bg-red-950/10 border border-red-500/20 rounded-2xl p-4 text-left space-y-1 animate-pulse">
                <p className="text-[10px] text-red-400 font-bold font-mono uppercase tracking-widest flex items-center gap-1.5">⚠️ TARGET RANGE VIOLATION</p>
                <p className="text-xs text-slate-400 leading-normal">
                  Chosen date results in <strong className="text-red-400 font-mono">{durationWeeks} weeks</strong>. Select a target between <strong className="text-orange-400">3 and 9 weeks</strong> from today to unlock the console.
                </p>
              </div>
            ) : (
              <div className="bg-green-950/10 border border-green-500/20 rounded-2xl p-4 text-left space-y-1">
                <p className="text-[10px] text-green-400 font-bold font-mono uppercase tracking-widest flex items-center gap-1.5">✓ SCHEDULE VALIDATED</p>
                <p className="text-xs text-slate-400 leading-normal">
                  System will generate a customized roadmap with exactly <strong className="text-green-400 font-mono">{durationWeeks} weeks</strong>.
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 bg-slate-950 hover:bg-slate-900 border border-white/5 text-slate-400 hover:text-slate-200 px-5 py-3 rounded-2xl text-xs font-bold uppercase transition-colors cursor-pointer">
                <ChevronLeft size={14} /> Back
              </button>
              <button onClick={finish} disabled={!isValid} className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-black py-3 rounded-2xl transition-all duration-300 text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(255,107,0,0.2)]">
                Lock Schedule →
              </button>
            </div>
          </div>
          </div>
        )
      })()}

      {/* ── Crafted-by credit on onboarding landing ── */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-30 select-none pointer-events-none">
        <p className="text-[10px] font-mono text-slate-500 tracking-wider">
          Crafted by : <span className="text-orange-500 font-bold">Ravi Kiran</span>
        </p>
      </div>

    </div>
  )
}
